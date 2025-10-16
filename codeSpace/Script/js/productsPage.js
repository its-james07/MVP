const cfeaturedItems = [
  {name: "Monge Adult Dog Food", price: 2200, image: "../assets/images/catProducts/cat-wear.png", wishlist: false},
  {name: "Monge Puppy Dog", price: 3200, image: "../assets/images/catProducts/fish-doll.png", wishlist: false},
  {name: "Drools Balls", price: 2200, image: "../assets/images/catProducts/frog-mask.png", wishlist: false},
  {name: "Fur Scrubber", price: 1200, image: "../assets/images/dogProducts/cleaner.png", wishlist: false},
  {name: "Pedigree Biscrok", price: 2010, image: "../assets/images/dogProducts/play-balls.png", wishlist: false},
  {name: "Whiskas Tuna Treats", price: 1800, image: "../assets/images/catProducts/fish-doll.png", wishlist: false},
  {name: "Me-O Cat Litter", price: 950, image: "../assets/images/catProducts/cat-wear.png", wishlist: false},
  {name: "Purina Pro Plan", price: 3300, image: "../assets/images/dogProducts/cleaner.png", wishlist: false},
  {name: "Smart Chicken Mix", price: 2600, image: "../assets/images/catProducts/frog-mask.png", wishlist: false},
  {name: "Catnip Mouse Toy", price: 700, image: "../assets/images/dogProducts/play-balls.png", wishlist: false},
  {name: "Drools Kitten Food", price: 2400, image: "../assets/images/catProducts/fish-doll.png", wishlist: false},
  {name: "Pedigree Gravy Pouch", price: 1100, image: "../assets/images/dogProducts/cleaner.png", wishlist: false},
  {name: "Whiskas Salmon Mix", price: 2100, image: "../assets/images/catProducts/cat-wear.png", wishlist: false},
  {name: "Cat Grooming Brush", price: 800, image: "../assets/images/dogProducts/play-balls.png", wishlist: false},
  {name: "Pet Paw Cleaner", price: 1300, image: "../assets/images/dogProducts/cleaner.png", wishlist: false},
  {name: "Feline Collar Set", price: 1500, image: "../assets/images/catProducts/frog-mask.png", wishlist: false},
  {name: "Drools Puppy Starter", price: 3200, image: "../assets/images/catProducts/fish-doll.png", wishlist: false},
  {name: "Whiskas Crunchy Bites", price: 1800, image: "../assets/images/dogProducts/play-balls.png", wishlist: false},
  {name: "Cat Blanket", price: 2100, image: "../assets/images/catProducts/cat-wear.png", wishlist: false},
  {name: "Dog Rope Toy", price: 950, image: "../assets/images/dogProducts/cleaner.png", wishlist: false}
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
            <button class="wish-btn"><b>Wishlist +</b></ion-icon></button>
            </div>
          </div>
          `;
          container.appendChild(div);
    });
}

renderProducts("cfeatured-items", "cfitem", cfeaturedItems);