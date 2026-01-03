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

