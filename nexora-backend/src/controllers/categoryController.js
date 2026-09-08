const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// @desc    گرفتن همه دسته‌بندی‌ها
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json({ success: true, count: categories.length, data: categories });
});

module.exports = { getCategories };
