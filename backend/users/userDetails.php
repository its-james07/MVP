<?php
require_once '../config/db.php';
require '../config/sanitizedata.php';
header('Content-Type: application/json');

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Invalid request method");
    }

    // Sanitize input
    $fname = test_input($_POST["fname"]);
    $email = test_input($_POST["reg-email"]);
    $password = $_POST["new-pass"];
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Check if email exists
    $stmt = $conn->prepare("SELECT email FROM userdetails WHERE email = ?");
    if ($stmt === false) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $email);
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        echo json_encode(["status" => "email_exists", "message" => "Email Already Exists"]);
        $stmt->close();
        $conn->close();
        exit;
    }
    $stmt->close();

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO userdetails(fname, email, password) VALUES (?, ?, ?)");
    if ($stmt === false) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("sss", $fname, $email, $hashedPassword);
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    echo json_encode(["status" => "success", "message" =>"Signup Successful"]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    // Log the detailed error for debugging (server-side)
    error_log($e->getMessage());

    // Return a generic error to the client
    echo json_encode(["status" => "error", "message" => "Something went wrong"]);
    exit;
}
