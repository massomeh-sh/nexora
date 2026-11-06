const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

const catchAsync = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const pick = (obj, fields) =>
    fields.reduce((acc, f) => (obj[f] !== undefined ? { ...acc, [f]: obj[f] } : acc), {});

const ADDRESS_FIELDS = ['receiverName', 'receiverPhone', 'province', 'city', 'detail', 'postalCode', 'isDefault'];

// ---------- حساب کاربری ----------

// GET /api/users/me
exports.getMe = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
});

// PUT /api/users/me
exports.updateMe = catchAsync(async (req, res) => {
    const updates = pick(req.body, ['name', 'phone']);
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
    });
    res.json({ success: true, user });
});

// PUT /api/users/me/password
exports.changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد' });
    }
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
        return res.status(400).json({ success: false, message: 'رمز عبور فعلی اشتباه است' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'رمز عبور تغییر کرد' });
});

// ---------- خلاصه فعالیت‌ها ----------

// GET /api/users/me/summary
exports.getSummary = catchAsync(async (req, res) => {
    const rows = await Order.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const byStatus = rows.reduce((acc, r) => ({ ...acc, [r._id]: r.count }), {});
    const n = (s) => byStatus[s] || 0;

    const user = await User.findById(req.user._id).select('wishlist');

    res.json({
        success: true,
        summary: {
            ordersInProgress: n('pending') + n('processing') + n('shipped'),
            ordersDelivered: n('delivered'),
            ordersCancelled: n('cancelled'),
            ordersReturned: n('returned'),
            wishlistCount: user.wishlist.length,
        },
    });
});

// ---------- نظرهای من ----------

// GET /api/users/me/reviews
exports.getMyReviews = catchAsync(async (req, res) => {
    const count = (f) => ({
        $cond: [{ $isArray: f }, { $size: f }, { $ifNull: [f, 0] }],
    });

    const reviews = await Product.aggregate([
        { $match: { 'reviews.user': req.user._id } },
        { $unwind: '$reviews' },
        { $match: { 'reviews.user': req.user._id } },
        {
            $project: {
                _id: '$reviews._id',
                productId: '$_id',
                productName: '$name',
                productImage: { $ifNull: [{ $arrayElemAt: ['$images', 0] }, '$image'] },
                rating: '$reviews.rating',
                comment: '$reviews.comment',
                isAnonymous: '$reviews.isAnonymous',
                likes: count('$reviews.likes'),
                dislikes: count('$reviews.dislikes'),
                createdAt: '$reviews.createdAt',
            },
        },
        { $sort: { createdAt: -1 } },
    ]);

    res.json({ success: true, reviews });
});

// ---------- آدرس‌ها ----------

// GET /api/users/me/addresses
exports.getAddresses = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ success: true, addresses: user.addresses });
});

// POST /api/users/me/addresses
exports.addAddress = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const data = pick(req.body, ADDRESS_FIELDS);

    if (user.addresses.length === 0) data.isDefault = true;
    if (data.isDefault) user.addresses.forEach((a) => (a.isDefault = false));

    user.addresses.push(data);
    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
});

// PUT /api/users/me/addresses/:addressId
exports.updateAddress = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ success: false, message: 'آدرس پیدا نشد' });

    const data = pick(req.body, ADDRESS_FIELDS);
    if (data.isDefault) user.addresses.forEach((a) => (a.isDefault = false));

    address.set(data);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
});

// DELETE /api/users/me/addresses/:addressId
exports.deleteAddress = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (!address) return res.status(404).json({ success: false, message: 'آدرس پیدا نشد' });

    const wasDefault = address.isDefault;
    user.addresses.pull(req.params.addressId);
    if (wasDefault && user.addresses.length > 0) user.addresses[0].isDefault = true;

    await user.save();
    res.json({ success: true, addresses: user.addresses });
});

// ---------- علاقه‌مندی‌ها ----------

// GET /api/users/me/wishlist
exports.getWishlist = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
});

// POST /api/users/me/wishlist/:productId  (اگر بود حذف، اگر نبود اضافه)
exports.toggleWishlist = catchAsync(async (req, res) => {
    const { productId } = req.params;
    if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({ success: false, message: 'شناسه محصول نامعتبر است' });
    }

    const user = await User.findById(req.user._id);
    const exists = user.wishlist.some((id) => id.toString() === productId);
    if (exists) user.wishlist.pull(productId);
    else user.wishlist.push(productId);

    await user.save();
    res.json({ success: true, added: !exists, wishlist: user.wishlist });
});