const menuBtn = document.getElementById('admin-menu');
const adminMenu = document.getElementById('account-modal');

let hideTimeout;
function showMenu(){
    adminMenu.style.display = "block"; 
}

function hideMenu(){
    hideTimeout = setTimeout(()=>{
        adminMenu.style.display = "none";
    }, 200);
}

menuBtn.addEventListener('click', ()=>{
    clearTimeout();
    showMenu();
})

menuBtn