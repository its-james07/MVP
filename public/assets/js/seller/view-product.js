// =============================================================================
// view-product.js
// Seller product panel — fetch, render, CRUD, image replace, mobile cards.
//
// Depends on (loaded in seller-panel.php before this file):
//   - bootstrap.bundle.min.js
//   - view-products.css
//   - modal-product-detail.php
//   - modal-product-edit.php
//   - add-product.js   (defines validateName, validateDescription, showErr, hideErr)
// =============================================================================

const PRODUCTS_API = '../../backend/products/view-products.php';


// ─────────────────────────────────────────────────────────────────────────────
// 1. INIT
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('btn-view-products')?.addEventListener('click',  () => loadProducts());
    document.getElementById('btn-update-product')?.addEventListener('click', () => loadProducts('update'));
    document.getElementById('btn-remove-product')?.addEventListener('click', () => loadProducts('delete'));
    loadProducts();
    // Wire real-time validation to edit modal fields once DOM is ready
    initEditFormValidation();
});


// ─────────────────────────────────────────────────────────────────────────────
// 2. LOAD PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────
function loadProducts(mode = 'view') {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        bootstrap.Dropdown.getOrCreateInstance(menu.previousElementSibling).hide();
    });

    const box = document.getElementById('content-box');
    box.innerHTML = renderSkeleton();

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
                    <ion-icon name="warning-outline" class="text-danger d-block mb-3" style="font-size:2rem;"></ion-icon>
                    <p class="fw-semibold text-danger mb-1">Failed to load products</p>
                    <pre class="orders-error-pre">${escHtml(err.message)}</pre>
                    <button class="btn btn-sm btn-outline-secondary mt-3" onclick="loadProducts()">
                        <ion-icon name="refresh-outline"></ion-icon> Retry
                    </button>
                </div>`;
        });
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. RENDER PRODUCTS — desktop table + mobile card grid
// ─────────────────────────────────────────────────────────────────────────────
function renderProducts(products, mode = 'view') {
    const box = document.getElementById('content-box');

    const modeConfig = {
        view:   { title: 'My Products',     icon: 'cube-outline'   },
        update: { title: 'Update Stock',    icon: 'create-outline' },
        delete: { title: 'Remove Products', icon: 'trash-outline'  },
    };
    const cfg = modeConfig[mode] ?? modeConfig.view;

    if (!products || products.length === 0) {
        box.innerHTML = `
            <div class="orders-empty text-center p-5">
                <ion-icon name="folder-open-outline" class="text-muted d-block mb-3" style="font-size:2rem;"></ion-icon>
                <p class="fw-semibold text-muted">No products found</p>
                <p class="text-muted small">You have not uploaded any products yet.</p>
            </div>`;
            // Update dashboard card to 0 if no products
            const dashTotalProducts = document.getElementById('dash-total-products');
            if (dashTotalProducts) dashTotalProducts.textContent = '0';
            return;
    }

    const cards = products.map(p      => buildCard(p, mode)).join('');
    const rows  = products.map((p, i) => buildRow(p, i, mode)).join('');

    box.innerHTML = `
        <div class="orders-header">
            <ion-icon name="${cfg.icon}" class="text-success me-2" style="font-size:1.2rem;vertical-align:middle;"></ion-icon>
            <h5 class="orders-title">${cfg.title}</h5>
            <span class="orders-count-badge">${products.length}</span>
        </div>

        <div class="vp-card-grid">${cards}</div>

        <div class="table-responsive orders-table-wrap vp-table-wrap">
            <table class="table orders-table vp-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th>Category / Type</th>
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

        // Update dashboard card with total products
        const dashTotalProducts = document.getElementById('dash-total-products');
        if (dashTotalProducts) dashTotalProducts.textContent = products.length;
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. BUILD MOBILE CARD
// ─────────────────────────────────────────────────────────────────────────────
function buildCard(p, mode) {
    const statusCfg  = getStatusConfig(p.status);
    const stockClass = stockColorClass(p.stock);

    return `
        <div class="vp-card" id="product-card-${p.product_id}" data-product='${serialize(p)}'>
            <div class="vp-card-inner">
                <div class="vp-card-img-wrap">${thumbHtml(p, 'card')}</div>
                <div class="vp-card-body">
                    <div class="vp-card-name">${escHtml(p.name)}</div>
                    <div class="vp-card-meta">
                        <span class="vp-category-badge">${escHtml(p.category ?? 'N/A')}</span>
                        <small class="text-muted ms-1">${escHtml(p.product_type ?? '')}</small>
                    </div>
                    <div class="vp-card-row">
                        <span class="text-success fw-bold">${formatPrice(p.price)}</span>
                        <span class="${stockClass}">Qty: ${p.stock}</span>
                    </div>
                    <div class="vp-card-row">
                        <span class="status-badge ${statusCfg.badge}">${statusCfg.label}</span>
                        <small class="text-muted">${formatDate(p.created_at)}</small>
                    </div>
                    <div class="vp-card-actions">${buildActions(p, mode)}</div>
                </div>
            </div>
        </div>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 5. BUILD DESKTOP TABLE ROW
// ─────────────────────────────────────────────────────────────────────────────
function buildRow(p, index, mode) {
    const statusCfg  = getStatusConfig(p.status);
    const stockClass = stockColorClass(p.stock);

    return `
        <tr id="product-row-${p.product_id}" data-product='${serialize(p)}'>
            <td class="text-muted" style="font-size:0.8rem">${index + 1}</td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    ${thumbHtml(p, 'table')}
                    <div>
                        <div class="product-name">${escHtml(p.name)}</div>
                        <small class="text-muted">
                            ${p.description ? escHtml(p.description.substring(0, 45)) + '…' : '—'}
                        </small>
                    </div>
                </div>
            </td>
            <td>
                <span class="vp-category-badge">${escHtml(p.category ?? 'N/A')}</span><br>
                <small class="text-muted">${escHtml(p.product_type ?? '')}</small>
            </td>
            <td><strong class="text-success">${formatPrice(p.price)}</strong></td>
            <td>
                <span class="${stockClass}">${p.stock}</span>
                ${p.stock > 0 && p.stock <= 5 ? '<br><small class="text-warning">Low stock</small>'  : ''}
                ${p.stock <= 0               ? '<br><small class="text-danger">Out of stock</small>' : ''}
            </td>
            <td><span class="status-badge ${statusCfg.badge}">${statusCfg.label}</span></td>
            <td class="text-muted" style="font-size:0.78rem">${formatDate(p.created_at)}</td>
            <td class="text-center" id="action-cell-${p.product_id}">${buildActions(p, mode)}</td>
        </tr>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 6. BUILD ACTION BUTTONS
// ─────────────────────────────────────────────────────────────────────────────
function buildActions(product, mode) {
    const id   = product.product_id;
    const name = escHtml(product.name);

    if (mode === 'view') return `
        <button class="btn btn-sm btn-success text-white me-1"
                onclick="showProductDetail(${id})" title="View Details">
            Details
        </button>
        <button class="btn btn-sm btn-secondary me-1"
                onclick="showEditProductModal(${id})" title="Edit Product">
            Edit
        </button>
        <button class="btn btn-sm text-dark btn-outline-danger"
                onclick="handleDeleteProduct(${id}, '${name}')" title="Delete Product">
            <ion-icon name="trash-outline" style="vertical-align:middle;font-size:1rem;"></ion-icon>
        </button>`;

    if (mode === 'update') return `
        <div class="d-flex align-items-center gap-1 justify-content-center">
            <input type="number" id="stock-input-${id}"
                   class="form-control form-control-sm vp-stock-input"
                   value="${product.stock}" min="0" style="width:72px">
            <button class="btn btn-sm vp-btn-save"
                    onclick="handleUpdateStock(${id}, '${name}')">
                <ion-icon name="checkmark-outline"></ion-icon>
            </button>
        </div>`;

    if (mode === 'delete') return `
        <button class="btn btn-sm vp-btn-delete"
                onclick="handleDeleteProduct(${id}, '${name}')">
            <ion-icon name="trash-outline" style="vertical-align:middle;font-size:1rem;"></ion-icon> Delete
        </button>`;

    return '';
}


// ─────────────────────────────────────────────────────────────────────────────
// 7. PRODUCT DETAIL MODAL — populate and show
// ─────────────────────────────────────────────────────────────────────────────
function showProductDetail(productId) {
    const el = document.getElementById(`product-row-${productId}`)
            ?? document.getElementById(`product-card-${productId}`);
    if (!el) return console.error('[showProductDetail] not found:', productId);

    const p         = JSON.parse(el.dataset.product);
    const statusCfg = getStatusConfig(p.status);

    document.getElementById('vp-modal-name').textContent        = p.name;
    document.getElementById('vp-modal-category').textContent    = p.category     ?? 'N/A';
    document.getElementById('vp-modal-type').textContent        = p.product_type ?? 'N/A';
    document.getElementById('vp-modal-price').textContent       = formatPrice(p.price);
    document.getElementById('vp-modal-stock').textContent       = p.stock;
    document.getElementById('vp-modal-weight').textContent      = p.weight ? `${p.weight} kg` : '—';
    document.getElementById('vp-modal-status').innerHTML        = `<span class="status-badge ${statusCfg.badge}">${statusCfg.label}</span>`;
    document.getElementById('vp-modal-date').textContent        = formatDate(p.created_at);
    document.getElementById('vp-modal-description').textContent = p.description ?? 'No description provided.';

    const imgEl   = document.getElementById('vp-modal-image');
    const noImgEl = document.getElementById('vp-modal-no-image');
    if (p.image) {
        imgEl.src             = `${escHtml(p.image)}`;
        imgEl.style.display   = 'block';
        noImgEl.style.display = 'none';
    } else {
        imgEl.style.display   = 'none';
        noImgEl.style.display = 'block';
    }

    bootstrap.Modal.getOrCreateInstance(document.getElementById('vpDetailModal')).show();
}


// ─────────────────────────────────────────────────────────────────────────────
// 8. EDIT PRODUCT MODAL — populate and show
// ─────────────────────────────────────────────────────────────────────────────
function showEditProductModal(productId) {
    const el = document.getElementById(`product-row-${productId}`)
            ?? document.getElementById(`product-card-${productId}`);
    if (!el) return;

    const p = JSON.parse(el.dataset.product);

    // Clear any errors left from a previous open
    clearAllEditErrors();

    document.getElementById('product_id_edit').value          = p.product_id;
    document.getElementById('product_name_edit').value        = p.name        ?? '';
    document.getElementById('product_description_edit').value = p.description ?? '';
    document.getElementById('product_category_edit').value    = p.category_id ?? '';
    document.getElementById('product_type_edit').value        = p.type_id     ?? '';
    document.getElementById('product_price_edit').value       = p.price       ?? '';
    document.getElementById('product_weight_edit').value      = p.weight      ?? '';
    document.getElementById('product_stock_edit').value       = p.stock       ?? 0;

    // Current image thumbnail
    // const currentWrap = document.getElementById('product_current_img_wrap_edit');
    // const currentImg  = document.getElementById('product_current_img_edit');
    // if (p.image) {
    //     currentImg.src            = `../../uploads/products/${escHtml(p.image)}`;
    //     currentWrap.style.display = 'block';
    // } else {
    //     currentWrap.style.display = 'none';
    // }

    // Reset file input and preview
    document.getElementById('product_image_edit').value                  = '';
    document.getElementById('product_new_img_wrap_edit').style.display   = 'none';
    document.getElementById('product_new_img_edit').src                  = '';

    bootstrap.Modal.getOrCreateInstance(document.getElementById('editProductModal')).show();
}


// ─────────────────────────────────────────────────────────────────────────────
// 8a. EDIT MODAL — real-time validation
//     Mirrors add-product.js rules exactly, scoped to _edit field IDs.
//     Uses validateName() and validateDescription() from add-product.js.
// ─────────────────────────────────────────────────────────────────────────────
function initEditFormValidation() {

    // ── Name ──────────────────────────────────────────────────────────────────
    const nameInput = document.getElementById('product_name_edit');
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            const before  = nameInput.value;
            const cleaned = before.replace(/[^a-zA-Z\s]/g, '');
            if (cleaned !== before) {
                nameInput.value = cleaned;
                showEditErr('name-err-edit', 'Only letters are allowed.');
                return;
            }
            const err = validateName(cleaned.trim());
            err ? showEditErr('name-err-edit', err) : hideEditErr('name-err-edit');
        });

        nameInput.addEventListener('focusout', () => {
            const err = validateName(nameInput.value.trim());
            err ? showEditErr('name-err-edit', err) : hideEditErr('name-err-edit');
        });

        nameInput.addEventListener('focus', () => {
            if (nameInput.value.trim().length > 0) hideEditErr('name-err-edit');
        });
    }

    // ── Description ───────────────────────────────────────────────────────────
    const descInput = document.getElementById('product_description_edit');
    if (descInput) {
        descInput.addEventListener('input', () => {
            const before  = descInput.value;
            const cleaned = before.replace(/[^a-zA-Z0-9\s.,!?'"()\-]/g, '');
            if (cleaned !== before) descInput.value = cleaned;

            const err = validateDescription(cleaned.trim());
            err ? showEditErr('desc-err-edit', err) : hideEditErr('desc-err-edit');
        });

        descInput.addEventListener('focusout', () => {
            const err = validateDescription(descInput.value.trim());
            err ? showEditErr('desc-err-edit', err) : hideEditErr('desc-err-edit');
        });

        descInput.addEventListener('focus', () => {
            if (descInput.value.trim().length > 0) hideEditErr('desc-err-edit');
        });
    }

    // ── Category ──────────────────────────────────────────────────────────────
    const categorySelect = document.getElementById('product_category_edit');
    if (categorySelect) {
        const checkCategory = () =>
            categorySelect.value
                ? hideEditErr('category-err-edit')
                : showEditErr('category-err-edit', 'Please select a category.');
        categorySelect.addEventListener('change',   checkCategory);
        categorySelect.addEventListener('focusout', checkCategory);
    }

    // ── Product type ──────────────────────────────────────────────────────────
    const typeSelect = document.getElementById('product_type_edit');
    if (typeSelect) {
        const checkType = () =>
            typeSelect.value
                ? hideEditErr('type-err-edit')
                : showEditErr('type-err-edit', 'Please select a product type.');
        typeSelect.addEventListener('change',   checkType);
        typeSelect.addEventListener('focusout', checkType);
    }

    // ── Price ─────────────────────────────────────────────────────────────────
    const priceInput = document.getElementById('product_price_edit');
    if (priceInput) {
        const checkPrice = () => {
            const v = parseFloat(priceInput.value);
            if (priceInput.value.trim() === '') return showEditErr('price-err-edit', 'Price is required.');
            if (isNaN(v) || v <= 0)             return showEditErr('price-err-edit', 'Enter a valid price greater than 0.');
            hideEditErr('price-err-edit');
        };
        priceInput.addEventListener('input',    checkPrice);
        priceInput.addEventListener('focusout', checkPrice);
        priceInput.addEventListener('focus', () => {
            const v = parseFloat(priceInput.value);
            if (!isNaN(v) && v > 0) hideEditErr('price-err-edit');
        });
    }

    // ── Stock ─────────────────────────────────────────────────────────────────
    const stockInput = document.getElementById('product_stock_edit');
    if (stockInput) {
        const checkStock = () => {
            const v = parseInt(stockInput.value);
            if (stockInput.value.trim() === '') return showEditErr('stock-err-edit', 'Stock quantity is required.');
            if (isNaN(v) || v < 0)              return showEditErr('stock-err-edit', 'Stock cannot be negative.');
            hideEditErr('stock-err-edit');
        };
        stockInput.addEventListener('input',    checkStock);
        stockInput.addEventListener('focusout', checkStock);
        stockInput.addEventListener('focus', () => {
            const v = parseInt(stockInput.value);
            if (!isNaN(v) && v >= 0) hideEditErr('stock-err-edit');
        });
    }

    // ── Image (optional on edit — only validated when a file is chosen) ───────
    const imageInput = document.getElementById('product_image_edit');
    if (imageInput) {
        imageInput.addEventListener('change', () => {
            const file         = imageInput.files[0];
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!file) { hideEditErr('img-err-edit'); return; }
            if (!allowedTypes.includes(file.type)) return showEditErr('img-err-edit', 'Only JPG, PNG or WEBP allowed.');
            if (file.size > 2 * 1024 * 1024)       return showEditErr('img-err-edit', 'Image must be under 2MB.');

            // Show live preview
            const wrap = document.getElementById('product_new_img_wrap_edit');
            const prev = document.getElementById('product_new_img_edit');
            hideEditErr('img-err-edit');
            const reader = new FileReader();
            reader.onload = e => { prev.src = e.target.result; wrap.style.display = 'block'; };
            reader.readAsDataURL(file);
        });
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// 8b. EDIT FORM — on-submit validation (runs on Save Changes click)
// ─────────────────────────────────────────────────────────────────────────────
function validateEditProductForm() {
    clearAllEditErrors();

    const nameVal  = document.getElementById('product_name_edit').value.trim();
    const descVal  = document.getElementById('product_description_edit').value.trim();
    const category = document.getElementById('product_category_edit').value;
    const type     = document.getElementById('product_type_edit').value;
    const price    = parseFloat(document.getElementById('product_price_edit').value);
    const stock    = parseInt(document.getElementById('product_stock_edit').value);
    const weight   = document.getElementById('product_weight_edit').value;
    const image    = document.getElementById('product_image_edit').files[0];
    const allowed  = ['image/jpeg', 'image/png', 'image/webp'];

    let valid = true;

    const nameErr = validateName(nameVal);
    if (nameErr) { showEditErr('name-err-edit', nameErr); valid = false; }

    const descErr = validateDescription(descVal);
    if (descErr) { showEditErr('desc-err-edit', descErr); valid = false; }

    if (!category) { showEditErr('category-err-edit', 'Please select a category.');    valid = false; }
    if (!type)     { showEditErr('type-err-edit',     'Please select a product type.'); valid = false; }

    if (document.getElementById('product_price_edit').value.trim() === '') {
        showEditErr('price-err-edit', 'Price is required.'); valid = false;
    } else if (isNaN(price) || price <= 0) {
        showEditErr('price-err-edit', 'Enter a valid price greater than 0.'); valid = false;
    }

    if (document.getElementById('product_stock_edit').value.trim() === '') {
        showEditErr('stock-err-edit', 'Stock quantity is required.'); valid = false;
    } else if (isNaN(stock) || stock < 0) {
        showEditErr('stock-err-edit', 'Stock cannot be negative.'); valid = false;
    }

    if (weight !== '' && (isNaN(parseFloat(weight)) || parseFloat(weight) < 0)) {
        showEditErr('weight-err-edit', 'Enter a valid weight or leave it empty.'); valid = false;
    }

    // Image is optional on edit — only validate if a file was chosen
    if (image) {
        if (!allowed.includes(image.type))    { showEditErr('img-err-edit', 'Only JPG, PNG or WEBP allowed.'); valid = false; }
        else if (image.size > 2 * 1024 * 1024) { showEditErr('img-err-edit', 'Image must be under 2MB.');       valid = false; }
    }

    return valid;
}


// ─────────────────────────────────────────────────────────────────────────────
// 8c. EDIT ERROR HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function showEditErr(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent   = msg;
    el.style.display = 'inline';
}

function hideEditErr(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

function clearAllEditErrors() {
    ['name-err-edit', 'desc-err-edit', 'category-err-edit', 'type-err-edit',
     'price-err-edit', 'stock-err-edit', 'weight-err-edit', 'img-err-edit'
    ].forEach(hideEditErr);
}


// ─────────────────────────────────────────────────────────────────────────────
// 8d. SUBMIT EDIT FORM
// ─────────────────────────────────────────────────────────────────────────────
function submitProductUpdate() {
    if (!validateEditProductForm()) return;

    const submitBtn  = document.getElementById('product_edit_submit_btn');
    const btnText    = document.getElementById('product_edit_btn_text');
    const spinner    = document.getElementById('product_edit_spinner');
    const imageInput = document.getElementById('product_image_edit');

    submitBtn.disabled  = true;
    btnText.textContent = 'Saving…';
    spinner.classList.remove('d-none');

    const fd = new FormData();
    fd.append('action',      'update_product');
    fd.append('product_id',  document.getElementById('product_id_edit').value);
    fd.append('name',        document.getElementById('product_name_edit').value.trim());
    fd.append('description', document.getElementById('product_description_edit').value.trim());
    fd.append('category_id', document.getElementById('product_category_edit').value);
    fd.append('type_id',     document.getElementById('product_type_edit').value);
    fd.append('price',       parseFloat(document.getElementById('product_price_edit').value));
    fd.append('stock',       parseInt(document.getElementById('product_stock_edit').value));

    const w = document.getElementById('product_weight_edit').value;
    if (w !== '') fd.append('weight', w);
    if (imageInput.files[0]) fd.append('image', imageInput.files[0]);

    fetch(PRODUCTS_API, { method: 'POST', body: fd })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
        .then(text => {
            let res;
            try { res = JSON.parse(text); }
            catch (e) { throw new Error(`Invalid JSON:\n${text.substring(0, 300)}`); }
            if (res.success) {
                showToast('Product updated successfully.', 'success');
                bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
                loadProducts();
            } else {
                showToast(res.message || 'Update failed.', 'error');
            }
        })
        .catch(e => showToast(e.message, 'error'))
        .finally(() => {
            submitBtn.disabled  = false;
            btnText.textContent = 'Save Changes';
            spinner.classList.add('d-none');
        });
}


// ─────────────────────────────────────────────────────────────────────────────
// 9. DELETE PRODUCT
// ─────────────────────────────────────────────────────────────────────────────
function handleDeleteProduct(productId, productName) {
    if (!confirm(`Permanently delete "${productName}"? This cannot be undone.`)) return;

    const btn = document.querySelector(`#action-cell-${productId} button`);
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>'; }

    fetch(PRODUCTS_API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'delete', product_id: productId }),
    })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
    .then(text => {
        let data;
        try { data = JSON.parse(text); }
        catch (e) { throw new Error(`Invalid JSON:\n${text.substring(0, 300)}`); }
        if (!data.success) throw new Error(data.message);

        [`product-row-${productId}`, `product-card-${productId}`].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.style.transition = 'opacity 0.3s';
            el.style.opacity    = '0';
            setTimeout(() => el.remove(), 300);
        });

        setTimeout(() => {
            const badge = document.querySelector('.orders-count-badge');
            if (badge) badge.textContent = document.querySelectorAll('[id^="product-row-"]').length;
        }, 350);

        showToast('Product deleted successfully.', 'success');
    })
    .catch(err => {
        console.error('[handleDeleteProduct]', err);
        showToast('Delete failed: ' + err.message, 'error');
        if (btn) { btn.disabled = false; btn.innerHTML = '<ion-icon name="trash-outline" style="vertical-align:middle;font-size:1rem;"></ion-icon> Delete'; }
    });
}


