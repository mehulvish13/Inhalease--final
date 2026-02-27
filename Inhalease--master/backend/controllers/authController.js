const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { findUserByEmail, createUser } = require('../db/store');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, location } = req.body;

        const userExists = findUserByEmail(email);

        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = createUser({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            location
        });

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    firstName: user.firstName,
                    email: user.email,
                    location: user.location,
                    token: generateToken(user._id)
                }
            });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = findUserByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    firstName: user.firstName,
                    email: user.email,
                    location: user.location,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
