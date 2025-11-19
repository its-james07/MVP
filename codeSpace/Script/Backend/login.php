<?php 
session_start();
require 'db.php';   

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $lemail = trim($_POST["log-email"]);
    $lpass = trim($_POST["log-pass"]);

    $stmt = $conn->prepare("SELECT id, fname, email,role, password FROM signup_db WHERE email = ?");
    if ($stmt === false) {
        die("Prepare failed: " . $conn->error);
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
            header('Location: ../../adminDashboard.php');
        }
        elseif($role === 'seller'){
            header('Location: sellerDashboard.php');  
        }
        else{
            echo "Invalid password";
        }
    } else {
        echo "Invalid email"; 
    }

    $stmt->close();
    $conn->close();
}}
?>
