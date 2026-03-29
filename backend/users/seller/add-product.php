<?php

declare(strict_types=1);

session_start();
header('Content-Type: application/json; charset=utf-8');

require_once '../../auth/config/db.php';


const MAX_IMAGE_BYTES         = 2 * 1024 * 1024;
const UPLOAD_DIR              = '../../../public/assets/images/products/';
const IMAGE_PUBLIC_PATH       = '/mvp/public/assets/images/products/';
const NAME_SIMILARITY_THRESHOLD = 85.0;

function respond(int $code, bool $ok, string|array $message, array $extra = []): never
{
    http_response_code($code);
    echo json_encode(['status' => $ok ? 'success' : 'error', 'message' => $message, ...$extra], JSON_UNESCAPED_UNICODE);
    exit();
}

function normalise(string $text): string
{
    return trim(preg_replace('/\s+/', ' ', strtolower($text)));
}

function nameSimilarity(string $a, string $b): float
{
    similar_text(normalise($a), normalise($b), $percent);
    return round($percent, 2);
}

function validateImage(array $file): string
{
    $uploadErrors = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds the server upload size limit.',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds the form upload size limit.',
        UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded.',
        UPLOAD_ERR_NO_FILE    => 'No file was uploaded.',
        UPLOAD_ERR_NO_TMP_DIR => 'Server is missing a temporary folder.',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk.',
        UPLOAD_ERR_EXTENSION  => 'Upload blocked by a server extension.',
    ];

    if ($file['error'] !== UPLOAD_ERR_OK) return $uploadErrors[$file['error']] ?? 'Unknown upload error.';

    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true)) return 'Only JPG, PNG, and WEBP images are accepted.';
    if ($file['size'] > MAX_IMAGE_BYTES) return sprintf('Image must be under %d MB.', intdiv(MAX_IMAGE_BYTES, 1024 * 1024));

    return '';
}

function saveImage(array $file): string
{
    if (!is_dir(UPLOAD_DIR) && !mkdir(UPLOAD_DIR, 0755, true) && !is_dir(UPLOAD_DIR)) {
        throw new RuntimeException('Upload directory could not be created: ' . UPLOAD_DIR);
    }

    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$mime];
    $filename = 'product_' . bin2hex(random_bytes(12)) . '.' . $ext;
    $dest = UPLOAD_DIR . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        throw new RuntimeException('move_uploaded_file() failed for destination: ' . $dest);
    }

    return IMAGE_PUBLIC_PATH . $filename;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, false, 'Method not allowed.');

$sellerId = $_SESSION['seller_id'] ?? 0;
if ($sellerId <= 0) respond(401, false, 'Unauthorised. Please log in.');


$categoryId  = (int) ($_POST['category'] ?? 0);
$typeId      = isset($_POST['type']) && $_POST['type'] !== '' ? (int) $_POST['type'] : null;
$name        = trim($_POST['name'] ?? '');
$description = trim($_POST['description'] ?? '');
$price       = (float) ($_POST['price'] ?? 0.0);
$stock       = (int) ($_POST['stock'] ?? 0);
$sku         = isset($_POST['sku']) && $_POST['sku'] !== '' ? trim($_POST['sku']) : null;
$weight      = isset($_POST['weight']) && $_POST['weight'] !== '' ? trim($_POST['weight']) : null;

//Server validation for required fields
$errors = [];
if ($categoryId <= 0) $errors[] = 'Please select a category.';
if (mb_strlen($name) < 2) $errors[] = 'Product name must be at least 2 characters.';
if (mb_strlen($name) > 255) $errors[] = 'Product name must not exceed 255 characters.';
if (empty($description)) $errors[] = 'Description is required.';
if ($price <= 0) $errors[] = 'Price must be greater than 0.';
if ($stock < 0) $errors[] = 'Stock cannot be negative.';
if (empty($_FILES['image']['name'] ?? '')) $errors[] = 'A product image is required.';
if ($errors) respond(422, false, $errors);

//Validating image

$imageError = validateImage($_FILES['image']);
if ($imageError !== '') respond(422, false, $imageError);

//DUplicate checking
try {
    $dupStmt = $conn->prepare('SELECT product_id, name FROM products WHERE seller_id = ?');
    $dupStmt->bind_param('i', $sellerId);
    $dupStmt->execute();
    $dupResult = $dupStmt->get_result();

    while ($row = $dupResult->fetch_assoc()) {
        if (nameSimilarity($name, $row['name']) >= NAME_SIMILARITY_THRESHOLD) {
            $dupStmt->close();
            respond(409, false, sprintf('A similar product "%s" already exists in your store.', htmlspecialchars($row['name'], ENT_QUOTES)));
        }
    }

    $dupStmt->close();
} catch (Throwable $e) {
    respond(500, false, 'A server error occurred during duplicate check. Please try again.');
}

//Saves image of the product
try {
    $imagePath = saveImage($_FILES['image']);
} catch (Throwable $e) {
    respond(500, false, 'Failed to save the product image. Please check folder permissions.');
}

 //Inserts product data

try {
    $stmt = $conn->prepare("
        INSERT INTO products
            (seller_id, category_id, type_id, name, description,
             price, stock, image, status, sku, weight)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    ");

    $stmt->bind_param('iiissdisss', $sellerId, $categoryId, $typeId, $name, $description, $price, $stock, $imagePath, $sku, $weight);
    $stmt->execute();
    $newProductId = (int) $stmt->insert_id;
    $stmt->close();
} catch (Throwable $e) {
    if (file_exists(UPLOAD_DIR . basename($imagePath))) unlink(UPLOAD_DIR . basename($imagePath));
    respond(500, false, 'Failed to save the product. Please try again.');
}

//Success message
respond(201, true, 'Product submitted successfully. It is pending admin approval.', ['product_id' => $newProductId]);