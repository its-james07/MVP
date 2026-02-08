// ==================== SAMPLE PRODUCT DATA ====================
const productsData = [
    {
        id: 1,
        name: "Premium Dog Food - Chicken & Rice",
        category: "dog",
        type: "food",
        price: 1250,
        originalPrice: 1500,
        image: "../assets/images/dog-food.jpg",
        rating: 4.5,
        reviews: 128,
        badge: "sale",
        brand: "pedigree",
        inStock: true
    },
    {
        id: 2,
        name: "Interactive Cat Toy Ball",
        category: "cat",
        type: "toys",
        price: 450,
        originalPrice: null,
        image: "../assets/images/cat-toy.jpg",
        rating: 4.2,
        reviews: 89,
        badge: "new",
        brand: "whiskas",
        inStock: true
    },
    {
        id: 3,
        name: "Adjustable Dog Collar - Leather",
        category: "dog",
        type: "accessories",
        price: 800,
        originalPrice: 950,
        image: "../assets/images/collar.png",
        rating: 4.7,
        reviews: 245,
        badge: null,
        brand: "royal-canin",
        inStock: true
    },
    {
        id: 4,
        name: "Aquarium Fish Food Flakes",
        category: "fish",
        type: "food",
        price: 320,
        originalPrice: null,
        image: "../assets/images/fish-food.jpg",
        rating: 4.0,
        reviews: 56,
        badge: null,
        brand: "purina",
        inStock: true
    },
    {
        id: 5,
        name: "Bird Cage with Stand",
        category: "bird",
        type: "accessories",
        price: 3500,
        originalPrice: 4200,
        image: "../assets/images/bird-cage.jpg",
        rating: 4.6,
        reviews: 42,
        badge: "sale",
        brand: "pedigree",
        inStock: true
    },
    {
        id: 6,
        name: "Cat Scratching Post Tower",
        category: "cat",
        type: "accessories",
        price: 2100,
        originalPrice: null,
        image: "../assets/images/cat-scratch.jpg",
        rating: 4.8,
        reviews: 312,
        badge: "new",
        brand: "whiskas",
        inStock: true
    },
    {
        id: 7,
        name: "Dog Grooming Kit - Professional",
        category: "dog",
        type: "grooming",
        price: 1850,
        originalPrice: 2200,
        image: "../assets/images/grooming-kit.jpg",
        rating: 4.4,
        reviews: 167,
        badge: "sale",
        brand: "royal-canin",
        inStock: true
    },
    {
        id: 8,
        name: "Hamster Exercise Wheel",
        category: "small-pets",
        type: "toys",
        price: 550,
        originalPrice: null,
        image: "../assets/images/hamster-wheel.jpg",
        rating: 4.1,
        reviews: 73,
        badge: null,
        brand: "purina",
        inStock: false
    },
    {
        id: 9,
        name: "Premium Cat Litter - Odor Control",
        category: "cat",
        type: "health",
        price: 680,
        originalPrice: 750,
        image: "../assets/images/cat-litter.jpg",
        rating: 4.5,
        reviews: 198,
        badge: null,
        brand: "whiskas",
        inStock: true
    },
    {
        id: 10,
        name: "Dog Chew Toys Set of 5",
        category: "dog",
        type: "toys",
        price: 950,
        originalPrice: null,
        image: "../assets/images/chew-toys.jpg",
        rating: 4.3,
        reviews: 289,
        badge: "new",
        brand: "pedigree",
        inStock: true
    },
    {
        id: 11,
        name: "Bird Seed Mix - Premium Blend",
        category: "bird",
        type: "food",
        price: 420,
        originalPrice: null,
        image: "../assets/images/bird-seed.jpg",
        rating: 4.2,
        reviews: 91,
        badge: null,
        brand: "purina",
        inStock: true
    },
    {
        id: 12,
        name: "Automatic Pet Feeder",
        category: "dog",
        type: "accessories",
        price: 2800,
        originalPrice: 3200,
        image: "../assets/images/auto-feeder.jpg",
        rating: 4.6,
        reviews: 156,
        badge: "sale",
        brand: "royal-canin",
        inStock: true
    }
];

