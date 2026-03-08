<?php
session_start();
  require("components/navbar.php");
  require("components/cart-modal.php");
  require("components/login-modal.php");
  require("components/account-modal.php");
  require("components/wish-modal.php");
  require("components/body.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pet Shop Nepal</title>
  <link rel="stylesheet" href="assets/css/styles.css"/>
  <link rel="stylesheet" href="assets/css/navbar.css" />
  <link rel="stylesheet" href="assets/css/mediaqueries.css" />
  <link rel="stylesheet" href="assets/css/wish-modal.css" />
  <link rel="stylesheet" href="assets/css/cart-modal.css" />
  <link rel="stylesheet" href="assets/css/toast.css" />
  <link rel="stylesheet" href="assets/css/account-modal.css" />
  <link rel="stylesheet" href="assets/css/overlay-effect.css" />
  <link rel="stylesheet" href="assets/css/loader.css" />

  <link rel="icon" href="assets/favicon/favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0z-beta3/css/all.min.css" /> 
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</head>
<body>
 

  <!-- Footer section  -->
  <footer class="spacing">
    <section class="footer-section">
      <div class="top-foot">
      <div class="about-us">
        <h2>About Us</h2>
        <p>PupKit is your trusted destination for premium pet essentials, offering quality, comfort, and care for every furry friend. We provide thoughtfully curated products designed to keep pets happy and healthy. Our mission is to make pet parenting easier with reliable, affordable, and stylish solutions you and your pet will love.</p>
      </div>
      <div class="newsletter">
          <h1>Get Latest Updates</h1>
          <form action="">
          <input type="email" name="subscribe-email" id="subscribe-email" placeholder="Subscribe to our newsleeter">
          <button type="submit"><b>Subscribe!</b></button>
        </form>
        </div>
      </div> 
      <div class="bottom-foot">
        <div class="quick-links">
        <h3>Quick Links</h3>
        <ul class="footer-links">
          <li><a href="#main">Home</a></li>
          <li><a href="#main">Products</a></li>
          <li><a href="#main">Privacy Policy</a></li>
          <li><a href="#main">About us</a></li>
        </ul>
      </div>
      </div>  
    <div class="bottom-foot">
    </div>
    </section>
  </footer>

  <!-- Login Modal -->

  <div class="modal-overlay"></div>
  
<!-- <div class="loader"><div></div></div>   -->
<div class="toast" id="toast"></div>
  <script>
    document.addEventListener("DOMContentLoaded", () => {
    const guestAccount = document.querySelector('.guest-account');
    const userAccount = document.querySelector('.user-account');

    fetch("../backend/auth/checkSession.php")
        .then(res => res.json())
        .then(data => {
            if (data.loggedIn) {
                if (guestAccount) guestAccount.style.display = "none";
                if (userAccount) userAccount.style.display = "block";
            } else {
                if (guestAccount) guestAccount.style.display = "block";
                if (userAccount) userAccount.style.display = "none";
            }
        })
        .catch(err => console.error("Failed to check session:", err));
});
  </script>
  <script src="assets/js/modal.js"></script>
  <script src="assets/js/login.js"></script>
  <script src="assets/js/signout.js"></script>
  <script src="assets/js/view-product.js"></script>
  <script src="assets/js/render-products.js"></script>
  <script src="assets/js/cart-modal.js"></script>
  <!-- <script src="Script/validateForm.js"></script> -->
  <script src="assets/js/accordion-effect.js"></script>  
</body>
</html>