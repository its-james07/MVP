<?php

require_once 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fname = trim($_POST["fname"]);
    $email = trim($_POST["reg-email"]);
    $password = trim($_POST["new-pass"]);

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("SELECT email FROM signup_db WHERE email = ?");
    if($stmt ===false){
        die("Prepare failed: ". $conn->error);
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    if($stmt->num_rows > 0){
        $stmt->close();
        $conn->close();
        die("Already registered with this email");
    }

    $stmt->close();

    $stmt = $conn->prepare("INSERT INTO signup_db(fname, email, password) VALUES (?, ?, ?)");

    if ($stmt === false) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("sss", $fname, $email, $hashedPassword);

    if ($stmt->execute()) {
        echo "Signup Successful";
    } else {
        echo "Execute failed: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>