// ─────────────────────────────────────────────────────────────────────────────
// 10. UPDATE STOCK (inline)
// ─────────────────────────────────────────────────────────────────────────────
function handleUpdateStock(productId, productName) {
    const input    = document.getElementById(`stock-input-${productId}`);
    const newStock = parseInt(input.value);

    if (isNaN(newStock) || newStock < 0) {
        showToast('Please enter a valid stock quantity.', 'error');
        return input.focus();
    }

    const btn = document.querySelector(`#action-cell-${productId} .vp-btn-save`);
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>'; }

    fetch(PRODUCTS_API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'update_stock', product_id: productId, stock: newStock }),
    })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
    .then(text => {
        let data;
        try { data = JSON.parse(text); }
        catch (e) { throw new Error(`Invalid JSON:\n${text.substring(0, 300)}`); }
        if (!data.success) throw new Error(data.message);

        const row       = document.getElementById(`product-row-${productId}`);
        const stockCell = row?.querySelectorAll('td')[4];
        if (stockCell) {
            stockCell.innerHTML = `
                <span class="${stockColorClass(newStock)}">${newStock}</span>
                ${newStock > 0 && newStock <= 5 ? '<br><small class="text-warning">Low stock</small>'  : ''}
                ${newStock <= 0                 ? '<br><small class="text-danger">Out of stock</small>' : ''}`;
        }
        if (row) {
            const product       = JSON.parse(row.dataset.product);
            product.stock       = newStock;
            row.dataset.product = JSON.stringify(product);
        }
        showToast(`Stock for "${productName}" updated to ${newStock}.`, 'success');
    })
    .catch(err => {
        console.error('[handleUpdateStock]', err);
        showToast('Stock update failed: ' + err.message, 'error');
    })
    .finally(() => {
        if (btn) { btn.disabled = false; btn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>'; }
    });
}


