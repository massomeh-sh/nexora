const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

const POPULATE_FIELDS =
    'name images price discountPrice stock unit brand rating numReviews description shortDescription variants';

// @desc    گرفتن لیست علاقه‌مندی‌های کاربر
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    let wishlist = await Wishlist.findOne({user: req.user._id}).populate(
        'products',
        POPULATE_FIELDS
    );

    if (!wishlist) {
        wishlist = await Wishlist.create({user: req.user._id, products: []});
    }

    res.json({success: true, data: wishlist});
});

// @desc    افزودن محصول به علاقه‌مندی‌ها
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const {productId} = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('محصول یافت نشد');
    }

    let wishlist = await Wishlist.findOne({user: req.user._id});
    if (!wishlist) {
        wishlist = new Wishlist({user: req.user._id, products: []});
    }

    const alreadyExists = wishlist.products.some(
        (p) => p.toString() === productId
    );

    if (!alreadyExists) {
        wishlist.products.push(productId);
        await wishlist.save();
    }

    await wishlist.populate('products', POPULATE_FIELDS);

    res.status(201).json({success: true, data: wishlist});
});

// @desc    حذف محصول از علاقه‌مندی‌ها
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({user: req.user._id});

    if (!wishlist) {
        res.status(404);
        throw new Error('لیست علاقه‌مندی‌ها یافت نشد');
    }

    wishlist.products = wishlist.products.filter(
        (p) => p.toString() !== req.params.productId
    );

    await wishlist.save();
    await wishlist.populate('products', POPULATE_FIELDS);

    res.json({success: true, data: wishlist});
});

// @desc    افزودن/حذف محصول با یک درخواست (toggle)
// @route   POST /api/wishlist/toggle
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
    const {productId} = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('محصول یافت نشد');
    }

    let wishlist = await Wishlist.findOne({user: req.user._id});
    if (!wishlist) {
        wishlist = new Wishlist({user: req.user._id, products: []});
    }

    const exists = wishlist.products.some((p) => p.toString() === productId);

    if (exists) {
        wishlist.products = wishlist.products.filter(
            (p) => p.toString() !== productId
        );
    } else {
        wishlist.products.push(productId);
    }

    await wishlist.save();
    await wishlist.populate('products', POPULATE_FIELDS);

    res.json({success: true, data: wishlist});
});

// @desc    ادغام لیست علاقه‌مندی‌های لوکال با لیست کاربر بعد از لاگین
// @route   POST /api/wishlist/merge
// @access  Private
const mergeWishlist = asyncHandler(async (req, res) => {
    const {items} = req.body;

    if (!Array.isArray(items)) {
        res.status(400);
        throw new Error('آیتم‌های علاقه‌مندی‌ها نامعتبر هستند');
    }

    let wishlist = await Wishlist.findOne({user: req.user._id});
    if (!wishlist) {
        wishlist = new Wishlist({user: req.user._id, products: []});
    }

    for (const localItem of items) {
        // پشتیبانی از چند ساختار احتمالی: رشته خام، {productId}, یا {product: {_id}}
        const productId =
            typeof localItem === 'string'
                ? localItem
                : localItem._id || localItem.product?._id || localItem.productId;

        if (!productId) {
            continue;
        }

        const product = await Product.findById(productId);
        if (!product) {
            continue;
        }

        const alreadyExists = wishlist.products.some(
            (p) => p.toString() === productId
        );

        if (!alreadyExists) {
            wishlist.products.push(productId);
        }
    }

    await wishlist.save();
    await wishlist.populate('products', POPULATE_FIELDS);

    res.json({success: true, data: wishlist});
});

// @desc    حذف تمام محصولات از علاقه‌مندی‌ها
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({user: req.user._id});

    if (!wishlist) {
        res.status(404);
        throw new Error('لیست علاقه‌مندی‌ها یافت نشد');
    }

    wishlist.products = [];

    await wishlist.save();

    res.json({
        success: true,
        data: wishlist
    });
});

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    mergeWishlist,
    clearWishlist
};
