<?php 
session_start();
require_once 'db.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $lemail = trim($_POST["log-email"]);
    $lpass = trim($_POST["log-pass"]);

    $stmt = $conn->prepare("SELECT id,password FROM signup_db WHERE email = ?");
    if ($stmt === false) {
        die("Prepare failed: " . $conn->error);
    }
    $stmt->bind_param("s", $lemail);
    $stmt->execute();
    $stmt->bind_result($userId,$dbpassword);
    if ($stmt->fetch()) {
        if (password_verify($lpass,$dbpassword)) {
            $_SESSION['user_id'] = $userId;
            $_SESSION['user_email'] = $lemail;
            echo "Login Successful";
        } else {
            echo "Invalid Password";  
        }
    } else {
        echo "Invalid email"; 
    }

    $stmt->close();
    $conn->close();
}
?>
