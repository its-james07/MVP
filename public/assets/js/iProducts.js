const featuredItems = [
    {name: "Monge Adult Food", price: 2200, image: "../assets/images/dogProducts/dog-chain.png", wishlist: false},
    {name: "Monge Puppy Dog", price: 3200, image: "../assets/images/dogProducts/collar.png", wishlist: false},
    {name: "Drools Balls", price: 2200, image: "../assets/images/dogProducts/play-balls.png", wishlist: false},
    {name: "Fur scrubber", price: 1200, image: "../assets/images/dogProducts/cleaner.png", wishlist: false},
    {name: "Fur scrubber", price: 1200, image: "../assets/images/dogProducts/cleaner.png", wishlist: false} 
];

const dfeaturedItems = [
    {name: "Monge Adult Food", price: 2200, image: "../assets/images/dogProducts/biscuit.png", wishlist: false},
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
            <div class="price-action">
              <p id="price">Rs ${product.price}</p>
            <button class="view-btn"><b>View Product</b></ion-icon></button>
            </div>
          </div>
          `;
          container.appendChild(div);
    });
}

// function renderProducts(containerId, columnClass, productsArray) {
//   const container = document.getElementById(containerId);
//   container.innerHTML = "";

//   productsArray.forEach(product => {
//     const col = document.createElement("div");
//     col.className = columnClass; 

//     col.innerHTML = `
//       <div class="card h-100">

//         <!-- Product image -->
//         <img 
//           src="${product.image}" 
//           class="card-img-top" 
//           alt="${product.name}"
//           style="height: 250px; object-fit: cover;"
//         />

//         <!-- Product details -->
//         <div class="card-body">
//           <div class="text-center">
//             <h5 class="fw-bolder">${product.name}</h5>
//             <span class="price">Price Rs ${product.price}</span>
//           </div>
//         </div>

//         <!-- Product actions -->
//         <div class="card-footer py-2 bg-transparent border-top-0">
//           <div class="text-center">
//             <a class="btn btn-sm btn-outline-dark" href="#">
//               View Product
//             </a>
//           </div>
//         </div>

//       </div>
//     `;

//     container.appendChild(col);
//   });
// }


renderProducts("featured-items","fitem", featuredItems);
renderProducts("dfeatured-items","dfitem",dfeaturedItems);
renderProducts("cfeatured-items","cfitem", cfeaturedItems );
renderProducts("product-items", "pitem", featuredItems);