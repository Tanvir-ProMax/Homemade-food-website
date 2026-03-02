const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');

// POST /api/orders — create order (guests allowed, attaches user if logged in)
router.post('/', optionalAuth, addOrderItems);

// GET /api/orders/:id — view order by ID (public for tracking page)
router.get('/:id', getOrderById);

// PUT /api/orders/:id/status — update status (requires authentication)
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
