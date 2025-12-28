<?php 
    require_once '../config/db.php';
    $result = $conn->query('SELECT * FROM products');
    print_r($result);
    