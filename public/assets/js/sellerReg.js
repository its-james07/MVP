const form = document.getElementById('sr-form');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!validateForm()){
    return;
  }

  const submitBtn = document.getElementById('sr-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting ..";
  setTimeout(()=>{
    const formData = new FormData(form);
    fetch('../../backend/users/registerSeller.php', {
      method: 'POST', 
      body: formData
    })
    .then(res => res.json())
    .then(data =>{
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
      if(data.status === 'success'){
        showToast(data.message, data.status);
        clearForm();  
      }else{
        showToast(data.message, data.status);
      }
    }).catch(err =>{
      submitBtn.disabled = false;
        submitBtn.textContent = "Create Account";
        showToast("Oops! omething went wrong");
        console.error(err);
    })
  }, 2000);
})

function validateForm(){
  const password = document.getElementById("pwd").value.trim();
  const confirmPass = document.getElementById("cpwd").value.trim();

  const emailError = document.getElementById("emailError");
  const passInvalidError = document.getElementById("invalid-pass");
  const notConfirm = document.getElementById("not-confirm");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  emailError.style.display = "none";
  passInvalidError.style.display = "none";
  notConfirm.style.display = "none";

if (password.length < 8) {
    passLengthError.style.display = "block";
    return false;
} else {
    if (!passwordRegex.test(password)) {
        passInvalidError.style.display = "block";
        return false;
    } else {
        if (password !== confirmPass) {
            notConfirm.style.display = "block";
            return false;
        }
    }
}
  return true;
}

function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');  
    toast.textContent = message;                     
    toast.classList.remove('success', 'error');      
    toast.classList.add(type, 'show');               

    setTimeout(() => {
        toast.classList.remove('show');  
    }, duration);
}

function clearForm() {
    const userForm = document.getElementById('sr-form');
    if (userForm) {
        userForm.reset(); 
    }
}