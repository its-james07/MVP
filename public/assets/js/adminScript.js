const menuMap = {
    'seller-btn':'seller-menu', 
    'product-btn':'product-menu',
    'admin-menu-btn':'admin-menu'
};

const allMenus = Object.values(menuMap).map(id => document.getElementById(id));

function hideAllMenus(){
    allMenus.forEach(menu=>{
        menu.style.display = 'none';
    });
}

function toggleMenu(menu){
    hideAllMenus();
    menu.style.display = 'block';
}

Object.entries(menuMap).forEach(([btnId, menuId]) => {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(menu);
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('#seller-btn') &&
        !e.target.closest('#product-btn') &&
        !e.target.closest('#user-btn') &&
        !e.target.closest('#admin-menu-btn') &&
        !e.target.closest('#seller-menu') &&
        !e.target.closest('#product-menu') &&
        !e.target.closest('#user-menu') &&
        !e.target.closest('#admin-menu')) {
        hideAllMenus();
    }
});
