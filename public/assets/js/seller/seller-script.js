/**
 * Seller Panel — Dropdown UI
 * Updates button label when a dropdown item is clicked
 */

function setupDropdown(toggleSelector, menuSelector) {
  const toggleBtn = document.querySelector(toggleSelector);
  const items     = document.querySelectorAll(`${menuSelector} .dropdown-item`);

  if (!toggleBtn || !items.length) return;

  items.forEach(item => {
    item.addEventListener("click", function () {
      toggleBtn.textContent = this.textContent;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {

  // Manage Products dropdown
  setupDropdown(
    '.action-bar .btn-outline-success.dropdown-toggle',
    '.action-bar .btn-outline-success + .dropdown-menu'
  );

  // Orders dropdown
  setupDropdown(
    '.action-bar .btn-outline-info.dropdown-toggle',
    '.action-bar .btn-outline-info + .dropdown-menu'
  );

});