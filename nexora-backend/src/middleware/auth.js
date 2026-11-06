const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// بررسی توکن و احراز هویت کاربر
// توکن از کوکی httpOnly خوانده می‌شود (نه از هدر Authorization)
const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401);
        throw new Error('توکنی ارسال نشده، دسترسی غیرمجاز');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            res.status(401);
            throw new Error('کاربر یافت نشد، دسترسی غیرمجاز');
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error('توکن نامعتبر است، دسترسی غیرمجاز');
    }
});


const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    res.status(403);
    throw new Error('دسترسی فقط برای ادمین مجاز است');
};

module.exports = {protect, admin};
