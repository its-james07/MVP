// document.addEventListener('DOMContentLoaded', () => {
//     loadPendingSellers();
// });

// const fetchApplications = document.getElementById('');

// async function loadPendingSellers() {
//     const container = document.getElementById('s-container');
//     container.innerHTML = `<p>Loading seller applications...</p>`;
//     try {
//         const response = await fetch('../backend/users/seller/seller-applications.php', {
//             cache: 'no-store'
//         });

//         if (!response.ok) {
//             throw new Error(`Network error: ${response.status}`);
//         }

//         const result = await response.json();

//         if (!result.success) {
//             throw new Error(result.message || 'Failed to fetch applications');
//         }

//         renderApplications(result.data);
//     } catch (err) {
//         console.error(err);
//         container.innerHTML = `<p class="error">Failed to load seller applications.</p>`;
//     }
// }

// function renderApplications(applications) {
//     const container = document.getElementById('s-container');
//     container.innerHTML = '';

//     if (!applications || applications.length === 0) {
//         container.innerHTML = `<p>No pending applications</p>`;
//         return;
//     }

//     applications.forEach(seller => {
//         const div = document.createElement('div');
//         div.className = 'seller-item';

//         // Safe XSS-free rendering
//         const name = document.createElement('h3');
//         name.textContent = seller.user_name;
//         div.appendChild(name);

//         const email = document.createElement('p');
//         email.textContent = `Email: ${seller.user_email}`;
//         div.appendChild(email);

//         const shop = document.createElement('p');
//         shop.textContent = `Shop: ${seller.shop_name}`;
//         div.appendChild(shop);

//         const address = document.createElement('p');
//         address.textContent = `Address: ${seller.address}`;
//         div.appendChild(address);

//         const status = document.createElement('p');
//         status.textContent = `Status: ${seller.status}`;
//         div.appendChild(status);

//         const btnContainer = document.createElement('div');
//         btnContainer.className = 'button-container';

//         const approveBtn = document.createElement('button');
//         approveBtn.textContent = 'Approve';
//         approveBtn.className = 'approve-btn';
//         approveBtn.addEventListener('click', () => updateStatus(seller.seller_id, 'approved'));
//         btnContainer.appendChild(approveBtn);

//         const rejectBtn = document.createElement('button');
//         rejectBtn.textContent = 'Reject';
//         rejectBtn.className = 'reject-btn';
//         rejectBtn.addEventListener('click', () => {
//             if (confirm('Are you sure you want to reject this seller?')) {
//                 updateStatus(seller.seller_id, 'rejected');
//             }
//         });
//         btnContainer.appendChild(rejectBtn);

//         div.appendChild(btnContainer);
//         container.appendChild(div);
//     });
// }

// async function updateStatus(sellerId, status) {
//     try {
//         const response = await fetch('/api/update-seller-status.php', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ seller_id: sellerId, status })
//         });

//         const result = await response.json();

//         if (result.success) {
//             alert(`Seller ${status} successfully.`);
//             loadPendingSellers(); // refresh the list
//         } else {
//             alert(result.message || `Failed to ${status} seller.`);
//         }
//     } catch (err) {
//         console.error(err);
//         alert('Error updating seller status. Check console for details.');
//     }
// }

const applicationBtn = document.getElementById('applicationBtn');
applicationBtn.addEventListener('change', ()=>{
    console.log("Hello world");
})