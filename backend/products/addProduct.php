<?php 
    require_once '../config/db.php';
    require 'uploadimage.php';
    header('Content-Type: application/json');


    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        try {
    $name = trim($_POST['name'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $price = $_POST['price'] ?? null;
    $stock = $_POST['stock_quantity'] ?? null;
    $isActive = isset($_POST['is_active']) ? 1 : 0;

    if ($name === '' || strlen($name) < 2) {
        throw new Exception('Invalid product name');
    }

    if (strlen($description) > 100) {
        throw new Exception('Description too long');
    }

    if (!is_numeric($price) || $price <= 0) {
        throw new Exception('Invalid price');
    }

    if (!ctype_digit((string)$stock) || $stock < 0) {
        throw new Exception('Invalid stock quantity');
    }

    if (!isset($_FILES['product-image'])) {
        throw new Exception('Product image is required');
    }

    $imageName = uploadImage($_FILES['product-image']);

    $stmt = $conn->prepare("
        INSERT INTO products 
        (name, description, price, stock_quantity, is_active, image_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");

    $stmt->execute([
        $name,
        $description,
        $price,
        $stock,
        $isActive,
        $imageName
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Product added successfully'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
    }
?>