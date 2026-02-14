<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seller Registration</title>
    <link rel="stylesheet" href="../assets/css/SRF.css">
    <link rel="stylesheet" href="../assets/css/toast.css">
    <!-- <link rel="stylesheet" href="../assets/css/styles.css"> -->

    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
</head>

<body>
<main class="container">
    <section id="pageInfo">
        <img src="../assets/images/sellerRegistration.png" alt="seller registration illustration">
        <h3>Grow | Expand | Earn</h3>
    </section>
    <section class="seller-section">
        <div class="card">
            <div class="progress-container">
                <div class="progress" id="progress"></div>
                <div class="circle active">1</div>
                <div class="circle">2</div>
        </div>
<form id="regForm" method="POST">
    <div class="form-step active" id="step1">
        <h2>Shop Information</h2>

        <label for="shop_name">Shop Name</label>
        <input type="text" id="shop_name" name="shop_name" required>
        <span id="storeNameError" class="formError"></span>

        <label for="owner_name">Owner Full Name</label>
        <input type="text" id="owner_name" name="owner_name" required>
        <span id="ownerNameError" class="formError"></span>

        <label for="shop_address">Business Address</label>
        <input type="text" id="shop_address" name="shop_address" required>

        <label for="city">City</label>
        <!-- <input type="text" name="city"> -->
        <select name="city" id="city" required>
            <option value="">Select a City</option>
            <option value="kathmandu">Kathmandu</option>
            <option value="bhaktapur">Bhaktapur</option>
            <option value="lalitpur">Lalitpur</option>
        </select>

        <div class="btn-group">
            <button type="button" id="nextBtn" class="nav-btn">Next</button>
        </div>
</div>
<div class="form-step" id="step2">
    <h2>Account Details</h2>

    <label for="email">Email</label>
    <input type="email" id="email" name="email" autocomplete="email" required>
    <span id="emailError" class="formError"></span>

    <label for="password">Password</label>
    <input type="password" id="password" class="toggle" name="password" minlength="8" required>
    <span id="passError" class="formError"></span>

    <label for="confirm_password">Confirm Password</label>
    <input type="password" id="confirm_password" class="toggle" name="confirm_password" required>
    <span id="not-confirm" class="formError"></span>

    <div class="show-pass">
        <input type="checkbox" id="toggle-password">
        <label for="toggle-password" id="show-text"><strong>Show</strong></label>
    </div>

    <label for="phone">Phone Number</label>
    <input type="tel" id="phone" name="phone" autocomplete="tel" pattern="[0-9]{10}" required>
    <span id="phoneError" class="formError"></span>

    <div class="terms">
        <input type="checkbox" id="terms&conditions" required>
        <a href="#main">I agree to Terms & Conditions</a>
    </div>

    <div class="btn-group">
        <button type="button" id="prevBtn" class="nav-btn">Previous</button>
        <button id="submitBtn" type="submit" class="btn">Register Seller</button>
    </div>
    </div>
</form>
</div>
</section>
<div id="toast" class="toast"></div>
</main>
<script src="../assets/js/registerSeller.js"></script>
</body>
</html>