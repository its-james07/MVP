<?php 
  require("../components/navbar.php");
  require("../components/cartmodal.php");
  require("../components/loginmodal.php");
  require("../components/accountmodal.php");
  require("../components/wishmodal.php");
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title>Shop Homepage</title>
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="../assets/favicon/favicon.png" />

   <link rel="stylesheet" href="../assets/css/navbar.css">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <link rel="stylesheet" href="../assets/css/mediaqueries.css">
  <link rel="stylesheet" href="../assets/css/cartModal.css">
  <link rel="stylesheet" href="../assets/css/accountModal.css" />
  <link rel="stylesheet" href="../assets/css/wishModal.css" />
  <link rel="stylesheet" href="../assets/css/productCatalog.css" />
  <link rel="stylesheet" href="../assets/css/productDetails.css" />
    <!-- <link rel="stylesheet" href="../assets/vendor/bootstrap/css/bootstrap.min.css" /> -->
  </head>

<body>   
<section class="filter-section" >
  <div class="filter-container">
    <h2>Browse Products</h2>
    <div class="filters">
      <div class="categories">
        <button class="active catg-btn">All</button>
        <button class="catg-btn">Dog</button>
        <button class="catg-btn">Cat</button>
        <button class="catg-btn">Fish</button>
        <button class="catg-btn">Bird</button>
      </div>
      <div class="sort">
        <label for="sort-price">Sort by:</label>
        <select id="sort-price">
          <option value="">Default</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>
    </div>
</div>
</section>
    <section class="products-section spacing">
      <div class="product-items" id="product-items">
        <!-- Product Card Example -->
        <!-- <div class="dfitem">
          <div class="dfitem-img">
            <img src="../assets/images/collar.png" alt="Collar" />
          </div>
          <div class="fitem-details">
            <h4><a href="#main">Collar for Dog | New</a></h4>
            <div class="price-wishlist">
              <p id="price">Rs 200</p>
            <button class="wish-btn"><b>Wishlist +</b></ion-icon></button>
            </div>
          </div>
        </div> -->
      </div>
    </section>
  <!-- <div class="load-more" style="display: flex; align-items: center; color: red">
  <button class="load-data">Centered Button</button>
  </div> -->
    <!-- Footer -->
    <!-- <footer class="py-2 bg-dark">
      <div class="container">
        <p class="m-0 text-center text-white">Copyright &copy; Your Website 2023</p>
      </div>
    </footer> -->
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
    <script src="../assets/js/main.js"></script>
    <script src="../assets/js/renderProducts.js"></script>
    <script src="../assets/js/browse.js"></script>
    <script src="../assets/js/modal.js"></script>
    <script src="../assets/js/signin.js"></script>
    <script src="../assets/js/signout.js"></script>
  <script src="../assets/js/viewProduct.js"></script>
  <script src="../assets/js/cartModal.js"></script>
  </body>
</html>
