<?php 

session_start();
require("../config/db.php");
if($_SERVER["REQUEST_METHOD"] === 'POST'){

    $id = $_POST['id'] ?? 0;
    
}