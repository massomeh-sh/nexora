const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const POPULATE_FIELDS =
    'name images price shortDescription description discountPrice stock unit variants';

// ---------- Helpers ----------

// تبدیل ورودی به عدد صحیح؛ در غیر این صورت NaN
const parseQuantity = (value) => {
    const q = Number(value);
    return Number.isInteger(q) ? q : NaN;
};

// اگه تعداد بیشتر از موجودی باشه خطا می‌ده
const assertStock = (res, product, quantity) => {
    if (product.stock < quantity) {
        res.status(400);
        throw new Error(
            product.stock === 0
                ? 'این محصول موجود نیست'
                : `موجودی محصول کافی نیست (حداکثر ${product.stock} عدد)`
        );
    }
};

const getEffectivePrice = (product) =>
    product.discountPrice > 0 ? product.discountPrice : product.price;

// @desc    گرفتن سبد خرید کاربر
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({user: req.user._id}).populate(
        'items.product',
        POPULATE_FIELDS
    );

    if (!cart) {
        cart = await Cart.create({user: req.user._id, items: []});
    }

    res.json({success: true, data: cart});
});

// @desc    افزودن محصول به سبد خرید
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
    const {productId, variantId} = req.body;
    const quantity = parseQuantity(req.body.quantity ?? 1);

    if (!productId || !mongoose.isValidObjectId(productId)) {
        res.status(400);
        throw new Error('شناسه محصول نامعتبر است');
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        res.status(400);
        throw new Error('تعداد نامعتبر است');
    }

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('محصول یافت نشد');
    }

    // اگر محصول رنگ‌بندی دارد، رنگ الزامی و باید داخل همین محصول باشد
    let variant = null;
    if (product.variants.length > 0) {
        if (!variantId || !mongoose.isValidObjectId(variantId)) {
            res.status(400);
            throw new Error('انتخاب رنگ الزامی است');
        }
        variant = product.variants.id(variantId);
        if (!variant) {
            res.status(400);
            throw new Error('رنگ انتخاب‌شده معتبر نیست');
        }
    }

    let cart = await Cart.findOne({user: req.user._id});
    if (!cart) {
        cart = new Cart({user: req.user._id, items: []});
    }

    // آیتم تکراری = همان محصول + همان رنگ
    const existingItem = cart.items.find(
        (item) =>
            item.product.toString() === String(productId) &&
            String(item.variantId ?? '') === String(variant?._id ?? '')
    );

    const effectivePrice = getEffectivePrice(product);

    const newQuantity = quantity;
    // موجودی رنگ انتخاب‌شده، وگرنه موجودی کل محصول
    assertStock(res, {...product.toObject(), stock: variant ? variant.stock : product.stock}, newQuantity);

    if (existingItem) {
        existingItem.quantity = newQuantity;
        existingItem.price = effectivePrice;
    } else {
        cart.items.push({
            product: productId,
            variantId: variant?._id ?? null,
            quantity,
            price: effectivePrice,
        });
    }

    await cart.save();
    await cart.populate('items.product', POPULATE_FIELDS);

    res.status(201).json({success: true, data: cart});
});

// @desc    بروزرسانی تعداد یک آیتم در سبد خرید
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
    const quantity = parseQuantity(req.body.quantity);

    if (!Number.isInteger(quantity)) {
        res.status(400);
        throw new Error('تعداد نامعتبر است');
    }

    const cart = await Cart.findOne({user: req.user._id});
    if (!cart) {
        res.status(404);
        throw new Error('سبد خرید یافت نشد');
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
        res.status(404);
        throw new Error('آیتم مورد نظر در سبد خرید یافت نشد');
    }

    if (quantity <= 0) {
        item.deleteOne();
    } else {
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error('محصول یافت نشد');
        }
        assertStock(res, product, quantity);
        item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', POPULATE_FIELDS);

    res.json({success: true, data: cart});
});

// @desc    حذف آیتم از سبد خرید
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({user: req.user._id});

    if (!cart) {
        res.status(404);
        throw new Error('سبد خرید یافت نشد');
    }

    cart.items = cart.items.filter(
        (item) => item._id.toString() !== req.params.itemId
    );

    await cart.save();
    res.json({success: true, data: cart});
});

// @desc    ادغام سبد خرید مهمان با سبد کاربر
// @route   POST /api/cart/merge
// @access  Private
const mergeCart = asyncHandler(async (req, res) => {
    const {items} = req.body;

    if (!Array.isArray(items)) {
        res.status(400);
        throw new Error('آیتم‌های سبد خرید نامعتبر هستند');
    }

    let cart = await Cart.findOne({user: req.user._id});
    if (!cart) {
        cart = new Cart({user: req.user._id, items: []});
    }

    for (const localItem of items) {
        const productId = localItem.product?._id;
        if (!productId || !mongoose.isValidObjectId(productId)) continue;

        const product = await Product.findById(productId);
        if (!product || product.stock < 1) continue; // محصول ناموجود اضافه نشه

        const existingItem = cart.items.find(
            (item) => item.product.toString() === String(productId)
        );

        const effectivePrice = getEffectivePrice(product);
        const quantity = Math.max(parseQuantity(localItem.quantity) || 1, 1);

        if (existingItem) {
            existingItem.quantity = Math.min(
                existingItem.quantity + quantity,
                product.stock
            );
            existingItem.price = effectivePrice;
        } else {
            cart.items.push({
                product: product._id,
                quantity: Math.min(quantity, product.stock),
                price: effectivePrice,
            });
        }
    }

    await cart.save();
    await cart.populate('items.product', POPULATE_FIELDS);

    res.json({success: true, data: cart});
});

// @desc    خالی کردن کامل سبد خرید
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({user: req.user._id});

    if (!cart) {
        res.status(404);
        throw new Error('سبد خرید یافت نشد');
    }

    cart.items = [];

    await cart.save();

    res.json({success: true, data: cart});
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    mergeCart,
    clearCart,
};