const form = document.getElementById('signupForm');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const visibleError = document.querySelector(
        '#nameError, #emailError, #pass-length, #invalid-pass, #not-confirm'
    );

    if (visibleError && visibleError.style.display === 'block') {
        showToast("Please fix the errors before submitting.", 'error');
        return;
    }

    if (!validateForm()) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="btn-loader"><div></div></div>`;

    const formData = new FormData(form);

    setTimeout(() => {
        fetch('../../backend/users/userDetails.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.textContent = "Create Account";

                if (data.status === 'success') {
                    showToast(data.message, 'success');
                    clearForm();
                    // Redirect to home page with openLogin parameter after 1.5 seconds
                    setTimeout(() => {
                        window.location.href = '/mvp/public/index.php?openLogin=true';
                    }, 1500);
                } else {
                    const msg = Array.isArray(data.message)
                        ? data.message[0]
                        : data.message;
                    showToast(msg, 'error');
                }
            })
            .catch(err => {
                submitBtn.disabled = false;
                submitBtn.textContent = "Create Account";
                showToast("Oops! Something went wrong", 'error');
                console.error(err);
            });
    }, 2000);
});

const nameInput = document.getElementById("fname");

if (nameInput) {
    nameInput.addEventListener('input', () => {
        const nameError = document.getElementById("nameError");
        if (!nameError) return;

        const before = nameInput.value;
        const cleaned = before.replace(/[^a-zA-Z\s'\-]/g, '');

        if (cleaned !== before) {
            nameInput.value = cleaned;
            nameError.textContent = "Numbers and symbols are not allowed.";
            nameError.style.display = "block";
            return;
        }

        nameError.style.display = "none";
    });

    nameInput.addEventListener('focusout', () => {
        const nameError = document.getElementById("nameError");
        if (!nameError) return;

        const v = nameInput.value.trim();

        if (v.length === 0) {
            nameError.textContent = "Name is required.";
            nameError.style.display = "block";
        } else if (!/^[a-zA-Z]/.test(v)) {
            nameError.textContent = "Name must start with a letter.";
            nameError.style.display = "block";
        } else if (v.length < 2) {
            nameError.textContent = "Name is too short.";
            nameError.style.display = "block";
        } else {
            nameError.style.display = "none";
        }
    });

    nameInput.addEventListener('focus', () => {
        const nameError = document.getElementById("nameError");
        if (nameError && nameError.textContent === "Name is required.") {
            nameError.style.display = "none";
        }
    });
}

const emailInput = document.getElementById("reg-email");

if (emailInput) {
    emailInput.addEventListener('focusout', () => {
        const emailError = document.getElementById("emailError");
        if (!emailError) return;

        const v = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (v.length === 0) {
            emailError.textContent = "Email is required.";
            emailError.style.display = "block";
        } else if (!emailRegex.test(v)) {
            emailError.textContent = "Please enter a valid email address.";
            emailError.style.display = "block";
        } else {
            emailError.style.display = "none";
        }
    });

    emailInput.addEventListener('focus', () => {
        const emailError = document.getElementById("emailError");
        if (emailError && emailError.textContent === "Email is required.") {
            emailError.style.display = "none";
        }
    });

    emailInput.addEventListener('input', () => {
        const emailError = document.getElementById("emailError");
        if (emailError) emailError.style.display = "none";
    });
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,72}$/;

const newPassInput = document.getElementById("new-pass");
const confirmPassInput = document.getElementById("confirm-password");

const passStrengthBar = document.getElementById("pass-strength-bar");
const passStrengthText = document.getElementById("pass-strength-text");
const passSuggestions = document.getElementById("pass-suggestions");

const strengthLevels = [
    { label: "Very weak", color: "#E24B4A", width: "20%" },
    { label: "Weak", color: "#EF9F27", width: "40%" },
    { label: "Fair", color: "#e6b800", width: "60%" },
    { label: "Strong", color: "#97C459", width: "80%" },
    { label: "Very strong", color: "#1D9E75", width: "100%" }
];

function getPasswordStrength(password) {
    const checks = {
        length: password.length >= 8,
        longEnough: password.length >= 12,
        lower: /[a-z]/.test(password),
        upper: /[A-Z]/.test(password),
        digit: /\d/.test(password),
        special: /[@$!%*?&]/.test(password),
        noRepeat: !/(.)\1{2,}/.test(password)
    };

    const suggestions = [];

    if (!checks.length) suggestions.push("Use at least 8 characters");
    if (!checks.longEnough) suggestions.push("12+ characters makes it much stronger");
    if (!checks.lower) suggestions.push("Add lowercase letters (a–z)");
    if (!checks.upper) suggestions.push("Add uppercase letters (A–Z)");
    if (!checks.digit) suggestions.push("Include at least one number (0–9)");
    if (!checks.special) suggestions.push("Add a symbol: @ $ ! % * ? &");
    if (!checks.noRepeat) suggestions.push("Avoid repeated characters (e.g. aaa)");

    const score = Object.values(checks).filter(Boolean).length;
    const level = Math.min(Math.floor((score / 7) * 5), 4);

    return { level, suggestions };
}

if (newPassInput) {
    newPassInput.addEventListener('focusout', () => {
        const passLengthError = document.getElementById("pass-length");
        const passInvalidError = document.getElementById("invalid-pass");
        if (!passLengthError || !passInvalidError) return;

        const val = newPassInput.value;

        passLengthError.style.display = "none";
        passInvalidError.style.display = "none";

        if (val.length === 0) return;

        if (val.length < 8) {
            passLengthError.style.display = "block";
            return;
        }

        if (val.length > 72) {
            passInvalidError.textContent = "Password must not exceed 72 characters.";
            passInvalidError.style.display = "block";
            return;
        }

        if (!PASSWORD_REGEX.test(val)) {
            passInvalidError.textContent = "Must include uppercase, lowercase, number & symbol (@$!%*?&).";
            passInvalidError.style.display = "block";
            return;
        }

        passLengthError.style.display = "none";
        passInvalidError.style.display = "none";
    });

    newPassInput.addEventListener('focus', () => {
        const passLengthError = document.getElementById("pass-length");
        const passInvalidError = document.getElementById("invalid-pass");
        if (passLengthError) passLengthError.style.display = "none";
        if (passInvalidError) passInvalidError.style.display = "none";
    });

    newPassInput.addEventListener('input', () => {
        const val = newPassInput.value;

        if (!passStrengthBar || !passStrengthText || !passSuggestions) return;

        if (val.length === 0) {
            passStrengthBar.style.width = "0%";
            passStrengthText.textContent = "";
            passSuggestions.innerHTML = "";
            passSuggestions.style.display = "none";
        } else {
            const { level, suggestions } = getPasswordStrength(val);
            const strength = strengthLevels[level];

            passStrengthBar.style.width = strength.width;
            passStrengthBar.style.backgroundColor = strength.color;
            passStrengthText.textContent = strength.label;
            passStrengthText.style.color = strength.color;

            if (suggestions.length > 0) {
                passSuggestions.style.display = "block";
                passSuggestions.innerHTML = suggestions.map(s => `<li>${s}</li>`).join("");
            } else {
                passSuggestions.style.display = "none";
                passSuggestions.innerHTML = "";
            }
        }

        const notConfirm = document.getElementById("not-confirm");

        if (notConfirm && confirmPassInput && confirmPassInput.value.length > 0) {
            if (val !== confirmPassInput.value) {
                notConfirm.textContent = "Passwords do not match.";
                notConfirm.style.display = "block";
            } else {
                notConfirm.style.display = "none";
            }
        }
    });
}

if (confirmPassInput && newPassInput) {
    confirmPassInput.addEventListener('input', () => {
        const notConfirm = document.getElementById("not-confirm");
        if (!notConfirm) return;

        const confirmVal = confirmPassInput.value;

        if (confirmVal.length === 0) {
            notConfirm.style.display = "none";
            return;
        }

        if (newPassInput.value !== confirmVal) {
            notConfirm.textContent = "Passwords do not match.";
            notConfirm.style.display = "block";
        } else {
            notConfirm.style.display = "none";
        }
    });

    confirmPassInput.addEventListener('focusout', () => {
        const notConfirm = document.getElementById("not-confirm");
        if (!notConfirm) return;

        const confirmVal = confirmPassInput.value;

        if (confirmVal.length === 0) {
            notConfirm.textContent = "Please confirm your password.";
            notConfirm.style.display = "block";
            return;
        }

        if (newPassInput.value !== confirmVal) {
            notConfirm.textContent = "Passwords do not match.";
            notConfirm.style.display = "block";
        } else {
            notConfirm.style.display = "none";
        }
    });

    confirmPassInput.addEventListener('focus', () => {
        const notConfirm = document.getElementById("not-confirm");
        if (notConfirm && notConfirm.textContent === "Please confirm your password.") {
            notConfirm.style.display = "none";
        }
    });
}

function validateForm() {
    const name = document.getElementById("fname").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("new-pass").value;
    const confirmPass = document.getElementById("confirm-password").value;

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passLengthError = document.getElementById("pass-length");
    const passInvalidError = document.getElementById("invalid-pass");
    const notConfirm = document.getElementById("not-confirm");

    const emailRegex = /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z][a-zA-Z\s'\-]{1,49}$/;

    nameError.style.display = "none";
    emailError.style.display = "none";
    passLengthError.style.display = "none";
    passInvalidError.style.display = "none";
    notConfirm.style.display = "none";

    if (!nameRegex.test(name)) {
        nameError.textContent = name.length === 0 ? "Name is required." : "Please enter a valid name.";
        nameError.style.display = "block";
        return false;
    }

    if (!emailRegex.test(email)) {
        emailError.textContent = email.length === 0 ? "Email is required." : "Please enter a valid email address.";
        emailError.style.display = "block";
        return false;
    }

    if (password.length === 0) {
        passLengthError.textContent = "Password is required.";
        passLengthError.style.display = "block";
        return false;
    }

    if (password.length < 8) {
        passLengthError.style.display = "block";
        return false;
    }

    if (password.length > 72) {
        passInvalidError.textContent = "Password must not exceed 72 characters.";
        passInvalidError.style.display = "block";
        return false;
    }

    if (!PASSWORD_REGEX.test(password)) {
        passInvalidError.textContent = "Must include uppercase, lowercase, number & symbol (@$!%*?&).";
        passInvalidError.style.display = "block";
        return false;
    }

    if (password !== confirmPass) {
        notConfirm.textContent = "Passwords do not match.";
        notConfirm.style.display = "block";
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
    const userForm = document.getElementById('signupForm');

    if (userForm) {
        userForm.reset();

        document.querySelectorAll('#nameError, #emailError, #pass-length, #invalid-pass, #not-confirm')
            .forEach(el => el.style.display = "none");

        if (passStrengthBar) passStrengthBar.style.width = "0%";
        if (passStrengthText) passStrengthText.textContent = "";
        if (passSuggestions) {
            passSuggestions.innerHTML = "";
            passSuggestions.style.display = "none";
        }
    }
}

function toggleField(fieldId, iconWrapper) {
    const input = document.getElementById(fieldId);
    const icon =
        iconWrapper.querySelector('ion-icon') ||
        (iconWrapper.tagName === 'ION-ICON' ? iconWrapper : null);

    if (!input || !icon) return;

    if (input.type === 'password') {
        input.type = 'text';
        icon.setAttribute('name', 'eye-off-outline');
    } else {
        input.type = 'password';
        icon.setAttribute('name', 'eye-outline');
    }
}