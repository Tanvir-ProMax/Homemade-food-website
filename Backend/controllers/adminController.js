const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// ═══════════════════════════════════════════════════════════════
// ORDER MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// @desc    Get all orders (admin) with optional search and filter
// @route   GET /api/admin/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
    try {
        const filter = {};

        // Filter by status
        if (req.query.status && req.query.status !== 'All') {
            filter.status = req.query.status;
        }

        // Search by customer name, phone, or order ID
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filter.$or = [
                { 'deliveryDetails.fullName': searchRegex },
                { 'deliveryDetails.phone': searchRegex },
            ];
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get order statistics (admin)
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const preparingOrders = await Order.countDocuments({ status: 'Preparing' });
        const onWayOrders = await Order.countDocuments({ status: 'On Way' });
        const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
        const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

        // Calculate total revenue (only delivered orders)
        const deliveredOrderDocs = await Order.find({ status: 'Delivered' });
        const totalRevenue = deliveredOrderDocs.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

        // Get counts
        const customers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const availableProducts = await Product.countDocuments({ isAvailable: true });

        // Recent orders (last 5)
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            totalOrders,
            pendingOrders,
            preparingOrders,
            onWayOrders,
            deliveredOrders,
            cancelledOrders,
            totalRevenue,
            customers,
            totalProducts,
            availableProducts,
            recentOrders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Please provide status' });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const validStatuses = ['Pending', 'Preparing', 'On Way', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        order.status = status;

        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        if (status === 'Cancelled') {
            order.cancelledAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Cancel order (admin)
// @route   DELETE /api/admin/orders/:id
// @access  Private (Admin)
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = 'Cancelled';
        order.cancelledAt = Date.now();

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ═══════════════════════════════════════════════════════════════
// USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Toggle user admin status
// @route   PUT /api/admin/users/:id/toggle-admin
// @access  Private (Admin)
const toggleUserAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent self-demotion
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ message: 'You cannot change your own admin status' });
        }

        user.isAdmin = !user.isAdmin;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent self-deletion
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }

        // Prevent deleting other admins
        if (user.isAdmin) {
            return res.status(400).json({ message: 'Cannot delete admin users' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ═══════════════════════════════════════════════════════════════
// PRODUCT MANAGEMENT (admin wrappers)
// ═══════════════════════════════════════════════════════════════

const {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProductsAdmin,
} = require('../controllers/productController');

module.exports = {
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
};
