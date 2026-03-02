require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const seedProducts = [
    {
        name: 'Chicken Biryani',
        category: 'Rice',
        price: 180,
        image: '/chicken_biryani.png',
        description: 'Fragrant basmati rice slow-cooked with tender marinated chicken and whole spices.',
        rating: 4.9,
        reviews: 214,
        tag: 'Bestseller',
        isAvailable: true,
    },
    {
        name: 'Beef Kacchi',
        category: 'Rice',
        price: 220,
        image: '/beef_kacchi.png',
        description: 'Traditional Dhaka-style dum biryani with marinated beef and golden potatoes.',
        rating: 4.8,
        reviews: 178,
        tag: 'Special',
        isAvailable: true,
    },
    {
        name: 'Vegetable Khichuri',
        category: 'Rice',
        price: 120,
        image: '/chicken_biryani.png',
        description: 'Earthy comfort food — soft lentil and rice porridge with seasonal vegetables and ghee.',
        rating: 4.6,
        reviews: 93,
        tag: '',
        isAvailable: true,
    },
    {
        name: 'Chicken Curry',
        category: 'Chicken',
        price: 150,
        image: '/chicken_curry.png',
        description: 'Rich spiced chicken simmered in a thick, golden-red onion-tomato gravy.',
        rating: 4.9,
        reviews: 301,
        tag: 'Bestseller',
        isAvailable: true,
    },
    {
        name: 'Grilled Chicken',
        category: 'Chicken',
        price: 200,
        image: '/chicken_curry.png',
        description: 'Smoky marinated half chicken grilled to perfection, served with herb dip.',
        rating: 4.7,
        reviews: 145,
        tag: 'Chef Pick',
        isAvailable: true,
    },
    {
        name: 'Chicken Roast',
        category: 'Chicken',
        price: 190,
        image: '/chicken_curry.png',
        description: 'Bengali-style braised whole chicken in a dark caramelized spice sauce.',
        rating: 4.8,
        reviews: 162,
        tag: '',
        isAvailable: true,
    },
    {
        name: 'Beef Bhuna',
        category: 'Beef',
        price: 240,
        image: '/beef_bhuna.png',
        description: 'Slow-cooked beef chunks in a deeply caramelized, thick masala — rich and hearty.',
        rating: 4.9,
        reviews: 189,
        tag: 'Chef Pick',
        isAvailable: true,
    },
    {
        name: 'Beef Rezala',
        category: 'Beef',
        price: 250,
        image: '/beef_bhuna.png',
        description: 'Mughal-inspired white gravy beef with cardamom, yogurt, and rose water.',
        rating: 4.8,
        reviews: 134,
        tag: 'Special',
        isAvailable: true,
    },
    {
        name: 'Samosa (4 pcs)',
        category: 'Snacks',
        price: 60,
        image: '/snacks_plate.png',
        description: 'Crispy pastry pockets filled with spiced potato & peas — golden and crunchy.',
        rating: 4.7,
        reviews: 256,
        tag: '',
        isAvailable: true,
    },
    {
        name: 'Piyaju Platter',
        category: 'Snacks',
        price: 50,
        image: '/snacks_plate.png',
        description: 'Crunchy lentil fritters with onion and chili — the ultimate teatime snack.',
        rating: 4.6,
        reviews: 198,
        tag: '',
        isAvailable: true,
    },
    {
        name: 'Shemai',
        category: 'Desserts',
        price: 80,
        image: '/shemai_dessert.png',
        description: 'Classic Bengali vermicelli pudding with condensed milk, pistachios, and raisins.',
        rating: 4.8,
        reviews: 112,
        tag: 'Special',
        isAvailable: true,
    },
    {
        name: 'Firni',
        category: 'Desserts',
        price: 70,
        image: '/shemai_dessert.png',
        description: 'Silky ground rice pudding with rose water and cardamom — chilled perfection.',
        rating: 4.7,
        reviews: 87,
        tag: '',
        isAvailable: true,
    },
];

const seedDB = async () => {
    try {
        await connectDB();

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products.');

        // Insert seed data
        const created = await Product.insertMany(seedProducts);
        console.log(`Seeded ${created.length} products successfully!`);

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error.message);
        process.exit(1);
    }
};

seedDB();
