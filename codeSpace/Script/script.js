//Form Modal Toggling
const closeBtns = document.querySelectorAll('.close-btn');
const iconModal = document.querySelectorAll('.icon-modal');
// const loginModal = document.querySelector('.login-modal');
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
    iconModal.style.display = 'flex';
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

