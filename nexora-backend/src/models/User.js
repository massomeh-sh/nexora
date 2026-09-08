const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'وارد کردن نام الزامی است'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'وارد کردن ایمیل الزامی است'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'وارد کردن رمز عبور الزامی است'],
            minlength: 6,
            select: false,
        },
        address: {
            province: { type: String, trim: true },
            city: { type: String, trim: true },
            detail: { type: String, trim: true },
            postalCode: { type: String, trim: true },
        },
        resetPasswordToken: {
            type: String,
            select: false,
        },
        resetPasswordExpire: {
            type: Date,
            select: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            select: false,
        },
        verificationTokenExpire: {
            type: Date,
            select: false,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

// ساخت توکن بازیابی رمز عبور: نسخه خام برمی‌گردد (برای ایمیل)
// و نسخه هش‌شده در دیتابیس ذخیره می‌شود (برای امنیت بیشتر)
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // ۱۰ دقیقه

    return resetToken;
};

// ساخت توکن تایید ایمیل: نسخه خام برمی‌گردد (برای ایمیل)
// و نسخه هش‌شده در دیتابیس ذخیره می‌شود (برای امنیت بیشتر)
userSchema.methods.getVerificationToken = function () {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    this.verificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // ۲۴ ساعت

    return verificationToken;
};

module.exports = mongoose.model('User', userSchema);
