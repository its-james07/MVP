document.addEventListener('DOMContentLoaded', () => {
    const productControlBtn = document.getElementById('ftch-product-apps');
    if (productControlBtn) {
        productControlBtn.addEventListener('click', loadProducts);
    }

    // ─── Inject Modal into DOM ────────────────────────────────
    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="productDetailModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content" style="border-radius: 12px; overflow: hidden;">
                    <div class="modal-header" style="background-color: #1a1a2e; color: #fff;">
                        <h5 class="modal-title"><i class="fas fa-box me-2"></i><span id="modal-product-name"></span></h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" style="background-color: #f9f9f9;">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <p><strong>Seller:</strong> <span id="modal-seller-name"></span></p>
                                <p><strong>Email:</strong> <span id="modal-seller-email"></span></p>
                                <p><strong>Category:</strong> <span id="modal-category"></span></p>
                                <p><strong>Price:</strong> <span id="modal-price"></span></p>
                                <p><strong>Status:</strong> <span id="modal-status"></span></p>
                                <p><strong>Submitted:</strong> <span id="modal-created-at"></span></p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Description:</strong></p>
                                <p id="modal-description" class="text-muted" style="white-space: pre-wrap;"></p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer" style="background-color: #f0f0f0;">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `);
});

// ─── Fetch & Render ───────────────────────────────────────────
async function loadProducts() {
    const container = document.getElementById('s-container');
    container.innerHTML = `<p class="text-muted">Loading products...</p>`;

    try {
        const response = await fetch('../../backend/users/admin/products-control.php', {
            cache: 'no-store'
        });

        if (!response.ok) throw new Error(`Network error: ${response.status}`);

        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to fetch products');

        renderProducts(result.data);

    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="alert alert-danger">Failed to load products: ${err.message}</div>`;
    }
}

function renderProducts(products) {
    const container = document.getElementById('s-container');
    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = `<div class="alert alert-info">No pending products found.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="card shadow-sm" style="border: none; border-radius: 12px; overflow: hidden;">
            <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #2c6e49;">
                <h5 class="mb-0 text-white"><i class="fas fa-box me-2"></i>Pending Product Approvals</h5>
                <span class="badge" style="background-color: #ffc107; color: #333;" id="product-count-badge">${products.length} Pending</span>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover table-bordered align-middle mb-0" id="products-table">
                        <thead style="background-color: #1a1a2e; color: #fff;">
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Seller</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Submitted</th>
                                <th>Status</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="products-tbody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    const tbody = document.getElementById('products-tbody');

    products.forEach((product, index) => {
        const tr = document.createElement('tr');
        tr.id = `product-row-${product.product_id}`;
        tr.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f0f7f3';

        const statusBadge = getProductStatusBadge(product.status);
        const actionButtons = getProductActionButtons(product.product_id, product.name, product.status);

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <strong>${product.name}</strong><br>
                <small class="text-muted">${product.description ? product.description.substring(0, 50) + '...' : ''}</small>
            </td>
            <td>
                ${product.seller_name ?? 'N/A'}<br>
                <small class="text-muted">${product.seller_email ?? ''}</small>
            </td>
            <td>$${parseFloat(product.price).toFixed(2)}</td>
            <td><span class="badge" style="background-color: #1a1a2e; color: #fff;">${product.category ?? 'N/A'}</span></td>
            <td>${new Date(product.created_at).toLocaleDateString()}</td>
            <td id="status-badge-${product.product_id}">${statusBadge}</td>
            <td class="text-center" id="actions-${product.product_id}">${actionButtons}</td>
        `;

        // Store full product data on the row for the modal
        tr.dataset.product = JSON.stringify(product);

        tbody.appendChild(tr);
    });
}

// ─── Show Product Detail Modal ────────────────────────────────
function showProductDetail(productId) {
    const row = document.getElementById(`product-row-${productId}`);
    const product = JSON.parse(row.dataset.product);

    document.getElementById('modal-product-name').textContent   = product.name;
    document.getElementById('modal-seller-name').textContent    = product.seller_name  ?? 'N/A';
    document.getElementById('modal-seller-email').textContent   = product.seller_email ?? 'N/A';
    document.getElementById('modal-category').textContent       = product.category     ?? 'N/A';
    document.getElementById('modal-price').textContent          = `$${parseFloat(product.price).toFixed(2)}`;
    document.getElementById('modal-status').innerHTML           = getProductStatusBadge(product.status);
    document.getElementById('modal-created-at').textContent     = new Date(product.created_at).toLocaleDateString();
    document.getElementById('modal-description').textContent    = product.description  ?? 'No description provided.';

    const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
    modal.show();
}

// ─── Badge Helper ─────────────────────────────────────────────
function getProductStatusBadge(status) {
    const styles = {
        pending:  'background-color: #ffc107; color: #333;',
        approved: 'background-color: #4c956c; color: #fff;',
        rejected: 'background-color: #c0392b; color: #fff;'
    };
    const style = styles[status] ?? 'background-color: #aaa; color: #fff;';
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="badge" style="${style}">${label}</span>`;
}

// ─── Action Buttons Helper ────────────────────────────────────
function getProductActionButtons(productId, productName, status) {
    const detailBtn = `<button class="btn btn-sm me-1"
            style="background-color: #1a1a2e; color: #fff; border: none;"
            onmouseover="this.style.backgroundColor='#3a3a5e'"
            onmouseout="this.style.backgroundColor='#1a1a2e'"
            onclick="showProductDetail(${productId})">
            <i class="fas fa-eye me-1"></i>Details
       </button>`;

    const approveBtn = status === 'pending' || status === 'rejected'
        ? `<button class="btn btn-sm me-1"
                style="background-color: #4c956c; color: #fff; border: none;"
                onmouseover="this.style.backgroundColor='#2c6e49'"
                onmouseout="this.style.backgroundColor='#4c956c'"
                onclick="handleProductAction(${productId}, '${productName}', 'approve')">
                <i class="fas fa-check me-1"></i>Approve
           </button>`
        : '';

    const rejectBtn = status === 'pending' || status === 'approved'
        ? `<button class="btn btn-sm me-1"
                style="background-color: #ffc107; color: #333; border: none;"
                onmouseover="this.style.backgroundColor='#e0a800'"
                onmouseout="this.style.backgroundColor='#ffc107'"
                onclick="handleProductAction(${productId}, '${productName}', 'reject')">
                <i class="fas fa-times me-1"></i>Reject
           </button>`
        : '';

    const deleteBtn = `<button class="btn btn-sm"
            style="background-color: #fff; color: #c0392b; border: 1.5px solid #c0392b;"
            onmouseover="this.style.backgroundColor='#c0392b'; this.style.color='#fff'"
            onmouseout="this.style.backgroundColor='#fff'; this.style.color='#c0392b'"
            onclick="handleProductAction(${productId}, '${productName}', 'delete')">
            <i class="fas fa-trash me-1"></i>Delete
       </button>`;

    return detailBtn + approveBtn + rejectBtn + deleteBtn;
}

// ─── Handle Action ────────────────────────────────────────────
async function handleProductAction(productId, productName, action) {
    const confirmMessages = {
        approve: `Approve "${productName}"? It will be visible to buyers.`,
        reject:  `Reject "${productName}"? The seller will be notified.`,
        delete:  `Permanently delete "${productName}"? This cannot be undone.`
    };

    if (!confirm(confirmMessages[action])) return;

    const row = document.getElementById(`product-row-${productId}`);
    const buttons = row.querySelectorAll('button');
    buttons.forEach(b => b.disabled = true);

    try {
        const response = await fetch('../../backend/users/admin/products-control.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, action })
        });

        const result = await response.json();

        if (result.success) {
            row.remove();

            const remaining = document.querySelectorAll('#products-tbody tr').length;
            const badge = document.getElementById('product-count-badge');
            if (badge) badge.textContent = `${remaining} Pending`;

        } else {
            alert(result.message || `Failed to ${action} product.`);
            buttons.forEach(b => b.disabled = false);
        }

    } catch (err) {
        console.error(err);
        alert('Error performing action. Check console for details.');
        buttons.forEach(b => b.disabled = false);
    }
}