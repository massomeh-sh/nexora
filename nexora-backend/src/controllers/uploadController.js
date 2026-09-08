const asyncHandler = require('express-async-handler');

// @desc    آپلود یک یا چند عکس محصول و گرفتن لینک آن‌ها
// @route   POST /api/upload
// @access  Public (چون نقش ادمین/فروشنده نداریم)
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('هیچ فایلی ارسال نشده است');
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const urls = req.files.map((file) => `${baseUrl}/uploads/${file.filename}`);

  res.status(201).json({
    success: true,
    message: 'عکس‌ها با موفقیت آپلود شدند',
    data: urls,
  });
});

module.exports = { uploadImages };
