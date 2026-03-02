function setupDropdown(buttonId, menuId) {
  const dropdownBtn = document.getElementById(buttonId);
  const items = document.querySelectorAll(`#${menuId} .dropdown-item`);

  items.forEach(item => {
    item.addEventListener("click", function () {
      dropdownBtn.textContent = this.textContent;
    });
  });
}

// Initialize all dropdowns
setupDropdown("sellerDropdown", "sellerDropdownMenu");
setupDropdown("productDropdown", "productDropdownMenu");

document.addEventListener("DOMContentLoaded", () => {
    fetch("../../backend/auth/adminAnalytics.php")
        .then(res => {
            if (!res.ok) {
                window.location.href = "unauthorized.html";
                return;
            }
            return res.json();
        })
        .then(data => {
            document.getElementById("usersCount").textContent = data.total_users;
            document.getElementById("sellersCount").textContent = data.total_sellers;
            document.getElementById("productsCount").textContent = data.total_products;
            document.getElementById("pendingRequests").textContent = data.pending_requests;
        })
        .catch(() => {
            console.error("Failed to load analytics");
        });
});
