document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productUploadForm');
    if (form) {
        form.addEventListener('submit', handleProductUpload);
        initRealTimeValidation();
    }
});

const addProductModal = document.getElementById('addProductModal');

    addProductModal.addEventListener('show.bs.modal', () => {
        const skuInput  = document.getElementById('product_sku');
        const catSelect = document.getElementById('product_category');
        if (!skuInput) return;

        const generateSKU = () => {
            const catText = catSelect.options[catSelect.selectedIndex]?.text || 'GEN';
            const prefix  = catText.toUpperCase().slice(0, 3);
            const ts      = Date.now().toString(36).toUpperCase();
            const rand    = Math.random().toString(36).slice(2, 6).toUpperCase();
            return `SKU-${prefix}-${ts}-${rand}`;
        };

        skuInput.value = generateSKU();
        catSelect.addEventListener('change', () => { skuInput.value = generateSKU(); });
    });

    addProductModal.addEventListener('hidden.bs.modal', () => {
        document.getElementById('productUploadForm').reset();
        ['name-err', 'desc-err', 'category-err', 'type-err',
         'price-err', 'stock-err', 'img-err'].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.textContent = ''; el.style.display = 'none'; }
        });
        const skuInput = document.getElementById('product_sku');
        if (skuInput) skuInput.value = '';
    });

function showErr(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent   = msg;
    el.style.display = 'inline';
}

function hideErr(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

function clearAllErrors() {
    ['name-err', 'desc-err', 'category-err', 'type-err', 'price-err', 'stock-err', 'img-err'].forEach(hideErr);
}

function validateName(v) {
    if (v.length === 0)                    return 'Product name is required.';
    if (v.length < 2)                      return 'Name is too short.';
    if (!/^[a-zA-Z0-9\s]+$/.test(v))      return 'Only letters and numbers are allowed.';
    return null;
}

function validateDescription(v) {
    if (v.length === 0)                    return 'Description is required.';
    if (v.length < 10)                     return 'Description is too short.';
    if (!/^[a-zA-Z0-9\s.,!?'"()\-]+$/.test(v)) return 'No special characters allowed.';
    return null;
}

function initRealTimeValidation() {

    const nameInput = document.getElementById('product_name');
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            const before  = nameInput.value;
            const cleaned = before.replace(/[^a-zA-Z\s]/g, '');
            if (cleaned !== before) {
        nameInput.value = cleaned;
        showErr('name-err', 'Only letters are allowed.');
        return;
    }


            const err = validateName(cleaned.trim());
            err ? showErr('name-err', err) : hideErr('name-err');
        });

        nameInput.addEventListener('focusout', () => {
            const err = validateName(nameInput.value.trim());
            err ? showErr('name-err', err) : hideErr('name-err');
        });

        nameInput.addEventListener('focus', () => {
            if (nameInput.value.trim().length > 0) hideErr('name-err');
        });
    }

    const descInput = document.getElementById('product_description');
    if (descInput) {
        descInput.addEventListener('input', () => {
            const before  = descInput.value;
            const cleaned = before.replace(/[^a-zA-Z0-9\s.,!?'"()\-]/g, '');
            if (cleaned !== before) descInput.value = cleaned;

            const err = validateDescription(cleaned.trim());
            err ? showErr('desc-err', err) : hideErr('desc-err');
        });

        descInput.addEventListener('focusout', () => {
            const err = validateDescription(descInput.value.trim());
            err ? showErr('desc-err', err) : hideErr('desc-err');
        });

        descInput.addEventListener('focus', () => {
            if (descInput.value.trim().length > 0) hideErr('desc-err');
        });
    }

    const categorySelect = document.getElementById('product_category');
    if (categorySelect) {
        categorySelect.addEventListener('change', () => {
            categorySelect.value ? hideErr('category-err') : showErr('category-err', 'Please select a category.');
        });
        categorySelect.addEventListener('focusout', () => {
            categorySelect.value ? hideErr('category-err') : showErr('category-err', 'Please select a category.');
        });
    }

    const typeSelect = document.getElementById('product_type');
    if (typeSelect) {
        typeSelect.addEventListener('change', () => {
            typeSelect.value ? hideErr('type-err') : showErr('type-err', 'Please select a product type.');
        });
        typeSelect.addEventListener('focusout', () => {
            typeSelect.value ? hideErr('type-err') : showErr('type-err', 'Please select a product type.');
        });
    }

    const priceInput = document.getElementById('product_price');
    if (priceInput) {
        const validatePrice = () => {
            const v = parseFloat(priceInput.value);
            if (priceInput.value.trim() === '') return showErr('price-err', 'Price is required.');
            if (isNaN(v) || v <= 0)             return showErr('price-err', 'Enter a valid price greater than 0.');
            hideErr('price-err');
        };
        priceInput.addEventListener('input',    validatePrice);
        priceInput.addEventListener('focusout', validatePrice);
        priceInput.addEventListener('focus', () => {
            const v = parseFloat(priceInput.value);
            if (!isNaN(v) && v > 0) hideErr('price-err');
        });
    }

    const stockInput = document.getElementById('product_stock');
    if (stockInput) {
        const validateStock = () => {
            const v = parseInt(stockInput.value);
            if (stockInput.value.trim() === '') return showErr('stock-err', 'Stock quantity is required.');
            if (isNaN(v) || v < 0)              return showErr('stock-err', 'Stock cannot be negative.');
            hideErr('stock-err');
        };
        stockInput.addEventListener('input',    validateStock);
        stockInput.addEventListener('focusout', validateStock);
        stockInput.addEventListener('focus', () => {
            const v = parseInt(stockInput.value);
            if (!isNaN(v) && v >= 0) hideErr('stock-err');
        });
    }

    const imageInput = document.getElementById('product_image');
    if (imageInput) {
        imageInput.addEventListener('change', () => {
            const file         = imageInput.files[0];
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!file)                              return showErr('img-err', 'Please upload a product image.');
            if (!allowedTypes.includes(file.type)) return showErr('img-err', 'Only JPG, PNG or WEBP allowed.');
            if (file.size > 2 * 1024 * 1024)       return showErr('img-err', 'Image must be under 2MB.');
            hideErr('img-err');
        });
    }
}

async function handleProductUpload(e) {
    e.preventDefault();
    clearAllErrors();

    if (!validateProductForm()) return;

    const submitText    = document.getElementById('submitBtnText');
    const submitSpinner = document.getElementById('submitBtnSpinner');
    const submitBtn     = e.target.querySelector('button[type="submit"]');

    submitBtn.disabled     = true;
    submitText.textContent = 'Uploading...';
    submitSpinner.classList.remove('d-none');

    const formData = new FormData(e.target);

    try {
        const response = await fetch('../../backend/users/seller/add-product.php', {
            method: 'POST',
            body: formData
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server returned non-JSON response.');
        }

        const result = await response.json();

        if (result.status === 'success') {
            showToast(result.message, 'success');
            e.target.reset();
            clearAllErrors();
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
                if (modal) modal.hide();
            }, 1500);
        } else {
            const msg = Array.isArray(result.message) ? result.message[0] : result.message;
            showToast(msg, 'error');
        }

    } catch (err) {
        console.error(err);
        showToast('Something went wrong. Check console for details.', 'error');
    } finally {
        submitBtn.disabled     = false;
        submitText.textContent = 'Save Product';
        submitSpinner.classList.add('d-none');
    }
}

