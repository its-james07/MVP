<?php

require_once 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fname = $_POST["fname"];
    $lname = $_POST["lname"];
    $email = $_POST["reg-email"];

    $hashedPassword = password_hash($_POST["new-pass"], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("SELECT email FROM signup_db WHERE email = ?");
    if($stmt ===false){
        die("Prepare failed: ". $conn->error);
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    if($stmt->num_rows > 0){
        echo "email already registered";
        $stmt->close();
        $conn->close();
        exit;
    }

    $stmt->close();

    $stmt = $conn->prepare("INSERT INTO signup_db(fname, lname, email, password) VALUES (?, ?, ?, ?)");

    if ($stmt === false) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ssss", $fname, $lname, $email, $hashedPassword);

    if ($stmt->execute()) {
        echo "Signup Successful";
    } else {
        echo "Execute failed: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>



