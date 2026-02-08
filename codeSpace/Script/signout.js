const logOutBtn = document.getElementById('log-out-btn');
logOutBtn.addEventListener('click', ()=>{
    fetch('Backend/logout.php', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success'){
            window.location.href = "index.html";
        } else {
            console.error("Sign out failed:", data.message);
        }
    })
    .catch(err => {
        console.error("Fetch error:", err);
    });
})