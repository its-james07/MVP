<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in.']);
    exit;
}

require_once '../auth/config/db.php';

$order_id    = isset($_POST['order_id']) ? (int) $_POST['order_id'] : 0;
$customer_id = (int) $_SESSION['user_id'];

if ($order_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid order ID.']);
    exit;
}

// ── Pre-flight: verify ownership and cancellable status ──────────────────────
$stmt = mysqli_prepare($conn, "
    SELECT order_id, order_status, payment_status, grand_total
    FROM orders
    WHERE order_id = ? AND customer_id = ?
    LIMIT 1
");
mysqli_stmt_bind_param($stmt, 'ii', $order_id, $customer_id);
mysqli_stmt_execute($stmt);
$order = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
mysqli_stmt_close($stmt);

if (!$order) {
    echo json_encode(['success' => false, 'message' => 'Order not found.']);
    exit;
}

// Only allow cancellation when order is still pending
if (strtolower($order['order_status']) !== 'pending') {
    echo json_encode([
        'success' => false,
        'message' => 'Only pending orders can be cancelled. Current status: ' . $order['order_status']
    ]);
    exit;
}

// ── Fetch all order items (needed for stock restore + financial zero-out) ────
$stmt = mysqli_prepare($conn, "
    SELECT order_item_id, product_id, quantity,
           commission_amount, seller_payout_amount, line_total
    FROM order_items
    WHERE order_id = ?
");
mysqli_stmt_bind_param($stmt, 'i', $order_id);
mysqli_stmt_execute($stmt);
$items = mysqli_fetch_all(mysqli_stmt_get_result($stmt), MYSQLI_ASSOC);
mysqli_stmt_close($stmt);

if (empty($items)) {
    echo json_encode(['success' => false, 'message' => 'No items found for this order.']);
    exit;
}

// ── Begin atomic transaction ─────────────────────────────────────────────────
mysqli_begin_transaction($conn);

try {

    // 1. Cancel the order — double-check status atomically inside the transaction
    $stmt = mysqli_prepare($conn, "
        UPDATE orders
        SET order_status  = 'cancelled',
            updated_at    = CURRENT_TIMESTAMP
        WHERE order_id    = ?
          AND customer_id = ?
          AND LOWER(order_status) = 'pending'
    ");
    mysqli_stmt_bind_param($stmt, 'ii', $order_id, $customer_id);
    mysqli_stmt_execute($stmt);
    if (mysqli_stmt_affected_rows($stmt) === 0) {
        throw new Exception('Order could not be cancelled — status may have changed.');
    }
    mysqli_stmt_close($stmt);

    // 2. Restore stock for every item
    $stmt_stock = mysqli_prepare($conn, "
        UPDATE products
        SET stock = stock + ?
        WHERE product_id = ?
    ");
    foreach ($items as $item) {
        $prod_id = (int) $item['product_id'];
        $qty     = (int) $item['quantity'];
        if ($prod_id > 0 && $qty > 0) {
            mysqli_stmt_bind_param($stmt_stock, 'ii', $qty, $prod_id);
            if (!mysqli_stmt_execute($stmt_stock)) {
                throw new Exception("Failed to restore stock for product ID $prod_id.");
            }
        }
    }
    mysqli_stmt_close($stmt_stock);

    // 3. Financial rollback on order_items:
    //    Zero out commission_amount, seller_payout_amount, line_total
    //    and mark fulfillment_status = 'cancelled'.
    //
    //    These are zeroed because no money actually moved
    //    (payment_method = Cash on Delivery, payment_status = pending/unpaid).
    //    This prevents cancelled figures from appearing in revenue/payout reports.
    $stmt_item = mysqli_prepare($conn, "
        UPDATE order_items
        SET fulfillment_status   = 'cancelled',
            commission_amount    = 0.00,
            seller_payout_amount = 0.00,
            line_total           = 0.00,
            updated_at           = CURRENT_TIMESTAMP
        WHERE order_item_id = ?
          AND order_id      = ?
    ");
    foreach ($items as $item) {
        mysqli_stmt_bind_param(
            $stmt_item,
            'ii',
            $item['order_item_id'],
            $order_id
        );
        if (!mysqli_stmt_execute($stmt_item)) {
            throw new Exception('Failed to reverse financials for order item ID ' . $item['order_item_id'] . '.');
        }
    }
    mysqli_stmt_close($stmt_item);

    // 4. Zero out the order-level financial totals as well
    $stmt = mysqli_prepare($conn, "
        UPDATE orders
        SET subtotal       = 0.00,
            shipping_total = 0.00,
            discount_total = 0.00,
            grand_total    = 0.00
        WHERE order_id = ?
    ");
    mysqli_stmt_bind_param($stmt, 'i', $order_id);
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception('Failed to zero out order totals.');
    }
    mysqli_stmt_close($stmt);

    // 5. Write audit log — mirrors the entry made in place_order.php
    $old_status = $order['order_status'];   // exact value stored (e.g. 'Pending')
    $new_status = 'cancelled';
    $note       = 'Order cancelled by customer.';
    $changed_by = $customer_id;

    $stmt = mysqli_prepare($conn, "
        INSERT INTO order_status_logs (order_id, old_status, new_status, note, changed_by)
        VALUES (?, ?, ?, ?, ?)
    ");
    mysqli_stmt_bind_param($stmt, 'isssi', $order_id, $old_status, $new_status, $note, $changed_by);
    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception('Failed to write status log.');
    }
    mysqli_stmt_close($stmt);

    // ── All steps succeeded — commit ─────────────────────────────────────────
    mysqli_commit($conn);

    echo json_encode([
        'success'  => true,
        'message'  => 'Order cancelled successfully. Stock has been restored and financials reversed.',
        'order_id' => $order_id,
    ]);

} catch (Exception $e) {
    mysqli_rollback($conn);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

mysqli_close($conn);
?>