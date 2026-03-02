const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getAdminStats,
    updateOrderStatus,
    cancelOrder,
    getAllUsers,
    toggleUserAdmin,
    deleteUser,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProductsAdmin,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const adminProtect = require('../middleware/adminMiddleware');

// All admin routes require authentication AND admin role
router.use(protect);
router.use(adminProtect);

// ── Stats ────────────────────────────────────────────────
router.get('/stats', getAdminStats);

// ── Orders ───────────────────────────────────────────────
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', cancelOrder);

// ── Users ────────────────────────────────────────────────
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-admin', toggleUserAdmin);
router.delete('/users/:id', deleteUser);

// ── Products ─────────────────────────────────────────────
router.get('/products', getAllProductsAdmin);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
