<?php
require("../components/navbar.php");
require("../components/cartmodal.php");
require("../components/loginmodal.php");
require("../components/accountmodal.php");
require("../components/wishmodal.php");
?>
<?php
$featuredItems = [
  [
    "id" => 1,
    "name" => "Monge Adult Food",
    "price" => 2200,
    "category" => "Dog Food",
    "description" => "High-quality adult dog food made with balanced nutrients for healthy growth and coat.",
    "image" => "/mvp/public/assets/images/dogProducts/dog-chain.png"
  ],
  [
    "id" => 2,
    "name" => "Monge Puppy Dog",
    "price" => 3200,
    "category" => "Dog Food",
    "description" => "Nutritious puppy food to support development and energy levels during early growth stages.",
    "image" => "/mvp/public/assets/images/dogProducts/collar.png"
  ],
  [
    "id" => 3,
    "name" => "Drools Balls",
    "price" => 2200,
    "category" => "Toys",
    "description" => "Durable chew balls to keep your dog active and entertained while promoting dental health.",
    "image" => "/mvp/public/assets/images/dogProducts/play-balls.png"
  ],
  [
    "id" => 4,
    "name" => "Fur Scrubber",
    "price" => 1200,
    "category" => "Grooming",
    "description" => "Soft fur scrubber for easy grooming and removal of loose hair and dirt from your dog’s coat.",
    "image" => "/mvp/public/assets/images/dogProducts/cleaner.png"
  ],
  [
    "id" => 5,
    "name" => "Dog Leash",
    "price" => 900,
    "category" => "Accessories",
    "description" => "Sturdy and comfortable leash for daily walks, made with durable material for safety.",
    "image" => "/mvp/public/assets/images/dogProducts/dog-leash.png"
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
    // echo "Product Found: " . $item['name'] . " - Price: " .  $item['price'];
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
  <title><?= htmlspecialchars($product['name']) ?></title>
  <link rel="icon" type="image/x-icon" href="/assets/favicon/favicon.png" />

  <link rel="stylesheet" href="../assets/css/navbar.css">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <link rel="stylesheet" href="../assets/css/mediaqueries.css">
  <link rel="stylesheet" href="../assets/css/cartModal.css">
  <link rel="stylesheet" href="../assets/css/accountModal.css" />
  <link rel="stylesheet" href="../assets/css/wishModal.css" />
  <link rel="stylesheet" href="../assets/css/productDetails.css" />
  <link rel="stylesheet" href="../assets/css/overlay-effect.css" />
  <link rel="stylesheet" href="../assets/css/toast.css" />



  <!-- <script src="http://localhost:35729/livereload.js"></script> -->
  <link rel="icon" href="assets/favicon/favicon.png">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-pV4mrjbl1aJb8yHHnZ2MLycXvPiDkhJ4b0xQdF5Tc9zHZo0r3UOy2rJwAi5uT8lDdIkY1+jEfrFcv0q4fZ0Yw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
   <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
  
</head>

<body style="background-color: #fafafa;">

  <!-- Product Section -->
  <!-- <section class="py-5" style="background: #fafafa;">
    <div class="container px-4 px-lg-5 my-2">
      <div class="row gx-4 gx-lg-5 align-items-center">
        <div class="col-md-6">
          <img class="card-image mb-5 mb-md-0 shadow rounded-0" src=""/>
        </div>
        <div class="col-md-6">
          <div class="small mb-1"><strong>Type: </strong><span class="catgory"></span></div>
          <h1 class="display-5 fw-bolder"></h1>
          <div class="fs-5 mb-5">
            <span class="text-success">Price: </span>
          </div>
          <p class="lead"></p>
          <div class="d-flex">
            <div class="d-flex">
              <label for="quantity" class="fs-5">Status&nbsp;</label>
              <input type="number" class="form-control text-center" id="inputQuantity" value="1" min="1" 
                     style="width: 50px; height: 45px; padding: 0; font-size: 12px;">
            </div>
          </div>
          <div class="d-flex mt-3">
            <button class="btn btn-outline-success flex-shrink-0 mx-2" id="add-to-cart" type="button">
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
  </section> -->

  <!-- Footer -->
  <!-- <footer class="py-2 bg-success-subtle">
    <div class="container">
      <p class="m-0 text-center text-black">Copyright &copy; @Pupkit 2025</p>
    </div>
  </footer> -->

  <section class="product-showcase">
    <div class="main-container">
      <div class="product-grid">
        <div class="image-column">
          <img class="product-image" src="<?= ($product['image']) ?>" alt="<?= htmlspecialchars($product['name']) ?>"
            alt="img">
        </div>
        <div class="details-column">
          <div class="category-info">
            <b>Category:</b> <span><?= htmlspecialchars($product['category']) ?></span>
          </div>
          <h1 class="product-title"><?= htmlspecialchars($product['name']) ?></h1>
          <div class="product-price">Price: <?= number_format($product['price'], 2) ?></div>
          <p class="product-description">Description:
            <?= htmlspecialchars($product['description']) ?>
          </p>
          <div class="quantity-section">
            <label for="productQuantity" class="quantity-label">Quantity&nbsp;</label>
            <input type="number" class="quantity-input" id="productQuantity" value="1" min="1">
          </div>
          <div class="action-buttons">
            <button class="btn btn-add-to-cart">
              Add to Cart
              <!-- onclick="addToCart(<?= $product['id']?>) -->
            </button>
            <button class="btn btn-wishlist">
              Wish
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <div class="modal-overlay"></div>
<div class="toast" id="toast"></div>

  <footer class="site-footer">
    <div class="main-container">
      <p class="footer-content">Copyright &copy; @Pupkit 2025</p>
    </div>
    <!-- <div class="social-links">
      <a href="#main" style="color: blue">Facebook</a>
      <a href="#main" style="color: gray">Tiktok</a>
      <a href="#main" style="color: red">Youtube</a>
    </div> -->
  </footer>
  <script src="../assets/js/main.js"></script>
  <script src="../assets/js/modal.js"></script>
  <script src="../assets/js/signin.js"></script>
  <script src="../assets/js/signout.js"></script>
  <script src="../assets/js/viewProduct.js"></script>
  <script src="../assets/js/cartModal.js"></script>
  <script src="../assets/js/toast.js"></script>
</body>

</html>