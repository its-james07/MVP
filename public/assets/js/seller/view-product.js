// ─── view-products.js ─────────────────────────────────────────────────────────
// Seller product viewer — fetch, render, delete, update stock
// Renders into: #content-box (same panel content area as orders)
// ─────────────────────────────────────────────────────────────────────────────

const PRODUCTS_API = '../../backend/products/view-products.php';

// ─────────────────────────────────────────────────────────────────────────────
// 1. INIT — wire up the Manage Products dropdown buttons
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('btn-view-products')?.addEventListener('click',   () => loadProducts());
    document.getElementById('btn-update-product')?.addEventListener('click',  () => loadProducts('update'));
    document.getElementById('btn-remove-product')?.addEventListener('click',  () => loadProducts('delete'));

    // Inject product detail modal into DOM once
    injectProductModal();
});


// ─────────────────────────────────────────────────────────────────────────────
// 2. LOAD PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────
function loadProducts(mode = 'view') {
    // Close any open Bootstrap dropdown
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        bootstrap.Dropdown.getOrCreateInstance(menu.previousElementSibling).hide();
    });

    const box = document.getElementById('content-box');
    box.innerHTML = renderProductSkeleton();

    fetch(PRODUCTS_API, { cache: 'no-store' })
        .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
            return r.text();
        })
        .then(text => {
            let data;
            try { data = JSON.parse(text); }
            catch (e) { throw new Error(`Invalid JSON from view-products.php:\n${text.substring(0, 300)}`); }

            if (!data.success) throw new Error(data.message);

            renderProducts(data.data, mode);
        })
        .catch(err => {
            console.error('[loadProducts]', err);
            box.innerHTML = `
                <div class="orders-error text-center p-5">
                    <i class="fa-solid fa-triangle-exclamation fa-2x mb-3 text-danger"></i>
                    <p class="fw-semibold text-danger mb-1">Failed to load products</p>
                    <pre class="orders-error-pre">${escHtml(err.message)}</pre>
                    <button class="btn btn-sm btn-outline-secondary mt-3" onclick="loadProducts()">
                        <i class="fa-solid fa-rotate-right me-1"></i>Retry
                    </button>
                </div>`;
        });
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. RENDER PRODUCTS TABLE
// ─────────────────────────────────────────────────────────────────────────────
function renderProducts(products, mode = 'view') {
    const box = document.getElementById('content-box');

    const modeConfig = {
        view:   { title: 'My Products',    badge: 'badge-info-custom',    icon: 'fa-box' },
        update: { title: 'Update Stock',   badge: 'badge-warning-custom', icon: 'fa-pen-to-square' },
        delete: { title: 'Remove Products',badge: 'badge-danger-custom',  icon: 'fa-trash' },
    };

    const cfg = modeConfig[mode] || modeConfig.view;

    if (!products || products.length === 0) {
        box.innerHTML = `
            <div class="orders-empty text-center p-5">
                <div class="orders-empty-icon mb-3">
                    <i class="fa-regular fa-folder-open fa-2x text-muted"></i>
                </div>
                <p class="orders-empty-title fw-semibold text-muted">No products found</p>
                <p class="orders-empty-sub text-muted small">You have not uploaded any products yet.</p>
            </div>`;
        return;
    }

    const rows = products.map((p, index) => {
        const statusCfg = getStatusConfig(p.status);
        const stockClass = p.stock <= 0
            ? 'text-danger fw-bold'
            : p.stock <= 5
                ? 'text-warning fw-bold'
                : 'text-success fw-semibold';

        const actionCell = buildActionCell(p, mode);

        return `
            <tr id="product-row-${p.product_id}" data-product='${JSON.stringify(p).replace(/'/g, "&#39;")}'>
                <td class="text-muted" style="font-size:0.8rem">${index + 1}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        ${p.image
                            ? `<img src="../../uploads/products/${escHtml(p.image)}"
                                    alt="${escHtml(p.name)}"
                                    class="product-thumb"
                                    onerror="this.style.display='none'">`
                            : `<div class="product-thumb-placeholder"><i class="fa-solid fa-image"></i></div>`
                        }
                        <div>
                            <div class="product-name">${escHtml(p.name)}</div>
                            <small class="text-muted">${p.description ? escHtml(p.description.substring(0, 45)) + '...' : '—'}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="vp-category-badge">${escHtml(p.category ?? 'N/A')}</span><br>
                    <small class="text-muted">${escHtml(p.product_type ?? '')}</small>
                </td>
                <td><strong class="text-success">NPR ${parseFloat(p.price).toLocaleString('en-NP', { minimumFractionDigits: 2 })}</strong></td>
                <td>
                    <span class="${stockClass}">${p.stock}</span>
                    ${p.stock <= 5 && p.stock > 0 ? `<br><small class="text-warning">Low stock</small>` : ''}
                    ${p.stock <= 0 ? `<br><small class="text-danger">Out of stock</small>` : ''}
                </td>
                <td><span class="status-badge ${statusCfg.badge}">${statusCfg.label}</span></td>
                <td class="text-muted" style="font-size:0.78rem">${formatDate(p.created_at)}</td>
                <td class="text-center" id="action-cell-${p.product_id}">${actionCell}</td>
            </tr>`;
    }).join('');

    box.innerHTML = `
        <div class="orders-header">
            <i class="fa-solid ${cfg.icon} text-success me-2"></i>
            <h5 class="orders-title">${cfg.title}</h5>
            <span class="orders-count-badge">${products.length}</span>
        </div>
        <div class="table-responsive orders-table-wrap">
            <table class="table orders-table vp-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Added</th>
                        <th class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. BUILD ACTION CELL based on mode
// ─────────────────────────────────────────────────────────────────────────────
function buildActionCell(product, mode) {
    const id   = product.product_id;
    const name = escHtml(product.name);

    // View mode — details button only
    if (mode === 'view') {
        return `
            <button class="btn btn-sm vp-btn-detail" onclick="showProductDetail(${id})">
                <i class="fa-solid fa-eye me-1"></i>Details
            </button>`;
    }

    // Update mode — stock inline editor
    if (mode === 'update') {
        return `
            <div class="d-flex align-items-center gap-1 justify-content-center">
                <input type="number"
                       id="stock-input-${id}"
                       class="form-control form-control-sm vp-stock-input"
                       value="${product.stock}"
                       min="0"
                       style="width:72px">
                <button class="btn btn-sm vp-btn-save"
                        onclick="handleUpdateStock(${id}, '${name}')">
                    <i class="fa-solid fa-check"></i>
                </button>
            </div>`;
    }

    // Delete mode — delete button
    if (mode === 'delete') {
        return `
            <button class="btn btn-sm vp-btn-delete"
                    onclick="handleDeleteProduct(${id}, '${name}')">
                <i class="fa-solid fa-trash me-1"></i>Delete
            </button>`;
    }

    return '';
}


// ─────────────────────────────────────────────────────────────────────────────
// 5. PRODUCT DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────────────
function showProductDetail(productId) {
    const row     = document.getElementById(`product-row-${productId}`);
    const product = JSON.parse(row.dataset.product);
    const statusCfg = getStatusConfig(product.status);

    document.getElementById('vp-modal-name').textContent        = product.name;
    document.getElementById('vp-modal-category').textContent    = product.category    ?? 'N/A';
    document.getElementById('vp-modal-type').textContent        = product.product_type ?? 'N/A';
    document.getElementById('vp-modal-price').textContent       = 'NPR ' + parseFloat(product.price).toLocaleString('en-NP', { minimumFractionDigits: 2 });
    document.getElementById('vp-modal-stock').textContent       = product.stock;
    document.getElementById('vp-modal-weight').textContent      = product.weight ? product.weight + ' kg' : '—';
    document.getElementById('vp-modal-status').innerHTML        = `<span class="status-badge ${statusCfg.badge}">${statusCfg.label}</span>`;
    document.getElementById('vp-modal-date').textContent        = formatDate(product.created_at);
    document.getElementById('vp-modal-description').textContent = product.description ?? 'No description provided.';

    const imgEl = document.getElementById('vp-modal-image');
    if (product.image) {
        imgEl.src   = `../../uploads/products/${escHtml(product.image)}`;
        imgEl.style.display = 'block';
    } else {
        imgEl.style.display = 'none';
    }

    bootstrap.Modal.getOrCreateInstance(
        document.getElementById('vpDetailModal')
    ).show();
}

function injectProductModal() {
    if (document.getElementById('vpDetailModal')) return;

    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal fade" id="vpDetailModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content" style="border-radius:12px; overflow:hidden;">

                    <div class="modal-header" style="background:#1a1a2e; color:#fff;">
                        <h5 class="modal-title">
                            <i class="fa-solid fa-box me-2"></i>
                            <span id="vp-modal-name"></span>
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body" style="background:#f9f9f9;">
                        <div class="row g-4">

                            <div class="col-md-5 text-center">
                                <img id="vp-modal-image"
                                     src=""
                                     alt="Product image"
                                     style="max-width:100%; max-height:220px; border-radius:10px; object-fit:cover; display:none;">
                                <div id="vp-modal-no-image" class="text-muted small mt-2">No image</div>
                            </div>

                            <div class="col-md-7">
                                <table class="table table-sm table-borderless">
                                    <tbody>
                                        <tr><td class="text-muted fw-semibold" style="width:40%">Category</td><td id="vp-modal-category"></td></tr>
                                        <tr><td class="text-muted fw-semibold">Type</td><td id="vp-modal-type"></td></tr>
                                        <tr><td class="text-muted fw-semibold">Price</td><td id="vp-modal-price" class="text-success fw-bold"></td></tr>
                                        <tr><td class="text-muted fw-semibold">Stock</td><td id="vp-modal-stock"></td></tr>
                                        <tr><td class="text-muted fw-semibold">Weight</td><td id="vp-modal-weight"></td></tr>
                                        <tr><td class="text-muted fw-semibold">Status</td><td id="vp-modal-status"></td></tr>
                                        <tr><td class="text-muted fw-semibold">Added</td><td id="vp-modal-date"></td></tr>
                                    </tbody>
                                </table>
                                <hr>
                                <p class="text-muted fw-semibold mb-1">Description</p>
                                <p id="vp-modal-description" style="white-space:pre-wrap; font-size:0.875rem;"></p>
                            </div>

                        </div>
                    </div>

                    <div class="modal-footer" style="background:#f0f0f0;">
                        <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                    </div>

                </div>
            </div>
        </div>

        <style>
            .product-thumb {
                width: 44px;
                height: 44px;
                object-fit: cover;
                border-radius: 8px;
                border: 1px solid #eee;
                flex-shrink: 0;
            }
            .product-thumb-placeholder {
                width: 44px;
                height: 44px;
                border-radius: 8px;
                background: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ccc;
                font-size: 1rem;
                flex-shrink: 0;
            }
            .product-name {
                font-weight: 600;
                font-size: 0.875rem;
                color: #1a1a2e;
            }
            .vp-category-badge {
                background: #e8f5e9;
                color: #2c6e49;
                border-radius: 20px;
                padding: 2px 10px;
                font-size: 0.75rem;
                font-weight: 600;
                display: inline-block;
            }
            .vp-table thead th {
                font-size: 0.72rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.04em;
                color: #999;
                background: #f8fafc;
                border-bottom: 1px solid #eee;
                padding: 10px 12px;
            }
            .vp-table tbody td {
                vertical-align: middle;
                padding: 12px;
                border-bottom: 1px solid #f5f5f5;
                font-size: 0.875rem;
            }
            .vp-btn-detail {
                background: #1a1a2e;
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 4px 12px;
                font-size: 0.8rem;
                transition: background 0.2s;
            }
            .vp-btn-detail:hover { background: #3a3a5e; color: #fff; }
            .vp-btn-save {
                background: #2c6e49;
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 4px 10px;
                font-size: 0.8rem;
                transition: background 0.2s;
            }
            .vp-btn-save:hover { background: #1e5236; color: #fff; }
            .vp-btn-delete {
                background: #fff;
                color: #c0392b;
                border: 1.5px solid #c0392b;
                border-radius: 6px;
                padding: 4px 12px;
                font-size: 0.8rem;
                transition: all 0.2s;
            }
            .vp-btn-delete:hover { background: #c0392b; color: #fff; }
            .vp-stock-input {
                text-align: center;
                font-size: 0.85rem;
            }
            .badge-info-custom    { background:#e3f2fd; color:#1565c0; border:1px solid #90caf9; }
            .badge-warning-custom { background:#fff8e1; color:#f59f00; border:1px solid #ffe082; }
            .badge-danger-custom  { background:#fce4ec; color:#c62828; border:1px solid #ef9a9a; }
        </style>
    `);
}


