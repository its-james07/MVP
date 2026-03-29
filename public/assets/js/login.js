const loginForm = document.getElementById('login-form');
const invalidPass = document.querySelector('.pass-error');
const loginAPI = '/mvp/backend/auth/login.php';

invalidPass.style.display = "none";

// ── Real-time email validation ─────────────────────────────────────────
const emailInput = document.getElementById('login-email');
const emailError = document.getElementById('login-email-error');

if(emailInput){
    emailInput.addEventListener('input',()=>{
        validateEmail();
    })
}

const emailRegex = /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateEmail() {
    const value = emailInput.value.trim();

    if (value === '') {
        emailError.textContent   = '';
        emailError.style.display = 'none';
        emailInput.classList.remove('input-error', 'input-valid');
        return false;
    }

    if (!emailRegex.test(value)) {
        emailError.textContent   = 'Enter a valid email address.';
        emailError.style.display = 'inline';
        emailInput.classList.add('input-error');
        emailInput.classList.remove('input-valid');
        return false;
    }

    emailError.textContent   = '';
    emailError.style.display = 'none';
    emailInput.classList.remove('input-error');
    emailInput.classList.add('input-valid');
    return true;
}

// Clear error while typing, full check on blur
emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('input-error')) {
        validateEmail();
    } else {
        emailError.style.display = 'none';
        emailInput.classList.remove('input-error');
    }
});

emailInput.addEventListener('focusout', () => {
    validateEmail();
});

emailInput.addEventListener('focus', () => {
    if (emailError.textContent === '') {
        emailError.style.display = 'none';
    }
});
// ──────────────────────────────────────────────────────────────────────


// ── Toggle password visibility ─────────────────────────────────────────
function toggleLoginPassword() {
    const passInput = document.getElementById('login-pass');
    const icon      = document.getElementById('login-pass-icon');

    if (!passInput || !icon) return;

    if (passInput.type === 'password') {
        passInput.type = 'text';
        icon.setAttribute('name', 'eye-off-outline');
    } else {
        passInput.type = 'password';
        icon.setAttribute('name', 'eye-outline');
    }
}
// ──────────────────────────────────────────────────────────────────────

// ── Form submit ────────────────────────────────────────────────────────
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="btn-loader"><div></div></div>`;

    invalidPass.style.display = 'none';

    const formData = new FormData(loginForm);

    setTimeout(() => {
        fetch(loginAPI, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.status === 'redirect_admin') {
                showToast("Login Successful!", "success");
                setTimeout(() => {
                    window.location.href = "/mvp/public/pages/admin-panel.php";
                }, 1200);
            }
            else if (data.status === 'redirect_seller') {
                showToast("Login Successful!", "success");
                setTimeout(() => {
                    window.location.href = "/mvp/public/pages/seller-panel.php";
                }, 1200);
            }
            else if (data.status === 'redirect_user') {
                showToast("Login Successful!", "success");
                showMenu();
                setTimeout(() => {
                    window.location.href = "/mvp/public/index.php";
                }, 1200);
            }
            else if (data.status === 'incorrect_password') {
                invalidPass.textContent   = "Incorrect password.";
                invalidPass.style.display = "inline";
                submitBtn.disabled        = false;
                submitBtn.innerHTML       = "Login";
            }
            else if (data.status === 'error') {
                invalidPass.textContent   = data.message || "Login failed.";
                invalidPass.style.display = "inline";
                submitBtn.disabled        = false;
                submitBtn.innerHTML       = "Login";
            }
        })
        .catch(err => {
            submitBtn.disabled  = false;
            submitBtn.innerHTML = "Login";
            console.error(err);
            showToast("Something went wrong", "error");
        });
    }, 2000);
});
// ──────────────────────────────────────────────────────────────────────

// ── Toast ──────────────────────────────────────────────────────────────
function showToast(message, type = 'success', duration = 2000) {
    const toast = document.getElementById('toast');
    if (!toast) { console.error("Toast element not found!"); return; }

    toast.textContent = message;
    toast.classList.remove('success', 'error');
    toast.classList.add(type, 'show');

    setTimeout(() => toast.classList.remove('show'), duration);
}
// ──────────────────────────────────────────────────────────────────────

// ── Menu toggle ────────────────────────────────────────────────────────
function showMenu() {
    document.querySelectorAll('.user-account').forEach(el => el.style.display = 'block');
    document.querySelectorAll('.guest-account').forEach(el => el.style.display = 'none');
}
// ──────────────────────────────────────────────────────────────────────

// ── Loader ─────────────────────────────────────────────────────────────
function showLoader(task) {
    document.querySelectorAll('.loader').forEach(el => {
        el.style.display = task ? 'block' : 'none';
    });
}
// ──────────────────────────────────────────────────────────────────────