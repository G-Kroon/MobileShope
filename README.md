# MobileShop

This is a comprehensive Mobile Shop web application built with vanilla JavaScript, HTML, and CSS, using Bootstrap for styling. Here's a detailed breakdown:

## Architecture:

Server: A simple Node.js HTTP server (server.js) handling static files and API endpoints
Frontend: Single Page Application (SPA) architecture with multiple screens
Data: Uses localStorage for cart persistence and simulated product data
Key Features:  

## Product Management:
Product catalog with search and sort functionality
Detailed product views with images and descriptions
Categories including smartphones, accessories, wearables, and tablets
Price filtering and name-based sorting  
## Shopping Cart:
Add/remove items
Quantity adjustment
Cart persistence using localStorage
Free shipping on orders over $50
Tax calculation (8%)
Real-time total calculation  
## Checkout System:
Shipping information collection
Payment processing (integrated with Stripe)
Order confirmation
Order history tracking  
## User Interface:
Responsive design using Bootstrap
Clean navigation system
Toast notifications for user feedback
Loading spinners for async operations
Product image animations  
## Screens:
### Home: Welcome banner and featured sections
### Products: Grid view with search/filter
### Product Detail: Comprehensive product information
### Cart: Item management and totals
### Checkout: Payment and shipping forms
### Orders: Order history and tracking
### Order Success: Confirmation page  
### Technical Implementation:  

Modular JavaScript architecture (separate files for products, cart, payment)
RESTful API endpoints (/api/products, /api/checkout)
Client-side routing
Error handling and validation
Responsive image handling
MIME type support for various static assets  
The application runs on port 5000 and is configured for production deployment through Replit's infrastructure. It demonstrates a complete e-commerce flow from browsing products to completing purchases.