// ─────────────────────────────────────────────────────────────────────────────
// 6. HANDLE DELETE
// ─────────────────────────────────────────────────────────────────────────────
function handleDeleteProduct(productId, productName) {
    if (!confirm(`Permanently delete "${productName}"? This cannot be undone.`)) return;

    const row = document.getElementById(`product-row-${productId}`);
    const btn = document.querySelector(`#action-cell-${productId} button`);
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>'; }

    fetch(PRODUCTS_API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'delete', product_id: productId })
    })
    .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
        return r.text();
    })
    .then(text => {
        let data;
        try { data = JSON.parse(text); }
        catch (e) { throw new Error(`Invalid JSON:\n${text.substring(0, 300)}`); }

        if (!data.success) throw new Error(data.message);

        row.style.transition = 'opacity 0.3s';
        row.style.opacity    = '0';
        setTimeout(() => {
            row.remove();
            // Update count badge
            const remaining = document.querySelectorAll('[id^="product-row-"]').length;
            const badge = document.querySelector('.orders-count-badge');
            if (badge) badge.textContent = remaining;
        }, 300);

        showToast('Product deleted successfully.', 'success');
    })
    .catch(err => {
        console.error('[handleDeleteProduct]', err);
        showToast('Delete failed: ' + err.message, 'error');
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-trash me-1"></i>Delete'; }
    });
}


