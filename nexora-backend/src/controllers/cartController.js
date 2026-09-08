const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    گرفتن سبد خرید کاربر
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name images price stock unit'
  );

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json({ success: true, data: cart });
});

// @desc    افزودن محصول به سبد خرید
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('محصول یافت نشد');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error('موجودی محصول کافی نیست');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  if (existingItem) {
    existingItem.quantity += Number(quantity) || 1;
  } else {
    cart.items.push({
      product: productId,
      quantity: Number(quantity) || 1,
      price: effectivePrice,
    });
  }

  await cart.save();
  await cart.populate('items.product', 'name images price stock unit');

  res.status(201).json({ success: true, data: cart });
});

// @desc    بروزرسانی تعداد یک آیتم در سبد خرید
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

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
    item.quantity = quantity;
  }

  await cart.save();
  await cart.populate('items.product', 'name images price stock unit');

  res.json({ success: true, data: cart });
});

// @desc    حذف آیتم از سبد خرید
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('سبد خرید یافت نشد');
  }

  cart.items = cart.items.filter(
    (item) => item._id.toString() !== req.params.itemId
  );

  await cart.save();
  res.json({ success: true, data: cart });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
