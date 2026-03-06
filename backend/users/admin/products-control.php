<?php
// ─── products-control.php ──────────────────────────────────────
// Place at: backend/products/admin/products-control.php

header('Content-Type: application/json');
require __DIR__ . '/../../../config/db.php';

// ─── GET: Fetch all products ───────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("
        SELECT 
            p.id        AS product_id,
            p.name,
            p.description,
            p.price,
            p.category,
            p.status,
            p.created_at,
            u.name      AS seller_name,
            u.email     AS seller_email
        FROM products p
        LEFT JOIN users u ON p.user_id = u.id
        ORDER BY 
            FIELD(p.status, 'pending', 'approved', 'rejected'),
            p.created_at DESC
    ");

    if (!$result) {
        echo json_encode(['success' => false, 'message' => 'Query failed: ' . $conn->error]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'data'    => $result->fetch_all(MYSQLI_ASSOC)
    ]);
    exit;
}

// ─── POST: Approve / Reject / Delete ──────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body       = json_decode(file_get_contents('php://input'), true);
    $product_id = isset($body['product_id']) ? (int) $body['product_id'] : 0;
    $action     = $body['action'] ?? '';

    if (!$product_id || !in_array($action, ['approve', 'reject', 'delete'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid request.']);
        exit;
    }

    if ($action === 'delete') {
        $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
        $stmt->bind_param("i", $product_id);

    } else {
        $newStatus = $action === 'approve' ? 'approved' : 'rejected';
        $stmt = $conn->prepare("UPDATE products SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $newStatus, $product_id);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'DB error: ' . $stmt->error]);
    }

    $stmt->close();
    exit;
}

echo json_encode(['success' => false, 'message' => 'Method not allowed.']);