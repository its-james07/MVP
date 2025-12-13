const loginForm = document.getElementById('login-form');
const invalidPass = document.querySelector('.pass-error');
invalidPass.style.display = "none";
loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(loginForm);
    console.log("It works before fetching");
    fetch('Backend/login.php',{
        method: 'POST',
        body: formData 
    }).then(response => response.json())
    .then(data =>{
        if(data.status === 'redirect_admin'){
            window.location.href = "adminDashboard.html";
        }
        else if(data.status === 'redirect_seller'){    
            window.location.href = "sellerDashboard.html";
        }
        else if(data.status === 'redirect_user'){
            showToast("Login Successful!","success");
            showUserMenu();
            window.location.href = "index.html";
        }
        else if(data.status === 'incorrect_password'){
            invalidPass.style.display = "inline"; 
        }
    }).catch(err =>{
        showToast("Oops nomething went wrong", 'error');
    })
})

function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');  
    if (!toast) {
        console.error("Toast element not found!");
        return;
    }
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

