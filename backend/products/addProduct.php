<?php
require_once '../config/db.php'; // assumes $mysqli is your mysqli object
require 'uploadimage.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $category = $_POST['category'] ?? '';
        $price = $_POST['price'] ?? '';
        $stock = $_POST['stock_quantity'] ?? '';
        $isActive = isset($_POST['is_active']) ? 1 : 0;

        // Validation
        if (empty($name) || strlen($name) < 2) {
            throw new Exception('Invalid product name');
        }

        if (strlen($description) > 100) {
            throw new Exception('Description too long');
        }

        if ($category === '') {
            throw new Exception('Please Select a Category');
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

        // Upload image
        $imageName = uploadImage($_FILES['product-image'], $category);

        // Prepare statement
        $stmt = $mysqli->prepare("
            INSERT INTO products
            (name, description, category, price, stock_quantity, is_active, image_url, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        ");

        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $mysqli->error);
        }

        $stmt->bind_param(
            "sssdiis",
            $name,
            $description,
            $category,
            $price,
            $stock,
            $isActive,
            $imageName
        );

        // Execute
        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Product added successfully'
        ]);

        $stmt->close();
        $mysqli->close();

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage()
        ]);
    }
}
?>
