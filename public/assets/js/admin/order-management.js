document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('ftch-orders');
    if (btn) {
        btn.addEventListener('click', loadOrderManagement);
    }
});

async function loadOrderManagement() {
    const container = document.getElementById('s-container');
    container.innerHTML = '<p class="text-muted">Loading orders...</p>';

    try {
        const response = await fetch('../../backend/orders/admin-orders.php', { cache: 'no-store' });
        if (!response.ok) throw new Error(`Network error: ${response.status}`);
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to load orders');
        renderOrderManagement(result.orders || []);
    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
    }
}

function renderOrderManagement(orders) {
    const container = document.getElementById('s-container');
    container.innerHTML = '';

    if (!orders.length) {
        container.innerHTML = '<div class="alert alert-info">No orders found.</div>';
        return;
    }

    container.innerHTML = `<div class="card border-0 shadow-sm">
    <div class="card-header bg-white d-flex justify-content-between align-items-center border-bottom">
        <h6 class="mb-0 fw-semibold text-dark">
            <i class="fas fa-receipt me-2 text-muted"></i>Orders
        </h6>
        <span class="small text-muted">${orders.length} orders</span>
    </div>

    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table align-middle mb-0">
                <thead class="border-bottom">
                    <tr class="text-muted small">
                        <th>#</th>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>City</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Placed</th>
                        <th class="text-center">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    ${orders.map((o, i) => buildOrderRow(o, i)).join('')}
                </tbody>
            </table>
        </div>
    </div>
</div>
    `;
}

// function buildOrderRow(order, index) {
//     const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Partially Delivered'];
//     const optionsHtml = statusOptions.map(s => `<option value="${s}" ${s === order.order_status ? 'selected' : ''}>${s}</option>`).join('');

//     const details = (order.items || []).map(i => `<div>${i.product_name} x ${i.quantity} — NPR ${parseFloat(i.line_total).toFixed(2)} <span class="badge bg-secondary text-white">${i.fulfillment_status}</span></div>`).join('');

//     return `
//       <tr>
//         <td>${index + 1}</td>
//         <td>${order.order_number}</td>
//         <td>${order.customer_name ?? 'N/A'}<br><small>${order.customer_email ?? ''}</small></td>
//         <td>${order.shipping_city ?? '—'}</td>
//         <td>${parseFloat(order.grand_total).toFixed(2)}</td>
//         <td>${order.payment_method} / ${order.payment_status}</td>
//         <td>
//             <select class="form-select form-select-sm" onchange="updateOrderStatus(${order.order_id}, this.value)">${optionsHtml}</select>
//             <div class="small text-muted mt-1">Current: ${order.order_status}</div>
//         </td>
//         <td>${new Date(order.placed_at).toLocaleString()}</td>
//         <td class="text-center">
//             <button class="btn btn-sm btn-outline-primary" onclick="showAdminDetailModal('Order Items: ${order.order_number}', '${escapeHtml(details)}')">Details</button>
//         </td>
//       </tr>`;
// }
function buildOrderRow(order, index) {
    const details = (order.items || []).map(i =>
        `<div>${i.product_name} x ${i.quantity} — NPR ${parseFloat(i.line_total).toFixed(2)} <span class="badge bg-secondary text-white">${i.fulfillment_status}</span></div>`
    ).join('');

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${order.order_number}</td>
        <td>${order.customer_name ?? 'N/A'}<br><small>${order.customer_email ?? ''}</small></td>
        <td>${order.shipping_city ?? '—'}</td>
        <td>${parseFloat(order.grand_total).toFixed(2)}</td>
        <td>${order.payment_method} / ${order.payment_status}</td>
        <td>
            <span class="badge bg-secondary">${order.order_status}</span>
            <div class="small text-muted mt-1">Current: ${order.order_status}</div>
        </td>
        <td>${new Date(order.placed_at).toLocaleString()}</td>
        <td class="text-center">
            <button class="btn btn-sm btn-outline-primary" onclick="showAdminDetailModal('Order Items: ${order.order_number}', '${escapeHtml(details)}')">Details</button>
        </td>
      </tr>`;
}

async function updateOrderStatus(orderId, status) {
    try {
        const response = await fetch('../../backend/orders/admin-orders.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, status })
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to update status');
        loadOrderManagement();
    } catch (err) {
        alert(err.message);
    }
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

window.updateOrderStatus = updateOrderStatus;
