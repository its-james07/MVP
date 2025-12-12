<?php

require_once 'db.php';
header('Content-Type: application/json');

function test_input($data){
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $fname = test_input($_POST["fname"]);
    $email = test_input($_POST["reg-email"]);
    $password = test_input($_POST["new-pass"]);
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("SELECT email FROM signup_db WHERE email = ?");
    if ($stmt === false){
        die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0){
        $stmt->close();
        $conn->close();
        echo json_encode(["status" => "email_exists"]);
        exit; 
    }
    $stmt->close();
    $stmt = $conn->prepare("INSERT INTO signup_db(fname, email, password) VALUES (?, ?, ?)");
    if ($stmt === false){
        die("Unexpected error");
    }

    $stmt->bind_param("sss", $fname, $email, $hashedPassword);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        die("Execution failed");
    }

    $stmt->close();
    $conn->close();
}

