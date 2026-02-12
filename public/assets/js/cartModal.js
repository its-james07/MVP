const addtoBtn = document.getElementById('add-to-cart');
const cartBadge = document.getElementById('cart-badge');
addtoBtn && (addtoBtn.addEventListener('click', addToCart));
function totalPrice(price, quantity){
    return quantity * price;
}

function addToCart(){
    let count = 0;
    cartBadge.textContent = count;
    count++;
}