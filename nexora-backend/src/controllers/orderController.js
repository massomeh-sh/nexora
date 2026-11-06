const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

// ---------------------------------------------------------------------------
// تنظیمات ثابت (باید با فرانت CheckoutPage.tsx یکی باشه)
// ---------------------------------------------------------------------------
const FREE_SHIPPING_THRESHOLD = 1000000; // بالای ۱ میلیون تومان ارسال عادی رایگانه

const PAYMENT_METHODS = ['zarinpal', 'cash_on_delivery']; // همان enum مدل Order

const PROVINCES = [
    'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام',
    'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی',
    'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان', 'سیستان و بلوچستان', 'فارس',
    'قزوین', 'قم', 'کردستان', 'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد',
    'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد',
];

const getEffectivePrice = (product) =>
    product.discountPrice > 0 ? product.discountPrice : product.price;

// قیمت ارسال همیشه سمت سرور حساب می‌شه، نه از ورودی کاربر
const calcShippingPrice = (itemsPrice) =>
    itemsPrice > FREE_SHIPPING_THRESHOLD ? 0 : 120_000;

// ---------------------------------------------------------------------------
// اعتبارسنجی ورودی چک‌اوت
// ---------------------------------------------------------------------------
const toLatinDigits = (s) =>
    s
        .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
        .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

const isText = (v) => typeof v === 'string';

// خروجی: { error } یا { data } ؛ فقط فیلدهای مجاز ذخیره می‌شن
const validateCheckoutBody = (body) => {
    const {shippingAddress: a, paymentMethod, note = ''} = body || {};

    if (!a || typeof a !== 'object' || Array.isArray(a)) {
        return {error: 'آدرس ارسال الزامی است'};
    }

    const fullName = isText(a.fullName) ? a.fullName.trim() : '';
    const receiverPhone = isText(a.receiverPhone) ? toLatinDigits(a.receiverPhone).trim() : '';
    const province = isText(a.province) ? a.province.trim() : '';
    const city = isText(a.city) ? a.city.trim() : '';
    const postalCode = isText(a.postalCode) ? toLatinDigits(a.postalCode).trim() : '';
    const address = isText(a.address) ? a.address.trim() : '';

    if (fullName.length < 3 || fullName.length > 60) return {error: 'نام و نام خانوادگی معتبر نیست'};
    if (!/^(\+98|0)?9\d{9}$/.test(receiverPhone)) return {error: 'شماره موبایل معتبر نیست'};
    if (!PROVINCES.includes(province)) return {error: 'استان معتبر نیست'};
    if (city.length < 2 || city.length > 50) return {error: 'شهر معتبر نیست'};
    if (!/^\d{9,10}$/.test(postalCode)) return {error: 'کد پستی باید 9 یا 10 رقم باشد'};
    if (address.length < 10 || address.length > 300) return {error: 'آدرس باید بین ۱۰ تا ۳۰۰ کاراکتر باشد'};

    if (!isText(paymentMethod) || !PAYMENT_METHODS.includes(paymentMethod)) {
        return {error: 'روش پرداخت معتبر نیست'};
    }
    if (!isText(note) || note.length > 200) return {error: 'توضیحات سفارش حداکثر ۲۰۰ کاراکتر است'};

    return {
        data: {
            shippingAddress: {fullName, receiverPhone, province, city, postalCode, address},
            paymentMethod,
            note: note.trim(),
        },
    };
};

// برگردوندن موجودی محصولاتی که قبلاً کم شدن
const restoreStock = async (reserved) => {
    await Promise.all(
        reserved.map((r) =>
            Product.updateOne({_id: r.product}, {$inc: {stock: r.quantity}})
        )
    );
};

// برگردوندن آیتم‌های سبد در صورت شکست ثبت سفارش
const restoreCart = async (userId, items) => {
    if (!items.length) return;
    await Cart.updateOne(
        {user: userId},
        {$push: {items: {$each: items}}}
    );
};

