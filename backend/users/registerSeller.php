<?php 
require_once('../config/db.php');
require('../config/sanitizedata.php');
header('Content-Type: application/json');
try {
    if($_SERVER["REQUEST_METHOD"] !== "POST"){
        throw new Exception("Invalid Request Method");
    }

    $shopName = test_input($_POST['shop_name']);
    $shopAddress = test_input($_POST['shop_address']);
    $ownerName = test_input($_POST['owner_name']);
    $type = test_input($_POST['shop_type']);
    $sellerEmail = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $contact = $_POST['phone'];
    $role = "pending";

    $query1 = "INSERT INTO userdetails(fname, email, password, role) VALUES(?, ?, ?, ?)";
    $query2 = "INSERT INTO owner_details(oname, ocontact) VALUES(?,?)";
    $query3 = "INSERT INTO shop_details(sname, saddress, stype, oid) VALUES(?, ?, ?, ?)";

    $conn->begin_transaction();
    $stmt1 =  $conn->prepare($query1);
    if(!$stmt1) throw new Exception($conn->error);

    $stmt1->bind_param("ssss", $ownerName, $sellerEmail, $password, $role);
    if(!$stmt1->execute()) throw new Exception("Execute Failed" .$stmt1->error);
    $stmt1->close();

    $stmt2 =  $conn->prepare($query2);
    if(!$stmt2) throw new Exception($conn->error);

    $stmt2->bind_param("ss", $ownerName, $contact);
    if(!$stmt2->execute()) throw new Exception("Execute Failed" .$stmt2->error);
    $oid = $conn->insert_id;
    $stmt2->close();

    $stmt3 =  $conn->prepare($query3);
    if(!$stmt3) throw new Exception($conn->error);

    $stmt3->bind_param("sssi", $shopName, $shopAddress, $type, $oid);
    if(!$stmt3->execute()) throw new Exception("Execute Failed" .$stmt3->error);
    $stmt3->close();

    $conn->commit();
    echo json_encode(["status" => "success", "message" =>"Successful! Wait for Admin Approval"]);
}catch(Throwable $e){
    $conn->rollback();
    error_log($e->getMessage());
    echo json_encode(["status" => "error", "message" => "Registration Failed"]);
}finally{
    $conn->close();
}
?>