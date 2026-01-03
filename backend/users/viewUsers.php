<?php
require_once('../config/db.php');
header('Content-Type: application/json');

// function fetchRequests(){
//     try{
//     if($_SERVER["REQUEST_METHOD"] != "POST"){
//         throw new Exception("Invalid Request Method");
//     }

//     $stmt = $conn->query("SELECT * FROM userdetails WHERE role = 'pending'");
//     $result = store_result();
//     if($stmt->num_rows > 0){
        
//     }

// }catch(Exception e){
//     error_log($e->error);
//     echo json_encode("Something went wrong");
// }

$users = [
    ["id" => 1, "name" => "James Karki", "email" => "jameskarki@gmail.com"],
    ["id" => 2, "name" => "Sarah Lee", "email" => "sarahlee@gmail.com"],
    ["id" => 3, "name" => "John Doe", "email" => "johndoe@gmail.com"]
];

echo json_encode($users);
exit();

