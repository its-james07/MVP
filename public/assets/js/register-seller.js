const nextStepBtn    = document.getElementById('nextBtn');
const prevStepBtn    = document.getElementById('prevBtn');

const formSteps = document.querySelectorAll(".form-step");
const circles   = document.querySelectorAll(".circle");
const progress  = document.getElementById("progress");
const form      = document.getElementById('regForm');

nextStepBtn && (nextStepBtn.addEventListener('click', nextStep));
prevStepBtn && (prevStepBtn.addEventListener('click', prevStep));

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

// ── Helpers ────────────────────────────────────────────────────────────
function show(el) { if (el) el.style.display = 'block'; }
function hide(el) { if (el) el.style.display = 'none';  }

function setError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    show(el);
}
// ──────────────────────────────────────────────────────────────────────

// ── Toggle password visibility ─────────────────────────────────────────
function toggleField(fieldId, iconWrapper) {
    const input = document.getElementById(fieldId);
    const icon  = iconWrapper.querySelector('ion-icon');
    if (!input || !icon) return;

    if (input.type === 'password') {
        input.type = 'text';
        icon.name  = 'eye-off-outline';
    } else {
        input.type = 'password';
        icon.name  = 'eye-outline';
    }
}
// ──────────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════
//  STEP 1 — Real-time validations
// ══════════════════════════════════════════════════════════════════════

// ── Shop name ──────────────────────────────────────────────────────────
const shopNameInput = document.getElementById("shop_name");
if (shopNameInput) {
    shopNameInput.addEventListener('input', () => {
        const err    = document.getElementById("storeNameError");
        const before  = shopNameInput.value;
        const cleaned = before.replace(/[^a-zA-Z\s]/g, '');

        if (cleaned !== before) {
            shopNameInput.value = cleaned;
            setError(err, "Numbers and symbols are not allowed.");
            return;
        }
        hide(err);
    });

    shopNameInput.addEventListener('blur', () => {
        const err = document.getElementById("storeNameError");
        const v   = shopNameInput.value.trim();

        if (v.length === 0) {
            setError(err, "Shop name is required.");
        } else if (v.length < 2) {
            setError(err, "Shop name is too short.");
        } else {
            hide(err);
        }
    });

    shopNameInput.addEventListener('focus', () => hide(document.getElementById("storeNameError")));
}
// ──────────────────────────────────────────────────────────────────────

// ── Owner name ─────────────────────────────────────────────────────────
const ownerNameInput = document.getElementById("owner_name");
if (ownerNameInput) {
    ownerNameInput.addEventListener('input', () => {
        const err     = document.getElementById("ownerNameError");
        const before  = ownerNameInput.value;
        const cleaned = before.replace(/[^a-zA-Z\s'\-]/g, '');

        if (cleaned !== before) {
            ownerNameInput.value = cleaned;
            setError(err, "Numbers and symbols are not allowed.");
            return;
        }
        hide(err);
    });

    ownerNameInput.addEventListener('blur', () => {
        const err = document.getElementById("ownerNameError");
        const v   = ownerNameInput.value.trim();

        if (v.length === 0) {
            setError(err, "Owner name is required.");
        } else if (!/^[a-zA-Z]/.test(v)) {
            setError(err, "Name must start with a letter.");
        } else if (v.length < 2) {
            setError(err, "Name is too short.");
        } else {
            hide(err);
        }
    });

    ownerNameInput.addEventListener('focus', () => hide(document.getElementById("ownerNameError")));
}
// ──────────────────────────────────────────────────────────────────────

// ── Business address ───────────────────────────────────────────────────
const addressInput = document.getElementById("shop_address");
if (addressInput) {
    addressInput.addEventListener('blur', () => {
        const err = document.getElementById("addressError");
        if (!err) return;

        const v = addressInput.value.trim();
        if (v.length === 0) {
            setError(err, "Business address is required.");
        } else if (v.length < 5) {
            setError(err, "Please enter a complete address.");
        } else {
            hide(err);
        }
    });

    addressInput.addEventListener('focus', () => hide(document.getElementById("addressError")));
    addressInput.addEventListener('input', () => hide(document.getElementById("addressError")));
}
// ──────────────────────────────────────────────────────────────────────

// ── City select ────────────────────────────────────────────────────────
const citySelect = document.getElementById("city");
if (citySelect) {
    citySelect.addEventListener('change', () => {
        const err = document.getElementById("cityError");
        if (!err) return;

        if (!citySelect.value) {
            setError(err, "Please select a city.");
        } else {
            hide(err);
        }
    });

    citySelect.addEventListener('blur', () => {
        const err = document.getElementById("cityError");
        if (!err) return;

        if (!citySelect.value) {
            setError(err, "Please select a city.");
        } else {
            hide(err);
        }
    });
}
// ──────────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════
//  STEP 2 — Real-time validations
// ══════════════════════════════════════════════════════════════════════

// ── Email ──────────────────────────────────────────────────────────────
const emailInput = document.getElementById("email");
const emailRegex = /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]{0,63}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

if (emailInput) {
    emailInput.addEventListener('input', () => {
        const err = document.getElementById("emailError");
        const v   = emailInput.value.trim();

        if (v.length === 0) {
            hide(err);
            return;
        }

        if (!emailRegex.test(v)) {
            setError(err, "Please enter a valid email address.");
        } else {
            hide(err);
        }
    });

    emailInput.addEventListener('blur', () => {
        const err = document.getElementById("emailError");
        const v   = emailInput.value.trim();

        if (v.length === 0) {
            setError(err, "Email is required.");
        } else if (!emailRegex.test(v)) {
            setError(err, "Please enter a valid email address.");
        } else {
            hide(err);
        }
    });

    emailInput.addEventListener('focus', () => {
        const err = document.getElementById("emailError");
        if (err && err.textContent === "Email is required.") hide(err);
    });
}
// ──────────────────────────────────────────────────────────────────────

// ── Password regex (matches backend) ──────────────────────────────────
// Backend only checks length >= 8, so we mirror that as the hard rule
// and use the strength meter for guidance beyond that
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,72}$/;
// ──────────────────────────────────────────────────────────────────────

