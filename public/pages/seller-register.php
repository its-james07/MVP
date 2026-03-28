<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>pupkit - Seller Registration</title>
    <link rel="stylesheet" href="../assets/css/SRF.css">
    <link rel="stylesheet" href="../assets/css/toast.css">
    <link rel="icon" href="../assets/favicon/favicon.png">
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

                <!-- ── Step 1: Shop Information ── -->
                <div class="form-step active" id="step1">
                    <h2>Shop Information</h2>

                    <label for="shop_name">Shop Name
                        <span id="storeNameError" class="formError"></span>
                    </label>
                    <input type="text" id="shop_name" name="shop_name" placeholder="Enter shop name" required>

                    <label for="owner_name">Owner Full Name
                        <span id="ownerNameError" class="formError"></span>
                    </label>
                    <input type="text" id="owner_name" name="owner_name" placeholder="Enter owner name" required>

                    <label for="shop_address">Business Address
                        <span id="addressError" class="formError"></span>
                    </label>
                    <input type="text" id="shop_address" name="shop_address" placeholder="Enter business address" required>

                    <label for="city">City
                        <span id="cityError" class="formError"></span>
                    </label>
                    <select name="city" id="city" required>
                        <option value="">Select a City</option>
                        <option value="kathmandu">Kathmandu</option>
                        <option value="bhaktapur">Bhaktapur</option>
                        <option value="lalitpur">Lalitpur</option>
                    </select>

                    <div class="btn-group">
                        <button type="button" id="nextBtn" class="btn">Next →</button>
                    </div>
                </div>

                <!-- ── Step 2: Account Details ── -->
                <div class="form-step" id="step2">
                    <h2>Account Details</h2>

                    <label for="email">Email
                        <span id="emailError" class="formError"></span>
                    </label>
                    <input type="email" id="email" name="email" placeholder="Enter your email" autocomplete="email" required>

                    <label for="password">Password
                        <span id="passError" class="formError"></span>
                    </label>
                    <div class="input-wrapper">
                        <input type="password" id="password" name="password" placeholder="Min. 8 characters" required>
                        <span class="toggle-icon" onclick="toggleField('password', this)">
                            <ion-icon name="eye-outline"></ion-icon>
                        </span>
                    </div>

                    <!-- ── Password strength indicator ── -->
                    <div class="pass-strength-wrapper">
                        <div class="pass-strength-track">
                            <div id="pass-strength-bar"></div>
                        </div>
                        <div class="pass-strength-meta">
                            <span id="pass-strength-text"></span>
                        </div>
                        <ul id="pass-suggestions"></ul>
                    </div>
                    <!-- ─────────────────────────────── -->

                    <label for="confirm_password">Confirm Password
                        <span id="not-confirm" class="formError"></span>
                    </label>
                    <div class="input-wrapper">
                        <input type="password" id="confirm_password" name="confirm_password" placeholder="Re-enter your password" required>
                        <span class="toggle-icon" onclick="toggleField('confirm_password', this)">
                            <ion-icon name="eye-outline"></ion-icon>
                        </span>
                    </div>

                    <label for="phone">Phone Number
                        <span id="phoneError" class="formError"></span>
                    </label>
                    <input type="tel" id="phone" name="phone" placeholder="10-digit Nepali number (97/98...)" autocomplete="tel" maxlength="10" required>

                    <div class="terms">
                        <input type="checkbox" id="terms&conditions" required>
                        <a href="#main">I agree to Terms & Conditions</a>
                    </div>

                    <div class="btn-group">
                        <button type="button" id="prevBtn" class="nav-btn">← Previous</button>
                        <button id="submitBtn" type="submit" class="btn">Register Seller</button>
                    </div>
                </div>

            </form>
        </div>
    </section>

    <div id="toast" class="toast"></div>
</main>

<script src="../assets/js/register-seller.js"></script>
</body>
</html>