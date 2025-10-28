const featuredItems = [
    {name: "Monge Adult Dog Food", price: 2200, image: "../assets/images/dogProducts/dog-chain.png", wishlist: false},
    {name: "Monge Puppy Dog", price: 3200, image: "../assets/images/dogProducts/collar.png", wishlist: false},
    {name: "Drools Balls", price: 2200, image: "../assets/images/dogProducts/play-balls.png", wishlist: false},
    {name: "Fur scrubber", price: 1200, image: "../assets/images/dogProducts/cleaner.png", wishlist: false},
    {name: "Pedigree Biscrok", price: 2010, image: "../assets/images/dogProducts/dog-food.png", wishlist: false}
];

const dfeaturedItems = [
    {name: "Monge Adult Dog Food", price: 2200, image: "../assets/images/dogProducts/biscuit.png", wishlist: false},
    {name: "Monge Puppy Dog", price: 3200, image: "../assets/images/dogProducts/mattress.png", wishlist: false},
    {name: "Drools Balls", price: 2200, image: "../assets/images/dogProducts/play-balls.png", wishlist: false},
    {name: "Fur scrubber", price: 1200, image: "../assets/images/dogProducts/bowl.png", wishlist: false},
    {name: "Pedigree Biscrok", price: 2010, image: "../assets/images/dogProducts/cleaner.png", wishlist: false}
];

const cfeaturedItems = [
    {name: "Monge Adult Dog Food", price: 2200, image: "../assets/images/catProducts/cat-wear.png", wishlist: false},
    {name: "Monge Puppy Dog", price: 3200, image: "../assets/images/catProducts/fish-doll.png", wishlist: false},
    {name: "Drools Balls", price: 2200, image: "../assets/images/catProducts/frog-mask.png", wishlist: false},
    {name: "Fur scrubber", price: 1200, image: "../assets/images/dogProducts/cleaner.png", wishlist: false},
    {name: "Pedigree Biscrok", price: 2010, image: "../assets/images/dogProducts/play-balls.png", wishlist: false}
];


function renderProducts(containerId, classOfDiv, productsArray){
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    productsArray.forEach((product) =>{
        const div = document.createElement("div");
        div.className = classOfDiv;
        div.innerHTML = `
        <div class="${classOfDiv}-img">
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="${classOfDiv}-details">
            <h4><a href="#main">${product.name}</a></h4>
            <div class="price-wishlist">
              <p id="price">Rs ${product.price}</p>
            <button class="wish-btn" id="wish-btn"><b>Wishlist +</b></ion-icon></button>
            </div>
          </div>
          `;
          container.appendChild(div);
    });
}

renderProducts("featured-items","fitem", featuredItems);
renderProducts("dfeatured-items","dfitem",dfeaturedItems);
renderProducts("cfeatured-items","cfitem", cfeaturedItems );