// ── Password strength meter ────────────────────────────────────────────
const passStrengthBar  = document.getElementById("pass-strength-bar");
const passStrengthText = document.getElementById("pass-strength-text");
const passSuggestions  = document.getElementById("pass-suggestions");

const strengthLevels = [
    { label: "Very weak",   color: "#E24B4A", width: "20%"  },
    { label: "Weak",        color: "#EF9F27", width: "40%"  },
    { label: "Fair",        color: "#e6b800", width: "60%"  },
    { label: "Strong",      color: "#97C459", width: "80%"  },
    { label: "Very strong", color: "#1D9E75", width: "100%" },
];

function getPasswordStrength(password) {
    const checks = {
        length:     password.length >= 8,
        longEnough: password.length >= 12,
        lower:      /[a-z]/.test(password),
        upper:      /[A-Z]/.test(password),
        digit:      /\d/.test(password),
        special:    /[@$!%*?&]/.test(password),
        noRepeat:   !/(.)\1{2,}/.test(password),
    };

    const suggestions = [];
    if (!checks.length)     suggestions.push("Use at least 8 characters");
    if (!checks.longEnough) suggestions.push("12+ characters makes it much stronger");
    if (!checks.lower)      suggestions.push("Add lowercase letters (a–z)");
    if (!checks.upper)      suggestions.push("Add uppercase letters (A–Z)");
    if (!checks.digit)      suggestions.push("Include at least one number (0–9)");
    if (!checks.special)    suggestions.push("Add a symbol: @ $ ! % * ? &");
    if (!checks.noRepeat)   suggestions.push("Avoid repeated characters (e.g. aaa)");

    const score = Object.values(checks).filter(Boolean).length;
    const level = Math.min(Math.floor((score / 7) * 5), 4);
    return { level, suggestions };
}

const passwordInput      = document.getElementById("password");
const confirmPassInput   = document.getElementById("confirm_password");

if (passwordInput) {
    passwordInput.addEventListener('focusout', () => {
        const err = document.getElementById("passError");
        const val = passwordInput.value;

        hide(err);

        if (val.length === 0) return;

        if (val.length < 8) {
            setError(err, "Password must be at least 8 characters.");
            return;
        }
        if (val.length > 72) {
            setError(err, "Password must not exceed 72 characters.");
            return;
        }
        if (!PASSWORD_REGEX.test(val)) {
            setError(err, "Must include uppercase, lowercase, number & symbol (@$!%*?&).");
            return;
        }

        hide(err);
    });

    passwordInput.addEventListener('focus', () => hide(document.getElementById("passError")));

    passwordInput.addEventListener('input', () => {
        const val = passwordInput.value;

        // ── Strength bar ──
        if (passStrengthBar && passStrengthText && passSuggestions) {
            if (val.length === 0) {
                passStrengthBar.style.width   = "0%";
                passStrengthText.textContent  = "";
                passSuggestions.innerHTML     = "";
                passSuggestions.style.display = "none";
            } else {
                const { level, suggestions } = getPasswordStrength(val);
                const strength = strengthLevels[level];

                passStrengthBar.style.width           = strength.width;
                passStrengthBar.style.backgroundColor = strength.color;
                passStrengthText.textContent          = strength.label;
                passStrengthText.style.color          = strength.color;

                if (suggestions.length > 0) {
                    passSuggestions.style.display = "block";
                    passSuggestions.innerHTML     = suggestions.map(s => `<li>${s}</li>`).join("");
                } else {
                    passSuggestions.style.display = "none";
                    passSuggestions.innerHTML     = "";
                }
            }
        }

        // Re-check confirm field if it has a value
        const notConfirm = document.getElementById("not-confirm");
        if (notConfirm && confirmPassInput && confirmPassInput.value.length > 0) {
            if (val !== confirmPassInput.value) {
                setError(notConfirm, "Passwords do not match.");
            } else {
                hide(notConfirm);
            }
        }
    });
}
// ──────────────────────────────────────────────────────────────────────

