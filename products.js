// Product management script

// Product data (normally this would be fetched from an API)
const PRODUCTS = [
    {
        id: 1,
        name: "Smartphone X",
        price: 699.99,
        description: "Latest smartphone with advanced features and a stunning display.",
        details: "6.5-inch OLED display, Triple camera system, 128GB storage, 8GB RAM, All-day battery life",
        image: "https://cdn-icons-png.flaticon.com/512/3659/3659899.png",
        category: "smartphones",
        inStock: true
    },
    {
        id: 2,
        name: "Wireless Earbuds Pro",
        price: 149.99,
        description: "Premium wireless earbuds with noise cancellation and crystal clear sound.",
        details: "Active noise cancellation, 24-hour battery life with case, Sweat and water resistant, Touch controls",
        image: "https://cdn-icons-png.flaticon.com/512/2933/2933116.png",
        category: "accessories",
        inStock: true
    },
    {
        id: 3,
        name: "Smart Watch Elite",
        price: 249.99,
        description: "Track your fitness and stay connected with this feature-packed smartwatch.",
        details: "Heart rate monitoring, Sleep tracking, GPS, Water resistant, 5-day battery life, Customizable watch faces",
        image: "https://cdn-icons-png.flaticon.com/512/2972/2972531.png",
        category: "wearables",
        inStock: true
    },
    {
        id: 4,
        name: "Tablet Pro 11",
        price: 499.99,
        description: "Powerful tablet for work and entertainment with a stunning display.",
        details: "11-inch Retina display, Powerful processor, 256GB storage, 12MP camera, All-day battery life",
        image: "https://cdn-icons-png.flaticon.com/512/2672/2672346.png",
        category: "tablets",
        inStock: true
    },
    {
        id: 5,
        name: "Bluetooth Speaker",
        price: 79.99,
        description: "Portable Bluetooth speaker with amazing sound quality and long battery life.",
        details: "360° sound, 20-hour battery life, Waterproof, Built-in microphone for calls, Compact design",
        image: "https://cdn-icons-png.flaticon.com/512/2777/2777199.png",
        category: "accessories",
        inStock: true
    },
    {
        id: 6,
        name: "Wireless Charging Pad",
        price: 29.99,
        description: "Fast wireless charging for compatible smartphones and earbuds.",
        details: "15W fast charging, Compatible with Qi-enabled devices, LED indicator, Sleek design",
        image: "https://cdn-icons-png.flaticon.com/512/2953/2953473.png",
        category: "accessories",
        inStock: true
    },
    {
        id: 7,
        name: "Smartphone Y",
        price: 549.99,
        description: "Mid-range smartphone with excellent camera and performance.",
        details: "6.2-inch display, Quad camera system, 64GB storage, 6GB RAM, Fast charging",
        image: "https://cdn-icons-png.flaticon.com/512/545/545245.png",
        category: "smartphones",
        inStock: true
    },
    {
        id: 8,
        name: "Fitness Tracker Band",
        price: 79.99,
        description: "Track your workouts and monitor your health with this comfortable fitness band.",
        details: "Heart rate monitor, Step counter, Sleep tracking, Water resistant, 7-day battery life",
        image: "https://cdn-icons-png.flaticon.com/512/2421/2421097.png",
        category: "wearables",
        inStock: true
    }
];

// Load products into the products screen
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    
    // Clear current products
    productsGrid.innerHTML = '';
    
    // Add each product
    PRODUCTS.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Initialize search and sort functionality
    initProductsSearch();
    initProductsSort();
}

