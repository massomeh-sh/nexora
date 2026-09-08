const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const {notFound, errorHandler} = require('./src/middleware/errorHandler');

// اتصال به دیتابیس
connectDB();

const app = express();

// نکته مهم: وقتی از کوکی استفاده می‌کنیم، origin باید دقیق مشخص باشد (نه '*')
// و credentials باید true باشد تا مرورگر اجازه‌ی ارسال/دریافت کوکی بین دامنه‌ها را بدهد
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// دسترسی عمومی به عکس‌های آپلودشده
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// روت‌ها
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/categories', require('./src/routes/categoryRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/cart', require('./src/routes/cartRoutes'));
app.use('/api/wishlist', require('./src/routes/wishlistRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));

app.get('/api/health', (req, res) => {
    res.json({success: true, message: 'سرور Kartify بک‌اند فعال است 🚀'});
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 سرور روی پورت ${PORT} در حال اجراست`);
});
