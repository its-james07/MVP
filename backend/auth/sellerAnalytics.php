<?php 
session_start();
require_once('../config/db.php');
header('Content-Type: application/json');
// if(!isset($_SESSION['user_id']) || $_SESSION['role'] != 'seller'){
//     http_response_code(403);
//     echo json_encode(["error" => "unauthorized"]);
//     exit();
// }

$sid = $_SESSION['user_id'];
$responseData = [];
$result = $conn->query( "SELECT COUNT(*) AS total FROM products WHERE oid = $sid");
$row = $result->fetch_assoc();
$responseData['total_products'] = (int) $row['total'];


//Total Sellers
$result = $conn->query( "SELECT COUNT(*) AS total FROM users WHERE role = 'seller'");
$row = $result->fetch_assoc();
$responseData['total_sellers'] = (int) $row['total'];

//Total Products
$result = $conn->query(
    "SELECT COUNT(*) AS total FROM products"
);
$row = $result->fetch_assoc();
$responseData['total_products'] = (int) $row['total'];

//Pending User Requests
$result = $conn->query(
    "SELECT COUNT(*) AS total FROM users WHERE role = 'pending'"
);
$row = $result->fetch_assoc();
$responseData['pending_requests'] = (int) $row['total'];

echo json_encode($responseData);
exit();
