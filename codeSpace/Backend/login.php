<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

function test_input($data) {
    return trim($data); // don't htmlspecialchars passwords
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $lemail = test_input($_POST["log-email"] ?? '');
    $lpass  = $_POST["log-pass"] ?? '';

    $stmt = $conn->prepare(
        "SELECT id, fname, email, role, password FROM userdetails WHERE email = ?"
    );

    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "DB prepare failed"]);
        exit;
    }

    $stmt->bind_param("s", $lemail);
    $stmt->execute();
    $stmt->bind_result($userId, $username, $userMail, $role, $dbpassword);

    if ($stmt->fetch()) {

        if (password_verify($lpass, $dbpassword)) {

            $_SESSION['user_id'] = $userId;
            $_SESSION['username'] = $username;
            $_SESSION['usermail'] = $userMail;
            $_SESSION['role'] = $role;
            $_SESSION['logged-in'] = true;

            if ($role === 'admin') {
                echo json_encode(["status" => "redirect_admin"]);
            } elseif ($role === 'seller') {
                echo json_encode(["status" => "redirect_seller"]);
            } else {
                echo json_encode(["status" => "redirect_user"]);
            }

        } else {
            echo json_encode(["status" => "incorrect_password"]);
        }

    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }

    $stmt->close();
    $conn->close();
    exit;
}
