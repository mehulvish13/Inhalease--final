const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);
if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variable(s): ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend assets from backend/public
const frontendDir = path.join(__dirname, 'public');
app.use(express.static(frontendDir));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/aqi', require('./routes/aqiRoutes'));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendDir, 'index.html'));
});

// Basic Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