// ─────────────────────────────────────────────────────────────────────────────
// 7. HANDLE STOCK UPDATE
// ─────────────────────────────────────────────────────────────────────────────
function handleUpdateStock(productId, productName) {
    const input    = document.getElementById(`stock-input-${productId}`);
    const newStock = parseInt(input.value);

    if (isNaN(newStock) || newStock < 0) {
        showToast('Please enter a valid stock quantity.', 'error');
        input.focus();
        return;
    }

    const btn = document.querySelector(`#action-cell-${productId} .vp-btn-save`);
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>'; }

    fetch(PRODUCTS_API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'update_stock', product_id: productId, stock: newStock })
    })
    .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
        return r.text();
    })
    .then(text => {
        let data;
        try { data = JSON.parse(text); }
        catch (e) { throw new Error(`Invalid JSON:\n${text.substring(0, 300)}`); }

        if (!data.success) throw new Error(data.message);

        // Update the stock cell in the table live
        const row      = document.getElementById(`product-row-${productId}`);
        const stockCell = row.querySelectorAll('td')[4];
        const stockClass = newStock <= 0
            ? 'text-danger fw-bold'
            : newStock <= 5
                ? 'text-warning fw-bold'
                : 'text-success fw-semibold';

        stockCell.innerHTML = `
            <span class="${stockClass}">${newStock}</span>
            ${newStock <= 5 && newStock > 0 ? `<br><small class="text-warning">Low stock</small>` : ''}
            ${newStock <= 0 ? `<br><small class="text-danger">Out of stock</small>` : ''}`;

        // Update stored product data on the row
        const product   = JSON.parse(row.dataset.product);
        product.stock   = newStock;
        row.dataset.product = JSON.stringify(product);

        showToast(`Stock for "${productName}" updated to ${newStock}.`, 'success');
    })
    .catch(err => {
        console.error('[handleUpdateStock]', err);
        showToast('Stock update failed: ' + err.message, 'error');
    })
    .finally(() => {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-check"></i>'; }
    });
}


