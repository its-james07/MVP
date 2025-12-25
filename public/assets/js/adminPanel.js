// function showPanel(type) {

//     // Remove active class from all menu buttons
//     document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));

//     // Set active to clicked button
//     if (type === "sellers") {
//         document.querySelector(".menu-item:nth-child(2)").classList.add("active");
//         loadContent("Manage Sellers", ["Seller 1", "Seller 2", "Seller 3", "Seller 4"]);
//     }
//     else if (type === "products") {
//         document.querySelector(".menu-item:nth-child(3)").classList.add("active");
//         loadContent("Manage Products", ["Product A", "Product B", "Product C"]);
//     }
//     else if (type === "users") {
//         document.querySelector(".menu-item:nth-child(4)").classList.add("active");
//         loadContent("Manage Users", ["User Alpha", "User Beta", "User Gamma"]);
//     }
// }

// function loadContent(title, items) {
//     const contentArea = document.getElementById("content-area");

//     let html = `<h3 class="section-title">${title}</h3>`;
//     html += `<div class="list-box">`;

//     items.forEach(item => {
//         html += `<div class="list-item">${item}</div>`;
//     });

//     html += `</div>`;

//     contentArea.innerHTML = html;
// }
