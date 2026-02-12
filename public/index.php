<?php
  require("components/navbar.php");
  require("components/cartModal.php");

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
  <link rel="stylesheet" href="assets/css/wishModal.css" />
  <link rel="stylesheet" href="assets/css/cartModal.css" />
  <link rel="stylesheet" href="assets/css/toast.css" />

  <link rel="stylesheet" href="assets/css/accountModal.css" />

  <link rel="icon" href="assets/favicon/favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0z-beta3/css/all.min.css" /> 
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</head>
<body>
  <!-- <header class="navbar-container">
    <div class="header-main" style="background-color: #fafafa; height: 8rem;">
      <div class="logo-container">
        <a href="index.php" ><strong>Pupkit</strong></a>
      </div>
      <div class="search-bar">
        <input type="search" name="search" class="search-field" placeholder="Enter your product name..." />
        <button class="search-btn">
          <img src="assets/images/index/search.svg" alt="search-btn" style="height: 20px; width: 30px;">
        </button>
      </div>

      <div class="top-right-icons">
        <button class="action-btn">
          
          <img src="assets/images/index/heart (1).svg" alt="wishlist" class="show-wishlist ion-icon">
          <span class="badge" id="wish-badge">0</span>
        </button>
        <button  class="action-btn">  
           <img src="assets/images/index/cart.svg" alt="cart" class="show-cart ion-icon">
          <span class="badge" id="cart-badge">0</span>
        </button>
        <button class="action-btn user-login">
          <img src="assets/images/index/usericon.svg" alt="userIcon" class="ion-icon">
        </button>
        
      </div>
    </div>

    <div class="mobile-bottom-navigation">
      <button class="action-btn"><ion-icon name="menu-outline"></ion-icon></button>
      <button class="action-btn">
        <img src="assets/images/cart.svg" alt="cart" class="show-cart ion-icon">
        <span class="badge" id="cart-badge">0</span>
      </button>
      <button class="action-btn" onclick="window.location.href='index.html'">
        <ion-icon name="home-outline"></ion-icon>
      </button>
      <button class="action-btn">
        <img src="assets/images/heart (1).svg" alt="wishlist" class="show-wishlist ion-icon">
        <span class="badge" id="wish-badge">0</span>
      </button>
      <button class="action-btn user-login">
        <img src="assets/images/usericon.svg" alt="userIcon" class="ion-icon">
      </button>
    </div>
  </header> -->

  <!-- Main Section  -->
  <main class="spacing">
    <!-- Hero section  -->
    <section class="hero-section">
      <div class="hero-banner">
        <picture>
          <source srcset="assets/images/index.hero-mobile.png" media="(max-width: 767px)" />
          <img src="assets/images/index/hero-desktop.png" alt="Poppy" />
        </picture>
        <div class="hbanner-content">
          <div class="hbanner-text">
            <h1>Care, Comfort, and Joy</h1>
            <p>Pet essentials you can trust.</p>
          </div>
          <div class="hbanner-links">
            <a href="pages/browseProduct.php" class="buy-link">Buy now!</a>
            <a href="pages/sellerRegister.html" class="login-btn">Become a Seller</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products-->
     <section class="featured-section">
      <h2 style="display: inline">Featured Products</h2>
      <span class="view-more"><a href="products_page.html">View all</a></span>

      <div class="featured-items" id="featured-items"> 
        <!-- For reference -->
         <!-- <div class="fitem">
          <div class="fitem-img">
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

    <!-- Shop by Category -->
    <section class="category-section">
      <h2>Shop by Category</h2>
      <div class="category-items">
        <div class="citem one">
          <img src="assets/images/index/cDog.png" alt="Dog" draggable="false" />
          <a href="pages/browseProduct.php">Dog</a>
        </div>
        <div class="citem two">
          <img src="assets/images/index/cCat.png" alt="Cat" draggable="false" />
          <a href="pages/browseProduct.php">Cat</a>
        </div>
        <div class="citem three">
          <img src="assets/images/index/cFish.png" alt="Fish" draggable="false" />
          <a href="pages/browseProduct.php">Fish</a>
        </div>
        <div class="citem four">
          <img src="assets/images/index/cBird.png" alt="Bird" draggable="false" />
          <a href="pages/browseProduct.php">Bird</a>
        </div>
      </div>
    </section>
    
    <section class="lined-info">
      <h2 style="font-size: 2.3rem;">Everything your pet needs</h2>
      <p>Nutritious food to fun toys, we make pet parenting easier and more joyful</p>
      <hr>
    </section> 

    <!--Banners  -->
    <section class="banner-container">
      <div class="dog-banner">
        <picture>
          <source srcset="assets/images/index/dogBanner.png" media="(max-width: 767px)" />
          <img src="assets/images/index/dogBanner.png" alt="Dog Banner" />
        </picture>
      </div>
    </section>

    <!-- Dog Featured Products-->
    <section class="dfeatured-section">
      <h2 style="display: inline">Our Recommendation</h2>
      <span class="view-more"><a href="pages/browseProduct.php">View all</a></span>
      <div class="dfeatured-items" id="dfeatured-items">
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

    <!-- Cat banner -->
    <section class="banner-container">
      <div class="cat-banner">
        <picture>
          <source srcset="assets/images/index" media="(max-width: 767px)" />
          <img src="assets/images/index/cBanner.png" alt="Cat Banner" />
        </picture>
      </div>
    </section>

        <!-- Featured Products-->
    <section class="cfeatured-section">
      <h2 style="display: inline">Our Recommendation</h2>
      <span class="view-more"><a href="pages/browseProduct.php">View all</a></span>

      <div class="cfeatured-items" id="cfeatured-items">
        <!-- Product Card Example -->
        <!-- <div class="cfitem">
          <div class="fitem-img">
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

    <section class="faq-section">
      <h2 style="text-align: center;">Frequently Asked Questions</h2>
      <p style="text-align: center;">Find quick answers to common questions about our services and policies</p>
      <ul class="faqs">
        <li class="accordion">What is your shipping time?<span class="show-arrow"><ion-icon name="chevron-down-outline"></ion-icon></span></li>
        <p class="panel">Our shipping times depend on your location and the type of product you order. Standard shipping usually takes 3–7 business days, while express shipping options are available for faster delivery. You can track your order in real-time through your account dashboard</p>
        <li class="accordion">Can I return or exchange a product?<span class="show-arrow"><ion-icon name="chevron-down-outline"></ion-icon></span></li>
        <p class="panel">Yes! We offer a 30-day return or exchange policy on most products. To initiate a return, go to your order history on our platform, select the product, and follow the return instructions. Please note that some items like consumables (e.g., pet food) may have restrictions for hygiene reasons.</p>
        <li class="accordion">How do I know which product is right for my pet?<span class="show-arrow"><ion-icon name="chevron-down-outline"></ion-icon></span></li>
        <p class="panel">Our platform provides detailed product descriptions, including size, breed recommendations, and age suitability. You can also use our Pet Match Tool to get personalized suggestions based on your pet’s breed, size, and age. For additional guidance, our customer support team is available via chat or email.</p>
        <li class="accordion">Is my payment information secure?<span class="show-arrow"><ion-icon name="chevron-down-outline"></ion-icon></span></li>
        <p class="panel">Absolutely! Our platform uses industry-standard encryption and secure payment gateways to protect your information. We accept major credit/debit cards, PayPal, and other secure payment methods. Your data is never shared with third parties without your consent</p>
      </ul>
    </section>

  </main>

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
  <div id="login-modal" class="login-modal">
    <button class="close-btn" style="font-size: 1.9rem">&times;</button>
    <div class="login-bar">
      <form name="login-form" class="login-form" id="login-form" action="../../backend/login.php" method="POST">
        <label for="log-email">Email</label>
        <input type="email" id="login-email" name="log-email" placeholder="abc@example.com" required />
        <label for="log-pass">Password<span class="pass-error">Invalid Password</span></label>
        <input type="password" id="login-pass" name="log-pass" placeholder="my password" required />
        
        <!-- <span class="toggle-btn"><ion-icon id="togglePassword" name="eye-outline" class="toggle-icon"></ion-icon></span> -->

        <div class="btn">
          <button type="submit" class="login-btn"><strong>Login</strong></button>
        </div>
        <a href="#main" id="fp">Forgot password?</a>
        <hr />
        <div class="reg-btn">
    <a href="userRegister.html" class="register-link">Create an account</a>
    </div>
    </form>
      
  </div>
