<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Checkout Page</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container py-5">
  <div class="text-center mb-5">
    <h2>Checkout Form</h2>
    <p class="text-muted">Please fill in your details to complete the order.</p>
  </div>

  <div class="row g-5">
    <!-- Order Summary -->
    <div class="col-md-4 order-md-2">
      <h4 class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-muted">Your cart</span>
        <span class="badge bg-secondary rounded-pill" id="cart-count">0</span>
      </h4>
      <ul class="list-group mb-3" id="cart-items">
        <li class="list-group-item text-muted text-center">Loading cart...</li>
      </ul>
      <div class="d-flex justify-content-between mb-1">
        <span class="text-muted">Subtotal</span>
        <span id="cart-subtotal">NPR 0</span>
      </div>
      <div class="d-flex justify-content-between mb-1">
        <span class="text-muted">Delivery fee</span>
        <span id="cart-shipping">NPR 0</span>
      </div>
      <hr class="my-2">
      <div class="d-flex justify-content-between mb-3">
        <span><strong>Total</strong></span>
        <strong id="cart-total">NPR 0</strong>
      </div>
    </div>

    <!-- Billing Form -->
    <div class="col-md-8 order-md-1">
      <h4 class="mb-3">Billing Details</h4>
      <form id="checkout-form" class="needs-validation" novalidate>

        <div class="mb-3">
          <label for="fullName" class="form-label">Full Name</label>
          <input type="text" class="form-control" id="fullName" name="full_name"
                 placeholder="James Karki" required>
          <div class="invalid-feedback">Full name is required.</div>
        </div>

        <div class="mb-3">
          <label for="phone" class="form-label">Phone</label>
          <input type="tel" class="form-control" id="phone" name="phone"
                 placeholder="98XXXXXXXX" required
                 pattern="^(97|98)\d{8}$">
          <div class="invalid-feedback">Enter a valid Nepal number (starts with 97 or 98).</div>
        </div>

        <div class="mb-3">
          <label for="city" class="form-label">Area</label>
          <select class="form-select" id="city" name="city" required>
            <option value="">Select your area</option>
            <optgroup label="Kathmandu">
              <option value="Thamel">Thamel</option>
              <option value="Baneshwor">Baneshwor</option>
              <option value="Koteshwor">Koteshwor</option>
              <option value="Balaju">Balaju</option>
              <option value="Budhanilkantha">Budhanilkantha</option>
              <option value="Chabahil">Chabahil</option>
              <option value="Gongabu">Gongabu</option>
              <option value="Kalanki">Kalanki</option>
              <option value="Thankot">Thankot</option>
              <option value="Maharajgunj">Maharajgunj</option>
              <option value="Lazimpat">Lazimpat</option>
              <option value="Boudha">Boudha</option>
              <option value="Jorpati">Jorpati</option>
              <option value="Pepsicola">Pepsicola</option>
              <option value="Sitapaila">Sitapaila</option>
              <option value="Kirtipur">Kirtipur</option>
            </optgroup>
            <optgroup label="Lalitpur">
              <option value="Patan">Patan</option>
              <option value="Imadol">Imadol</option>
              <option value="Ekantakuna">Ekantakuna</option>
              <option value="Jawalakhel">Jawalakhel</option>
              <option value="Kupondol">Kupondol</option>
              <option value="Pulchowk">Pulchowk</option>
            </optgroup>
            <optgroup label="Bhaktapur">
              <option value="Bhaktapur">Bhaktapur</option>
              <option value="Suryabinayak">Suryabinayak</option>
              <option value="Madhyapur Thimi">Madhyapur Thimi</option>
            </optgroup>
          </select>
          <div class="invalid-feedback">Please select your area.</div>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <textarea class="form-control" id="address" name="address"
                    rows="3" placeholder="Street, House no., Landmark..." required></textarea>
          <div class="invalid-feedback">Address is required.</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Payment Method</label>
          <input type="text" class="form-control" value="Cash on Delivery" readonly
                 style="background-color:#e3e4e4;">
        </div>

        <button class="w-100 btn btn-lg" type="submit" id="place-btn"
                style="background-color: #4c956c; color: white;">Place Order</button>
      </form>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
  const DELIVERY_FEE = 70;
  let cartData = {};

  function renderCart(data) {
    const itemsDiv   = document.getElementById('cart-items');
    const totalEl    = document.getElementById('cart-total');
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const countSpan  = document.getElementById('cart-count');

    itemsDiv.innerHTML = '';
    let count = 0;

    const items = Object.values(data.cart || {});

    if (items.length === 0) {
      itemsDiv.innerHTML = '<li class="list-group-item text-muted text-center">Your cart is empty.</li>';
      totalEl.innerText    = 'NPR 0';
      subtotalEl.innerText = 'NPR 0';
      shippingEl.innerText = 'NPR 0';
      countSpan.innerText  = '0';
      document.getElementById('place-btn').disabled = true;
      return;
    }

    // Calculate subtotal and distinct seller count for delivery fee
    let subtotal = 0;
    const sellerIds     = [...new Set(items.map(i => i.seller_id).filter(Boolean))];
    const sellerCount   = sellerIds.length || 1;
    const shippingTotal = DELIVERY_FEE * sellerCount;

    items.forEach(item => {
      count    += item.quantity;
      subtotal += item.price * item.quantity;

      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between lh-sm';
      li.innerHTML = `
        <div>
          <h6 class="my-0">${item.name}</h6>
          <small class="text-muted">Qty: ${item.quantity}${item.weight ? ' · ' + item.weight : ''}</small>
        </div>
        <span>NPR ${(item.price * item.quantity).toLocaleString()}</span>`;
      itemsDiv.appendChild(li);
    });

    const grandTotal = subtotal + shippingTotal;

    countSpan.innerText  = count;
    subtotalEl.innerText = 'NPR ' + subtotal.toLocaleString();
    shippingEl.innerText = 'NPR ' + shippingTotal.toLocaleString()
      + (sellerCount > 1 ? ' (' + sellerCount + ' sellers)' : '');
    totalEl.innerText    = 'NPR ' + grandTotal.toLocaleString();

    cartData = data.cart;
  }

  // Fetch cart from PHP session
  fetch('../../backend/products/cartActions.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=fetch'
  })
  .then(res => res.json())
  .then(data => {
    if (data.cart !== undefined) {
      renderCart(data);
    } else {
      document.getElementById('cart-items').innerHTML =
        '<li class="list-group-item text-danger text-center">Failed to load cart.</li>';
    }
  })
  .catch(err => {
    console.error('Error fetching cart:', err);
    document.getElementById('cart-items').innerHTML =
      '<li class="list-group-item text-danger text-center">Error loading cart.</li>';
  });

  // Form submit
  document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!this.checkValidity()) {
      this.classList.add('was-validated');
      return;
    }
    if (Object.keys(cartData).length === 0) {
      alert('Cart is empty.');
      return;
    }

    const btn = document.getElementById('place-btn');
    btn.disabled     = true;
    btn.textContent  = 'Placing order...';

    const payload = new URLSearchParams({
      full_name: document.getElementById('fullName').value.trim(),
      phone:     document.getElementById('phone').value.trim(),
      city:      document.getElementById('city').value,
      address:   document.getElementById('address').value.trim(),
    });

    fetch('../../backend/orders/checkout_handler.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString()
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('Order ' + res.order_number + ' placed successfully!');
        cartData = {};
        renderCart({ cart: {}, total: 0 });
        this.reset();
        this.classList.remove('was-validated');
        btn.disabled    = false;
        btn.textContent = 'Place Order';
      } else {
        alert(res.message || 'Something went wrong. Please try again.');
        btn.disabled    = false;
        btn.textContent = 'Place Order';
      }
    })
    .catch(() => {
      alert('Could not connect to server. Please try again.');
      btn.disabled    = false;
      btn.textContent = 'Place Order';
    });
  });

  (() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  })();
</script>

</body>
</html>