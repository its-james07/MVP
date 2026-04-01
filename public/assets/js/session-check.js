
document.addEventListener("DOMContentLoaded", () => {
  const guestAccount = document.querySelector('.guest-account');
  const userAccount  = document.querySelector('.user-account');

  // Determine correct path for checkSession.php
  let checkSessionPath = "";
  if (window.location.pathname.includes("/pages/")) {
    checkSessionPath = "../../backend/auth/checkSession.php";
  } else {
    checkSessionPath = "../backend/auth/checkSession.php";
  }

  fetch(checkSessionPath)
    .then(res => res.json())
    .then(data => {
      if (data.loggedIn) {
        if (guestAccount) guestAccount.style.display = "none";
        if (userAccount)  userAccount.style.display  = "block";
      } else {
        if (guestAccount) guestAccount.style.display = "block";
        if (userAccount)  userAccount.style.display  = "none";
      }
    })
    .catch(err => console.error("Failed to check session:", err));
});
