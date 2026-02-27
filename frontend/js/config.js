// API Configuration for Netlify + Render Hybrid Deployment
const config = {
    // For Netlify deployment, point to Render backend
    // Update REACT_APP_API_URL with your actual Render backend URL
    API_BASE_URL: window.location.protocol === 'file:'
        ? 'http://localhost:5000/api'
        : (process.env.REACT_APP_API_URL || `${window.location.origin.replace('https://inhaleease', 'https://inhaleease-node-backend')}/api`),
};

// Auto-detect backend URL for production
if (window.location.hostname && window.location.hostname.includes('netlify.app')) {
    // Use Render backend URL for Netlify hosted frontend
    config.API_BASE_URL = 'https://inhaleease-node-backend.onrender.com/api';
} else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Local development
    config.API_BASE_URL = 'http://localhost:5000/api';
}

// Expose configuration globally
window.AppConfig = config;
console.log('API Config:', config.API_BASE_URL);
