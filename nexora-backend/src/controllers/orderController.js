const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    ثبت سفارش جدید بر اساس سبد خرید فعلی
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product'
  );

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('سبد خرید شما خالی است');
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images?.[0] || '',
    quantity: item.quantity,
    price: item.price,
  }));

  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 1000000 ? 0 : 50000; // بالای ۱۰۰ هزار تومان ارسال رایگان
  const totalPrice = itemsPrice + shippingPrice;

  // کم کردن موجودی محصولات
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  // خالی کردن سبد خرید بعد از ثبت سفارش
  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, data: order });
});

// @desc    گرفتن سفارش‌های کاربر لاگین‌کرده
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ success: true, count: orders.length, data: orders });
});

// @desc    گرفتن جزئیات یک سفارش
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('سفارش یافت نشد');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('شما اجازه مشاهده این سفارش را ندارید');
  }

  res.json({ success: true, data: order });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
};
