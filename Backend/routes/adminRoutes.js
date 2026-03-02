const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getAdminStats,
    updateOrderStatus,
    cancelOrder,
    getAllUsers,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const adminProtect = require('../middleware/adminMiddleware');

// All admin routes require authentication AND admin role
router.use(protect); // User must be logged in
router.use(adminProtect); // User must be admin

// @desc    Get all orders
// @route   GET /api/admin/orders
router.get('/orders', getAllOrders);

// @desc    Get admin statistics
// @route   GET /api/admin/stats
router.get('/stats', getAdminStats);

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', updateOrderStatus);

// @desc    Cancel order
// @route   DELETE /api/admin/orders/:id
router.delete('/orders/:id', cancelOrder);

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', getAllUsers);

module.exports = router;
