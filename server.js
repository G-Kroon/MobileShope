// Simple server for the mobile shop web app
const http = require('http');
const fs = require('fs');
const path = require('path');

// Port to listen on
const PORT = process.env.PORT || 5000;

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

// Create the HTTP server
const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Handle API requests
    if (req.url.startsWith('/api')) {
        return handleApiRequest(req, res);
    }
    
    // Parse the URL to get the pathname
    let filePath = req.url;
    
    // Default to index.html for root path
    if (filePath === '/' || filePath === '') {
        filePath = '/index.html';
    }
    
    // Get the full path to the file
    filePath = path.join(__dirname, filePath);
    
    // Get the file extension
    const extname = path.extname(filePath);
    
    // Set the content type based on the file extension
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    // Read the file and send the response
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                fs.readFile(path.join(__dirname, '/index.html'), (err, content) => {
                    if (err) {
                        // Something went wrong
                        res.writeHead(500);
                        res.end('Error loading the page');
                    } else {
                        // Return the index.html for SPA routing
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    }
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Handle API requests
function handleApiRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const endpoint = url.pathname;
    
    res.setHeader('Content-Type', 'application/json');
    
    // API endpoints
    if (endpoint === '/api/products' && req.method === 'GET') {
        // Return product data
        res.writeHead(200);
        res.end(JSON.stringify({ 
            success: true,
            products: [] // Would normally fetch from a database
        }));
    } else if (endpoint === '/api/checkout' && req.method === 'POST') {
        // Process checkout
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const checkout = JSON.parse(body);
                
                // Process payment (simulated)
                setTimeout(() => {
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        success: true,
                        orderNumber: generateOrderId(),
                        message: 'Order placed successfully'
                    }));
                }, 1000);
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    success: false,
                    message: 'Invalid request data'
                }));
            }
        });
    } else {
        // Endpoint not found
        res.writeHead(404);
        res.end(JSON.stringify({
            success: false,
            message: 'API endpoint not found'
        }));
    }
}

// Generate a random order ID
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

// Start the server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
