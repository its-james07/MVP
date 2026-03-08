<?php
header('Content-Type: application/json');
require_once '../../auth/config/db.php';

// Start session to get logged-in admin's ID
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

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
        $body    = json_decode(file_get_contents('php://input'), true);

        if (!isset($body['user_id']) || !isset($body['action'])) {
            throw new Exception("Missing user_id or action");
        }

        $user_id = (int) $body['user_id'];
        $action  = $body['action'];

        // ─── DELETE ─────────────────────────────────────────
        if ($action === 'delete') {

            // 1. Verify admin password
            $password = $body['password'] ?? '';
            if (!$password) {
                echo json_encode(['success' => false, 'message' => 'Password is required.']);
                exit;
            }

            // 2. Get logged-in admin's hashed password
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'message' => 'Session expired. Please log in again.']);
                exit;
            }

            $admin_id = (int) $_SESSION['user_id'];
            $stmt = $conn->prepare("SELECT password FROM users WHERE user_id = ?");
            if (!$stmt) throw new Exception($conn->error);
            $stmt->bind_param("i", $admin_id);
            $stmt->execute();
            $adminData = $stmt->get_result()->fetch_assoc();
            $stmt->close();

            if (!$adminData || !password_verify($password, $adminData['password'])) {
                echo json_encode([
                    'success' => false,
                    'reason'  => 'wrong_password',
                    'message' => 'Incorrect password.'
                ]);
                exit;
            }

            // 3. Cascade delete in correct order
            $conn->begin_transaction();

            try {
                // Get seller_id linked to this user
                $stmt = $conn->prepare("SELECT seller_id FROM sellers WHERE user_id = ?");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("i", $user_id);
                $stmt->execute();
                $sellerData = $stmt->get_result()->fetch_assoc();
                $stmt->close();

                if ($sellerData) {
                    $seller_id = $sellerData['seller_id'];

                    // Delete products linked to this seller
                    $stmt = $conn->prepare("DELETE FROM products WHERE seller_id = ?");
                    if (!$stmt) throw new Exception($conn->error);
                    $stmt->bind_param("i", $seller_id);
                    $stmt->execute();
                    $stmt->close();

                    // Delete shop linked to this seller
                    $stmt = $conn->prepare("DELETE FROM shop WHERE seller_id = ?");
                    if (!$stmt) throw new Exception($conn->error);
                    $stmt->bind_param("i", $seller_id);
                    $stmt->execute();
                    $stmt->close();

                    // Delete seller record
                    $stmt = $conn->prepare("DELETE FROM sellers WHERE seller_id = ?");
                    if (!$stmt) throw new Exception($conn->error);
                    $stmt->bind_param("i", $seller_id);
                    $stmt->execute();
                    $stmt->close();
                }

                // Finally delete the user
                $stmt = $conn->prepare("DELETE FROM users WHERE user_id = ?");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("i", $user_id);
                $stmt->execute();
                $stmt->close();

                $conn->commit();
                echo json_encode([
                    "success" => true,
                    "message" => "User and all related data deleted successfully."
                ]);

            } catch (Exception $e) {
                $conn->rollback();
                throw new Exception("Delete failed: " . $e->getMessage());
            }

        // ─── SUSPEND ────────────────────────────────────────
        } elseif ($action === 'suspend') {

            $conn->begin_transaction();

            try {
                // Suspend the user
                $status = 'suspended';
                $stmt = $conn->prepare("UPDATE users SET status = ? WHERE user_id = ?");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("si", $status, $user_id);
                $stmt->execute();
                $stmt->close();

                // Suspend seller account if exists
                $stmt = $conn->prepare("UPDATE sellers SET status = ? WHERE user_id = ?");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("si", $status, $user_id);
                $stmt->execute();
                $stmt->close();

                // Unpublish their products
                $productStatus = 'rejected';
                $stmt = $conn->prepare("
                    UPDATE products SET status = ?
                    WHERE seller_id = (SELECT seller_id FROM sellers WHERE user_id = ?)
                ");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("si", $productStatus, $user_id);
                $stmt->execute();
                $stmt->close();

                $conn->commit();
                echo json_encode([
                    "success" => true,
                    "message" => "User suspended and products unpublished."
                ]);

            } catch (Exception $e) {
                $conn->rollback();
                throw new Exception("Suspend failed: " . $e->getMessage());
            }

        // ─── ACTIVATE ───────────────────────────────────────
        } elseif ($action === 'activate') {

            $conn->begin_transaction();

            try {
                // Activate the user
                $status = 'active';
                $stmt = $conn->prepare("UPDATE users SET status = ? WHERE user_id = ?");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("si", $status, $user_id);
                $stmt->execute();
                $stmt->close();

                // Reactivate seller account if exists
                $stmt = $conn->prepare("UPDATE sellers SET status = ? WHERE user_id = ?");
                if (!$stmt) throw new Exception($conn->error);
                $stmt->bind_param("si", $status, $user_id);
                $stmt->execute();
                $stmt->close();

                $conn->commit();
                echo json_encode([
                    "success" => true,
                    "message" => "User activated successfully."
                ]);

            } catch (Exception $e) {
                $conn->rollback();
                throw new Exception("Activate failed: " . $e->getMessage());
            }

        } else {
            throw new Exception("Invalid action: " . $action);
        }

    } else {
        throw new Exception("Invalid request method.");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}