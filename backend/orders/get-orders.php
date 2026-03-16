<?php
// backend/orders/get_orders.php

session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in.']);
    exit;
}

require_once '../../config/db.php'; // adjust path to your PDO connection

$customer_id = (int) $_SESSION['user_id'];

try {
    // Fetch all orders for this customer, newest first
    $stmt = $pdo->prepare("
        SELECT
            order_id,
            order_number,
            shipping_city,
            shipping_address,
            subtotal,
            shipping_total,
            grand_total,
            payment_method,
            payment_status,
            order_status,
            placed_at
        FROM orders
        WHERE customer_id = :customer_id
        ORDER BY placed_at DESC
    ");
    $stmt->execute([':customer_id' => $customer_id]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($orders)) {
        echo json_encode(['success' => true, 'orders' => []]);
        exit;
    }

    // Fetch all order_items for these orders in one query
    $orderIds    = array_column($orders, 'order_id');
    $placeholders = implode(',', array_fill(0, count($orderIds), '?'));

    $itemStmt = $pdo->prepare("
        SELECT
            order_id,
            product_name,
            product_weight,
            sku,
            quantity,
            unit_price,
            line_total,
            fulfillment_status
        FROM order_items
        WHERE order_id IN ($placeholders)
        ORDER BY order_item_id ASC
    ");
    $itemStmt->execute($orderIds);
    $allItems = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

    // Group items by order_id
    $itemsByOrder = [];
    foreach ($allItems as $item) {
        $itemsByOrder[$item['order_id']][] = $item;
    }

    // Attach items to each order
    foreach ($orders as &$order) {
        $order['items'] = $itemsByOrder[$order['order_id']] ?? [];
    }
    unset($order);

    echo json_encode(['success' => true, 'orders' => $orders]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Something went wrong.']);
}