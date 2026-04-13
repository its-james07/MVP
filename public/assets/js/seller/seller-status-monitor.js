/**
 * Real-time seller status monitor
 * Periodically checks if seller account is suspended
 * Updates UI and blocks actions if status changes
 */

let lastKnownStatus = null;
let statusCheckInterval = null;

function initSellerStatusMonitor() {
    // Check immediately on load
    checkSellerStatus();
    
    // Then check every 10 seconds
    statusCheckInterval = setInterval(checkSellerStatus, 10000);
}

function checkSellerStatus() {
    fetch('/mvp/backend/auth/check-seller-status.php', {
        method: 'GET',
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error('Status check failed:', data.message);
                return;
            }

            const currentStatus = data.status;

            // First time loading - just set the status
            if (lastKnownStatus === null) {
                lastKnownStatus = currentStatus;
                return;
            }

            // Status changed to suspended
            if (lastKnownStatus !== 'suspended' && currentStatus === 'suspended') {
                handleAccountSuspension();
                lastKnownStatus = currentStatus;
                return;
            }

            // Status changed - update last known
            if (lastKnownStatus !== currentStatus) {
                lastKnownStatus = currentStatus;
            }
        })
        .catch(err => {
            console.error('Error checking seller status:', err);
        });
}

function handleAccountSuspension() {
    // Show error toast
    if (typeof showToast === 'function') {
        showToast('Your account has been suspended by admin. You will be logged out in 5 seconds.', 'error');
    } else {
        alert('Your account has been suspended by admin. You will be logged out.');
    }

    // Disable all action buttons
    disableAllSellerActions();

    // Redirect to login after 5 seconds
    setTimeout(() => {
        window.location.href = '/mvp/public/index.php';
    }, 5000);
}

function disableAllSellerActions() {
    // Disable all buttons
    document.querySelectorAll('button').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
    });

    // Disable all input fields
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.disabled = true;
        input.style.opacity = '0.6';
    });

    // Show overlay
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initSellerStatusMonitor();
});

// Clean up interval on page unload
window.addEventListener('beforeunload', () => {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }
});