</div>
  <div class="loader"><div></div></div>

  <div class="wishlist-modal">
        <div class="wishlist-header">Wishlist
        <button class="close-btn" style="font-size: 1.9rem; color: #2c6e49;">&times;</button>
        </div>
        <!-- Example items -->
        <div class="wishlists">
            <div class="wish-info"><a href="#main">Dog Biscuit</a></div>
            <div class="wish-actions">
                <button>Remove</button>
                <button>Add to Cart</button>
            </div>
        </div>
        <div class="wishlists">
            <div class="wish-info"><a href="#">NeckBand</a></div>
            <div class="wish-actions">
                <button>Remove</button>
                <button>Add to Cart</button>
            </div>
        </div>
    </div>

  

  <div class="account-modal">
  <!-- Guest Section -->
  <div class="guest-account">
    <div class="guest-info">
      <div class="guest-welcome"><strong>Welcome, Guest</strong></div>
      <div class="guest-text">You’re not signed in</div><hr>
    </div>

    <div class="guest-menu">
      <div class="guest-menu-item">
        <ion-icon name="log-in-outline" class="icon-login"></ion-icon>
        <button class="log-modal">Login</button>
      </div>
      <div class="guest-menu-item">
        <ion-icon name="person-add-outline" class="icon-create"></ion-icon>
        <span class="menu-text"><a href="pages/userRegister.html">Create an account</a></span>
      </div>
      <div class="guest-menu-item">
        <ion-icon name="briefcase-outline" class="icon-seller"></ion-icon>
        <span class="menu-text"><a href="sellerRegister.html">Become a Seller</a></span>
      </div>
    </div>
  </div>

  <!-- User Section -->
  <div class="user-account">
    <div class="user-info">
      <div class="user-name-text">Olivia Winters</div>
    </div>

    <div class="user-menu">
      <div class="user-menu-item">
        <ion-icon name="person-outline" class="icon-profile"></ion-icon>
        <span class="menu-text">Profile</span>
      </div>
      <div class="user-menu-item">
        <ion-icon name="settings-outline" class="icon-settings"></ion-icon>
        <span class="menu-text">Settings</span>
      </div>
      <div class="menu-divider"></div>
      <div class="user-menu-item logout">
        <ion-icon name="log-out-outline" class="icon-logout"></ion-icon>
        <button class="log-out-btn">Logout</button>
        <!-- class="menu-btn" -->
      </div>
    </div>
  </div>
</div>
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
  <!-- <script src="Script/main.js"></script> -->
  <script src="assets/js/modal.js"></script>
  <script src="assets/js/signin.js"></script>
  <script src="assets/js/signout.js"></script>
  <script src="assets/js/viewProduct.js"></script>
  <script src="assets/js/renderProducts.js"></script>
  <script src="assets/js/wishPage.js"></script>
  <script src="assets/js/cartModal.js"></script>
  <!-- <script src="Script/validateForm.js"></script> -->
  <script src="assets/js/accordionEffect.js"></script>
</body>
</html>