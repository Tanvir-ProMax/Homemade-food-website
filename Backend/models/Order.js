const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User',
        },
        deliveryDetails: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            orderNote: { type: String },
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                foodId: {
                    type: String,
                    required: true,
                },
            },
        ],
        paymentMethod: {
            type: String,
            required: true,
            enum: ['COD', 'bKash'],
        },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        itemsPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        deliveryFee: {
            type: Number,
            required: true,
            default: 0.0,
        },
        discount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Preparing', 'On Way', 'Delivered', 'Cancelled'],
            default: 'Pending'
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', orderSchema);
