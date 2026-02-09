const form = document.getElementById('regForm');
form.addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!validateForm()){
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
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

function validateForm() {
    const storeName = document.getElementById('shop_name').value.trim();
    const ownerName = document.getElementById('owner_name').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();
    const confirmPass = document.querySelector('input[name="confirm_password"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();

    // Error elements
    const storeNameError = document.getElementById("storeNameError");
    const ownerNameError = document.getElementById("ownerNameError");
    const emailError = document.getElementById("emailError");
    const passInvalidError = document.getElementById("invalid-pass");
    const notConfirm = document.getElementById("not-confirm");
    const passLengthError = document.getElementById("passLengthError");
    const phoneError = document.getElementById("phoneError");

    storeNameError?.style.display = "none";
    ownerNameError?.style.display = "none";
    emailError?.style.display = "none";
    passInvalidError?.style.display = "none";
    notConfirm?.style.display = "none";
    passLengthError?.style.display = "none";
    phoneError?.style.display = "none";

    // Regex
    const textRegex = /^[A-Za-z\s]+$/; 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    // Validate text fields
    if (!textRegex.test(storeName)) {
        storeNameError.style.display = "block";
        return false;
    }

    if (!textRegex.test(ownerName)) {
        ownerNameError.style.display = "block";
        return false;
    }

    // Validate email (basic)
    if (!email) {
        emailError.style.display = "block";
        return false;
    }

    // Validate password
    if (password.length < 8) {
        passLengthError.style.display = "block";
        return false;
    }

    if (!passwordRegex.test(password)) {
        passInvalidError.style.display = "block";
        return false;
    }

    if (password !== confirmPass) {
        notConfirm.style.display = "block";
        return false;
    }

    // Validate phone
    if (!phoneRegex.test(phone)) {
        phoneError.style.display = "block";
        return false;
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
    const form = document.getElementById('regForm');
    form.reset();
}