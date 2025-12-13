document.addEventListener('DOMContentLoaded', ()=>{
    const logoutBtn = document.getElementById('log-out-btn');
    logoutBtn.addEventListener('click', ()=>{
        fetch('Backend/signout.php')
        .then(response => response.json())
        .then(data =>{
            
        })
})
})