// ── Confirm password ───────────────────────────────────────────────────
if (confirmPassInput) {
    confirmPassInput.addEventListener('input', () => {
        const notConfirm = document.getElementById("not-confirm");
        const confirmVal = confirmPassInput.value;

        if (confirmVal.length === 0) {
            hide(notConfirm);
            return;
        }

        if (passwordInput.value !== confirmVal) {
            setError(notConfirm, "Passwords do not match.");
        } else {
            hide(notConfirm);
        }
    });

    confirmPassInput.addEventListener('focusout', () => {
        const notConfirm = document.getElementById("not-confirm");
        const confirmVal = confirmPassInput.value;

        if (confirmVal.length === 0) {
            setError(notConfirm, "Please confirm your password.");
            return;
        }

        if (passwordInput.value !== confirmVal) {
            setError(notConfirm, "Passwords do not match.");
        } else {
            hide(notConfirm);
        }
    });

    confirmPassInput.addEventListener('focus', () => {
        const notConfirm = document.getElementById("not-confirm");
        if (notConfirm && notConfirm.textContent === "Please confirm your password.") {
            hide(notConfirm);
        }
    });
}
// ──────────────────────────────────────────────────────────────────────

// ── Phone number ───────────────────────────────────────────────────────
const phoneInput = document.getElementById("phone");
if (phoneInput) {
    phoneInput.addEventListener('input', () => {
        const err     = document.getElementById("phoneError");
        const before  = phoneInput.value;
        const cleaned = before.replace(/[^0-9]/g, '');

        if (cleaned !== before) {
            phoneInput.value = cleaned;
            setError(err, "Only numbers are allowed.");
            return;
        }

        // Enforce max length of 10 digits while typing
        if (cleaned.length > 10) {
            phoneInput.value = cleaned.slice(0, 10);
        }

        hide(err);
    });

    phoneInput.addEventListener('blur', () => {
        const err = document.getElementById("phoneError");
        const v   = phoneInput.value.trim();

        if (v.length === 0) {
            setError(err, "Phone number is required.");
            return;
        }
        if (v.length !== 10) {
            setError(err, "Phone number must be exactly 10 digits.");
            return;
        }
        if (!/^(97|98)/.test(v)) {
            setError(err, "Number must start with 97 or 98 (Nepali mobile).");
            return;
        }

        hide(err);
    });

    phoneInput.addEventListener('focus', () => hide(document.getElementById("phoneError")));
}
// ──────────────────────────────────────────────────────────────────────

// ── Form submit ────────────────────────────────────────────────────────
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!secondStepValidation()) return;

    const submitBtn       = form.querySelector('button[type="submit"]');
    submitBtn.disabled    = true;
    submitBtn.textContent = "Submitting...";

    const formData = new FormData(form);

    fetch('../../backend/users/seller/registerSeller.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Server returned non-JSON response. Check PHP for errors.");
        }
        return response.json();
    })
    .then(data => {
        submitBtn.disabled    = false;
        submitBtn.textContent = "Register Seller";

        if (data.status === 'success') {
            showToast(data.message, data.status);
            clearForm();
        } else {
            const msg = Array.isArray(data.message) ? data.message[0] : data.message;
            showToast(msg, data.status);
        }
    })
    .catch(err => {
        submitBtn.disabled    = false;
        submitBtn.textContent = "Register Seller";
        showToast("Oops! Something went wrong. Check console for details.", "error");
        console.error("Registration error:", err);
    });
});
// ──────────────────────────────────────────────────────────────────────

