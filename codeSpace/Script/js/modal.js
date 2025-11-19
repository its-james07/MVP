//Form Modal Toggling
const closeBtns = document.querySelectorAll('.close-btn');
const loginModal = document.querySelector('.login-modal');
const registerModal = document.querySelector('.register-modal');
const userLogin = document.querySelectorAll('.user-login');
const createNew = document.querySelector('.create-btn');

closeBtns.forEach((btn) => {
  btn.onclick = () => {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
  };
});

userLogin.forEach((btn) => {
  btn.onclick = () => {
    loginModal.style.display = 'block';
  };
});

createNew.onclick = () => {
  loginModal.style.display = 'none';
  registerModal.style.display = 'block';
};

//Form Validation
function handleLogin(){
const logForm = document.forms['login-form'];

}


// document.querySelector(".login-form")?.addEventListener("submit", function(e) {
//     e.preventDefault(); // prevent default form submission

//     // Show loader
//     document.getElementById("loader").style.display = "flex";

//     // Wait 3 seconds, then submit form
//     setTimeout(() => {
//         this.submit(); // submit the form after 3 seconds
//     }, 1000);
// });





