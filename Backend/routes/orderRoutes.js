const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, updateOrderStatus } = require('../controllers/orderController');
// Optional: import { protect } from '../middleware/authMiddleware' if you want orders to be strictly authenticated

router.post('/', addOrderItems);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
