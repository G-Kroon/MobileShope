// Payment processing

// Stripe instance
let stripe;
let elements;
let card;

// Initialize payment
function initPayment() {
    // Initialize Stripe (would use your API key in production)
    stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    
    // Initialize Elements
    elements = stripe.elements();
    
    // Create and mount the Card Element
    card = elements.create('card', {
        style: {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        }
    });
    
    // Mount the Card Element when the checkout screen is shown
    document.getElementById('nav-home').addEventListener('click', function() {
        setTimeout(function() {
            try {
                card.unmount();
            } catch (e) {
                // Card not mounted yet, ignore
            }
        }, 300);
    });
    
    document.getElementById('proceed-to-checkout').addEventListener('click', function() {
        setTimeout(function() {
            try {
                card.mount('#card-element');
                
                // Add event listener for card validation
                card.addEventListener('change', function(event) {
                    const displayError = document.getElementById('card-errors');
                    if (event.error) {
                        displayError.textContent = event.error.message;
                    } else {
                        displayError.textContent = '';
                    }
                });
            } catch (e) {
                console.error('Error mounting card:', e);
            }
        }, 300);
    });
    
    // Place order button event listener
    document.getElementById('place-order-btn').addEventListener('click', placeOrder);
}

// Process payment
function placeOrder(event) {
    event.preventDefault();
    
    // Validate the form
    if (!validateCheckoutForm()) {
        return;
    }
    
    showLoading();
    
    // Simulate payment processing
    setTimeout(() => {
        hideLoading();
        
        // Show success screen
        const orderNumber = generateOrderNumber();
        document.getElementById('order-number').textContent = orderNumber;
        
        // Save order to local storage
        saveOrderToHistory(orderNumber);
        
        showScreen('order-success-screen');
    }, 2000);
}

// Validate checkout form
function validateCheckoutForm() {
    // Get form elements
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const country = document.getElementById('country');
    const state = document.getElementById('state');
    const zip = document.getElementById('zip');
    
    // Reset previous errors
    const formElements = [firstName, lastName, email, address, country, state, zip];
    formElements.forEach(element => {
        element.classList.remove('is-invalid');
    });
    
    let isValid = true;
    
    // Validate first name
    if (!firstName.value.trim()) {
        firstName.classList.add('is-invalid');
        isValid = false;
    }
    
    // Validate last name
    if (!lastName.value.trim()) {
        lastName.classList.add('is-invalid');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        email.classList.add('is-invalid');
        isValid = false;
    }
    
    // Validate address
    if (!address.value.trim()) {
        address.classList.add('is-invalid');
        isValid = false;
    }
    
    // Validate country
    if (!country.value) {
        country.classList.add('is-invalid');
        isValid = false;
    }
    
    // Validate state
    if (!state.value.trim()) {
        state.classList.add('is-invalid');
        isValid = false;
    }
    
    // Validate zip
    if (!zip.value.trim()) {
        zip.classList.add('is-invalid');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Error', 'Please fill in all required fields', 'error');
    }
    
    return isValid;
}

// Save order to history
function saveOrderToHistory(orderNumber) {
    // Get existing orders
    let orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    // Add new order
    const newOrder = {
        orderNumber: orderNumber,
        date: new Date().toISOString(),
        items: [...cart.items],
        totalAmount: cart.total,
        status: 'Processing'
    };
    
    orders.push(newOrder);
    
    // Save back to localStorage
    localStorage.setItem('orderHistory', JSON.stringify(orders));
    
    // Update orders screen
    updateOrdersScreen();
}

// Update orders screen
function updateOrdersScreen() {
    const ordersList = document.getElementById('orders-list');
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="alert alert-info">
                You haven't placed any orders yet.
            </div>
        `;
        return;
    }
    
    let ordersHTML = '';
    
    orders.forEach(order => {
        const date = new Date(order.date);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        
        let itemsHTML = '';
        order.items.forEach(item => {
            itemsHTML += `
                <div class="d-flex justify-content-between border-bottom py-2">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>${formatCurrency(item.price * item.quantity)}</span>
                </div>
            `;
        });
        
        ordersHTML += `
            <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Order #${order.orderNumber}</h5>
                    <span class="badge ${getStatusBadgeClass(order.status)}">${order.status}</span>
                </div>
                <div class="card-body">
                    <p class="text-muted">Placed on: ${formattedDate}</p>
                    
                    <div class="mb-3">
                        ${itemsHTML}
                    </div>
                    
                    <div class="d-flex justify-content-between fw-bold">
                        <span>Total</span>
                        <span>${formatCurrency(order.totalAmount)}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-sm btn-outline-primary">View Details</button>
                </div>
            </div>
        `;
    });
    
    ordersList.innerHTML = ordersHTML;
}

// Get status badge class
function getStatusBadgeClass(status) {
    switch (status) {
        case 'Processing':
            return 'bg-warning';
        case 'Shipped':
            return 'bg-info';
        case 'Delivered':
            return 'bg-success';
        case 'Cancelled':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}