// ==================== STATE MANAGEMENT ====================
let state = {
    products: [...productsData],
    filteredProducts: [...productsData],
    currentPage: 1,
    productsPerPage: 9,
    filters: {
        category: 'all',
        type: 'all',
        minPrice: null,
        maxPrice: null,
        search: '',
        availability: [],
        brand: [],
        rating: []
    },
    sortBy: '',
    viewMode: 'grid'
};

// ==================== DOM ELEMENTS ====================
const elements = {
    productGrid: document.getElementById('product-grid'),
    loadingSpinner: document.getElementById('loading-spinner'),
    noResults: document.getElementById('no-results'),
    resultsCount: document.getElementById('results-count'),
    categoryBtns: document.querySelectorAll('.catg-btn'),
    typeBtns: document.querySelectorAll('.type-btn'),
    sortSelect: document.getElementById('sort-price'),
    searchInput: document.getElementById('search-input'),
    minPriceInput: document.getElementById('min-price'),
    maxPriceInput: document.getElementById('max-price'),
    applyPriceBtn: document.getElementById('apply-price'),
    viewBtns: document.querySelectorAll('.view-btn'),
    prevPageBtn: document.getElementById('prev-page'),
    nextPageBtn: document.getElementById('next-page'),
    pageNumbers: document.getElementById('page-numbers'),
    mobileFilterBtn: document.getElementById('mobile-filter-btn'),
    filters: document.getElementById('filters'),
    activeFiltersContainer: document.getElementById('active-filters'),
    filterTags: document.getElementById('filter-tags'),
    clearFiltersBtn: document.getElementById('clear-filters'),
    resetSidebarBtn: document.getElementById('reset-sidebar')
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadProducts();
});

function initializeEventListeners() {
    // Category filters
    elements.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => handleCategoryClick(btn));
    });

    // Type filters
    elements.typeBtns.forEach(btn => {
        btn.addEventListener('click', () => handleTypeClick(btn));
    });

    // Sort
    elements.sortSelect.addEventListener('change', handleSort);

    // Search
    elements.searchInput?.addEventListener('input', debounce(handleSearch, 300));

    // Price filter
    elements.applyPriceBtn.addEventListener('click', handlePriceFilter);

    // View toggle
    elements.viewBtns.forEach(btn => {
        btn.addEventListener('click', () => handleViewToggle(btn));
    });

    // Pagination
    elements.prevPageBtn.addEventListener('click', () => changePage(state.currentPage - 1));
    elements.nextPageBtn.addEventListener('click', () => changePage(state.currentPage + 1));

    // Mobile filter toggle
    elements.mobileFilterBtn?.addEventListener('click', toggleMobileFilters);

    // Clear filters
    elements.clearFiltersBtn?.addEventListener('click', clearAllFilters);
    elements.resetSidebarBtn?.addEventListener('click', resetSidebarFilters);

    // Sidebar checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
}

// ==================== PRODUCT LOADING & RENDERING ====================
function loadProducts() {
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        applyFilters();
        hideLoading();
    }, 500);
}

function renderProducts() {
    const startIndex = (state.currentPage - 1) * state.productsPerPage;
    const endIndex = startIndex + state.productsPerPage;
    const productsToShow = state.filteredProducts.slice(startIndex, endIndex);

    if (productsToShow.length === 0) {
        elements.noResults.style.display = 'block';
        elements.productGrid.innerHTML = '';
        updateResultsCount(0);
        updatePagination();
        return;
    }

    elements.noResults.style.display = 'none';
    elements.productGrid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
    updateResultsCount(state.filteredProducts.length);
    updatePagination();
    attachProductEventListeners();
}

function createProductCard(product) {
    const discountPercent = product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='../assets/images/placeholder.jpg'">
                ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge === 'sale' ? `-${discountPercent}%` : 'New'}</span>` : ''}
                <button class="wishlist-btn" data-id="${product.id}">
                    <i class="bi bi-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${generateStars(product.rating)}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-footer">
                    <div class="product-price">
                        <span class="current-price">Rs ${product.price}</span>
                        ${product.originalPrice ? `<span class="original-price">Rs ${product.originalPrice}</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                        <i class="bi bi-cart-plus"></i>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '⭐';
    }
    if (hasHalfStar) {
        stars += '⭐';
    }
    
    return stars;
}

function attachProductEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        });
    });

    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            toggleWishlist(productId);
        });
    });

    // Product cards (navigate to detail page)
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.productId;
            // Navigate to product detail page
            // window.location.href = `product-detail.html?id=${productId}`;
            console.log('Navigate to product:', productId);
        });
    });
}

// ==================== FILTERING ====================
function handleCategoryClick(btn) {
    elements.categoryBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.filters.category = btn.dataset.category;
    state.currentPage = 1;
    applyFilters();
}

function handleTypeClick(btn) {
    elements.typeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.filters.type = btn.dataset.type;
    state.currentPage = 1;
    applyFilters();
}

function handleSearch(e) {
    state.filters.search = e.target.value.toLowerCase();
    state.currentPage = 1;
    applyFilters();
}

function handlePriceFilter() {
    const min = parseInt(elements.minPriceInput.value) || null;
    const max = parseInt(elements.maxPriceInput.value) || null;
    
    state.filters.minPrice = min;
    state.filters.maxPrice = max;
    state.currentPage = 1;
    applyFilters();
}

function handleCheckboxChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    
    if (e.target.checked) {
        state.filters[name].push(value);
    } else {
        state.filters[name] = state.filters[name].filter(v => v !== value);
    }
    
    state.currentPage = 1;
    applyFilters();
}

function applyFilters() {
    let filtered = [...state.products];

    // Category filter
    if (state.filters.category !== 'all') {
        filtered = filtered.filter(p => p.category === state.filters.category);
    }

    // Type filter
    if (state.filters.type !== 'all') {
        filtered = filtered.filter(p => p.type === state.filters.type);
    }

    // Search filter
    if (state.filters.search) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(state.filters.search)
        );
    }

    // Price filter
    if (state.filters.minPrice !== null) {
        filtered = filtered.filter(p => p.price >= state.filters.minPrice);
    }
    if (state.filters.maxPrice !== null) {
        filtered = filtered.filter(p => p.price <= state.filters.maxPrice);
    }

    // Availability filter
    if (state.filters.availability.includes('in-stock')) {
        filtered = filtered.filter(p => p.inStock);
    }
    if (state.filters.availability.includes('on-sale')) {
        filtered = filtered.filter(p => p.originalPrice !== null);
    }

    // Brand filter
    if (state.filters.brand.length > 0) {
        filtered = filtered.filter(p => state.filters.brand.includes(p.brand));
    }

    // Rating filter
    if (state.filters.rating.length > 0) {
        const minRating = Math.min(...state.filters.rating.map(r => parseInt(r)));
        filtered = filtered.filter(p => p.rating >= minRating);
    }

    state.filteredProducts = filtered;
    applySorting();
    updateActiveFilters();
}

// ==================== SORTING ====================
function handleSort(e) {
    state.sortBy = e.target.value;
    applySorting();
}

function applySorting() {
    let sorted = [...state.filteredProducts];

    switch (state.sortBy) {
        case 'low-high':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'high-low':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name-az':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-za':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'newest':
            sorted.sort((a, b) => b.id - a.id);
            break;
        default:
            // Keep original order
            break;
    }

    state.filteredProducts = sorted;
    renderProducts();
}

// ==================== VIEW TOGGLE ====================
function handleViewToggle(btn) {
    elements.viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const view = btn.dataset.view;
    state.viewMode = view;
    
    if (view === 'list') {
        elements.productGrid.classList.add('list-view');
    } else {
        elements.productGrid.classList.remove('list-view');
    }
}

// ==================== PAGINATION ====================
function changePage(page) {
    const totalPages = Math.ceil(state.filteredProducts.length / state.productsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    state.currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePagination() {
    const totalPages = Math.ceil(state.filteredProducts.length / state.productsPerPage);
    
    // Update prev/next buttons
    elements.prevPageBtn.disabled = state.currentPage === 1;
    elements.nextPageBtn.disabled = state.currentPage === totalPages || totalPages === 0;
    
    // Update page numbers
    elements.pageNumbers.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= state.currentPage - 1 && i <= state.currentPage + 1)
        ) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === state.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => changePage(i));
            elements.pageNumbers.appendChild(pageBtn);
        } else if (
            i === state.currentPage - 2 ||
            i === state.currentPage + 2
        ) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '0 0.5rem';
            elements.pageNumbers.appendChild(dots);
        }
    }
}

