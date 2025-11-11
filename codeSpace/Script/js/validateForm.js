function validateForm(){
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("new-pass").value.trim();
    const emailError = document.getElementById("email-err");
    const passError = document.getElementById("pass-err");

    const emailRegex = /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if(!emailRegex.test(email)){
        emailError.style.display = "inline";
        return false;
    }
    if(password.length < 8){
        passError.style.display = "inline";
        return false;
      
    }
    return true;
}