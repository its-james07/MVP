<?php
$featuredItems = [
  ["id" => 1, "name" => "Monge Adult Food", "price" => 2200, "category" => "Dog Food",      "description" => "High-quality adult dog food made with balanced nutrients for healthy growth and coat.",
        "image" => "../assets/images/dogProducts/dog-chain.png"
    ],
    [
        "id" => 2,
        "name" => "Monge Puppy Dog",
        "price" => 3200,
        "category" => "Dog Food",
        "description" => "Nutritious puppy food to support development and energy levels during early growth stages.",
        "image" => "../assets/images/dogProducts/collar.png"
    ],
    [
        "id" => 3,
        "name" => "Drools Balls",
        "price" => 2200,
        "category" => "Toys",
        "description" => "Durable chew balls to keep your dog active and entertained while promoting dental health.",
        "image" => "assets/images/dogProducts/play-balls.png"
    ],
    [
        "id" => 4,
        "name" => "Fur Scrubber",
        "price" => 1200,
        "category" => "Grooming",
        "description" => "Soft fur scrubber for easy grooming and removal of loose hair and dirt from your dog’s coat.",
        "image" => "assets/images/dogProducts/cleaner.png"
    ],
    [
        "id" => 5,
        "name" => "Dog Leash",
        "price" => 900,
        "category" => "Accessories",
        "description" => "Sturdy and comfortable leash for daily walks, made with durable material for safety.",
        "image" => "assets/images/dogProducts/dog-leash.png"
    ]
];

$searchid = $_GET['id'] ?? null;

if (!$searchid) {
    echo "No product id provided";
    exit;
}

$found = false;

foreach ($featuredItems as $item) {
    if ($item['id'] == $searchid) { // use == for type coercion
        echo "Product Found: " . $item['name'] . " - Price: " . $item['price'];
        $found = true;
        $product = $item;
        break; 
    }
}

if (!$found) {
    echo "Product not found";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta name="description" content="" />
  <meta name="author" content="" />
  <title><?= htmlspecialchars($product['name'])?></title>
  <link rel="icon" type="image/x-icon" href="/assets/favicon/favicon.png" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" />
  
  <link rel="stylesheet" href="../assets/css/navbar.css">
  <link rel="stylesheet" href="../assets/css/mediaqueries.css">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <link rel="stylesheet" href="../assets/vendor/bootstrap/css/bootstrap.min.css">

  <!-- <script src="http://localhost:35729/livereload.js"></script> -->
</head>

<body style="background-color: #fafafa;">
  <header class="navbar-container">
    <div class="header-main" style="background-color: #fafafa; height: 8rem;">
      <div class="logo-container">
        <a href="index.php" ><strong>Pupkit</strong></a>
      </div>
      <div class="search-bar">
        <input type="search" name="search" class="search-field" placeholder="Enter your product name..." />
        <button class="search-btn">
          <img src="../assets/images/search.svg" alt="search-btn" style="height: 20px; width: 30px;">
        </button>
      </div>

      <div class="top-right-icons">
        <button class="action-btn">
          
          <img src="../assets/images/heart (1).svg" alt="wishlist" class="show-wishlist ion-icon">
          <span class="badge" id="wish-badge">0</span>
        </button>
        <button  class="action-btn">  
           <img src="../assets/images/cart.svg" alt="cart" class="show-cart ion-icon">
          <span class="badge" id="cart-badge">0</span>
        </button>
        <button class="action-btn user-login">
          <img src="../assets/images/usericon.svg" alt="userIcon" class="ion-icon">
        </button>
        
      </div>
    </div>

    <!-- Mobile Bottom Nav -->
    <div class="mobile-bottom-navigation">
      <button class="action-btn"><ion-icon name="menu-outline"></ion-icon></button>
      <button class="action-btn">
        <img src="../assets/images/cart.svg" alt="cart" class="show-cart ion-icon">
        <span class="badge" id="cart-badge">0</span>
      </button>
      <button class="action-btn" onclick="window.location.href='index.html'">
        <ion-icon name="home-outline"></ion-icon>
      </button>
      <button class="action-btn">
        <img src="../assets/images/heart (1).svg" alt="wishlist" class="show-wishlist ion-icon">
        <span class="badge" id="wish-badge">0</span>
      </button>
      <button class="action-btn user-login">
        <img src="../assets/images/usericon.svg" alt="userIcon" class="ion-icon">
      </button>
    </div>
  </header>

  <!-- Product Section -->
  <section class="py-5" style="background: #fafafa;">
    <div class="container px-4 px-lg-5 my-2">
      <div class="row gx-4 gx-lg-5 align-items-center">
        <div class="col-md-6">
          <img class="card-img-top mb-5 mb-md-0 shadow rounded-0" src="<?=($product['image'])?>" alt="<?=htmlspecialchars($product['name'])?>"/>
        </div>
        <div class="col-md-6">
          <div class="small mb-1"><strong>Type: </strong><span class="catgory"><?=htmlspecialchars($product['category'])?></span></div>
          <h1 class="display-5 fw-bolder"><?=htmlspecialchars($product['name'])?></h1>
          <div class="fs-5 mb-5">
            <!-- <span class="text-decoration-line-through">$45.00</span> -->
            <span class="text-success">Price: <?=number_format($product['price'],2)?></span>
          </div>
          <p class="lead"><?=htmlspecialchars($product['description'])?></p>
          <div class="d-flex">
            <div class="d-flex">
              <label for="quantity" class="fs-5">Quantity&nbsp;</label>
              <input type="number" class="form-control text-center" id="inputQuantity" value="1" min="1" 
                     style="width: 50px; height: 45px; padding: 0; font-size: 12px;">
            </div>
          </div>
          <div class="d-flex mt-3">
            <button class="btn btn-outline-success flex-shrink-0 mx-2" type="button">
              <i class="bi-cart-fill me-1"></i>
              Add to Cart
            </button>
            <button class="btn btn-outline-secondary flex-shrink-0" type="button">
              <i class="bi-heart-fill me-1"></i>
              Wish +
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-2 bg-success-subtle">
    <div class="container">
      <p class="m-0 text-center text-black">Copyright &copy; @Pupkit 2025</p>
    </div>
  </footer>

  <!-- Bootstrap JS -->
  <script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Custom JS -->
  <script src="../assets/js/main.js"></script>
  <script src="../assets/js/modal.js"></script>
  <script src="../assets/js/signin.js"></script>
  <script src="../assets/js/signout.js"></script>
  <script src="../assets/js/renderProducts.js"></script>
  <script src="../assets/js/wishPage.js"></script>

</body>

</html>
