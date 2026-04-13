<?php
session_start();
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'seller') {
    header("Location: /mvp/public/index.php");
    exit();
}

$seller_status = $_SESSION['seller_status'] ?? '';
$isSuspended   = ($seller_status === 'suspended');
$isApproved    = ($seller_status === 'active');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seller Dashboard</title>

    <link rel="stylesheet" href="../assets/css/styles.css">
    <link rel="stylesheet" href="../assets/css/navbar.css">
    <link rel="stylesheet" href="../assets/css/mediaqueries.css">
    <link rel="stylesheet" href="../assets/css/panel.css">
    <link rel="stylesheet" href="../assets/css/seller-panel.css">
    <link rel="stylesheet" href="../assets/css/view-products.css">
    <link rel="stylesheet" href="../assets/css/seller/view-products.css">
    <link rel="stylesheet" href="../assets/css/seller/modal-product-image.css">
    <link rel="stylesheet" href="../assets/vendor/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

    <link rel="icon" href="../assets/favicon/favicon.png">
</head>

<body>

<header>
    <nav class="header-main">
        <div class="logo-container">
            <a href="index.html"><strong>Seller Dashboard</strong></a>
        </div>
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Account
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><button class="dropdown-item">Profile</button></li>
                <li><button class="dropdown-item">Update Profile</button></li>
                <li><button class="dropdown-item log-out-btn">Logout</button></li>
            </ul>
        </div>
    </nav>
</header>

<main class="spacing">
    <div class="container-fluid mb-4">
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col">
                                <div class="text-xs fw-bold text-primary text-uppercase mb-1">Total Products</div>
                                <div class="h5 mb-0 fw-bold text-dark" id="dash-total-products">—</div>
                            </div>
                            <div class="col-auto">
                                <ion-icon class="fa-2x text-muted" name="albums-outline"></ion-icon>
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
                                <div class="text-xs fw-bold text-success text-uppercase mb-1">Orders</div>
                                <div class="h5 mb-0 fw-bold text-dark" id="dash-total-orders">—</div>
                            </div>
                            <div class="col-auto">
                                <ion-icon class="fa-2x text-muted" name="cart-outline"></ion-icon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left-info shadow h-100 py-2">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col">
                                <div class="text-xs fw-bold text-info text-uppercase mb-1">Earnings</div>
                                <div class="h5 mb-0 fw-bold text-dark" id="dash-earnings">—</div>
                            </div>
                            <div class="col-auto">
                                <ion-icon class="fa-2x text-muted" name="wallet-outline"></ion-icon>
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
                                <div class="text-xs fw-bold text-warning text-uppercase mb-1">Pending Orders</div>
                                <div class="h5 mb-0 fw-bold text-dark" id="dash-pending-orders">—</div>
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

    <div class="action-bar d-flex align-items-center gap-2 flex-wrap mb-3">
        <button class="btn btn-outline-success" id="btn-view-products">View Products</button>

        <div class="dropdown">
            <button class="btn btn-outline-info dropdown-toggle" type="button" data-bs-toggle="dropdown">
                Orders
            </button>
            <ul class="dropdown-menu">
                <li><button class="dropdown-item" id="btn-all-orders">All Orders</button></li>
                <li><button class="dropdown-item" id="btn-pending-orders">Pending Orders</button></li>
                <li><button class="dropdown-item" id="btn-completed-orders">Completed Orders</button></li>
            </ul>
        </div>

        <button class="btn btn-warning ms-auto" data-bs-toggle="modal" data-bs-target="#addProductModal" <?php if (!$isApproved) echo 'disabled'; ?> title="<?php if (!$isApproved) echo 'Your account is not yet approved by admin'; ?>">
            Add Product
        </button>
    </div>

    <?php if ($seller_status === 'pending'): ?>
    <div class="alert alert-warning alert-dismissible fade show mb-3" role="alert">
        <strong>Account Approval Pending</strong><br>
        Your seller account is pending admin approval. Once approved, you will be able to add products, update orders, and access all seller features.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    <?php endif; ?>

    <div class="content-box" id="content-box"></div>
    <div id="toast" class="toast"></div>

    <?php include '../components/product-detail-modal.php'; ?>
    <?php include '../components/product-edit-modal.php'; ?>
    <?php include '../components/suspension.php'; ?>

    <div class="modal fade" id="addProductModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add New Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-4">
                    <form id="productUploadForm" enctype="multipart/form-data" novalidate>
                        <input type="hidden" name="seller_id" value="<?= htmlspecialchars($_SESSION['seller_id'] ?? '') ?>">

                        <div class="mb-3">
                            <label class="form-label">Product Name <span class="text-danger">*</span>
                                <span class="form-error" id="name-err"></span>
                            </label>
                            <input type="text" class="form-control" name="name" id="product_name"
                                   minlength="2" maxlength="255" placeholder="e.g. Premium Dog Harness" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Description
                                <span class="form-error" id="desc-err"></span>
                            </label>
                            <textarea class="form-control" name="description" id="product_description"
                                      rows="3" maxlength="1000" placeholder="Briefly describe the product..."></textarea>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Category <span class="text-danger">*</span>
                                    <span class="form-error" id="category-err"></span>
                                </label>
                                <select class="form-select" name="category" id="product_category" required>
                                    <option value="">Select Category</option>
                                    <option value="1">Dog</option>
                                    <option value="2">Cat</option>
                                    <option value="3">Fish</option>
                                    <option value="4">Bird</option>
                                    <option value="5">All</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Product Type <span class="text-danger">*</span>
                                    <span class="form-error" id="type-err"></span>
                                </label>
                                <select class="form-select" name="type_id" id="product_type" required>
                                    <option value="">Select Type</option>
                                    <option value="1">Food</option>
                                    <option value="2">Toys</option>
                                    <option value="3">Grooming</option>
                                    <option value="4">Accessories</option>
                                    <option value="5">Healthcare</option>
                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Price (Rs) <span class="text-danger">*</span>
                                    <span class="form-error" id="price-err"></span>
                                </label>
                                <input type="number" step="0.01" min="0.01" class="form-control"
                                       name="price" id="product_price" placeholder="0.00" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Weight (kg) <small class="text-muted">(optional)</small></label>
                                <input type="number" step="0.01" min="0" class="form-control"
                                       name="weight" id="product_weight" placeholder="0.00">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Stock Quantity <span class="text-danger">*</span>
                                <span class="form-error" id="stock-err"></span>
                            </label>
                            <input type="number" min="0" class="form-control"
                                   name="stock" id="product_stock" placeholder="0" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Product Image <span class="text-danger">*</span>
                                <span class="form-error" id="img-err"></span>
                            </label>
                            <input type="file" class="form-control" name="image" id="product_image"
                                   accept="image/jpeg, image/png, image/webp" required>
                            <small class="text-muted">JPG, PNG or WEBP — max 2MB</small>
                        </div>

                        <div class="modal-footer px-0 pb-0">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" class="btn btn-success">
                                <span id="submitBtnText">Save Product</span>
                                <span id="submitBtnSpinner" class="spinner-border spinner-border-sm ms-1 d-none"></span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="orderDetailModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <ion-icon name="receipt-outline" class="text-success me-2"></ion-icon>
                        Order Details
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body p-3" id="orderDetailBody"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</main>

