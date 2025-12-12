<?php 
session_start();
require 'db.php';   
header('Content-Type: application/json');

function test_input($data){
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $lemail = test_input($_POST["log-email"]);
    $lpass = test_input($_POST["log-pass"]);

    $stmt = $conn->prepare("SELECT id, fname, email,role, password FROM signup_db WHERE email = ?");
    if ($stmt === false) {
        error_log("Database prepare failed". $conn->error);
        echo json_encode(["status" => "error"]);

    }
    $stmt->bind_param("s", $lemail);
    $stmt->execute();
    $stmt->bind_result($userId, $username, $userMail, $role, $dbpassword);
    
    if ($stmt->fetch()) {
        if (password_verify($lpass,$dbpassword)) {
        $_SESSION['user_id'] = $userId;
        $_SESSION['username'] = $username;
        $_SESSION['usermail'] = $userMail;
        $_SESSION['role'] = $role;
        $_SESSION['logged-in'] = true;
        if($role === 'admin') {
            echo json_encode(["status" => "redirect_admin"]);
            
        }
        else if($role === 'seller'){
            echo json_encode(["status" => "redirect_seller"]);
        }
        else{
            echo json_encode(["status" => "redirect_user"]);
        }
    } else {
        echo "Invalid Credentials"; 
    }

    $stmt->close();
    $conn->close();
}else{
    echo json_encode(["status" => "invalid_password"]);
}}
