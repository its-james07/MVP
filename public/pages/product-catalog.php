<?php
session_start();
require_once '../../backend/auth/config/db.php';

$result = $conn->query("
    SELECT
        p.product_id,
        p.name,
        p.description,
        p.price,
        p.image,
        c.category_name,
        pt.type_name
    FROM products p
    LEFT JOIN categories    c  ON p.category_id = c.category_id
    LEFT JOIN product_types pt ON p.type_id     = pt.type_id
    WHERE p.status = 'approved'
    ORDER BY p.created_at DESC
");

$products = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>pupkit — Pet Products Catalog</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">

<link rel="stylesheet" href="../assets/css/product-catalog.css">
<link rel="stylesheet" href="../assets/css/footer.css">

<style>

body {
  opacity: 1;
  transition: opacity 0.3s ease;
}

body.page-leaving {
  opacity: 0;
  transition: opacity 0.25s ease;
}

@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.catalog-hero,
.catalog-main {
  animation: pageFadeIn 0.4s ease both;
}

.catalog-main {
  animation-delay: 0.05s;
}

.view-btn {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.view-btn.loading {
  pointer-events: none;
  opacity: 0.75;
}

.view-btn.loading::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.35) 50%, transparent 75%);
  background-size: 200% 100%;
  animation: shimmer 0.9s infinite;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}

#page-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

#page-loader.visible {
  opacity: 1;
  pointer-events: all;
}

.loader-paw {
  font-size: 2.2rem;
  animation: pawBounce 0.6s ease infinite alternate;
}

@keyframes pawBounce {
  from { transform: translateY(0) scale(1); }
  to   { transform: translateY(-10px) scale(1.1); }
}

</style>
</head>

<body>

<div id="page-loader">
<span class="loader-paw">🐾</span>
</div>

<div class="catalog-hero">
<div class="catalog-hero-inner">

<nav class="breadcrumb" aria-label="Breadcrumb">
<a href="/mvp/public/index.php">Home</a>
<span class="sep">›</span>
<a href="#">Shop</a>
<span class="sep">›</span>
<span class="current">Pet Products</span>
</nav>

<div class="catalog-title-row">

<h1 class="catalog-title">Explore Pet Products</h1>

<div class="sort-row">

<button class="filter-toggle-btn" id="filterToggleBtn" aria-label="Open filters" aria-expanded="false" aria-controls="sidebar">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/>
</svg>
Filters
</button>

<label for="sort-select">Sort by:</label>

<div class="custom-select-wrap">
<select id="sort-select">
<option value="relevance">Relevance</option>
<option value="low-high">Price: Low to High</option>
<option value="high-low">Price: High to Low</option>
</select>
<span class="select-arrow">▾</span>
</div>

<span class="product-count" id="productCount">
<?= count($products) ?> product<?= count($products) !== 1 ? 's' : '' ?>
</span>

</div>
</div>
</div>
</div>

<main class="catalog-main">

<div class="sidebar-overlay" id="sidebarOverlay"></div>

<aside class="sidebar" id="sidebar" aria-label="Product Filters">

<div class="sidebar-header">
<h2 class="sidebar-title">Filters</h2>
<button class="sidebar-close" id="sidebarClose" aria-label="Close filters">✕</button>
</div>

<div class="filter-group" data-group="pet-type">

<button class="filter-group-header" aria-expanded="true">
<span>Pet Type</span>
<span class="chevron">▾</span>
</button>

<div class="filter-group-body">
<label class="checkbox-label"><input type="checkbox" value="dog"><span>Dogs</span></label>
<label class="checkbox-label"><input type="checkbox" value="cat"><span>Cats</span></label>
<label class="checkbox-label"><input type="checkbox" value="bird"><span>Birds</span></label>
<label class="checkbox-label"><input type="checkbox" value="fish"><span>Fish</span></label>
</div>

</div>

<div class="filter-group" data-group="product-type">

<button class="filter-group-header" aria-expanded="true">
<span>Product Type</span>
<span class="chevron">▾</span>
</button>

<div class="filter-group-body">
<label class="checkbox-label"><input type="checkbox" value="food"><span>Food</span></label>
<label class="checkbox-label"><input type="checkbox" value="toys"><span>Toys</span></label>
<label class="checkbox-label"><input type="checkbox" value="grooming"><span>Grooming</span></label>
<label class="checkbox-label"><input type="checkbox" value="accessories"><span>Accessories</span></label>
<label class="checkbox-label"><input type="checkbox" value="healthcare"><span>Healthcare</span></label>
</div>

</div>

<div class="filter-group" data-group="price">

<button class="filter-group-header" aria-expanded="true">
<span>Price Range</span>
<span class="chevron">▾</span>
</button>

<div class="filter-group-body">

<div class="price-display">
<span id="priceMin">Rs 0</span>
<span>—</span>
<span id="priceMax">Rs 5000</span>
</div>

<div class="range-slider-wrap">
<input type="range" id="rangeMin" class="range-input" min="0" max="5000" value="0" step="50">
<input type="range" id="rangeMax" class="range-input" min="0" max="5000" value="5000" step="50">
</div>

</div>
</div>

<button class="apply-filters-btn">Apply Filters</button>
<button class="clear-filters-btn">Clear All</button>

</aside>

<section class="product-section">

<div class="product-grid" id="productGrid">

<?php if (empty($products)): ?>

<div class="no-products">
<p>No products available yet. Check back soon!</p>
</div>

<?php else: ?>

<?php foreach ($products as $product): ?>

<article
class="product-card"
data-pet="<?= htmlspecialchars(strtolower($product['category_name'])) ?>"
data-type="<?= htmlspecialchars(strtolower($product['type_name'])) ?>"
data-price="<?= (float)$product['price'] ?>">

