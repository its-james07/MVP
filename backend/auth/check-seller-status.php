<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['seller_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

require_once 'config/db.php';

$seller_id = (int) $_SESSION['seller_id'];

$stmt = $conn->prepare('SELECT status FROM sellers WHERE seller_id = ?');
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}

$stmt->bind_param('i', $seller_id);
$stmt->execute();
$result = $stmt->get_result();
$seller = $result->fetch_assoc();
$stmt->close();

if (!$seller) {
    echo json_encode(['success' => false, 'message' => 'Seller not found']);
    exit;
}

echo json_encode([
    'success' => true,
    'status' => $seller['status'],
    'isSuspended' => ($seller['status'] === 'suspended'),
    'isActive' => ($seller['status'] === 'active')
]);

mysqli_close($conn);
?>
