<?php
require_once '../config/db.php';
require '../config/sanitizedata.php';
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fname = test_input($_POST["fname"]);
    $email = test_input($_POST["reg-email"]);
    $password = test_input($_POST["new-pass"]);
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("SELECT email FROM userdetails WHERE email = ?");
    if ($stmt === false){
        error_log("Database connection: ".$conn->error);
        echo json_encode(["status" => "error"]);
        exit;
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0){
        echo json_encode(["status" => "email_exists"]);
        $stmt->close();
        $conn->close();
        exit; 
    }
    $stmt->close();
    $stmt = $conn->prepare("INSERT INTO userdetails(fname, email, password) VALUES (?, ?, ?)");
    if ($stmt === false){
        error_log("Database connection failed ".$conn->error);
        echo json_encode(["status" => "error"]);
        exit;
    }

    $stmt->bind_param("sss", $fname, $email, $hashedPassword);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error"]);
    }
    $stmt->close();
    $conn->close();
}

