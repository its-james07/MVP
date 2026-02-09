<?php 
require_once('../config/db.php');
header('Content-Type: application/json');

try {
    if($_SERVER["REQUEST_METHOD"] !== "POST"){
        throw new Exception("Invalid Request");
    }

    $shopName = trim($_POST['shop_name']);
    $ownerName = trim($_POST['owner_name']);
    $shopAddress = trim($_POST['shop_address']);
    $city = trim($_POST['city']);
    $sellerEmail = trim($_POST['email']);
    $contact = trim($_POST['phone']);
    $rawPassword = $_POST['password'];

    if(!filter_var($sellerEmail, FILTER_VALIDATE_EMAIL)){
        throw new Exception("Invalid email");
    }

    if(strlen($rawPassword) < 8){
        throw new Exception("Password too short");
    }

    if(!preg_match('/^[0-9]{10}$/',$contact)){
        throw new Exception("Invalid phone");
    }

    // check duplicate email
    $check = $conn->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
    $check->bind_param("s",$sellerEmail);
    $check->execute();
    $check->store_result();
    if($check->num_rows > 0){
        echo json_encode(["status"=>"error","message"=>"Email already registered"]);
        exit;
    }

    $password = password_hash($rawPassword, PASSWORD_DEFAULT);
    $role = "seller";
    $status = "pending";

    $conn->begin_transaction();

    // users
    $stmt1 = $conn->prepare("INSERT INTO users(fname,email,password,role) VALUES(?,?,?,?)");
    $stmt1->bind_param("ssss",$ownerName,$sellerEmail,$password,$role);
    $stmt1->execute();
    $user_id = $conn->insert_id;

    // sellers
    $stmt2 = $conn->prepare("INSERT INTO sellers(user_id,business_phone,status) VALUES(?,?,?)");
    $stmt2->bind_param("iss",$user_id,$contact,$status);
    $stmt2->execute();
    $seller_id = $conn->insert_id;

    // shops
    $stmt3 = $conn->prepare("INSERT INTO shops(seller_id,store_name,address,city) VALUES(?,?,?,?)");
    $stmt3->bind_param("isss",$seller_id,$shopName,$shopAddress,$city);
    $stmt3->execute();

    $conn->commit();

    echo json_encode([
        "status"=>"success",
        "message"=>"Registration successful. Wait for admin approval."
    ]);

}catch(Throwable $e){
    if($conn->connect_error === null){
        $conn->rollback();
    }
    error_log($e->getMessage());
    echo json_encode(["status"=>"error","message"=>"Registration failed"]);
}