<div class="card-img-wrap">

<img
src="<?= htmlspecialchars($product['image']) ?>"
alt="<?= htmlspecialchars($product['name']) ?>"
loading="lazy"
onerror="this.onerror=null;">

</div>

<div class="card-body">

<div class="card-meta">
<span class="card-category"><?= htmlspecialchars($product['category_name']) ?></span>
<span class="card-type"><?= htmlspecialchars($product['type_name']) ?></span>
</div>

<h3 class="card-name"><?= htmlspecialchars($product['name']) ?></h3>

<p class="card-desc"><?= htmlspecialchars($product['description']) ?></p>

<div class="card-footer">
<span class="card-price">Rs <?= number_format($product['price'], 2) ?></span>
</div>

<button class="view-btn" data-id="<?= (int)$product['product_id'] ?>">
View Product
</button>

</div>

</article>

<?php endforeach; ?>

<?php endif; ?>

</div>

<nav class="pagination" aria-label="Product pages">
<button class="page-btn" data-page="prev" aria-label="Previous page" disabled>‹</button>
<button class="page-btn active" data-page="1">1</button>
<button class="page-btn" data-page="next" aria-label="Next page">›</button>
</nav>

</section>

</main>

<footer class="site-footer">

<div class="footer-inner">

<div class="footer-brand">
<div class="footer-logo">pupkit</div>
<p class="footer-tagline">Everything your pet deserves.</p>

<form class="footer-subscribe" onsubmit="return false;">
<input type="email" placeholder="Your email address" aria-label="Email for newsletter">
<button type="submit">Subscribe</button>
</form>

</div>

<div class="footer-column">
<h4>Brand</h4>
<ul>
<li><a href="#">About Us</a></li>
<li><a href="#">Sustainability</a></li>
<li><a href="#">Careers</a></li>
<li><a href="#">Press</a></li>
</ul>
</div>

<div class="footer-column">
<h4>Shop</h4>
<ul>
<li><a href="#">Dogs</a></li>
<li><a href="#">Cats</a></li>
<li><a href="#">Birds</a></li>
<li><a href="#">Fish</a></li>
</ul>
</div>

<div class="footer-column">
<h4>Customer Care</h4>
<ul>
<li><a href="#">Shipping & Delivery</a></li>
<li><a href="#">Returns & Exchanges</a></li>
<li><a href="#">Size Guide</a></li>
<li><a href="#">Contact Us</a></li>
</ul>
</div>

</div>

<div class="footer-bottom">

<p>© 2026 pupkit. All rights reserved.</p>

<div class="footer-legal">
<a href="#">Privacy Policy</a>
<a href="#">Terms of Service</a>
</div>

</div>

</footer>

<div class="toast" id="toast"></div>
<div class="overlay"></div>

<script>

const ALL_PRODUCTS = <?= json_encode(array_map(fn($p) => [
'id' => (int)$p['product_id'],
'name' => $p['name'],
'desc' => $p['description'],
'price' => (float)$p['price'],
'image' => $p['image'],
'category' => strtolower($p['category_name']),
'type' => strtolower($p['type_name'])
], $products), JSON_HEX_TAG) ?>;

document.addEventListener('DOMContentLoaded', () => {

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const closeBtn = document.getElementById('sidebarClose');
const toggleBtn = document.getElementById('filterToggleBtn');
const loader = document.getElementById('page-loader');

function openSidebar() {
sidebar.classList.add('open');
overlay.classList.add('active');
document.body.style.overflow = 'hidden';
toggleBtn.setAttribute('aria-expanded', 'true');
}

function closeSidebar() {
sidebar.classList.remove('open');
overlay.classList.remove('active');
document.body.style.overflow = '';
toggleBtn.setAttribute('aria-expanded', 'false');
}

toggleBtn.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') closeSidebar();
});

window.addEventListener('resize', () => {
if (window.innerWidth > 1024) closeSidebar();
});

document.querySelectorAll('.filter-group-header').forEach(header => {
header.addEventListener('click', () => {
const group = header.closest('.filter-group');
const isCollapsed = group.classList.toggle('collapsed');
header.setAttribute('aria-expanded', String(!isCollapsed));
});
});

document.querySelectorAll('.view-btn').forEach(button => {

button.addEventListener('click', () => {

const id = button.getAttribute('data-id');

button.classList.add('loading');
button.textContent = 'Loading…';

if (loader) loader.classList.add('visible');

document.body.classList.add('page-leaving');

setTimeout(() => {
window.location.href = '/mvp/public/pages/product-details.php?id=' + id;
}, 250);

});

});

window.addEventListener('pageshow', () => {

document.body.classList.remove('page-leaving');
document.body.style.overflow = '';

if (loader) loader.classList.remove('visible');

document.querySelectorAll('.view-btn').forEach(btn => {
btn.classList.remove('loading');
btn.textContent = 'View Product';
});

});

const rangeMin = document.getElementById('rangeMin');
const rangeMax = document.getElementById('rangeMax');
const priceMin = document.getElementById('priceMin');
const priceMax = document.getElementById('priceMax');

function updatePriceDisplay() {

let min = parseInt(rangeMin.value);
let max = parseInt(rangeMax.value);

if (min > max) [min, max] = [max, min];

priceMin.textContent = 'Rs ' + min;
priceMax.textContent = 'Rs ' + max;

}

if (rangeMin && rangeMax) {

rangeMin.addEventListener('input', updatePriceDisplay);
rangeMax.addEventListener('input', updatePriceDisplay);

}

});

</script>

</body>
</html>