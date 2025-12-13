const userLogin = document.querySelectorAll(".user-login");
const closeBtns = document.querySelectorAll(".close-btn");
const wishlistBtn = document.querySelector(".show-wishlist");
const wishlistModal = document.querySelector(".wishlist-modal");
const cartBtn = document.querySelector(".show-cart");
const cartModal = document.querySelector(".cart-modal");
const accountModal = document.querySelector(".account-modal");
const guestAccount = document.querySelector(".guest-account");
const userAccount = document.querySelector(".user-account");
const loginBtn = document.querySelector('.log-modal');
const loginModal = document.getElementById('login-modal');
const createNew = document.querySelector(".create-btn");

let hideTimeout;

function showAccountModal() {
  accountModal.style.display = "block";
  wishlistModal.style.display = "none";
  cartModal.style.display = "none";
}
function hideAccountModal() {
  hideTimeout = setTimeout(() => {
    accountModal.style.display = "none";
  }, 200);
}

loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
  });

userLogin.forEach((btn) => {
  btn.addEventListener("click", showAccountModal);
  btn.addEventListener("mouseleave", () => {
    if (!accountModal.matches(":hover")) {
      hideAccountModal();
    }
  });
});
accountModal.addEventListener("mouseenter", () => {
  clearTimeout(hideTimeout);
  showAccountModal();
});
accountModal.addEventListener("mouseleave", hideAccountModal);

wishlistBtn.addEventListener('click', ()=>{
  wishlistModal.style.display = "block";
  cartModal.style.display = "none";
});

cartBtn.addEventListener('click', ()=>{
  cartModal.style.display = "block";
  wishlistModal.style.display = "none";

});

closeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    loginModal.style.display = "none";
    accountModal.style.display = "none";
    wishlistModal.style.display = "none";
    cartModal.style.display = "none";
  });
});


function showMenu() {
    const guestAccount = document.querySelector('.guest-account');
    const userAccount = document.querySelector('.user-account');

    // Hide guest menu, show user menu
    guestAccount.style.display = "none";
    userAccount.style.display = "block";
}