// ==================== ACTIVE FILTERS ====================
function updateActiveFilters() {
    const activeTags = [];
    
    if (state.filters.category !== 'all') {
        activeTags.push({ type: 'category', value: state.filters.category });
    }
    if (state.filters.type !== 'all') {
        activeTags.push({ type: 'type', value: state.filters.type });
    }
    if (state.filters.minPrice || state.filters.maxPrice) {
        activeTags.push({ 
            type: 'price', 
            value: `Rs ${state.filters.minPrice || 0} - ${state.filters.maxPrice || '∞'}` 
        });
    }
    if (state.filters.search) {
        activeTags.push({ type: 'search', value: state.filters.search });
    }
    
    if (activeTags.length > 0) {
        elements.activeFiltersContainer.style.display = 'flex';
        elements.filterTags.innerHTML = activeTags.map(tag => `
            <div class="filter-tag">
                <span>${tag.value}</span>
                <button onclick="removeFilter('${tag.type}')">×</button>
            </div>
        `).join('');
    } else {
        elements.activeFiltersContainer.style.display = 'none';
    }
}

function removeFilter(type) {
    switch (type) {
        case 'category':
            state.filters.category = 'all';
            elements.categoryBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === 'all');
            });
            break;
        case 'type':
            state.filters.type = 'all';
            elements.typeBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.type === 'all');
            });
            break;
        case 'price':
            state.filters.minPrice = null;
            state.filters.maxPrice = null;
            elements.minPriceInput.value = '';
            elements.maxPriceInput.value = '';
            break;
        case 'search':
            state.filters.search = '';
            elements.searchInput.value = '';
            break;
    }
    applyFilters();
}

function clearAllFilters() {
    state.filters = {
        category: 'all',
        type: 'all',
        minPrice: null,
        maxPrice: null,
        search: '',
        availability: [],
        brand: [],
        rating: []
    };
    
    elements.categoryBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === 'all');
    });
    elements.typeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === 'all');
    });
    elements.minPriceInput.value = '';
    elements.maxPriceInput.value = '';
    elements.searchInput.value = '';
    elements.sortSelect.value = '';
    
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    applyFilters();
}

function resetSidebarFilters() {
    state.filters.availability = [];
    state.filters.brand = [];
    state.filters.rating = [];
    
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    applyFilters();
}

// ==================== MOBILE FILTERS ====================
function toggleMobileFilters() {
    elements.filters.classList.toggle('show');
}

// ==================== CART & WISHLIST ====================
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    // Add to cart logic here
    console.log('Added to cart:', product);
    showToast(`${product.name} added to cart!`, 'success');
    
    // Update cart badge
    updateCartBadge();
}

function toggleWishlist(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    // Toggle wishlist logic here
    console.log('Toggle wishlist:', product);
    showToast(`${product.name} added to wishlist!`, 'success');
    
    // Update wishlist badge
    updateWishlistBadge();
}

function updateCartBadge() {
    // Update cart count - placeholder
    const count = 0; // Get from localStorage or state
    document.querySelectorAll('[id$="cart-badge"]').forEach(badge => {
        badge.textContent = count;
    });
}

function updateWishlistBadge() {
    // Update wishlist count - placeholder
    const count = 0; // Get from localStorage or state
    document.querySelectorAll('[id$="wish-badge"]').forEach(badge => {
        badge.textContent = count;
    });
}

// ==================== UTILITY FUNCTIONS ====================
function updateResultsCount(count) {
    elements.resultsCount.innerHTML = `Showing <strong>${count}</strong> product${count !== 1 ? 's' : ''}`;
}

function showLoading() {
    elements.loadingSpinner.style.display = 'flex';
    elements.productGrid.style.display = 'none';
}

function hideLoading() {
    elements.loadingSpinner.style.display = 'none';
    elements.productGrid.style.display = 'grid';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}