<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Shopping Cart</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

<style>
body {
  font-family: 'Inter', sans-serif;
  background:#fff;
  color:#111827;
}

/* ===== CART LAYOUT ===== */
.cart-wrapper {
  max-width:1200px;
  margin:60px auto;
}

.cart-top {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:24px;
}

.cart-table-header,
.cart-row {
  display:grid;
  grid-template-columns: 3.2fr 1.3fr 1fr 1fr;
  align-items:center;
}

.cart-table-header {
  font-size:12px;
  color:#9ca3af;
  border-bottom:1px solid #e5e7eb;
  padding-bottom:12px;
}

.cart-row {
  padding:20px 0;
  border-bottom:1px solid #e5e7eb;
}

/* ===== PRODUCT ===== */
.product {
  display:flex;
  gap:16px;
}

.product img {
  width:72px;
}

.product-title {
  font-weight:500;
}

.platform {
  font-size:12px;
  color:#ef4444;
}

.remove {
  font-size:12px;
  color:#9ca3af;
  cursor:pointer;
}

/* ===== QTY ===== */
.qty {
  display:flex;
  align-items:center;
  gap:8px;
}

.qty button {
  width:26px;
  height:26px;
  border:1px solid #d1d5db;
  background:#fff;
  font-size:14px;
}

/* ===== SUMMARY ===== */
.summary {
  background:#f9fafb;
  padding:24px;
}

.summary h6 {
  font-weight:600;
  margin-bottom:16px;
}

.summary .line {
  display:flex;
  justify-content:space-between;
  font-size:14px;
  margin-bottom:16px;
}

.summary select,
.summary input {
  width:100%;
  padding:8px;
  border:1px solid #d1d5db;
  margin-bottom:12px;
  font-size:14px;
}

.apply {
  background:#f87171;
  color:#fff;
  border:none;
  width:100%;
  padding:8px;
  margin-bottom:20px;
}

.checkout {
  background:#5b5ce2;
  color:#fff;
  border:none;
  width:100%;
  padding:12px;
  font-weight:500;
}

/* ===== CONTINUE ===== */
.continue {
  display:inline-block;
  margin-top:24px;
  font-size:14px;
  color:#5b5ce2;
  text-decoration:none;
}
@media (max-width: 768px) {

  .cart-wrapper {
    margin: 32px auto;
  }

  .cart-table-header {
    display: none;
  }

  .cart-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .product {
    align-items: center;
  }

  .qty {
    justify-content: flex-start;
  }

  .cart-row > div:nth-child(3),
  .cart-row > div:nth-child(4) {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .cart-row > div:nth-child(3)::before {
    content: "Price";
    color: #9ca3af;
  }

  .cart-row > div:nth-child(4)::before {
    content: "Total";
    color: #9ca3af;
  }

  .continue {
    margin-bottom: 24px;
  }

  .summary {
    margin-top: 32px;
  }
}

</style>
</head>

<body>

<div class="cart-wrapper">
  <div class="row">

    <!-- LEFT -->
    <div class="col-lg-8">
      <div class="cart-top">
        <h5>Shopping Cart</h5>
        <span class="text-muted">3 Items</span>
      </div>

      <div class="cart-table-header">
        <div>Product Details</div>
        <div>Quantity</div>
        <div>Price</div>
        <div>Total</div>
      </div>

      <!-- ITEM -->
      <div class="cart-row" data-price="44">
        <div class="product">
          <img src="https://via.placeholder.com/72">
          <div>
            <div class="product-title">Fifa 19</div>
            <div class="platform">PS4</div>
            <div class="remove">Remove</div>
          </div>
        </div>

        <div class="qty">
          <button class="minus">−</button>
          <span class="count">2</span>
          <button class="plus">+</button>
        </div>

        <div>£44.00</div>
        <div class="item-total">£88.00</div>
      </div>

      <!-- ITEM -->
      <div class="cart-row" data-price="249.99">
        <div class="product">
          <img src="https://via.placeholder.com/72">
          <div>
            <div class="product-title">Glacier White 500GB</div>
            <div class="platform">PS4</div>
            <div class="remove">Remove</div>
          </div>
        </div>

        <div class="qty">
          <button class="minus">−</button>
          <span class="count">1</span>
          <button class="plus">+</button>
        </div>

        <div>£249.99</div>
        <div class="item-total">£249.99</div>
      </div>

      <a href="shop.html" class="continue">← Continue Shopping</a>
    </div>

    <!-- RIGHT -->
    <div class="col-lg-4">
      <div class="summary">
        <h6>Order Summary</h6>

        <div class="line">
          <span>Items 3</span>
          <span id="subtotal">£457.98</span>
        </div>

        <label class="small text-muted">Shipping</label>
        <select>
          <option>Standard Delivery - £5.00</option>
        </select>

        <label class="small text-muted">Promo Code</label>
        <input placeholder="Enter your code">
        <button class="apply">APPLY</button>

        <div class="line fw-semibold">
          <span>Total Cost</span>
          <span id="grandTotal">£462.98</span>
        </div>

        <button class="checkout">CHECKOUT</button>
      </div>
    </div>

  </div>
</div>

<script>
function updateTotals() {
  let subtotal = 0;
  document.querySelectorAll('.cart-row').forEach(row => {
    const price = +row.dataset.price;
    const qty = +row.querySelector('.count').innerText;
    const total = price * qty;
    row.querySelector('.item-total').innerText = `£${total.toFixed(2)}`;
    subtotal += total;
  });
  document.getElementById('subtotal').innerText = `£${subtotal.toFixed(2)}`;
  document.getElementById('grandTotal').innerText = `£${(subtotal + 5).toFixed(2)}`;
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('plus')) {
    const c = e.target.previousElementSibling;
    c.innerText = +c.innerText + 1;
  }
  if (e.target.classList.contains('minus')) {
    const c = e.target.nextElementSibling;
    if (+c.innerText > 1) c.innerText--;
  }
  updateTotals();
});

updateTotals();
</script>

</body>
</html>
