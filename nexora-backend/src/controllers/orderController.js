const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

const getEffectivePrice = (product) =>
    product.discountPrice > 0 ? product.discountPrice : product.price;

// برگردوندن موجودی محصولاتی که قبلاً کم شدن
const restoreStock = async (reserved) => {
  await Promise.all(
      reserved.map((r) =>
          Product.updateOne({ _id: r.product }, { $inc: { stock: r.quantity } })
      )
  );
};

// برگردوندن آیتم‌های سبد در صورت شکست ثبت سفارش
const restoreCart = async (userId, items) => {
  if (!items.length) return;
  await Cart.updateOne(
      { user: userId },
      { $push: { items: { $each: items } } }
  );
};

// @desc    ثبت سفارش جدید بر اساس سبد خرید فعلی
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error('آدرس ارسال و روش پرداخت الزامی است');
  }

  // سبد رو به‌صورت atomic "برمی‌داریم" و خالی می‌کنیم؛
  // اگه دو درخواست هم‌زمان بیاد فقط یکی‌شون سبد پر پیدا می‌کنه
  const cart = await Cart.findOneAndUpdate(
      { user: req.user._id, 'items.0': { $exists: true } },
      { $set: { items: [] } },
      { new: false }
  ).populate('items.product');

  if (!cart) {
    res.status(400);
    throw new Error('سبد خرید شما خالی است');
  }

  const originalItems = cart.items.map((item) => ({
    product: item.product?._id || item.product,
    quantity: item.quantity,
    price: item.price,
  }));

  const reserved = []; // آیتم‌هایی که موجودی‌شون کم شده

  try {
    // محصول حذف‌شده
    if (cart.items.some((item) => !item.product)) {
      res.status(400);
      throw new Error('یکی از محصولات سبد خرید دیگر موجود نیست');
    }

    // قیمت از DB خونده می‌شه، نه از snapshot قدیمی سبد
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || '',
      quantity: item.quantity,
      price: getEffectivePrice(item.product),
    }));

    // کم کردن atomic موجودی: فقط اگه stock کافی باشه کم می‌شه
    for (const item of cart.items) {
      const result = await Product.updateOne(
          { _id: item.product._id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } }
      );

      if (result.modifiedCount === 0) {
        res.status(400);
        throw new Error(`موجودی محصول «${item.product.name}» کافی نیست`);
      }

      reserved.push({ product: item.product._id, quantity: item.quantity });
    }

    const itemsPrice = orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const shippingPrice = itemsPrice > 1000000 ? 0 : 50000; // بالای ۱۰۰ هزار تومان ارسال رایگان
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    // هر خطایی: موجودی و سبد به حالت اول برگردن
    await restoreStock(reserved).catch((e) =>
        console.error('restoreStock failed:', e)
    );
    await restoreCart(req.user._id, originalItems).catch((e) =>
        console.error('restoreCart failed:', e)
    );
    throw error;
  }
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