// @desc    ثبت سفارش جدید بر اساس سبد خرید فعلی
// @route   POST /api/orders
// @access  Private
// body:    { shippingAddress: { fullName, receiverPhone, province, city, postalCode, address },
//            paymentMethod: 'zarinpal' | 'cash_on_delivery', note? }
const createOrder = asyncHandler(async (req, res) => {
    // اول ورودی چک می‌شه تا اگه اشتباه بود، سبد و موجودی دست نخورن
    const {error: validationError, data: checkout} = validateCheckoutBody(req.body);
    if (validationError) {
        res.status(400);
        throw new Error(validationError);
    }
    const {shippingAddress, shippingMethod, paymentMethod, note} = checkout;

    // سبد رو به‌صورت atomic "برمی‌داریم" و خالی می‌کنیم؛
    // اگه دو درخواست هم‌زمان بیاد فقط یکی‌شون سبد پر پیدا می‌کنه
    const cart = await Cart.findOneAndUpdate(
        {user: req.user._id, 'items.0': {$exists: true}},
        {$set: {items: []}},
        {new: false}
    ).populate('items.product');

    if (!cart) {
        res.status(400);
        throw new Error('سبد خرید شما خالی است');
    }

    const originalItems = cart.items.map((item) => ({
        product: item.product?._id || item.product,
        quantity: item.quantity,
        price: item.price,
    }));

    const reserved = []; // آیتم‌هایی که موجودی‌شون کم شده

    try {
        // محصول حذف‌شده
        if (cart.items.some((item) => !item.product)) {
            res.status(400);
            throw new Error('یکی از محصولات سبد خرید دیگر موجود نیست');
        }

        // قیمت از DB خونده می‌شه، نه از snapshot قدیمی سبد
        const orderItems = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            image: item.product.images?.[0] || '',
            quantity: item.quantity,
            price: getEffectivePrice(item.product),
        }));

        // کم کردن atomic موجودی: فقط اگه stock کافی باشه کم می‌شه
        for (const item of cart.items) {
            const result = await Product.updateOne(
                {_id: item.product._id, stock: {$gte: item.quantity}},
                {$inc: {stock: -item.quantity}}
            );

            if (result.modifiedCount === 0) {
                res.status(400);
                throw new Error(`موجودی محصول «${item.product.name}» کافی نیست`);
            }

            reserved.push({product: item.product._id, quantity: item.quantity});
        }

        const itemsPrice = orderItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        const shippingPrice = calcShippingPrice(itemsPrice);
        const totalPrice = itemsPrice + shippingPrice;

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            shippingMethod,
            paymentMethod,
            note,
            itemsPrice,
            shippingPrice,
            totalPrice,
        });

        res.status(201).json({success: true, data: order});
    } catch (error) {
        // هر خطایی: موجودی و سبد به حالت اول برگردن
        await restoreStock(reserved).catch((e) =>
            console.error('restoreStock failed:', e)
        );
        await restoreCart(req.user._id, originalItems).catch((e) =>
            console.error('restoreCart failed:', e)
        );
        throw error;
    }
});

// @desc    گرفتن سفارش‌های کاربر لاگین‌کرده
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    // برای لیست سفارش‌ها آدرس لازم نیست؛ جزئیاتش در getOrderById می‌آید
    const orders = await Order.find({user: req.user._id})
        .select('-shippingAddress -user -__v')
        .sort({createdAt: -1});
    res.json({success: true, count: orders.length, data: orders});
});

// @desc    گرفتن جزئیات یک سفارش
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('سفارش یافت نشد');
    }

    if (order.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('شما اجازه مشاهده این سفارش را ندارید');
    }

    res.json({success: true, data: order});
});


// وضعیت‌هایی که از هر وضعیت می‌شود به آن‌ها رفت
const ALLOWED_TRANSITIONS = {
    pending: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: ['returned'],
    cancelled: [],
    returned: [],
};

// @desc    تغییر وضعیت سفارش (ادمین)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const {status} = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('سفارش یافت نشد');
    }

    if (!ALLOWED_TRANSITIONS[order.status]?.includes(status)) {
        res.status(400);
        throw new Error(`تغییر وضعیت از «${order.status}» به «${status}» مجاز نیست`);
    }

    // لغو یا مرجوعی: موجودی انبار برمی‌گردد
    // (چون هر سفارش فقط یک‌بار می‌تواند به این وضعیت‌ها برسد، دوبار برگردانده نمی‌شود)
    if (status === 'cancelled' || status === 'returned') {
        await restoreStock(order.items);
    }

    order.status = status;
    await order.save();

    res.json({success: true, data: order});
});

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
};