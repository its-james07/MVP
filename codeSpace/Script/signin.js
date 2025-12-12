const loginForm = document.querySelector('.login-form');
const invalidPass = document.querySelector('.pass-error');
loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new FormData(loginForm);

    fetch('Backend/login.php',{
        method: 'POST',
        body: formData 
    }).then(response => response.json())
    .then(data =>{
        if(data === 'redirect_admin'){
            window.location.href = "adminDashboard.html";
        }
        else if(data === 'redirect_seller'){    
            window.location.href = "sellerDashboard.html";
        }
        else if(data === 'redirect_user'){
            window.location.href = "index.html";
        }
        else if(data === 'Invalid Password'){
            invalidPass.style.display = "block";
            
        }
    }).catch(err =>{
        showToast("Oops something went wrong", 'error');
    })
})