
// header("Content-Type: application/json");
// require_once "../../config/db.php";

// try {
//     $sql = "
//         SELECT
//             s.id AS seller_id, 
//             u.name AS user_name, 
//             u.email AS user_email, 
//             sh.shop_name, 
//             sh.address, 
//             s.status, s.created_at
//         FROM sellers s
//         JOIN users u ON s.user_id = u.id
//         JOIN shops sh ON sh.seller_id = s.id
//         WHERE s.status = 'pending'
//         ORDER BY s.created_at DESC
//     ";

//     $result = $conn->query($sql);

//     if (!$result) {
//         throw new Exception("Database query failed: " . $conn->error);
//     }

//     $applications = [];
//     while ($row = $result->fetch_assoc()) {
//         $applications[] = $row;
//     }

//     echo json_encode([
//         "success" => true,
//         "data" => $applications
//     ]);
// } catch (Exception $e) {
//     http_response_code(500);
//     echo json_encode([
//         "success" => false,
//         "message" => "Server error: " . $e->getMessage()
//     ]);
// }

<?php
header("Content-Type: application/json");

try {
    // Dummy data simulating pending sellers
    $applications = [
        [
            "seller_id" => 1,
            "user_name" => "James Karki",
            "user_email" => "james@example.com",
            "shop_name" => "James Electronics",
            "address" => "Kathmandu, Nepal",
            "status" => "pending",
            "created_at" => "2026-03-02 10:15:00"
        ],
        [
            "seller_id" => 2,
            "user_name" => "Nikesh Gajurel",
            "user_email" => "nikesh@example.com",
            "shop_name" => "Tech World",
            "address" => "Lalitpur, Nepal",
            "status" => "pending",
            "created_at" => "2026-03-01 14:20:00"
        ],
        [
            "seller_id" => 3,
            "user_name" => "Rubisha Pokhrel",
            "user_email" => "rubisha@example.com",
            "shop_name" => "Gadget Hub",
            "address" => "Bhaktapur, Nepal",
            "status" => "pending",
            "created_at" => "2026-02-28 09:45:00"
        ]
    ];

    echo json_encode([
        "success" => true,
        "data" => $applications
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}