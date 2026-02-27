// API Configuration
// After deploying backend to Render, update RENDER_BACKEND_URL below with your actual URL
const RENDER_BACKEND_URL = 'https://inhalease-backend-3z8j.onrender.com';

const config = {};

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') {
    config.API_BASE_URL = 'http://localhost:5000/api';
} else {
    config.API_BASE_URL = RENDER_BACKEND_URL + '/api';
}

// Expose configuration globally
window.AppConfig = config;
console.log('API Config:', config.API_BASE_URL);