<script src="../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="../assets/js/signout.js"></script>
<script src="../assets/js/bootstrap-alert.js"></script>
<script src="../assets/js/seller/add-product.js"></script>
<script src="../assets/js/seller/seller-script.js"></script>
<script src="../assets/js/seller/order-control.js"></script>
<script src="../assets/js/seller/view-product.js"></script>
<script src="../assets/js/seller/seller-status-monitor.js"></script>

<script>
document.addEventListener('DOMContentLoaded', () => {
const isSuspended = <?= $isSuspended ? 'true' : 'false' ?>;
if (!isSuspended) return;

const modalEl = document.getElementById('suspendedModal');
if (modalEl && !sessionStorage.getItem('suspendedModalSeen')) {
  new bootstrap.Modal(modalEl, { backdrop: 'static', keyboard: false }).show();
  sessionStorage.setItem('suspendedModalSeen', 'true');
}

const actionBar = document.querySelector('.action-bar');
if (actionBar) {
  actionBar.style.opacity = '0.4';
  actionBar.style.pointerEvents = 'none';
}

const container = document.getElementById('content-box');
if(container){
  container.style.opacity = '0.4';
  container.style.pointerEvents = 'none';
}

document.querySelectorAll('.card').forEach(card => {
  card.style.opacity = '0.4';
  card.style.pointerEvents = 'none';
});

const banner = document.createElement('div');
banner.className = 'alert alert-danger mb-0 rounded-0 text-center';
banner.innerHTML = `
    <i class="fas fa-ban me-2"></i>
    <strong>Your account is suspended.</strong> All features are disabled.
    <a href="/mvp/public/pages/contact-us.php" class="alert-link ms-2">Contact us to reactivate.</a>
  `;
document.querySelector('header').after(banner);

});
</script>

</body>
</html>