<?php
function uploadImage(array $file, $category): string
{
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Image upload error');
    }

    if ($file['size'] > 2 * 1024 * 1024) {
        throw new Exception('Image size exceeds 2MB');
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mime, $allowedTypes)) {
        throw new Exception('Invalid image type');
    }

    if($category === 'dog'){
       $uploadDir = __DIR__ . '/../../public/assets/images/dog-products/';
    }else if($category === 'cat'){
       $uploadDir = __DIR__ . '/../../public/assets/images/cat-products/';
    }else if($category === 'fish'){
       $uploadDir = __DIR__ . '/../../public/assets/images/fish-products/';
    }else{
       $uploadDir = __DIR__ . '/../../public/assets/images/bird-products/';
    }

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $fileName = uniqid('product_', true) . '.' . $extension;

    if (!move_uploaded_file($file['tmp_name'], $uploadDir . $fileName)) {
        throw new Exception('Failed to move uploaded file');
    }
    return $fileName;
}

