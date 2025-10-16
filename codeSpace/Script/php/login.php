<?php 
require_once 'db.php'; // Make sure db.php sets up $conn (mysqli connection)

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $lemail = trim($_POST["log-email"]);
    $lpass = trim($_POST["log-pass"]);

    // Prepare SQL statement
    $stmt = $conn->prepare("SELECT password FROM signup_db WHERE email = ?");
    if ($stmt === false) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $lemail);
    $stmt->execute();

    // Bind the result to a variable
    $stmt->bind_result($dbpassword);

    // Fetch the result
    if ($stmt->fetch()) {
        // Compare passwords (use password_verify() if hashed)
        if (!password_verify($lpass,$dbpassword)) {
            echo "$conn->error";
        } else {
            echo "Login Successful ";
        }
    } else {
        echo "Email not found";
    }

    $stmt->close();
    $conn->close();
}
?>
