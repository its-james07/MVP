<!-- =============================================================================
     partials/modal-product-edit.php
     All field IDs carry an _edit suffix so they never clash with the
     identically-structured Add Product modal on the same page.
     ============================================================================= -->

<div class="modal fade" id="editProductModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">

            <div class="modal-header bg-light">
                <h5 class="modal-title">
                    <ion-icon name="create-outline" style="font-size: 1.1rem; margin-right: 6px;"></ion-icon>
                    Edit Product
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body p-4">
                <form id="productEditForm" novalidate>
                    <input type="hidden" id="product_id_edit">

                    <!-- Product Name -->
                    <div class="mb-3">
                        <label class="form-label">
                            Product Name <span class="text-danger">*</span>
                            <span class="form-error" id="name-err-edit"></span>
                        </label>
                        <input type="text" class="form-control" id="product_name_edit"
                               minlength="2" maxlength="255"
                               placeholder="e.g. Premium Dog Harness" required>
                    </div>

                    <!-- Description -->
                    <div class="mb-3">
                        <label class="form-label">
                            Description
                            <span class="form-error" id="desc-err-edit"></span>
                        </label>
                        <textarea class="form-control" id="product_description_edit"
                                  rows="3" maxlength="1000"
                                  placeholder="Briefly describe the product..."></textarea>
                    </div>

                    <!-- Category + Product Type -->
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">
                                Category <span class="text-danger">*</span>
                                <span class="form-error" id="category-err-edit"></span>
                            </label>
                            <select class="form-select" id="product_category_edit" required>
                                <option value="">Select Category</option>
                                <option value="1">Dog</option>
                                <option value="2">Cat</option>
                                <option value="3">Fish</option>
                                <option value="4">Bird</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">
                                Product Type <span class="text-danger">*</span>
                                <span class="form-error" id="type-err-edit"></span>
                            </label>
                            <select class="form-select" id="product_type_edit" required>
                                <option value="">Select Type</option>
                                <option value="1">Food</option>
                                <option value="2">Toys</option>
                                <option value="3">Grooming</option>
                                <option value="4">Accessories</option>
                                <option value="5">Healthcare</option>
                            </select>
                        </div>
                    </div>

                    <!-- Price + Weight -->
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">
                                Price (Rs) <span class="text-danger">*</span>
                                <span class="form-error" id="price-err-edit"></span>
                            </label>
                            <input type="number" step="0.01" min="0.01"
                                   class="form-control" id="product_price_edit"
                                   placeholder="0.00" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">
                                Weight (kg)
                                <small class="text-muted fw-normal">(optional)</small>
                            </label>
                            <input type="number" step="0.01" min="0"
                                   class="form-control" id="product_weight_edit"
                                   placeholder="0.00">
                        </div>
                    </div>

                    <!-- Stock -->
                    <div class="mb-3">
                        <label class="form-label">
                            Stock Quantity <span class="text-danger">*</span>
                            <span class="form-error" id="stock-err-edit"></span>
                        </label>
                        <input type="number" min="0"
                               class="form-control" id="product_stock_edit"
                               placeholder="0" required>
                    </div>

                    <!-- Image Replace -->
                    <div class="mb-3">
                        <label class="form-label">
                            Replace Product Image
                            <small class="text-muted fw-normal">(optional — leave empty to keep current)</small>
                            <span class="form-error" id="img-err-edit"></span>
                        </label>

                        <div id="product_current_img_wrap_edit" class="mb-2" style="display: none;">
                            <p class="text-muted small mb-1">Current image:</p>
                            <img id="product_current_img_edit" src="" alt="Current product image"
                                 style="height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid #ddd;">
                        </div>

                        <input type="file" class="form-control" id="product_image_edit"
                               accept="image/jpeg, image/png, image/webp">
                        <small class="text-muted">JPG, PNG or WEBP — max 2MB. Old file is deleted from server.</small>

                        <div id="product_new_img_wrap_edit" class="mt-2" style="display: none;">
                            <p class="text-muted small mb-1">New image preview:</p>
                            <img id="product_new_img_edit" src="" alt="New image preview"
                                 style="height: 80px; border-radius: 8px; object-fit: cover; border: 2px solid #2c6e49;">
                        </div>
                    </div>

                    <!-- Footer actions -->
                    <div class="d-flex justify-content-end gap-2 mt-3">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success"
                                id="product_edit_submit_btn"
                                onclick="submitProductUpdate()">
                            <span id="product_edit_btn_text">Save Changes</span>
                            <span id="product_edit_spinner"
                                  class="spinner-border spinner-border-sm ms-1 d-none"
                                  role="status"></span>
                        </button>
                    </div>

                </form>
            </div>

        </div>
    </div>
</div>