// ── Step 1 validation (on Next click) ─────────────────────────────────
function firstStepValidation() {
    const storeName  = document.getElementById('shop_name').value.trim();
    const ownerName  = document.getElementById('owner_name').value.trim();
    const address    = document.getElementById('shop_address').value.trim();
    const city       = document.getElementById('city').value;

    const storeNameError = document.getElementById("storeNameError");
    const ownerNameError = document.getElementById("ownerNameError");
    const addressError   = document.getElementById("addressError");
    const cityError      = document.getElementById("cityError");

    hide(storeNameError);
    hide(ownerNameError);
    hide(addressError);
    hide(cityError);

    const textRegex  = /^[A-Za-z\s]+$/;
    const nameRegex  = /^[a-zA-Z][a-zA-Z\s'\-]{1,49}$/;
    let valid = true;

    if (!storeName) {
        setError(storeNameError, "Shop name is required.");
        valid = false;
    } else if (!textRegex.test(storeName)) {
        setError(storeNameError, "Only letters are allowed in shop name.");
        valid = false;
    } else if (storeName.length < 2) {
        setError(storeNameError, "Shop name is too short.");
        valid = false;
    }

    if (!ownerName) {
        setError(ownerNameError, "Owner name is required.");
        valid = false;
    } else if (!nameRegex.test(ownerName)) {
        setError(ownerNameError, "Enter a valid full name.");
        valid = false;
    }

    if (!address) {
        setError(addressError, "Business address is required.");
        valid = false;
    } else if (address.length < 5) {
        setError(addressError, "Please enter a complete address.");
        valid = false;
    }

    if (!city) {
        setError(cityError, "Please select a city.");
        valid = false;
    }

    return valid;
}
// ──────────────────────────────────────────────────────────────────────

// ── Step 2 validation (on Submit click) ───────────────────────────────
function secondStepValidation() {
    const email       = document.getElementById('email').value.trim();
    const password    = document.getElementById('password').value;
    const confirmPass = document.getElementById('confirm_password').value;
    const phone       = document.getElementById('phone').value.trim();

    const emailError = document.getElementById("emailError");
    const passError  = document.getElementById("passError");
    const notConfirm = document.getElementById("not-confirm");
    const phoneError = document.getElementById("phoneError");

    hide(emailError);
    hide(passError);
    hide(notConfirm);
    hide(phoneError);

    const phoneRegex = /^(97|98)\d{8}$/;
    let valid = true;

    if (!email) {
        setError(emailError, "Email is required.");
        valid = false;
    } else if (!emailRegex.test(email)) {
        setError(emailError, "Please enter a valid email address.");
        valid = false;
    }

    if (password.length === 0) {
        setError(passError, "Password is required.");
        valid = false;
    } else if (password.length < 8) {
        setError(passError, "Password must be at least 8 characters.");
        valid = false;
    } else if (password.length > 72) {
        setError(passError, "Password must not exceed 72 characters.");
        valid = false;
    } else if (!PASSWORD_REGEX.test(password)) {
        setError(passError, "Must include uppercase, lowercase, number & symbol (@$!%*?&).");
        valid = false;
    }

    if (confirmPass.length === 0) {
        setError(notConfirm, "Please confirm your password.");
        valid = false;
    } else if (password !== confirmPass) {
        setError(notConfirm, "Passwords do not match.");
        valid = false;
    }

    if (!phone) {
        setError(phoneError, "Phone number is required.");
        valid = false;
    } else if (!phoneRegex.test(phone)) {
        setError(phoneError, "Enter a valid 10-digit Nepali number (starts with 97 or 98).");
        valid = false;
    }

    return valid;
}
// ──────────────────────────────────────────────────────────────────────

// ── Toast ──────────────────────────────────────────────────────────────
function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className   = `toast ${type} show`;

    setTimeout(() => toast.classList.remove('show'), duration);
}
// ──────────────────────────────────────────────────────────────────────

// ── Clear form ─────────────────────────────────────────────────────────
function clearForm() {
    document.getElementById('regForm').reset();
    document.querySelectorAll('.toggle-icon ion-icon').forEach(icon => {
        icon.name = 'eye-outline';
    });

    // Reset strength bar
    if (passStrengthBar)  passStrengthBar.style.width  = "0%";
    if (passStrengthText) passStrengthText.textContent = "";
    if (passSuggestions) {
        passSuggestions.innerHTML     = "";
        passSuggestions.style.display = "none";
    }

    // Reset to step 1
    formSteps[1].classList.remove("active");
    formSteps[0].classList.add("active");
    updateProgress(0);
}
// ──────────────────────────────────────────────────────────────────────