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
        <span class="badge bg-secondary rounded-pill" id="cart-count">3</span>
      </h4>
      <ul class="list-group mb-3" id="cart-items">
        <!-- Cart items will appear here -->
      </ul>
      <div class="d-flex justify-content-between mb-3">
        <span>Total</span>
        <strong id="cart-total">$0</strong>
      </div>
    </div>

    <!-- Billing Form -->
    <div class="col-md-8 order-md-1">
      <h4 class="mb-3">Billing Details</h4>
      <form id="checkout-form" class="needs-validation" novalidate>
        <div class="row g-3">
          <div class="col-md-6">
            <label for="firstName" class="form-label">First Name</label>
            <input type="text" class="form-control" id="firstName" placeholder="James" required>
            <div class="invalid-feedback">First name is required.</div>
          </div>
          <div class="col-md-6">
            <label for="lastName" class="form-label">Last Name</label>
            <input type="text" class="form-control" id="lastName" placeholder="Karki" required>
            <div class="invalid-feedback">Last name is required.</div>
          </div>
        </div>

        <div class="mb-3 mt-3">
          <label for="email" class="form-label">Email <span class="text-muted">(Optional)</span></label>
          <input type="email" class="form-control" id="email" placeholder="you@example.com">
        </div>

        <div class="mb-3">
          <label for="phone" class="form-label">Phone</label>
          <input type="text" class="form-control" id="phone" placeholder="1234567890" required>
          <div class="invalid-feedback">Phone is required.</div>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <textarea class="form-control" id="address" rows="3" placeholder="1234 Main St, Apt, etc." required></textarea>
          <div class="invalid-feedback">Address is required.</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Payment Method</label>
          <input type="text" class="form-control" value="Payment on Delivery" readonly style="background-color:#e3e4e4;">
        </div>

        <button class="w-100 btn btn-lg" type="submit" style="background-color: #4c956c; color: white;">Place Order</button>
      </form>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
Example cart data
let cart = [
  {name:'Headphones', price:50, qty:1},
  {name:'Mouse', price:25, qty:2},
  {name:'Keyboard', price:70, qty:1},
];

function renderCart() {
  const itemsDiv = document.getElementById('cart-items');
  const totalDiv = document.getElementById('cart-total');
  const countSpan = document.getElementById('cart-count');
  itemsDiv.innerHTML = '';
  let total = 0;
  let count = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between lh-sm';
    li.innerHTML = `<div><h6 class="my-0">${item.name}</h6></div>
                    <span>$${item.price*item.qty}</span>`;
    itemsDiv.appendChild(li);
  });
  totalDiv.innerText = '$'+total;
  countSpan.innerText = count;
}

document.getElementById('checkout-form').addEventListener('submit', function(e){
  e.preventDefault();
  if(cart.length===0){
    alert('Cart is empty');
    return;
  }
  alert('Order placed successfully!');
  cart = [];
  renderCart();
  this.reset();
});

Bootstrap form validation
(() => {
  'use strict'
  const forms = document.querySelectorAll('.needs-validation')
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add('was-validated')
    }, false)
  })
})();

renderCart();
</script>

</body>
</html>
