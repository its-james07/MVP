// ─── Trigger ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const userControlBtn = document.getElementById('ftch-users');
    if (userControlBtn) {
        userControlBtn.addEventListener('click', loadUsers);
    }
});

// ─── Fetch & Render ───────────────────────────────────────────
async function loadUsers() {
    const container = document.getElementById('s-container');
    container.innerHTML = `<p class="text-muted">Loading users...</p>`;

    try {
        const response = await fetch('../../backend/users/admin/users-control.php', {
            cache: 'no-store'
        });

        if (!response.ok) throw new Error(`Network error: ${response.status}`);

        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to fetch users');

        renderUsers(result.data);

    } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="alert alert-danger">Failed to load users: ${err.message}</div>`;
    }
}

function renderUsers(users) {
    const container = document.getElementById('s-container');
    container.innerHTML = '';

    if (!users || users.length === 0) {
        container.innerHTML = `<div class="alert alert-info">No users found.</div>`;
        return;
    }

    container.innerHTML = `
        <div class="card shadow-sm" style="border: none; border-radius: 12px; overflow: hidden;">
            <div class="card-header d-flex justify-content-between align-items-center" style="background-color: #2c6e49;">
                <h5 class="mb-0 text-white"><i class="fas fa-users me-2"></i>System Users</h5>
                <span class="badge" style="background-color: #ffc107; color: #333;">${users.length} Users</span>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover table-bordered align-middle mb-0" id="users-table">
                        <thead style="background-color: #1a1a2e; color: #fff;">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="users-tbody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    const tbody = document.getElementById('users-tbody');

    users.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.id = `user-row-${user.user_id}`;
        tr.style.backgroundColor = index % 2 === 0 ? '#fff' : '#f0f7f3';

        const statusBadge = getStatusBadge(user.status);
        const actionButtons = getActionButtons(user.user_id, user.fname, user.status);

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${user.fname}</strong></td>
            <td>${user.email}</td>
            <td><span class="badge" style="background-color: #1a1a2e; color: #fff;">${user.role}</span></td>
            <td id="status-badge-${user.user_id}">${statusBadge}</td>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
            <td class="text-center" id="actions-${user.user_id}">${actionButtons}</td>
        `;

        tbody.appendChild(tr);
    });
}

// ─── Badge Helper ─────────────────────────────────────────────
function getStatusBadge(status) {
    if (status === 'active') {
        return `<span class="badge" style="background-color: #4c956c; color: #fff;">Active</span>`;
    } else if (status === 'suspended') {
        return `<span class="badge" style="background-color: #c0392b; color: #fff;">Suspended</span>`;
    }
    return `<span class="badge" style="background-color: #aaa; color: #fff;">${status}</span>`;
}

// ─── Action Buttons Helper ────────────────────────────────────
function getActionButtons(userId, userName, status) {
    const suspendBtn = status !== 'suspended'
        ? `<button class="btn btn-sm me-1"
                style="background-color: #ffc107; color: #333; border: none;"
                onmouseover="this.style.backgroundColor='#e0a800'"
                onmouseout="this.style.backgroundColor='#ffc107'"
                onclick="handleUserAction(${userId}, '${userName}', 'suspend')">
                <i class="fas fa-ban me-1"></i>Suspend
           </button>`
        : '';

    const activateBtn = status === 'suspended'
        ? `<button class="btn btn-sm me-1"
                style="background-color: #4c956c; color: #fff; border: none;"
                onmouseover="this.style.backgroundColor='#2c6e49'"
                onmouseout="this.style.backgroundColor='#4c956c'"
                onclick="handleUserAction(${userId}, '${userName}', 'activate')">
                <i class="fas fa-check me-1"></i>Activate
           </button>`
        : '';

    const deleteBtn = `<button class="btn btn-sm"
            style="background-color: #fff; color: #c0392b; border: 1.5px solid #c0392b;"
            onmouseover="this.style.backgroundColor='#c0392b'; this.style.color='#fff'"
            onmouseout="this.style.backgroundColor='#fff'; this.style.color='#c0392b'"
            onclick="handleUserAction(${userId}, '${userName}', 'delete')">
            <i class="fas fa-trash me-1"></i>Delete
       </button>`;

    return suspendBtn + activateBtn + deleteBtn;
}

// ─── Handle Action ────────────────────────────────────────────
async function handleUserAction(userId, userName, action) {
    const confirmMessages = {
        suspend: `Suspend ${userName}? They will lose access temporarily.`,
        activate: `Activate ${userName}? They will regain full access.`,
        delete: `Permanently delete ${userName}? This cannot be undone.`
    };

    if (!confirm(confirmMessages[action])) return;

    const row = document.getElementById(`user-row-${userId}`);
    const buttons = row.querySelectorAll('button');
    buttons.forEach(b => b.disabled = true);

    try {
        const response = await fetch('../../backend/users/users-control.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, action })
        });

        const result = await response.json();

        if (result.success) {
            if (action === 'delete') {
                row.remove();

                // Update user count in header
                const headerBadge = document.querySelector('.card-header .badge');
                if (headerBadge) {
                    const remaining = document.querySelectorAll('#users-tbody tr').length;
                    headerBadge.textContent = `${remaining} Users`;
                }

            } else {
                // Update status badge
                const newStatus = action === 'suspend' ? 'suspended' : 'active';
                document.getElementById(`status-badge-${userId}`).innerHTML = getStatusBadge(newStatus);

                // Swap action buttons
                document.getElementById(`actions-${userId}`).innerHTML = getActionButtons(userId, userName, newStatus);
            }

        } else {
            alert(result.message || `Failed to ${action} user.`);
            buttons.forEach(b => b.disabled = false);
        }

    } catch (err) {
        console.error(err);
        alert('Error performing action. Check console for details.');
        buttons.forEach(b => b.disabled = false);
    }
}