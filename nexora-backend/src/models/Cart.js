const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
    price: {
        // قیمت لحظه‌ی افزودن به سبد (برای جلوگیری از تغییر ناگهانی قیمت)
        type: Number,
        required: true,
    },
    variantId: {type: mongoose.Schema.Types.ObjectId, default: null},
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
    },
    {timestamps: true}
);

module.exports = mongoose.model('Cart', cartSchema);
