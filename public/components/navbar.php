<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <header class="navbar-container">
  <div class="header-main" style="background-color: #fafafa; height: 8rem;">
    <div class="logo-container">
      <a href="/mvp/public/index.php"><strong>Pupkit</strong></a>
    </div>
    <div class="search-bar">
      <input type="search" name="search" class="search-field" placeholder="Enter your product name..." />
      <button class="search-btn">
        <img src="/mvp/public/assets/images/index/search.svg" alt="search-btn" style="height: 20px; width: 30px;">
      </button>
    </div>

    <div class="top-right-icons">
      <button class="action-btn">

        <img src="/mvp/public/assets/images/index/heart (1).svg" alt="wishlist" class="show-wishlist ion-icon">
        <span class="badge" id="wish-badge">0</span>
      </button>
      <button class="action-btn">
        <img src="/mvp/public/assets/images/index/cart.svg" alt="cart" class="show-cart ion-icon">
        <span class="badge" id="cart-badge">0</span>
      </button>
      <button class="action-btn user-login">
        <img src="/mvp/public/assets/images/index/usericon.svg" alt="userIcon" class="ion-icon">
      </button>

    </div>
  </div>

  <!-- Mobile Bottom Nav -->
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
<div class="mobile-bottom-navigation">
    <a href="index.html" class="nav-item active"><i class="bi bi-house"></i><span>Home</span></a>
    <a href="#" class="nav-item show-wishlist"><i class="bi bi-heart"></i><span>Wishlist</span></a>
    <a href="#" class="nav-item show-cart main-nav-item"><i class="bi bi-cart3"></i></a>
    <a href="#" class="nav-item"><i class="bi bi-basket"></i><span>Search</span></a>
    <a href="#" class="nav-item user-login"><i class="bi bi-person"></i><span>Profile</span></a>
</div>
</header>
</body>
</html>
