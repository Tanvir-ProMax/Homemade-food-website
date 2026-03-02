const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a product name'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            enum: ['Rice', 'Chicken', 'Beef', 'Snacks', 'Desserts'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            min: 0,
        },
        image: {
            type: String,
            required: [true, 'Please add an image URL'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviews: {
            type: Number,
            default: 0,
            min: 0,
        },
        tag: {
            type: String,
            enum: ['', 'Bestseller', 'Special', 'Chef Pick'],
            default: '',
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', productSchema);
