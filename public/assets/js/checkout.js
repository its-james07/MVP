// ─── checkout.js ─────────────────────────────────────────────────────────────
// Handles: cart loading, form validation, place order fetch, success modal
// ─────────────────────────────────────────────────────────────────────────────

const DELIVERY_FEE = 70;
let cartData       = {};
let grandTotalCalc = 0;

// ─── Validation Rules ─────────────────────────────────────────────────────────
const VALIDATORS = {
    fullName: {
        validate(val) {
            if (!val.trim()) return 'Full name is required.';
            if (val.trim().length < 2) return 'Name must be at least 2 characters.';
            if (!/^[a-zA-Z\s'.'-]+$/.test(val.trim())) return 'Name can only contain letters, spaces, or hyphens.';
            return null;
        }
    },
    phone: {
        validate(val) {
            if (!val.trim()) return 'Phone number is required.';
            if (!/^(97|98)\d{8}$/.test(val.trim())) return 'Enter a valid Nepal number (starts with 97 or 98, 10 digits total).';
            return null;
        }
    },
    city: {
        validate(val) {
            if (!val) return 'Please select your area.';
            return null;
        }
    },
    address: {
        validate(val) {
            if (!val.trim()) return 'Address is required.';
            if (val.trim().length < 10) return 'Please enter a more detailed address (at least 10 characters).';
            return null;
        }
    }
};

// ─── Real-time Validation Helpers ─────────────────────────────────────────────

/**
 * Validates a single field and updates its visual state.
 * @param {string} fieldId  - The element id
 * @returns {boolean}       - true if valid
 */
function validateField(fieldId) {
    const el      = document.getElementById(fieldId);
    const rule    = VALIDATORS[fieldId];
    if (!el || !rule) return true;

    const error = rule.validate(el.value);
    setFieldState(el, error);
    return error === null;
}

/**
 * Applies valid/invalid Bootstrap classes and shows/hides feedback text.
 */
function setFieldState(el, errorMessage) {
    // Find or create feedback element
    let feedback = el.nextElementSibling;
    // For select inside a wrapper the feedback might be after it, walk siblings
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
        feedback = el.parentElement.querySelector('.invalid-feedback');
    }

    if (errorMessage) {
        el.classList.remove('is-valid');
        el.classList.add('is-invalid');
        if (feedback) feedback.textContent = errorMessage;
    } else {
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
        if (feedback) feedback.textContent = '';
    }
}

/**
 * Clears validation state on a field (e.g., on first focus before user types).
 */
function clearFieldState(el) {
    el.classList.remove('is-valid', 'is-invalid');
}

// ─── Attach Real-time Listeners ───────────────────────────────────────────────
function attachRealtimeValidation() {
    // Text/textarea fields — validate on every keystroke AND when leaving the field
    ['fullName', 'phone', 'address'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => validateField(id));   // every keystroke
        el.addEventListener('blur',  () => validateField(id));   // on tab/click away
    });

    // Select — validate on change and blur
    const city = document.getElementById('city');
    if (city) {
        city.addEventListener('change', () => validateField('city'));
        city.addEventListener('blur',   () => validateField('city'));
    }
}

/**
 * Validates all fields at once (used on submit).
 * @returns {boolean} true if all fields are valid
 */
function validateAllFields() {
    const results = Object.keys(VALIDATORS).map(id => validateField(id));
    return results.every(Boolean);
}


// ─── DOMContentLoaded ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    fetchCart();
    attachRealtimeValidation();

    // Form submit
    document.getElementById('checkout-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const valid = validateAllFields();
        if (!valid) {
            // Scroll to the first invalid field
            const firstInvalid = this.querySelector('.is-invalid');
            if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        if (Object.keys(cartData).length === 0) {
            alert('Your cart is empty.');
            return;
        }

        placeOrder(this);
    });

    // Continue Shopping button in modal
    document.getElementById('modal-continue-btn').addEventListener('click', () => {
        window.location.href = '../../public/pages/product-catalog.php';
    });
});


