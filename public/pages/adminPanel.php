<?php
  // session_start();
  // if(!isset($_SESSION['user_id'])){
  //   header('Location: ../index.php');
  //   exit();
  // }
  // if($_SESSION['role'] != 'admin'){
  //   header('Location: unauthorized.html');
  //   exit();
  // }
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Dashboard</title>

  <!-- Custom CSS -->
  <link rel="stylesheet" href="../assets/css/styles.css" />
  <link rel="stylesheet" href="../assets/css/navbar.css" />
  <link rel="stylesheet" href="../assets/css/mediaqueries.css" />
  <link rel="stylesheet" href="../assets/css/panel.css" />

  <!-- Bootstrap -->
  <link rel="stylesheet" href="../assets/vendor/bootstrap/css/bootstrap.min.css" />

  <!-- Font Awesome (REQUIRED for icons) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
  <link rel="icon" href="../assets/favicon/favicon.png" />
</head>

<body>

  <header>
    <nav class="header-main">
      <div class="logo-container">
        <a href="index.html"><strong>Admin Panel</strong></a>
      </div>

      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Account
        </button>
        <ul class="dropdown-menu">
          <li><button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#changePasswordForm">Change
          Password</button></li>
          <li><button class="dropdown-item log-out-btn">Logout</button></li>
        </ul>
      </div>
    </nav>

    <!-- Mobile Bottom Nav -->
    <nav class="mobile-bottom-navigation">
      <button class="action-btn"><ion-icon name="menu-outline"></ion-icon></button>
      <button class="action-btn">
        <ion-icon name="cart-outline"></ion-icon>
        <span class="badge" id="cart-badge">0</span>
      </button>
      <button class="action-btn" onclick="window.location.href='index.html'">
        <ion-icon name="home-outline"></ion-icon>
      </button>
      <button class="action-btn">
        <ion-icon name="heart-outline"></ion-icon>
        <span class="badge" id="wish-badge">0</span>
      </button>
      <button class="action-btn">
        <ion-icon name="person-outline"></ion-icon>
      </button>
    </nav>
  </header>

  <main class="spacing">
    <div class="modal fade" id="changePasswordForm" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-title fs-5">Change Password</div>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form action="">
              <div class="mb-3">
                <label for="cur-pwd">Current Password</label>
                <input type="password" id="cur-pwd" name="cur-pwd" placeholder="Your old password">
              </div>

              <div class="mb-3">
                <label for="new-pwd">New Password</label>
                <input type="password" id="new-pwd" name="new-pwd" placeholder="Your new password">
              </div>
              <button type="cancel" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-success float-end">Change</button>
            </form>

          </div>
        </div>
      </div>
    </div>

    <!-- BOOTSTRAP DASHBOARD CARDS (ADDED BEFORE ACTIONS) -->
    <div class="container-fluid mb-4">
      <div class="row">

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col">
                  <div class="text-xs fw-bold text-primary text-uppercase mb-1">
                    Total Users
                  </div>
                  <div class="h5 mb-0 fw-bold text-dark"><h5 id="usersCount"><strong></strong></h5></div>
                </div>
                <div class="col-auto">
                  <!-- <i class="fas fa-calendar fa-2x text-muted"></i> -->
                  <ion-icon class="fa-2x text-muted" name="people-outline"></ion-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col">
                  <div class="text-xs fw-bold text-success text-uppercase mb-1">
                    Total Sellers
                  </div>
                  <div class="h5 mb-0 fw-bold text-dark"><h5 id="sellersCount"><strong></strong></h5></div>
                </div>
                <div class="col-auto">
                  <!-- <i class="fas fa-dollar-sign fa-2x text-muted"></i> -->
                  <ion-icon class="fa-2x text-muted" name="storefront-outline"></ion-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col">
                  <div class="text-xs fw-bold text-success text-uppercase mb-1">
                    Total Products
                  </div>
                  <div class="h5 mb-0 fw-bold text-dark"><h5 id="productsCount"><strong></strong></h5></div>
                </div>
                <div class="col-auto">
                  <ion-icon class="fa-2x text-muted" name="albums-outline"></ion-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col">
                  <div class="text-xs fw-bold text-warning text-uppercase mb-1">
                    Pending Requests
                  </div>
                  <div class="h5 mb-0 fw-bold text-dark"><h5 id="pendingRequests"><strong></strong></h5></div>
                </div>
                <div class="col-auto">
                <ion-icon class="fa-2x text-muted" name="hourglass-outline"></ion-icon>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ACTION BAR -->
    <!-- <div class="action-bar">
    <button class="action-btn" id="seller-btn">Seller Control</button>
    <ul class="show-actions" id="seller-menu">
      <li><button>Approve / Reject</button></li>
      <li><button>View Details</button></li>
      <li><button>Remove</button></li>
    </ul>

    <button class="action-btn" id="product-btn">Product Control</button>
    <ul class="show-actions" id="product-menu">
      <li><button>Approve / Reject Product</button></li>
      <li><button>View Product Details</button></li>
      <li><button>Remove Product</button></li>
    </ul>

    <button class="action-btn" id="ftch-users">User Control</button>
  </div> -->
    <div class="action-bar d-flex align-items-center gap-2 flex-wrap">

      <!-- Seller Control Dropdown -->
      <div class="dropdown">
        <button class="btn btn-primary dropdown-toggle" type="button" id="sellerDropdown" data-bs-toggle="dropdown"
          aria-expanded="false">
          Seller Control
        </button>
        <ul id="sellerDropdownMenu" class="dropdown-menu" aria-labelledby="sellerDropdown">
          <li><button class="dropdown-item">Applications</button></li>
          <li><button class="dropdown-item">Details</button></li>
          <li><button class="dropdown-item">Manage</button></li>
        </ul>
      </div>

      <!-- Product Control Dropdown -->
      <div class="dropdown">
        <button class="btn btn-success dropdown-toggle" type="button" id="productDropdown" data-bs-toggle="dropdown"
          aria-expanded="false">
          Product Control
        </button>
        <ul id="productDropdownMenu" class="dropdown-menu" aria-labelledby="productDropdown">
          <li><button class="dropdown-item">Applications</button></li>
          <li><button class="dropdown-item">View Product Details</button></li>
          <li><button class="dropdown-item">Remove Product</button></li>
        </ul>
      </div>

      <!-- User Control -->
      <button class="btn btn-warning" id="ftch-users">
        User Control
      </button>

      <form class="d-flex ms-auto" role="search">
        <input class="form-control me-2" type="search" placeholder="Search users / sellers / products"
          aria-label="Search" id="admin-search" />
        <button class="btn btn-outline-secondary" type="submit">
          Search
        </button>
      </form>

    </div>


    <!-- CONTENT -->
    <div class="content-box">
      <div class="userData">
        <table id="userInfo-table"></table>
      </div>
    </div>

  </main>
   <script>
  document.addEventListener("DOMContentLoaded", () => {
  const guestAccount = document.querySelector('.guest-account');
  const userAccount = document.querySelector('.user-account');

    fetch("../backend/auth/checkSession.php")
        .then(res => res.json())
        .then(data => {
            if (data.loggedIn) {
               
            } else {
               
            }
        })
        .catch(err => console.error("Failed to check session:", err));
});
  </script>

  <!-- Scripts -->
  <script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="../assets/js/adminScript.js"></script>
  <script src="../assets/js/viewUsers.js"></script>

</body>

</html>