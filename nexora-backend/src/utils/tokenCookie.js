// تنظیم کوکی httpOnly برای توکن احراز هویت
// این کوکی از طریق جاوااسکریپت قابل خواندن نیست، پس در برابر XSS محافظت‌شده است
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction, // در تولید فقط روی HTTPS ارسال شود
    sameSite: isProduction ? 'none' : 'lax', // برای cross-site در پروڈاکشن، lax برای توسعه محلی کافی است
    maxAge: 7 * 24 * 60 * 60 * 1000, // ۷ روز (هم‌راستا با JWT_EXPIRES_IN پیش‌فرض)
  });
};

const clearTokenCookie = (res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
};

module.exports = { setTokenCookie, clearTokenCookie };
