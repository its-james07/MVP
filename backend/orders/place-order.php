<?php
session_start();
header('Content-Type: application/json');
require_once '../auth/config/db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'You must be logged in to place an order.']);
    exit;
}

$buyer_id = $_SESSION['user_id'];
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid request data.']);
    exit;
}

$shipping_name    = trim($data['shipping_name'] ?? '');
$shipping_phone   = trim($data['shipping_phone'] ?? '');
$shipping_address = trim($data['shipping_address'] ?? '');
$shipping_city    = trim($data['shipping_city'] ?? '');

$shipping_state   = 'Bagmati';
$shipping_country = 'Nepal';
$payment_method   = 'Cash on Delivery';

if (!$shipping_name || !$shipping_phone || !$shipping_address || !$shipping_city) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (empty($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
    echo json_encode(['success' => false, 'message' => 'Your cart is empty.']);
    exit;
}

$cart = $_SESSION['cart'];
$order_number = 'ORD-' . strtoupper(uniqid());
$commission_rate = 5.00;

mysqli_begin_transaction($conn);

try {
    $subtotal = 0;
    $cart_details = [];


    $stmt_product = mysqli_prepare($conn, "
        SELECT product_id, name, price, weight, seller_id, stock 
        FROM products 
        WHERE product_id = ? 
        LIMIT 1
    ");

    foreach ($cart as $product_id => $item) {
        $product_id = (int)$product_id;
        $quantity   = (int)$item['quantity'];

        mysqli_stmt_bind_param($stmt_product, 'i', $product_id);
        mysqli_stmt_execute($stmt_product);
        $result = mysqli_stmt_get_result($stmt_product);

        if (!$result || mysqli_num_rows($result) === 0) {
            throw new Exception("Product ID $product_id not found.");
        }

        $product = mysqli_fetch_assoc($result);

        if ((int)$product['stock'] < $quantity) {
            throw new Exception('Insufficient stock for "' . $product['name'] . '".');
        }

        $unit_price = (float)$product['price'];
        $line_total = $unit_price * $quantity;

        $commission_amount = round(($commission_rate / 100) * $line_total, 2);
        $seller_payout_amount = round($line_total - $commission_amount, 2);

        $subtotal += $line_total;

        $cart_details[] = [
            'product_id' => $product['product_id'],
            'seller_id' => $product['seller_id'],
            'product_name' => $product['name'],
            'product_weight' => $product['weight'],
            'quantity' => $quantity,
            'unit_price' => $unit_price,
            'line_total' => $line_total,
            'commission_amount' => $commission_amount,
            'seller_payout_amount' => $seller_payout_amount,
        ];
    }

    mysqli_stmt_close($stmt_product);

    $shipping_total = 0.00;
    $discount_total = 0.00;
    $grand_total = $subtotal + $shipping_total - $discount_total;

    // ✅ Order insert
    $stmt_order = mysqli_prepare($conn, "
        INSERT INTO orders (
            customer_id, order_number,
            shipping_name, shipping_phone, shipping_address,
            shipping_city, shipping_state, shipping_country,
            subtotal, shipping_total, discount_total, grand_total,
            payment_method, payment_status, order_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid', 'Pending')
    ");

    mysqli_stmt_bind_param(
        $stmt_order,
        'isssssssdddds',
        $buyer_id,
        $order_number,
        $shipping_name,
        $shipping_phone,
        $shipping_address,
        $shipping_city,
        $shipping_state,
        $shipping_country,
        $subtotal,
        $shipping_total,
        $discount_total,
        $grand_total,
        $payment_method
    );

    if (!mysqli_stmt_execute($stmt_order)) {
        throw new Exception('Failed to create order.');
    }

    $order_id = mysqli_insert_id($conn);
    mysqli_stmt_close($stmt_order);

    // ✅ Prepare once
    $stmt_item = mysqli_prepare($conn, "
        INSERT INTO order_items (
            order_id, seller_id, product_id, product_name, product_weight,
            quantity, unit_price, line_total,
            commission_rate, commission_amount, seller_payout_amount,
            fulfillment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    ");

    $stmt_stock = mysqli_prepare($conn, "
        UPDATE products 
        SET stock = stock - ? 
        WHERE product_id = ? AND stock >= ?
    ");

    foreach ($cart_details as $item) {

        mysqli_stmt_bind_param(
            $stmt_item,
            'iiissiddddd',
            $order_id,
            $item['seller_id'],
            $item['product_id'],
            $item['product_name'],
            $item['product_weight'],
            $item['quantity'],
            $item['unit_price'],
            $item['line_total'],
            $commission_rate,
            $item['commission_amount'],
            $item['seller_payout_amount']
        );

        if (!mysqli_stmt_execute($stmt_item)) {
            throw new Exception('Failed to insert order item.');
        }

        mysqli_stmt_bind_param(
            $stmt_stock,
            'iii',
            $item['quantity'],
            $item['product_id'],
            $item['quantity']
        );

        mysqli_stmt_execute($stmt_stock);

        if (mysqli_stmt_affected_rows($stmt_stock) === 0) {
            throw new Exception('Stock just ran out for "' . $item['product_name'] . '".');
        }
    }

    mysqli_stmt_close($stmt_item);
    mysqli_stmt_close($stmt_stock);

    // ✅ Status log (unchanged logic)
    $stmt_log = mysqli_prepare($conn, "
        INSERT INTO order_status_logs 
        (order_id, old_status, new_status, note, changed_by) 
        VALUES (?, NULL, ?, ?, ?)
    ");

    $new_status = 'Pending';
    $note = 'Order placed by customer.';
    $changed_by = $buyer_id;

    mysqli_stmt_bind_param($stmt_log, 'issi', $order_id, $new_status, $note, $changed_by);

    if (!mysqli_stmt_execute($stmt_log)) {
        throw new Exception('Failed to log order status.');
    }

    mysqli_stmt_close($stmt_log);

    mysqli_commit($conn);
    unset($_SESSION['cart']);

    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully!',
        'order_id' => $order_id,
        'order_number' => $order_number,
        'grand_total' => $grand_total
    ]);

} catch (Exception $e) {
    mysqli_rollback($conn);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

mysqli_close($conn);
?>