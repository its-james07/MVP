<?php
header('Content-Type: application/json');
require_once '../../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    // ─── GET: Fetch all users ───────────────────────────────
    if ($method === 'GET') {
        $sql = "SELECT user_id, fname, email, role, status, created_at FROM users ORDER BY created_at DESC";
        $result = $conn->query($sql);

        if (!$result) throw new Exception("Query failed: " . $conn->error);

        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }

        echo json_encode(["success" => true, "data" => $users]);

    // ─── POST: Suspend / Activate / Delete ─────────────────
    } elseif ($method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);

        if (!isset($body['user_id']) || !isset($body['action'])) {
            throw new Exception("Missing user_id or action");
        }

        $user_id = (int) $body['user_id'];
        $action  = $body['action'];

        if ($action === 'delete') {
            $stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
            if (!$stmt) throw new Exception($conn->error);
            $stmt->bind_param("i", $user_id);
            $stmt->execute();
            $stmt->close();

            echo json_encode(["success" => true, "message" => "User deleted successfully."]);

        } elseif ($action === 'suspend') {
            $status = 'suspended';
            $stmt = $conn->prepare("UPDATE users SET status = ? WHERE user_id = ?");
            if (!$stmt) throw new Exception($conn->error);
            $stmt->bind_param("si", $status, $user_id);
            $stmt->execute();
            $stmt->close();

            echo json_encode(["success" => true, "message" => "User suspended successfully."]);

        } elseif ($action === 'activate') {
            $status = 'active';
            $stmt = $conn->prepare("UPDATE users SET status = ? WHERE user_id = ?");
            if (!$stmt) throw new Exception($conn->error);
            $stmt->bind_param("si", $status, $user_id);
            $stmt->execute();
            $stmt->close();

            echo json_encode(["success" => true, "message" => "User activated successfully."]);

        } else {
            throw new Exception("Invalid action: " . $action);
        }

    } else {
        throw new Exception("Invalid request method.");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}