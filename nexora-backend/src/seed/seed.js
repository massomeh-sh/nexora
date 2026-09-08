require('dotenv').config();
const connectDB = require('../config/db');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

const { users, categories, productTemplates, reviewPool } = require('./seedData');

// ساخت ۲ تا ۴ نظر تصادفی فارسی برای یک محصول از بین کاربران نمونه
const generateFakeReviews = (createdUsers) => {
  const reviewCount = Math.floor(Math.random() * 3) + 2; // بین ۲ تا ۴ نظر
  const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
  const chosenUsers = shuffledUsers.slice(0, reviewCount);

  return chosenUsers.map((user) => {
    // بیشتر امتیازها ۴ و ۵ باشه تا واقعی‌تر به نظر برسه
    const ratingsPool = [5, 5, 4, 4, 3];
    const rating = ratingsPool[Math.floor(Math.random() * ratingsPool.length)];
    const comments = reviewPool[rating];
    const comment = comments[Math.floor(Math.random() * comments.length)];

    return {
      user: user._id,
      name: user.name,
      rating,
      comment,
    };
  });
};

const importData = async () => {
  try {
    await connectDB();

    // پاک کردن داده‌های قبلی
    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // ساخت کاربران نمونه (پسورد در مدل هش می‌شود)
    const createdUsers = [];
    for (const u of users) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    // ساخت دسته‌بندی‌ها (اول دسته‌های اصلی، بعد زیردسته‌ها با parent درست)
    const categoryMap = {};

    const topLevelCategories = categories.filter((c) => !c.parentSlug);
    const createdTopLevel = await Category.insertMany(
      topLevelCategories.map((c) => ({ name: c.name, slug: c.slug }))
    );
    createdTopLevel.forEach((c) => {
      categoryMap[c.slug] = c._id;
    });

    const childCategories = categories.filter((c) => c.parentSlug);
    if (childCategories.length > 0) {
      const createdChildren = await Category.insertMany(
        childCategories.map((c) => ({
          name: c.name,
          slug: c.slug,
          parent: categoryMap[c.parentSlug],
        }))
      );
      createdChildren.forEach((c) => {
        categoryMap[c.slug] = c._id;
      });
    }

    // ساخت محصولات فروشگاه به همراه نظرات فیک
    const productsToCreate = productTemplates.map((p) => {
      const reviews = generateFakeReviews(createdUsers);
      const numReviews = reviews.length;
      const rating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / numReviews;

      return {
        category: categoryMap[p.categorySlug],
        name: p.name,
        description: p.description,
        shortDescription: p.shortDescription || '',
        images: p.images || [],
        price: p.price,
        discountPrice: p.discountPrice,
        unit: p.unit,
        stock: p.stock,
        brand: p.brand,
        reviews,
        numReviews,
        rating: Number(rating.toFixed(1)),
      };
    });

    await Product.insertMany(productsToCreate);

    console.log('✅ داده‌های نمونه فارسی (همراه با نظرات فیک) با موفقیت وارد دیتابیس شدند');
    console.log('----------------------------------------');
    console.log('اطلاعات ورود کاربران نمونه:');
    users.forEach((u) => console.log(`${u.name} -> ${u.email} / 123456`));
    console.log('----------------------------------------');
    console.log('برای افزودن/ویرایش محصولات یا دسته‌بندی‌ها، فایل src/seed/seedData.js را ویرایش کن و دوباره seed را اجرا کن،');
    console.log('یا مستقیم از طریق MongoDB Compass / Atlas داده‌ها را تغییر بده.');

    process.exit();
  } catch (error) {
    console.error(`❌ خطا در وارد کردن داده‌ها: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('🗑️ همه داده‌ها حذف شدند');
    process.exit();
  } catch (error) {
    console.error(`❌ خطا در حذف داده‌ها: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
