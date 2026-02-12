const nextStepBtn = document.getElementById('nextBtn');
const prevStepBtn = document.getElementById('prevBtn');
const togglePasswordBtn = document.getElementById('toggle-password') ;

const formSteps = document.querySelectorAll(".form-step");
const circles = document.querySelectorAll(".circle");
const progress = document.getElementById("progress");
const form = document.getElementById('regForm');


nextStepBtn && (nextStepBtn.addEventListener('click',nextStep));
prevStepBtn && (prevStepBtn.addEventListener('click',prevStep));
togglePasswordBtn && (togglePasswordBtn.addEventListener('change', togglePassword));

function nextStep() {
    if (!firstStepValidation()) return;
        formSteps[0].classList.remove("active");
        formSteps[1].classList.add("active");
        updateProgress(1);
}

function prevStep() {
    formSteps[1].classList.remove("active");
    formSteps[0].classList.add("active");
    updateProgress(0);
}

function updateProgress(stepIndex) {
    circles.forEach((circle, idx) => {
        if (idx <= stepIndex) circle.classList.add("active");
        else circle.classList.remove("active");
    });
    progress.style.width = stepIndex === 1 ? "100%" : "0%";
}


form.addEventListener('submit', (e)=>{
  e.preventDefault();
  if(!secondStepValidation()){
    console.log("Error");
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting..";
    const formData = new FormData(form);
    fetch('../../backend/users/registerSeller.php', {
      method: 'POST', 
      body: formData
    })
    .then(response => response.json())
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
        submitBtn.textContent = "Register Seller";
        showToast("Oops! something went wrong");
        console.error(err);
    })
  });

function show(e1){
    if(e1) e1.style.display = 'block';
}

function hide(e1){
    if(e1) e1.style.display = 'none';
}

function firstStepValidation(){
    const storeName = document.getElementById('shop_name').value.trim();
    const ownerName = document.getElementById('owner_name').value.trim();

    const storeNameError = document.getElementById("storeNameError");
    const ownerNameError = document.getElementById("ownerNameError");

    hide(storeNameError);
    hide(ownerNameError);
    const textRegex = /^[A-Za-z\s]+$/; 

    if(!storeName){
        show(storeNameError);
        storeNameError.textContent = "Store name required";
        return false;
    }

     if (!textRegex.test(storeName)) {
        show(storeNameError);
        storeNameError.textContent = "Only letters allowed";
        return false;
    }

    if(!ownerName){
        show(ownerNameError);
        ownerNameError.textContent = "Owner name required";
        return false;
    }

    if (!textRegex.test(ownerName)) {
        show(ownerNameError);
        ownerNameError.textContent = "Only letters allowed";
        return false;
    }
    return true;
}

function secondStepValidation(){
    const email = document.querySelector('input[name="email"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();
    const confirmPass = document.querySelector('input[name="confirm_password"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();
   
    const emailError = document.getElementById("emailError");
    const notConfirm = document.getElementById("not-confirm");
    const passError = document.getElementById("passError");
    const phoneError = document.getElementById("phoneError");

    hide(emailError);
    hide(notConfirm);
    hide(passError);
    hide(phoneError);


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    if (!email) {
        show(emailError);
        emailError.textContent = "Email Cannot be Empty";
        return false;
    }

    if(!emailRegex.test(email)){
        show(emailError);
        emailError.textContent = "Invalid email format";
        return false;
    }

    if (password.length < 8) {
        show(passError);
        passError.textContent = "At least 8 Characters";
        return false;
    }

    if (password !== confirmPass) {
        show(notConfirm);
        notConfirm.textContent = "Password donot match";
        return false;
    }

     if (!phoneRegex.test(phone)) {
        phoneError.style.display = "block";
        return false;
    }

    return true;
}

function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    if(!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function clearForm() {
    const form = document.getElementById('regForm');
    form.reset();
}

function togglePassword() {
    const passwordToggle = document.querySelectorAll('.toggle');
    passwordToggle.forEach(field =>{
        field.type = field.type === "password" ? "text" : "password";
    })
}