// ─────────────────────────────────────────────────────────────────────────────
// 8. SKELETON LOADER
// ─────────────────────────────────────────────────────────────────────────────
function renderProductSkeleton() {
    const rows = Array(6).fill(`
        <tr>
            <td><div class="skel skel-line w-20"></div></td>
            <td>
                <div class="d-flex gap-2 align-items-center">
                    <div class="skel" style="width:44px;height:44px;border-radius:8px;flex-shrink:0"></div>
                    <div style="flex:1">
                        <div class="skel skel-line w-60 mb-1"></div>
                        <div class="skel skel-line w-40"></div>
                    </div>
                </div>
            </td>
            <td><div class="skel skel-pill"></div></td>
            <td><div class="skel skel-line w-40"></div></td>
            <td><div class="skel skel-line w-30"></div></td>
            <td><div class="skel skel-pill"></div></td>
            <td><div class="skel skel-line w-50"></div></td>
            <td><div class="skel skel-line w-40"></div></td>
        </tr>`).join('');

    return `
        <div class="orders-header">
            <div class="skel skel-line w-20"></div>
        </div>
        <div class="table-responsive orders-table-wrap">
            <table class="table orders-table vp-table">
                <thead>
                    <tr>
                        <th>#</th><th>Product</th><th>Category</th><th>Price</th>
                        <th>Stock</th><th>Status</th><th>Added</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 9. UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
function getStatusConfig(status) {
    const map = {
        pending:  { label: 'Pending',  badge: 'badge-pending'  },
        approved: { label: 'Approved', badge: 'badge-delivered'},
        rejected: { label: 'Rejected', badge: 'badge-cancelled'},
    };
    return map[status] ?? { label: status ?? 'Unknown', badge: 'badge-mixed' };
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
}

function escHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Uses the existing showToast from order-control.js — both files share it
// If order-control.js is not loaded, fall back to alert
if (typeof showToast === 'undefined') {
    window.showToast = function(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.className   = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), 3500);
    };
}