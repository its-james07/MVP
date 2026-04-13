<?php
session_start();
// if (isset($_SESSION['user_status']) && $_SESSION['user_status'] === 'suspended') {
//     echo json_encode([
//         'success' => false,
//         'message' => 'Feature unavailable due to Account Suspension'
//     ]);
//     exit;
// }
header('Content-Type: application/json');

require_once '../auth/config/db.php';

const NAME_SIMILARITY_THRESHOLD = 85.0;

function normalise(string $text): string {
    return trim(preg_replace('/\s+/', ' ', strtolower($text)));
}

function nameSimilarity(string $a, string $b): float {
    similar_text(normalise($a), normalise($b), $percent);
    return round($percent, 2);
}

if (!isset($_SESSION['seller_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized: Seller login required.']);
    exit;
}

$seller_id = $_SESSION['seller_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $action = $_POST['action'] ?? '';

    if (!$action) {
        $input  = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? '';
    }

    if ($action === 'delete') {
        $input      = $input ?? json_decode(file_get_contents('php://input'), true);
        $product_id = (int)($input['product_id'] ?? 0);
        $stmt = mysqli_prepare($conn, "DELETE FROM products WHERE product_id = ? AND seller_id = ?");
        mysqli_stmt_bind_param($stmt, "ii", $product_id, $seller_id);
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => true, 'message' => 'Product deleted successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete product.']);
        }
        exit;
    }

    if ($action === 'update_stock') {
        $input      = $input ?? json_decode(file_get_contents('php://input'), true);
        $product_id = (int)($input['product_id'] ?? 0);
        $stock      = (int)($input['stock'] ?? 0);
        $stmt = mysqli_prepare($conn, "UPDATE products SET stock = ? WHERE product_id = ? AND seller_id = ?");
        mysqli_stmt_bind_param($stmt, "iii", $stock, $product_id, $seller_id);
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => true, 'message' => 'Stock updated successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update stock.']);
        }
        exit;
    }

    if ($action === 'update_product') {

        $product_id  = (int)($_POST['product_id'] ?? 0);
        $name        = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price       = (float)($_POST['price'] ?? 0);
        $stock       = (int)($_POST['stock'] ?? 0);
        $category_id = !empty($_POST['category_id']) ? (int)$_POST['category_id'] : null;
        $type_id     = !empty($_POST['type_id']) ? (int)$_POST['type_id'] : null;
        $weight      = isset($_POST['weight']) && $_POST['weight'] !== '' ? (float)$_POST['weight'] : null;

        if (strlen($name) < 2) {
            echo json_encode(['success' => false, 'message' => 'Product name must be at least 2 characters.']);
            exit;
        }

        if ($price <= 0) {
            echo json_encode(['success' => false, 'message' => 'Price must be greater than zero.']);
            exit;
        }

        $dupStmt = $conn->prepare('SELECT product_id, name FROM products WHERE seller_id = ? AND product_id != ?');
        $dupStmt->bind_param('ii', $seller_id, $product_id);
        $dupStmt->execute();
        $dupResult = $dupStmt->get_result();

        while ($row = $dupResult->fetch_assoc()) {
            if (nameSimilarity($name, $row['name']) >= NAME_SIMILARITY_THRESHOLD) {
                echo json_encode([
                    'success' => false,
                    'message' => 'A similar product "' . htmlspecialchars($row['name'], ENT_QUOTES) . '" already exists.'
                ]);
                exit;
            }
        }

        if (!empty($_FILES['image']['size'])) {

            $file     = $_FILES['image'];
            $allowed  = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
            $maxBytes = 2 * 1024 * 1024;

            $finfo    = new finfo(FILEINFO_MIME_TYPE);
            $mimeType = $finfo->file($file['tmp_name']);

            if (!array_key_exists($mimeType, $allowed)) {
                echo json_encode(['success' => false, 'message' => 'Image must be JPG, PNG, or WEBP.']);
                exit;
            }

            if ($file['size'] > $maxBytes) {
                echo json_encode(['success' => false, 'message' => 'Image must be smaller than 2MB.']);
                exit;
            }

            $uploadDir = '../../uploads/products/';

            $stmtImg = mysqli_prepare($conn, "SELECT image FROM products WHERE product_id = ? AND seller_id = ?");
            mysqli_stmt_bind_param($stmtImg, "ii", $product_id, $seller_id);
            mysqli_stmt_execute($stmtImg);
            $rowImg = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtImg));

            if (!empty($rowImg['image'])) {
                $newFilename = $rowImg['image'];
            } else {
                $ext = $allowed[$mimeType];
                $newFilename = 'product_' . $product_id . '_' . uniqid() . '.' . $ext;
            }

            $destPath = $uploadDir . $newFilename;

            if (!move_uploaded_file($file['tmp_name'], $destPath)) {
                echo json_encode(['success' => false, 'message' => 'Failed to save image.']);
                exit;
            }

            if (empty($rowImg['image'])) {
                $stmtImgUpd = mysqli_prepare($conn, "UPDATE products SET image = ? WHERE product_id = ? AND seller_id = ?");
                mysqli_stmt_bind_param($stmtImgUpd, "sii", $newFilename, $product_id, $seller_id);
                mysqli_stmt_execute($stmtImgUpd);
            }
        }

        $stmt = mysqli_prepare($conn,
            "UPDATE products
             SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, type_id = ?, weight = ?
             WHERE product_id = ? AND seller_id = ?"
        );

        mysqli_stmt_bind_param($stmt, "ssdiiddii",
            $name, $description, $price, $stock,
            $category_id, $type_id, $weight,
            $product_id, $seller_id
        );

        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(['success' => true, 'message' => 'Product updated successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update product.']);
        }

        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Unknown action.']);
    exit;
}

$sql = "
    SELECT
        p.*,
        c.category_name AS category,
        pt.type_name AS product_type
    FROM products p
    LEFT JOIN categories c ON c.category_id = p.category_id
    LEFT JOIN product_types pt ON pt.type_id = p.type_id
    WHERE p.seller_id = ?
    ORDER BY p.created_at DESC
";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $seller_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

echo json_encode([
    'success' => true,
    'data' => mysqli_fetch_all($result, MYSQLI_ASSOC)
]);
?>