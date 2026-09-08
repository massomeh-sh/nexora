const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    گرفتن لیست علاقه‌مندی‌های کاربر
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'products',
    'name images price discountPrice stock unit brand rating numReviews'
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  res.json({ success: true, data: wishlist });
});

// @desc    افزودن محصول به علاقه‌مندی‌ها
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('محصول یافت نشد');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, products: [] });
  }

  const alreadyExists = wishlist.products.some(
    (p) => p.toString() === productId
  );

  if (!alreadyExists) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  await wishlist.populate(
    'products',
    'name images price discountPrice stock unit brand rating numReviews'
  );

  res.status(201).json({ success: true, data: wishlist });
});

// @desc    حذف محصول از علاقه‌مندی‌ها
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error('لیست علاقه‌مندی‌ها یافت نشد');
  }

  wishlist.products = wishlist.products.filter(
    (p) => p.toString() !== req.params.productId
  );

  await wishlist.save();
  await wishlist.populate(
    'products',
    'name images price discountPrice stock unit brand rating numReviews'
  );

  res.json({ success: true, data: wishlist });
});

// @desc    افزودن/حذف محصول با یک درخواست (toggle)
// @route   POST /api/wishlist/toggle
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('محصول یافت نشد');
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, products: [] });
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
  await wishlist.populate(
    'products',
    'name images price discountPrice stock unit brand rating numReviews'
  );

  res.json({ success: true, inWishlist: !exists, data: wishlist });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
};
