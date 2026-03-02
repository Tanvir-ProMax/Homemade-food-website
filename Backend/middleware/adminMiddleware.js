const User = require('../models/User');

// @desc    Protect routes - only admin can access
// @access  Private
const adminProtect = async (req, res, next) => {
    try {
        // Get user from request (set by authMiddleware)
        const user = await User.findById(req.user.id);

        // Check if user exists and is admin
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // User is admin, proceed to next middleware
        req.admin = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { adminProtect };
