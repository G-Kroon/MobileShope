// Shopping cart management

// Cart data structure
let cart = {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
};

// Initialize cart
function initCart() {
    // Load cart from localStorage if available
    loadCart();
    
    // Update cart display
    updateCartDisplay();
    
    // Initialize cart event handlers
    document.getElementById('continue-shopping').addEventListener('click', () => showScreen('products-screen'));
    document.getElementById('proceed-to-checkout').addEventListener('click', proceedToCheckout);
    document.getElementById('place-order-btn').addEventListener('click', placeOrder);
    
    // Order completed events
    document.getElementById('continue-shopping-success').addEventListener('click', () => {
        clearCart();
        showScreen('products-screen');
    });
    
    document.getElementById('view-orders').addEventListener('click', () => {
        clearCart();
        showScreen('orders-screen');
    });
}

// Add product to cart
function addToCart(productId, quantity = 1, clearCartFirst = false) {
    // Get product details
    const product = getProductById(productId);
    
    if (!product) {
        showNotification('Error', 'Product not found', 'error');
        return;
    }
    
    // Clear cart if needed (for Buy Now functionality)
    if (clearCartFirst) {
        cart.items = [];
    }
    
    // Check if product is already in cart
    const existingItem = cart.items.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // Update cart calculations
    updateCartCalculations();
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart display
    updateCartDisplay();
    
    // Show notification
    if (!clearCartFirst) {
        showNotification('Added to Cart', `${product.name} added to your cart`, 'success');
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart.items = cart.items.filter(item => item.id !== productId);
    
    // Update cart calculations
    updateCartCalculations();
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart display
    updateCartDisplay();
    
    // Show notification
    showNotification('Removed from Cart', 'Item removed from your cart', 'success');
}

// Update item quantity in cart
function updateCartItemQuantity(productId, quantity) {
    // Find the item
    const item = cart.items.find(item => item.id === productId);
    
    if (!item) return;
    
    // Update quantity
    item.quantity = parseInt(quantity);
    
    // Remove item if quantity is 0
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    // Update cart calculations
    updateCartCalculations();
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart display
    updateCartDisplay();
}

// Update cart calculations (subtotal, tax, shipping, total)
function updateCartCalculations() {
    // Calculate subtotal
    cart.subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate tax (assume 8%)
    cart.tax = cart.subtotal * 0.08;
    
    // Calculate shipping (free shipping over $50, otherwise $5.99)
    cart.shipping = cart.subtotal > 50 ? 0 : 5.99;
    
    // Calculate total
    cart.total = cart.subtotal + cart.tax + cart.shipping;
    
    // Update cart count in navbar
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    
    cartCount.textContent = totalItems;
    
    // Show/hide count badge
    if (totalItems > 0) {
        cartCount.style.display = 'inline-block';
    } else {
        cartCount.style.display = 'none';
    }
}

// Update cart display
function updateCartDisplay() {
    // Update cart items display
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.items.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="alert alert-info">
                Your cart is empty. <a href="#" onclick="showScreen('products-screen'); return false;">Continue shopping</a>
            </div>
        `;
        
        // Hide checkout button
        document.getElementById('proceed-to-checkout').style.display = 'none';
    } else {
        let cartItemsHTML = '';
        
        cart.items.forEach(item => {
            cartItemsHTML += `
                <div class="cart-item">
                    <div class="row align-items-center">
                        <div class="col-2 col-md-1">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid cart-item-image">
                        </div>
                        <div class="col-5 col-md-6">
                            <h5 class="mb-0">${item.name}</h5>
                            <p class="text-muted mb-0">${formatCurrency(item.price)} each</p>
                        </div>
                        <div class="col-3 col-md-3">
                            <div class="input-group input-group-sm">
                                <button class="btn btn-outline-secondary decrease-quantity" type="button" data-id="${item.id}">-</button>
                                <input type="number" class="form-control text-center cart-quantity" value="${item.quantity}" min="1" max="10" data-id="${item.id}">
                                <button class="btn btn-outline-secondary increase-quantity" type="button" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <div class="col-2 col-md-2 text-end">
                            <div class="d-flex flex-column align-items-end">
                                <span>${formatCurrency(item.price * item.quantity)}</span>
                                <button class="btn btn-sm text-danger remove-item mt-2" data-id="${item.id}">
                                    <i data-feather="trash-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartItemsHTML;
        
        // Initialize feather icons
        feather.replace();
        
        // Add event listeners
        const decreaseButtons = document.querySelectorAll('.decrease-quantity');
        const increaseButtons = document.querySelectorAll('.increase-quantity');
        const quantityInputs = document.querySelectorAll('.cart-quantity');
        const removeButtons = document.querySelectorAll('.remove-item');
        
        decreaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                const item = cart.items.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    updateCartItemQuantity(id, item.quantity - 1);
                }
            });
        });
        
        increaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                const item = cart.items.find(item => item.id === id);
                if (item && item.quantity < 10) {
                    updateCartItemQuantity(id, item.quantity + 1);
                }
            });
        });
        
        quantityInputs.forEach(input => {
            input.addEventListener('change', () => {
                const id = parseInt(input.getAttribute('data-id'));
                updateCartItemQuantity(id, input.value);
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
        
        // Show checkout button
        document.getElementById('proceed-to-checkout').style.display = 'block';
    }
    
    // Update cart summary
    updateCartSummary();
    
    // Update checkout summary
    updateCheckoutSummary();
}

// Update cart summary
function updateCartSummary() {
    const cartSummary = document.getElementById('cart-summary');
    
    if (cart.items.length === 0) {
        cartSummary.innerHTML = '';
        return;
    }
    
    cartSummary.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Order Summary</h5>
                <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>${formatCurrency(cart.subtotal)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Tax (8%)</span>
                    <span>${formatCurrency(cart.tax)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span>${cart.shipping === 0 ? 'FREE' : formatCurrency(cart.shipping)}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>${formatCurrency(cart.total)}</span>
                </div>
                ${cart.shipping === 0 ? 
                  '<div class="mt-2 text-success"><small><i data-feather="check-circle" class="feather-sm"></i> Free shipping applied</small></div>' : 
                  `<div class="mt-2 text-muted"><small>Add ${formatCurrency(50 - cart.subtotal)} more for free shipping</small></div>`
                }
            </div>
        </div>
    `;
    
    // Initialize feather icons
    feather.replace();
}

// Update checkout summary
function updateCheckoutSummary() {
    const checkoutSummary = document.getElementById('checkout-summary');
    
    if (cart.items.length === 0) {
        return;
    }
    
    let itemsHTML = '';
    cart.items.forEach(item => {
        itemsHTML += `
            <div class="d-flex justify-content-between mb-2">
                <span>${item.name} × ${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `;
    });
    
    checkoutSummary.innerHTML = `
        ${itemsHTML}
        <hr>
        <div class="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <span>${formatCurrency(cart.subtotal)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span>Tax (8%)</span>
            <span>${formatCurrency(cart.tax)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span>Shipping</span>
            <span>${cart.shipping === 0 ? 'FREE' : formatCurrency(cart.shipping)}</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between fw-bold">
            <span>Total</span>
            <span>${formatCurrency(cart.total)}</span>
        </div>
    `;
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.items.length === 0) {
        showNotification('Error', 'Your cart is empty', 'error');
        return;
    }
    
    showScreen('checkout-screen');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error parsing cart data:', e);
            cart = {
                items: [],
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0
            };
        }
    }
}

// Clear cart
function clearCart() {
    cart = {
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0
    };
    
    saveCart();
    updateCartDisplay();
}