// Create a product card
function createProductCard(product) {
    const col = document.createElement('div');
    col.classList.add('col-md-6', 'col-lg-3', 'mb-4');
    
    col.innerHTML = `
        <div class="card product-card h-100">
            <div class="product-image-container p-3">
                <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text text-truncate">${product.description}</p>
                <div class="mt-auto">
                    <p class="card-text fw-bold">${formatCurrency(product.price)}</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary view-product" data-id="${product.id}">View Details</button>
                        <button class="btn btn-outline-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    col.querySelector('.view-product').addEventListener('click', () => viewProductDetail(product.id));
    col.querySelector('.add-to-cart').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product.id, 1);
        
        // Show add animation
        const card = e.target.closest('.product-card');
        card.classList.add('product-added');
        setTimeout(() => {
            card.classList.remove('product-added');
        }, 1000);
    });
    
    return col;
}

// Initialize product search functionality
function initProductsSearch() {
    const searchInput = document.getElementById('search-products');
    searchInput.addEventListener('input', filterProducts);
}

// Initialize product sort functionality
function initProductsSort() {
    const sortSelect = document.getElementById('sort-products');
    sortSelect.addEventListener('change', filterProducts);
}

// Filter and sort products based on search input and sort selection
function filterProducts() {
    const searchInput = document.getElementById('search-products');
    const sortSelect = document.getElementById('sort-products');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const sortOption = sortSelect.value;
    
    // Filter products based on search term
    let filteredProducts = PRODUCTS.filter(product => {
        return product.name.toLowerCase().includes(searchTerm) ||
               product.description.toLowerCase().includes(searchTerm) ||
               product.category.toLowerCase().includes(searchTerm);
    });
    
    // Sort filtered products
    if (sortOption === 'price-low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Update products grid
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted">No products found matching your search criteria.</p>
            </div>
        `;
    } else {
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }
}

// View product detail
function viewProductDetail(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Error', 'Product not found', 'error');
        return;
    }
    
    const productDetailContent = document.getElementById('product-detail-content');
    
    productDetailContent.innerHTML = `
        <div class="row">
            <div class="col-md-5 mb-4">
                <div class="card">
                    <div class="product-image-container p-5">
                        <img src="${product.image}" class="img-fluid product-image" alt="${product.name}">
                    </div>
                </div>
            </div>
            <div class="col-md-7">
                <h2 class="mb-3">${product.name}</h2>
                <p class="fs-4 fw-bold text-primary mb-3">${formatCurrency(product.price)}</p>
                <p class="mb-4">${product.description}</p>
                
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Product Details</h5>
                    </div>
                    <div class="card-body">
                        <p>${product.details}</p>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label for="product-quantity" class="form-label">Quantity</label>
                    <div class="input-group mb-3" style="max-width: 150px;">
                        <button class="btn btn-outline-secondary" type="button" id="quantity-minus">-</button>
                        <input type="number" class="form-control text-center" id="product-quantity" value="1" min="1" max="10">
                        <button class="btn btn-outline-secondary" type="button" id="quantity-plus">+</button>
                    </div>
                </div>
                
                <div class="d-grid gap-2 d-md-flex mb-4">
                    <button class="btn btn-primary btn-lg flex-grow-1" id="add-to-cart-detail" data-id="${product.id}">
                        Add to Cart
                    </button>
                    <button class="btn btn-success btn-lg flex-grow-1" id="buy-now-detail" data-id="${product.id}">
                        Buy Now
                    </button>
                </div>
                
                <div class="alert alert-info d-flex align-items-center" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-info-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                    </svg>
                    <div>
                        Free shipping on orders over $50!
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners
    const quantityInput = document.getElementById('product-quantity');
    document.getElementById('quantity-minus').addEventListener('click', () => {
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });
    
    document.getElementById('quantity-plus').addEventListener('click', () => {
        if (quantityInput.value < 10) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        }
    });
    
    document.getElementById('add-to-cart-detail').addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        addToCart(product.id, quantity);
        showNotification('Added to Cart', `${product.name} (${quantity}) added to your cart`, 'success');
    });
    
    document.getElementById('buy-now-detail').addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        addToCart(product.id, quantity, true);
        showScreen('cart-screen');
    });
    
    showScreen('product-detail-screen');
}

// Get product by ID
function getProductById(productId) {
    return PRODUCTS.find(product => product.id === productId);
}
