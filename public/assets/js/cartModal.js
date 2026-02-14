// const addtoBtn = document.getElementById('add-to-cart');
// const cartBadge = document.getElementById('cart-badge');


// addtoBtn && (addtoBtn.addEventListener('click', addToCart));
// function totalPrice(price, quantity){
//     return quantity * price;
// }

// function addToCart(product, quantity){

//     cartBadge.textContent = count;
//     count++;
// }

function addToCart(id){
    fetch("../../backend/products/add-to-cart.php" ,{
        method: 'POST',
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: "id=" + id
    })
    .then(response => response.text())
    .then(data=>{
        console.log(data);
    })

}

function loadCart(){

}

