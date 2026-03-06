<?php
header('Content-Type: application/json');
require_once $_SERVER['DOCUMENT_ROOT'] . '/mvp/backend/auth/config/db.php';
require $_SERVER['DOCUMENT_ROOT'] . '/mvp/backend/auth/config/sanitizedata.php';

try {
    if ($_SERVER["REQUEST_METHOD"] !== 'POST') {
        throw new Exception("Invalid request method");
    }

    $result = validateUser($_POST, $conn);

    if (!$result['success']) {
        echo json_encode(["status" => "error", "message" => $result['errors']]);
        exit;
    }

    $fname          = $result['fname'];
    $email          = $result['email'];
    $hashedPassword = $result['password'];

    $stmt = $conn->prepare("INSERT INTO users(fname, email, password) VALUES (?, ?, ?)");
    if ($stmt === false) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("sss", $fname, $email, $hashedPassword);
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

    echo json_encode(["status" => "success", "message" => "Signup Successful"]);

} catch (Exception $e) {
    error_log($e->getMessage());
    echo json_encode(["status" => "error", "message" => "Something went wrong"]);
    exit;
}

// ─── Validate & Sanitize ──────────────────────────────────────
function validateUser($data, $conn) {
    $errors = [];

    $fname    = sanitizeData($data['fname']      ?? '');
    $email    = sanitizeData($data['reg-email']  ?? '');
    $password = $data['new-pass']                ?? '';

    // Name
    if (empty($fname) || !preg_match("/^[a-zA-Z ]+$/", $fname)) {
        $errors[] = "Empty or invalid name";
    }

    // Email
    if (empty($email)) {
        $errors[] = "Email field is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }

    // Password
    if (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters";
    }

    // Duplicate email check (only if no errors so far)
    if (empty($errors)) {
        $check = $conn->prepare("SELECT user_id FROM users WHERE email = ? LIMIT 1");
        if (!$check) throw new Exception("Prepare failed: " . $conn->error);

        $check->bind_param("s", $email);
        if (!$check->execute()) throw new Exception("Execute failed: " . $check->error);

        $check->store_result();
        if ($check->num_rows > 0) {
            $errors[] = "Email is already registered";
        }
        $check->close();
    }

    if (!empty($errors)) {
        return ['success' => false, 'errors' => $errors];
    }

    return [
        'success'  => true,
        'fname'    => $fname,
        'email'    => $email,
        'password' => password_hash($password, PASSWORD_DEFAULT)
    ];
}