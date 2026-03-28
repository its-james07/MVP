document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.getElementById('ftch-seller-apps'); 
    loadBtn.addEventListener('click', loadPendingSellers);
});

// ─── Fetch & Render ───────────────────────────────────────────

async function loadPendingSellers() {
    const container = document.getElementById('s-container');
    container.innerHTML = `<p class="text-muted">Loading seller applications...</p>`;
    try {
        const response = await fetch('../../backend/users/admin/seller-applications.php', { cache: 'no-store' });

        if (!response.ok) throw new Error(`Network error: ${response.status}`);

        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to fetch applications');

        renderApplications(result.data);

    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="alert alert-danger">Failed to load seller applications: ${err.message}</div>`;
    }
}

// ─── Render Table ────────────────────────────────────────────

function renderApplications(applications) {
    const container = document.getElementById('s-container');
    container.innerHTML = '';

    if (!applications || applications.length === 0) {
        container.innerHTML = `<div class="alert alert-info">No pending applications found.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="card shadow-sm">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0"><i class="fas fa-store me-2"></i>Pending Seller Applications</h5>
            <span class="badge bg-warning text-dark">${applications.length} Pending</span>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-bordered align-middle mb-0 table-sm" id="sellers-table">
                    <thead class="table-white fs-6">
                        <tr class="fw-semibold">
                            <th>#</th>
                            <th>Owner Name</th>
                            <th>Email</th>
                            <th>Shop Name</th>
                            <th>Status</th>
                            <th class="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="sellers-tbody" class="fs-6"></tbody>
                </table>
            </div>
        </div>
    </div>
    `;

    const tbody = document.getElementById('sellers-tbody');

    applications.forEach((seller, index) => {
        const tr = document.createElement('tr');
        tr.id = `seller-row-${seller.seller_id}`;

        // Store extra info in data-* attributes for modal
        tr.dataset.address = seller.address ?? '—';
        tr.dataset.city = seller.city ?? '—';
        tr.dataset.applied = new Date(seller.created_at).toLocaleDateString();

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${seller.user_name}</strong></td>
            <td>${seller.user_email}</td>
            <td>${seller.shop_name}</td>
            <td><span class="badge bg-warning text-dark">${seller.status}</span></td>
            <td class="text-center">
                <button class="btn btn-primary btn-sm me-1" onclick="showSellerDetails(${seller.seller_id})">
                    <i class="fas fa-info-circle me-1"></i>Details
                </button>
                <button class="btn btn-success btn-sm me-1" onclick="updateStatus(${seller.seller_id}, 'approved', this)">
                    <i class="fas fa-check me-1"></i>Approve
                </button>
                <button class="btn btn-danger btn-sm" onclick="handleReject(${seller.seller_id}, '${seller.user_name}', this)">
                    <i class="fas fa-times me-1"></i>Reject
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// ─── Seller Details Modal ────────────────────────────────────

function showSellerDetails(sellerId) {
    const row = document.getElementById(`seller-row-${sellerId}`);
    const cells = row.children;

    const detailsHtml = `
        <p><strong>Owner Name:</strong> ${cells[1].textContent}</p>
        <p><strong>Email:</strong> ${cells[2].textContent}</p>
        <p><strong>Shop Name:</strong> ${cells[3].textContent}</p>
        <p><strong>Address:</strong> ${row.dataset.address}</p>
        <p><strong>City:</strong> ${row.dataset.city}</p>
        <p><strong>Applied Date:</strong> ${row.dataset.applied}</p>
        <p><strong>Status:</strong> ${cells[4].textContent}</p>
    `;

    const modalHtml = `
        <div class="modal fade" id="sellerDetailsModal" tabindex="-1" aria-labelledby="sellerDetailsLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="sellerDetailsLabel">Seller Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">${detailsHtml}</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('sellerDetailsModal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = new bootstrap.Modal(document.getElementById('sellerDetailsModal'));
    modal.show();
}