<?php
header('Content-Type: application/json');

$users = [
    ["id" => 1, "name" => "James Karki", "email" => "jameskarki@gmail.com"],
    ["id" => 2, "name" => "Sarah Lee", "email" => "sarahlee@gmail.com"],
    ["id" => 3, "name" => "John Doe", "email" => "johndoe@gmail.com"]
];

echo json_encode($users);
exit;
