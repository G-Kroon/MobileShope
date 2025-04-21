// Main application script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather icons
    feather.replace();
    
    // Initialize Bootstrap components
    initBootstrapComponents();
    
    // Initialize navigation
    initNavigation();
    
    // Load products
    loadProducts();
    
    // Initialize cart
    initCart();
    
    // Initialize payment
    initPayment();
    
    console.log('Mobile Shop app initialized successfully');
});

// Initialize Bootstrap components
function initBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Initialize toasts
    const toastElList = document.querySelectorAll('.toast');
    const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl));
}

// Initialize navigation
function initNavigation() {
    // Navigation links
    document.getElementById('nav-home').addEventListener('click', () => showScreen('home-screen'));
    document.getElementById('nav-products').addEventListener('click', () => showScreen('products-screen'));
    document.getElementById('nav-orders').addEventListener('click', () => showScreen('orders-screen'));
    
    // Home screen buttons
    document.getElementById('browse-products-btn').addEventListener('click', () => showScreen('products-screen'));
    document.getElementById('new-products-btn').addEventListener('click', () => {
        showScreen('products-screen');
        // Could filter products to show only new ones
    });
    document.getElementById('offers-btn').addEventListener('click', () => {
        showScreen('products-screen');
        // Could filter products to show only offers
    });
    
    // Product detail screen navigation
    document.getElementById('back-to-products').addEventListener('click', () => showScreen('products-screen'));
    
    // Cart screen navigation
    document.getElementById('cart-button').addEventListener('click', () => showScreen('cart-screen'));
    document.getElementById('continue-shopping').addEventListener('click', () => showScreen('products-screen'));
    document.getElementById('proceed-to-checkout').addEventListener('click', () => showScreen('checkout-screen'));
    
    // Order success navigation
    document.getElementById('continue-shopping-success').addEventListener('click', () => showScreen('products-screen'));
    document.getElementById('view-orders').addEventListener('click', () => showScreen('orders-screen'));
    
    // Set home screen as default
    showScreen('home-screen');
}

// Show a specific screen
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.app-screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Show the selected screen
    document.getElementById(screenId).classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Update active nav link
    updateActiveNavLink(screenId);
}

// Update active navigation link
function updateActiveNavLink(screenId) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Set active class based on current screen
    if (screenId === 'home-screen') {
        document.getElementById('nav-home').classList.add('active');
    } else if (screenId === 'products-screen' || screenId === 'product-detail-screen') {
        document.getElementById('nav-products').classList.add('active');
    } else if (screenId === 'orders-screen') {
        document.getElementById('nav-orders').classList.add('active');
    }
}

// Show loading spinner
function showLoading() {
    const overlay = document.createElement('div');
    overlay.classList.add('spinner-overlay');
    overlay.id = 'loading-spinner';
    
    const spinner = document.createElement('div');
    spinner.classList.add('spinner-border', 'text-primary', 'loading-spinner');
    spinner.setAttribute('role', 'status');
    
    const span = document.createElement('span');
    span.classList.add('visually-hidden');
    span.textContent = 'Loading...';
    
    spinner.appendChild(span);
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
}

// Hide loading spinner
function hideLoading() {
    const overlay = document.getElementById('loading-spinner');
    if (overlay) {
        overlay.remove();
    }
}

// Show notification toast
function showNotification(title, message, type = 'success') {
    const toast = document.getElementById('notification-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    
    // Set content
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    // Set color based on type
    toast.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'text-white');
    if (type === 'success') {
        toast.classList.add('bg-success', 'text-white');
    } else if (type === 'error') {
        toast.classList.add('bg-danger', 'text-white');
    } else if (type === 'warning') {
        toast.classList.add('bg-warning');
    }
    
    // Show the toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Generate random order number
function generateOrderNumber() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
}
