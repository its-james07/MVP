<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>pupkit — Pet Products Catalog</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/product-catalog.css">
</head>
<body>
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
          <label for="sort-select">Sort by:</label>
          <div class="custom-select-wrap">
            <select id="sort-select">
              <option value="relevance">Relevance</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="popular">Popularity</option>
            </select>
            <span class="select-arrow">▾</span>
          </div>
          <span class="product-count" id="productCount">72 products</span>
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
        <label class="checkbox-label"><input type="checkbox" value="dogs" checked> <span>Dogs</span></label>
        <label class="checkbox-label"><input type="checkbox" value="cats"> <span>Cats</span></label>
        <label class="checkbox-label"><input type="checkbox" value="birds"> <span>Birds</span></label>
        <label class="checkbox-label"><input type="checkbox" value="fish"> <span>Fish</span></label>
        <label class="checkbox-label"><input type="checkbox" value="small-pets"> <span>Small Pets</span></label>
      </div>
    </div>

    <div class="filter-group" data-group="category">
      <button class="filter-group-header" aria-expanded="true">
        <span>Product Category</span>
        <span class="chevron">▾</span>
      </button>
      <div class="filter-group-body">
        <label class="checkbox-label"><input type="checkbox" value="food"> <span>Food</span></label>
        <label class="checkbox-label"><input type="checkbox" value="toys"> <span>Toys</span></label>
        <label class="checkbox-label"><input type="checkbox" value="beds"> <span>Beds</span></label>
        <label class="checkbox-label"><input type="checkbox" value="grooming"> <span>Grooming</span></label>
        <label class="checkbox-label"><input type="checkbox" value="accessories"> <span>Accessories</span></label>
        <label class="checkbox-label"><input type="checkbox" value="health"> <span>Health Care</span></label>
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

      <article class="product-card" data-pet="dogs" data-category="food">
        <div class="card-img-wrap">
          <img src="https://placedog.net/400/320?id=1" alt="Premium Dog Food" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-name">Premium Dog Food</h3>
          <p class="card-desc">High-protein kibble for active adult dogs</p>
          <div class="card-footer">
            <span class="card-price">Rs 1,299</span>
          </div>
          <a href="#" class="view-product-btn">View Product</a>
        </div>
      </article>

      <article class="product-card" data-pet="cats" data-category="toys">
        <div class="card-img-wrap">
          <img src="https://placekitten.com/400/320" alt="Interactive Cat Toy" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-name">Interactive Cat Toy</h3>
          <p class="card-desc">Auto-rotating feather wand with LED light</p>
          <div class="card-footer">
            <span class="card-price">Rs 849</span>
          </div>
          <a href="#" class="view-product-btn">View Product</a>
        </div>
      </article>

      <article class="product-card" data-pet="dogs" data-category="beds">
        <div class="card-img-wrap">
          <img src="https://placedog.net/400/320?id=3" alt="Orthopedic Pet Bed" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-name">Orthopedic Pet Bed</h3>
          <p class="card-desc">Memory foam support for joint relief</p>
          <div class="card-footer">
            <span class="card-price">Rs 2,199</span>
          </div>
          <a href="#" class="view-product-btn">View Product</a>
        </div>
      </article>

      <article class="product-card" data-pet="birds" data-category="accessories">
        <div class="card-img-wrap">
          <img src="https://picsum.photos/seed/birdcage/400/320" alt="Bird Cage Deluxe" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-name">Bird Cage Deluxe</h3>
          <p class="card-desc">Spacious wrought-iron cage with perches</p>
          <div class="card-footer">
            <span class="card-price">Rs 3,499</span>
          </div>
          <a href="#" class="view-product-btn">View Product</a>
        </div>
      </article>

      <article class="product-card" data-pet="fish" data-category="accessories">
        <div class="card-img-wrap">
          <img src="https://picsum.photos/seed/aquarium/400/320" alt="Aquarium Starter Kit" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-name">Aquarium Starter Kit</h3>
          <p class="card-desc">20L tank with filter, heater & LED light</p>
          <div class="card-footer">
            <span class="card-price">Rs 4,299</span>
          </div>
          <a href="#" class="view-product-btn">View Product</a>
        </div>
      </article>

      <article class="product-card" data-pet="dogs" data-category="toys">
        <div class="card-img-wrap">
          <img src="https://placedog.net/400/320?id=6" alt="Dog Chew Toy" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-name">Dog Chew Toy</h3>
          <p class="card-desc">Durable natural rubber, great for teeth</p>
          <div class="card-footer">
            <span class="card-price">Rs 399</span>
          </div>
          <a href="#" class="view-product-btn">View Product</a>
        </div>
      </article>

      <article class="product-card" data-pet="cats" data-category="accessories">
        <div class="card-img-wrap">
          <img src="https://placekitten.com/401/320" alt="Cat Scratching Post" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-name">Cat Scratching Post</h3>
          <p class="card-desc">Sisal rope wrapped, stable base design</p>
          <div class="card-footer">
            <span class="card-price">Rs 699</span>
          </div>
          <a href="#" class="view-product-btn">View Product</a>
        </div>
      </article>

      <article class="product-card" data-pet="dogs" data-category="grooming">
        <div class="card-img-wrap">
          <img src="https://placedog.net/400/320?id=8" alt="Pet Grooming Brush" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-name">Pet Grooming Brush</h3>
          <p class="card-desc">Self-cleaning slicker brush for all coats</p>
          <div class="card-footer">
            <span class="card-price">Rs 549</span>
          </div>
          <a href="#" class="view-product-btn">View Product</a>
        </div>
      </article>

      <article class="product-card" data-pet="dogs" data-category="accessories">
        <div class="card-img-wrap">
          <img src="https://placedog.net/400/320?id=9" alt="Adjustable Dog Harness" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-name">Adjustable Dog Harness</h3>
          <p class="card-desc">No-pull design with reflective strips</p>
          <div class="card-footer">
            <span class="card-price">Rs 999</span>
          </div>
          <a href="#" class="view-product-btn">View Product</a>
        </div>
      </article>

    </div>

    <nav class="pagination" aria-label="Product pages">
      <button class="page-btn" data-page="prev" aria-label="Previous page" disabled>‹</button>
      <button class="page-btn active" data-page="1">1</button>
      <button class="page-btn" data-page="2">2</button>
      <button class="page-btn" data-page="3">3</button>
      <span class="page-ellipsis">…</span>
      <button class="page-btn" data-page="8">8</button>
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
<script src="../assets/js/product-catalog.js"></script>
</body>
</html>