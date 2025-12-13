const form = document.getElementById('signupForm');
form.addEventListener('submit', function(e){
    e.preventDefault();
    if(!validateForm()){
        return;
    }   
    const formData = new FormData(form);
    console.log('It is working');
    fetch('Backend/userDetails.php',{
        method: 'POST', 
        body: formData
    }).then(response => response.json())
    .then(data =>{
        if(data.status ===  'success'){
            showToast('Signup Successful', 'success');
            clearForm();
        }
        else if(data.status === 'email_exists'){
            showToast("Email Already Exist", 'error');
        }
        else{
            showToast('Failed to signup', 'error');
        }
    })
    .catch(err =>{
        showToast("Oops! omething went wrong");
        console.error(err);
    })
})

function validateForm(){

  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("new-pass").value.trim();
  const confirmPass = document.getElementById("confirm-password").value.trim();

  const emailError = document.getElementById("emailError");
  const passLengthError = document.getElementById("pass-length");
  const passInvalidError = document.getElementById("invalid-pass");
  const notConfirm = document.getElementById("not-confirm");

  const emailRegex =
    /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  emailError.style.display = "none";
  passLengthError.style.display = "none";
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
    const userForm = document.getElementById('signupForm');
    if (userForm) {
        userForm.reset(); 
    }
}

function togglePassword() {
    const showHide = document.querySelectorAll('.showHide');

    showHide.forEach(field => {
        if (field.type === "password") {
            field.type = "text";
        } else {
            field.type = "password";
        }
    });
}



