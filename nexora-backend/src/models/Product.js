const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'وارد کردن نام محصول الزامی است'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'وارد کردن توضیحات محصول الزامی است'],
    },
    shortDescription: {
      type: String,
      default: '',
      maxlength: [120, 'توضیح کوتاه نباید بیشتر از ۱۲۰ کاراکتر باشد'],
    },
    images: [{ type: String }],
    price: {
      type: Number,
      required: [true, 'وارد کردن قیمت الزامی است'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    unit: {
      // واحد فروش مثل کیلوگرم، بسته، عدد
      type: String,
      default: 'عدد',
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    brand: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
