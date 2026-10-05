const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const {setTokenCookie, clearTokenCookie} = require('../utils/tokenCookie');
const sendEmail = require('../utils/sendEmail');
const {
    verificationEmailText,
    resendVerificationEmailText,
    resetPasswordEmailText,
} = require('../utils/emailTemplates');

// @desc    ثبت‌نام کاربر جدید (مشتری یا فروشنده)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, phone, password} = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('لطفا تمام فیلدهای الزامی را پر کنید');
    }

    let user = await User.findOne({email});

    // اگر کاربر وجود داشته باشد
    if (user) {
        // اگر ایمیل قبلا تایید شده باشد، اجازه ثبت‌نام مجدد نمی‌دهیم
        if (user.isVerified) {
            res.status(400);
            throw new Error('کاربری با این ایمیل قبلا ثبت‌نام کرده است');
        }

        // کاربر وجود دارد ولی هنوز ایمیلش را تایید نکرده
        user.name = name;
        user.phone = phone;
        user.password = password;
    } else {
        // کاربر جدید
        user = new User({
            name,
            email,
            phone,
            password,
        });
    }

    // ساخت توکن تایید
    const verificationToken = user.getVerificationToken();

    await user.save({validateBeforeSave: false});

    const verifyUrl = `${process.env.CLIENT_URL}/auth/verify-email/${verificationToken}`;

    try {
        await sendEmail({
            to: user.email,
            subject: 'تایید ایمیل - نکسورا',
            text: verificationEmailText({
                name: user.name,
                verifyUrl
            }),
        });
    } catch (error) {
        console.error('خطای ارسال ایمیل تایید:', error);

        // اگر ارسال ایمیل شکست خورد، توکن را پاک می‌کنیم
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;

        await user.save({validateBeforeSave: false});

        res.status(500);

        const err = new Error(
            'ثبت‌نام انجام شد اما ارسال ایمیل تایید با خطا مواجه شد، لطفا دوباره درخواست ارسال بدهید'
        );

        err.code = 'REGISTER_EMAIL_FAILED';

        throw err;
    }

    res.status(201).json({
        success: true,
        message: 'ثبت‌نام با موفقیت انجام شد. لطفا ایمیل خود را برای تایید حساب بررسی کنید',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
        },
    });
});

// @desc    ورود کاربر
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email}).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        res.status(401);
        throw new Error('ایمیل یا رمز عبور اشتباه است');
    }

    if (!user.isVerified) {
        res.status(403);
        throw new Error('حساب کاربری شما تایید نشده است. لطفا ابتدا ایمیل خود را تایید کنید');
    }

    const token = generateToken(user._id);

    setTokenCookie(res, token);

    res.json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        },
    });
});

// @desc    خروج کاربر (حذف کوکی توکن)
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    clearTokenCookie(res);
    res.json({success: true, message: 'با موفقیت خارج شدید'});
});

// @desc    دریافت اطلاعات کاربر لاگین‌کرده
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({
        success: true, data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        }
    });
});

// @desc    درخواست بازیابی رمز عبور (ارسال ایمیل حاوی لینک)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    // به‌عمد پیام موفقیت یکسان برمی‌گردانیم چه ایمیل وجود داشته باشد چه نه،
    // تا کسی نتواند با این endpoint بفهمد چه ایمیل‌هایی در سیستم ثبت‌نام کرده‌اند
    if (!user) {
        return res.json({
            success: true,
            message: 'اگر این ایمیل در سیستم ثبت‌شده باشد، لینک بازیابی رمز برایش ارسال می‌شود',
        });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave: false});

    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

    try {
        await sendEmail({
            to: user.email,
            subject: 'بازیابی رمز عبور - کارتیفای',
            text: resetPasswordEmailText({resetUrl}),
        });

        res.json({
            success: true,
            message: 'اگر این ایمیل در سیستم ثبت‌شده باشد، لینک بازیابی رمز برایش ارسال می‌شود',
        });
    } catch (error) {
        // اگر ارسال ایمیل شکست خورد، توکن را پاک می‌کنیم تا کاربر بتواند دوباره درخواست بدهد
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});

        res.status(500);
        throw new Error('ارسال ایمیل با خطا مواجه شد، لطفا دوباره تلاش کنید');
    }
});

// @desc    تعیین رمز عبور جدید با توکن دریافتی از ایمیل
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const {password} = req.body;

    if (!password || password.length < 6) {
        res.status(400);
        throw new Error('رمز عبور باید حداقل ۶ کاراکتر باشد');
    }

    // توکن دریافتی از URL را هش می‌کنیم تا با نسخه‌ی ذخیره‌شده در دیتابیس مقایسه شود
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: {$gt: Date.now()},
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
        res.status(400);
        throw new Error('لینک بازیابی نامعتبر یا منقضی‌شده است');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // بعد از تغییر موفق رمز، کاربر را مستقیم لاگین می‌کنیم
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
        success: true,
        message: 'رمز عبور با موفقیت تغییر کرد',
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
        },
    });
});

// @desc    تایید ایمیل کاربر با توکن دریافتی از ایمیل
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        verificationToken: hashedToken,
        verificationTokenExpire: {$gt: Date.now()},
    }).select('+verificationToken +verificationTokenExpire');

    if (!user) {
        res.status(400);
        throw new Error('لینک تایید نامعتبر یا منقضی‌شده است');
    }

    if (user.isVerified) {
        return res.json({
            success: true,
            message: 'حساب کاربری شما قبلا تایید شده است',
        });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({validateBeforeSave: false});

    res.json({
        success: true,
        message: 'ایمیل شما با موفقیت تایید شد. اکنون می‌توانید وارد شوید',
    });
});

// @desc    ارسال مجدد ایمیل تایید (اگر منقضی شده یا نرسیده باشد)
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    // پیام یکسان برمی‌گردانیم چه ایمیل وجود داشته باشد چه نه (مثل forgot-password)
    const genericMessage = 'اگر این ایمیل در سیستم ثبت‌شده و تایید نشده باشد، ایمیل تایید مجددا ارسال می‌شود';

    if (!user || user.isVerified) {
        return res.json({success: true, message: genericMessage});
    }

    const verificationToken = user.getVerificationToken();
    await user.save({validateBeforeSave: false});

    const verifyUrl = `${process.env.CLIENT_URL}/auth/verify-email/${verificationToken}`;

    try {
        await sendEmail({
            to: user.email,
            subject: 'تایید ایمیل - نکسورا',
            text: resendVerificationEmailText({name: user.name, verifyUrl}),
        });

        res.json({success: true, message: genericMessage});
    } catch (error) {
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save({validateBeforeSave: false});

        res.status(500);
        throw new Error('ارسال ایمیل با خطا مواجه شد، لطفا دوباره تلاش کنید');
    }
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
};
