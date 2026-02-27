// API Configuration 
const config = {
    // Use same-origin API when served by Node; fall back for file://
    API_BASE_URL: window.location.protocol === 'file:'
        ? 'http://localhost:5000/api'
        : `${window.location.origin}/api`,
};

// Expose configuration globally
window.AppConfig = config;
