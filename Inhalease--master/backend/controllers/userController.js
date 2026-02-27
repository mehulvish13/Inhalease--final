const bcrypt = require('bcryptjs');
const { findUserById, updateUser } = require('../db/store');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = findUserById(req.user._id);

        if (user) {
            res.json({
                success: true,
                data: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    location: user.location
                }
            });
        } else {
            res.status(404).json({ success: false, error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const user = findUserById(req.user._id);

        if (user) {
            const updates = {
                firstName: req.body.firstName || user.firstName,
                lastName: req.body.lastName || user.lastName,
                location: req.body.location || user.location
            };

            if (req.body.password) {
                updates.password = await bcrypt.hash(req.body.password, 10);
            }

            const updatedUser = updateUser(user._id, updates);

            res.json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    location: updatedUser.location
                }
            });
        } else {
            res.status(404).json({ success: false, error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