function validateProductForm() {
    const nameVal  = document.getElementById('product_name').value.trim();
    const descVal  = document.getElementById('product_description').value.trim();
    const category = document.getElementById('product_category').value;
    const type     = document.getElementById('product_type').value;
    const price    = parseFloat(document.getElementById('product_price').value);
    const stock    = parseInt(document.getElementById('product_stock').value);
    const image    = document.getElementById('product_image').files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    let valid = true;

    const nameErr = validateName(nameVal);
    if (nameErr) { showErr('name-err', nameErr); valid = false; }

    const descErr = validateDescription(descVal);
    if (descErr) { showErr('desc-err', descErr); valid = false; }

    if (!category) { showErr('category-err', 'Please select a category.');    valid = false; }
    if (!type)     { showErr('type-err',     'Please select a product type.'); valid = false; }

    if (isNaN(price) || price <= 0) { showErr('price-err', 'Enter a valid price greater than 0.'); valid = false; }
    if (isNaN(stock) || stock < 0)  { showErr('stock-err', 'Stock cannot be negative.');           valid = false; }

    if (!image) {
        showErr('img-err', 'Please upload a product image.');
        valid = false;
    } else if (!allowedTypes.includes(image.type)) {
        showErr('img-err', 'Only JPG, PNG or WEBP allowed.');
        valid = false;
    } else if (image.size > 2 * 1024 * 1024) {
        showErr('img-err', 'Image must be under 2MB.');
        valid = false;
    }

    return valid;
}

function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className   = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), duration);
}

