const Product = require('../models/Product');

// @desc    Get all available products (public)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const filter = { isAvailable: true };

        // Optional category filter
        if (req.query.category && req.query.category !== 'All') {
            filter.category = req.query.category;
        }

        // Optional search
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filter.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { category: searchRegex },
            ];
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a product (admin)
// @route   POST /api/admin/products
// @access  Private (Admin)
const createProduct = async (req, res) => {
    try {
        const { name, category, price, image, description, rating, reviews, tag, isAvailable } = req.body;

        if (!name || !category || price === undefined || !image || !description) {
            return res.status(400).json({ message: 'Please provide name, category, price, image, and description' });
        }

        const product = await Product.create({
            name,
            category,
            price,
            image,
            description,
            rating: rating || 0,
            reviews: reviews || 0,
            tag: tag || '',
            isAvailable: isAvailable !== undefined ? isAvailable : true,
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a product (admin)
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a product (admin)
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all products including unavailable (admin)
// @route   GET /api/admin/products
// @access  Private (Admin)
const getAllProductsAdmin = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProductsAdmin,
};
