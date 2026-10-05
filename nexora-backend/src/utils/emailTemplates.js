// این فایل فقط متن ساده‌ای که در ایمیل کاربر قرار می‌گیرد را می‌سازد.
// هیچ HTML یا طراحی‌ای اینجا نیست — رابط کاربری کامل (صفحه‌ی verify-email و reset-password)
// در فرانت‌اند خودتان با روت‌های اختصاصی پیاده‌سازی می‌شود. ایمیل فقط لینک را می‌رساند.

const verificationEmailText = ({name, verifyUrl}) =>
    `سلام ${name}،

برای فعال‌سازی حساب کاربری خود در نکسورا، روی لینک زیر کلیک کنید (تا ۲۴ ساعت معتبر است):
${verifyUrl}

اگر این ثبت‌نام را شما انجام نداده‌اید، این ایمیل را نادیده بگیرید.`;

const resendVerificationEmailText = ({name, verifyUrl}) =>
    `سلام ${name}،

لینک تایید ایمیل شما (تا ۲۴ ساعت معتبر است):
${verifyUrl}`;

const resetPasswordEmailText = ({resetUrl}) =>
    `برای تعیین رمز عبور جدید، روی لینک زیر کلیک کنید (تا ۱۰ دقیقه معتبر است):
${resetUrl}

اگر این درخواست را شما نداده‌اید، این ایمیل را نادیده بگیرید.`;

module.exports = {
    verificationEmailText,
    resendVerificationEmailText,
    resetPasswordEmailText,
};