// ─── 1. Fetch cart from PHP session ──────────────────────────────────────────
function fetchCart() {
    fetch('../../backend/products/cartActions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=fetch'
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP ${res.status} ${res.statusText} — cartActions.php`);
        }
        return res.text();
    })
    .then(text => {
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error(
                `cartActions.php returned invalid JSON.\n\nRaw response:\n${text.substring(0, 500)}`
            );
        }

        if (data.cart !== undefined) {
            renderCart(data);
        } else {
            showCartError(
                `Unexpected response structure from cartActions.php: ${JSON.stringify(data)}`
            );
        }
    })
    .catch(err => {
        console.error('[fetchCart] Error:', err);
        showCartError(`Failed to load cart — ${err.message}`);
    });
}

function showCartError(message) {
    const itemsDiv = document.getElementById('cart-items');
    if (itemsDiv) {
        itemsDiv.innerHTML = `
            <li class="list-group-item text-danger">
                <strong>Cart error:</strong><br>
                <small style="white-space:pre-wrap">${escapeHtml(message)}</small>
            </li>`;
    }
}


// ─── 2. Render cart summary panel ────────────────────────────────────────────
function renderCart(data) {
    const itemsDiv   = document.getElementById('cart-items');
    const totalEl    = document.getElementById('cart-total');
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const countSpan  = document.getElementById('cart-count');
    const placeBtn   = document.getElementById('place-btn');

    itemsDiv.innerHTML = '';
    let count = 0;

    const items = Object.values(data.cart || {});

    if (items.length === 0) {
        itemsDiv.innerHTML   = '<li class="list-group-item text-muted text-center">Your cart is empty.</li>';
        totalEl.innerText    = 'NPR 0';
        subtotalEl.innerText = 'NPR 0';
        shippingEl.innerText = 'NPR 0';
        countSpan.innerText  = '0';
        if (placeBtn) placeBtn.disabled = true;
        grandTotalCalc = 0;
        return;
    }

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
                <h6 class="my-0">${escapeHtml(item.name)}</h6>
                <small class="text-muted">Qty: ${item.quantity}${item.weight ? ' · ' + escapeHtml(item.weight) : ''}</small>
            </div>
            <span>NPR ${(item.price * item.quantity).toLocaleString()}</span>`;
        itemsDiv.appendChild(li);
    });

    grandTotalCalc = subtotal + shippingTotal;

    countSpan.innerText  = count;
    subtotalEl.innerText = 'NPR ' + subtotal.toLocaleString();
    shippingEl.innerText = 'NPR ' + shippingTotal.toLocaleString()
        + (sellerCount > 1 ? ' (' + sellerCount + ' sellers)' : '');
    totalEl.innerText    = 'NPR ' + grandTotalCalc.toLocaleString();

    cartData = data.cart;
}


// ─── 3. Place Order via fetch API ─────────────────────────────────────────────
function placeOrder(form) {
    const btn       = document.getElementById('place-btn');
    btn.disabled    = true;
    btn.textContent = 'Placing order...';

    const payload = JSON.stringify({
        shipping_name:    document.getElementById('fullName').value.trim(),
        shipping_phone:   document.getElementById('phone').value.trim(),
        shipping_city:    document.getElementById('city').value,
        shipping_address: document.getElementById('address').value.trim(),
        notes:            ''
    });

    fetch('../../backend/orders/place-order.php', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    payload
    })
    .then(r => {
        if (!r.ok) {
            throw new Error(`HTTP ${r.status} ${r.statusText} — place-order.php`);
        }
        return r.text();
    })
    .then(text => {
        let res;
        try {
            res = JSON.parse(text);
        } catch (e) {
            throw new Error(
                `place-order.php returned invalid JSON.\n\nRaw response:\n${text.substring(0, 500)}`
            );
        }

        if (res.success) {
            document.getElementById('modal-order-number').textContent = res.order_number;
            document.getElementById('modal-grand-total').textContent  =
                'NPR ' + parseFloat(res.grand_total).toLocaleString();
            document.getElementById('order-success-modal').style.display = 'flex';

            cartData = {};
            renderCart({ cart: {} });
            form.reset();
            // Clear all validation states after reset
            Object.keys(VALIDATORS).forEach(id => {
                const el = document.getElementById(id);
                if (el) clearFieldState(el);
            });
            btn.textContent = 'Order Placed';

        } else {
            const msg = res.message || 'Something went wrong. Please try again.';
            console.warn('[placeOrder] Server error:', res);
            alert('Order failed: ' + msg);
            btn.disabled    = false;
            btn.textContent = 'Place Order';
        }
    })
    .catch(err => {
        console.error('[placeOrder] Error:', err);
        alert('Could not place order.\n\n' + err.message);
        btn.disabled    = false;
        btn.textContent = 'Place Order';
    });
}


// ─── Utility: escape HTML to prevent XSS ─────────────────────────────────────
function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}