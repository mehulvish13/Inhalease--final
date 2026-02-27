const jwt = require('jsonwebtoken');
const { findUserById } = require('../db/store');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            const user = findUserById(decoded.id);
            if (!user) {
                return res.status(401).json({ success: false, error: 'Not authorized, user not found' });
            }

            const { password, ...safeUser } = user;
            req.user = safeUser;

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ success: false, error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }
};

module.exports = { protect };