// ─────────────────────────────────────────────────────────────────────────────
// 11. SKELETON LOADER
// ─────────────────────────────────────────────────────────────────────────────
function renderSkeleton() {
    const row = `
        <tr>
            <td><div class="skel skel-line w-20"></div></td>
            <td>
                <div class="d-flex gap-2 align-items-center">
                    <div class="skel" style="width:44px;height:44px;border-radius:8px;flex-shrink:0;"></div>
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
        </tr>`;

    return `
        <div class="orders-header"><div class="skel skel-line w-20"></div></div>
        <div class="table-responsive orders-table-wrap">
            <table class="table orders-table vp-table">
                <thead>
                    <tr>
                        <th>#</th><th>Product</th><th>Category / Type</th><th>Price</th>
                        <th>Stock</th><th>Status</th><th>Added</th><th>Actions</th>
                    </tr>
                </thead>
                <tbody>${row.repeat(6)}</tbody>
            </table>
        </div>`;
}


// ─────────────────────────────────────────────────────────────────────────────
// 12. UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function escHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#039;');
}

function serialize(p) {
    return JSON.stringify(p).replace(/'/g, '&#39;');
}

function formatPrice(value) {
    return 'NPR ' + parseFloat(value).toLocaleString('en-NP', { minimumFractionDigits: 2 });
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

function stockColorClass(stock) {
    if (stock <= 0) return 'text-danger fw-bold';
    if (stock <= 5) return 'text-warning fw-bold';
    return 'text-success fw-semibold';
}

function getStatusConfig(status) {
    const map = {
        pending:  { label: 'Pending',  badge: 'badge-pending'   },
        approved: { label: 'Approved', badge: 'badge-delivered' },
        rejected: { label: 'Rejected', badge: 'badge-cancelled' },
    };
    return map[status] ?? { label: status ?? 'Unknown', badge: 'badge-mixed' };
}

function thumbHtml(p, context) {
    if (p.image) {
        const cls = context === 'card' ? 'vp-card-img' : 'product-thumb';
        return `<img src="../../uploads/products/${escHtml(p.image)}"
                     alt="${escHtml(p.name)}" class="${cls}"
                     onerror="this.style.display='none'">`;
    }
    const cls  = context === 'card' ? 'vp-card-img-placeholder' : 'product-thumb-placeholder';
    const size = context === 'card' ? '1.5rem' : '1rem';
    return `<div class="${cls}"><ion-icon name="image-outline" style="font-size:${size};color:#ccc;"></ion-icon></div>`;
}

if (typeof showToast === 'undefined') {
    window.showToast = function (message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.className   = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), 3500);
    };
}