<?php
require_once '../config/db.php';
require '../config/sanitizedata.php';
header('Content-Type: application/json');

try {
    if ($_SERVER["REQUEST_METHOD"] !== 'POST') {
        throw new Exception("Invalid request method");
    }

    $result = validateUser($_POST, $conn);
    if(isset($result[0])){
        echo json_encode(["status" => "error", "message" => $result]);
        exit;
    }

    $fname = $result['fname'];
    $email = $result['email'];
    $hashedPassword = $result['password'];

    $stmt = $conn->prepare("INSERT INTO users(fname, email, password) VALUES (?, ?, ?)");
    if ($stmt === false) {
        throw new Exception("Prepare failed: ".$conn->error);
    }

    $stmt->bind_param("sss", $fname, $email, $hashedPassword);
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: ".$stmt->error);
    }

    echo json_encode(["status" => "success", "message" =>"Signup Successful"]);

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    error_log($e->getMessage());

    echo json_encode(["status" => "error", "message" => "Something went wrong"]);
    exit;
}

function validateUser($data, $conn){
    $errors = [];

    $fname = sanitizeData($data["fname"]);
    $email = sanitizeData($data["reg-email"]);
    $password = $data["new-pass"];

    // name validation
    if(empty($fname) || !preg_match("/^[a-zA-Z ]+$/", $fname)){
        $errors[] = "Empty or Invalid Name";
    }

    if(empty($email)){
        $errors[] = "Empty Email Field";
    }
    
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        $errors[] = "Invalid Email Format";
    }
    
    if(strlen($password) < 8){
        $errors[] = "Password too Short";
    }

    if(empty($errors)){
        $check = $conn->prepare("SELECT user_id FROM users WHERE email=? LIMIT 1");
        if(!$check) throw new Exception("Prepare failed: ".$conn->error);

        $check->bind_param("s", $email);
        if(!$check->execute()) throw new Exception("Execution failed: ".$check->error);

        $check->store_result();
        if($check->num_rows > 0){
            $errors[] = "Email already registered";
        }

        $check->close();
    }
    
    if(!empty($errors)){
        return $errors;
    }

    return [
        "fname" => $fname,
        "email" => $email,
        "password" => password_hash($password, PASSWORD_DEFAULT)
    ];
}
