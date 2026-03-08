function setupDropdown(buttonId, menuId) {
    const dropdownBtn = document.getElementById(buttonId);
    const items = document.querySelectorAll(`#${menuId} .dropdown-item`);

    items.forEach(item => {
        item.addEventListener("click", function () {
            dropdownBtn.textContent = this.textContent;
        });
    });
}

setupDropdown("sellerDropdown", "sellerDropdownMenu");
setupDropdown("productDropdown", "productDropdownMenu");

document.addEventListener("DOMContentLoaded", () => {
    fetch("../../backend/auth/adminAnalytics.php")
        .then(res => {
            const contentType = res.headers.get("content-type");
            if (!res.ok) {
                window.location.href = "unauthorized.html";
                return null;
            }
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned non-JSON response. Check PHP for errors.");
            }
            return res.json();
        })
        .then(data => {
            if (!data) return;
            document.getElementById("usersCount").textContent    = data.total_users     ?? 0;
            document.getElementById("sellersCount").textContent  = data.total_sellers   ?? 0;
            document.getElementById("productsCount").textContent = data.total_products  ?? 0;
            document.getElementById("pendingRequests").textContent = data.pending_requests ?? 0;
        })
        .catch(err => {
            console.error("Failed to load analytics:", err);
        });
});