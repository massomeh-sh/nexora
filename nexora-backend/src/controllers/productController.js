const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');

// آرایه‌ی لایک و دیسلایک رو به تعداد و وضعیت کاربر تبدیل می‌کنه
// (آیدی کاربرها هیچ‌وقت به کلاینت نمیره)
const formatReview = (review, userId) => {
    // user و name عمداً از خروجی جدا می‌شن و به کلاینت نمی‌رن
    const {likes = [], dislikes = [], user, name, ...rest} = review;
    const has = (arr) => userId && arr.some((u) => u.toString() === userId.toString());

    return {
        ...rest, // شامل _id, rating, comment, isAnonymous, createdAt و ...
        authorName: review.isAnonymous ? 'کاربر ناشناس' : name,
        isMine: Boolean(userId && user && user.toString() === userId.toString()),
        likesCount: likes.length,
        dislikesCount: dislikes.length,
        userReaction: has(likes) ? 'like' : has(dislikes) ? 'dislike' : null,
    };
};

// @desc    گرفتن لیست محصولات (با فیلتر، جستجو، مرتب‌سازی و صفحه‌بندی)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 8;
    const page = Math.max(Number(req.query.page) || 1, 1);

    // ---------- دسته‌بندی ----------
    let categoryFilter = {};

    if (req.query.category) {
        const rootCategory = await Category.findOne({slug: req.query.category});

        // اگر دسته نامعتبر بود، categoryFilter خالی می‌ماند => همه محصولات
        if (rootCategory) {
            const childCategories = await Category.find({
                parent: rootCategory._id,
            }).select('_id');

            categoryFilter = {
                category: {
                    $in: [rootCategory._id, ...childCategories.map((c) => c._id)],
                },
            };
        }
    }

    // ---------- جستجو ----------
    const keyword = req.query.keyword
        ? {$text: {$search: req.query.keyword}}
        : {};

    // ---------- قیمت (قیمت نهایی: تخفیف اگر داشت، وگرنه قیمت اصلی) ----------
    const effectivePriceExpr = {
        $cond: [{$gt: ['$discountPrice', 0]}, '$discountPrice', '$price'],
    };

    const minPrice = Number(req.query.minPrice);
    const maxPrice = Number(req.query.maxPrice);
    const priceExpr = [];

    if (req.query.minPrice && !Number.isNaN(minPrice)) {
        priceExpr.push({$gte: [effectivePriceExpr, minPrice]});
    }
    if (req.query.maxPrice && !Number.isNaN(maxPrice)) {
        priceExpr.push({$lte: [effectivePriceExpr, maxPrice]});
    }

    // ---------- امتیاز ----------
    const ratingFilter = {};
    const minRating = Number(req.query.rating);
    if (req.query.rating && !Number.isNaN(minRating) && minRating > 0) {
        ratingFilter.rating = {$gte: Math.min(minRating, 5)};
    }

    // ---------- فیلترهای ثابت (همیشه اعمال می‌شن) ----------
    const baseFilter = {
        isActive: true,
        ...categoryFilter,
        ...ratingFilter,
        ...(priceExpr.length ? {$expr: {$and: priceExpr}} : {}),
    };

    let filter = {...baseFilter, ...keyword};

    // ---------- مرتب‌سازی ----------
    const SORT_MAP = {
        price_asc: {effectivePrice: 1},
        price_desc: {effectivePrice: -1},
        rating: {rating: -1},
        discount: {discountPercent: -1},
    };

    // createdAt و _id برای ثبات صفحه‌بندی (وقتی مقدار sort یکسان است)
    const sortOption = {
        ...(SORT_MAP[req.query.sort] || {}),
        createdAt: -1,
        _id: -1,
    };

    // ---------- شمارش و فال‌بک ----------
    let isFallback = false;
    let count = await Product.countDocuments(filter);

    // فقط اگر سرچ نتیجه نداشت، سرچ رو حذف کن (امتیاز، قیمت و دسته می‌مونن)
    if (count === 0 && req.query.keyword) {
        isFallback = true;
        filter = baseFilter;
        count = await Product.countDocuments(filter);
    }

    // ---------- گرفتن محصولات ----------
    const aggregated = await Product.aggregate([
        {$match: filter},
        {
            $addFields: {
                effectivePrice: effectivePriceExpr,
                discountPercent: {
                    $cond: [
                        {$and: [{$gt: ['$discountPrice', 0]}, {$gt: ['$price', 0]}]},
                        {
                            $round: [
                                {
                                    $multiply: [
                                        {$divide: [{$subtract: ['$price', '$discountPrice']}, '$price']},
                                        100,
                                    ],
                                },
                                0,
                            ],
                        },
                        0,
                    ],
                },
            },
        },
        {$sort: sortOption},
        {$skip: pageSize * (page - 1)},
        {$limit: pageSize},
        {$project: {reviews: 0}},
    ]);

    const data = await Product.populate(aggregated, {
        path: 'category',
        select: 'name slug',
    });

    res.json({
        success: true,
        data,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
        isFallback,
    });
});

// @desc    گرفتن لیست محصولات شگفت‌انگیز (دارای تخفیف، به‌صورت مرتب‌شده یا تصادفی)
// @route   GET /api/products/deals?limit=10&random=true
// @access  Public
const getDealProducts = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 10;
    const isRandom = req.query.random === 'true';

    const matchStage = {
        isActive: true,
        discountPrice: {$gt: 0},
        $expr: {$lt: ['$discountPrice', '$price']},
    };

    // اگر اسلاگ دسته‌بندی داده شده باشد، محصولات آن دسته و زیردسته‌هایش را هم شامل می‌شود
    if (req.query.category) {
        const rootCategory = await Category.findOne({slug: req.query.category});
        if (!rootCategory) {
            return res.json({success: true, count: 0, data: []});
        }
        const childCategories = await Category.find({parent: rootCategory._id}).select('_id');
        const categoryIds = [rootCategory._id, ...childCategories.map((c) => c._id)];
        matchStage.category = {$in: categoryIds};
    }

    const pipeline = [{$match: matchStage}];

    if (isRandom) {
        // انتخاب تصادفی از بین محصولات تخفیف‌دار
        pipeline.push({$sample: {size: limit}});
    } else {
        // مرتب‌سازی بر اساس بیشترین درصد تخفیف
        pipeline.push(
            {
                $addFields: {
                    discountPercent: {
                        $multiply: [
                            {$divide: [{$subtract: ['$price', '$discountPrice']}, '$price']},
                            100,
                        ],
                    },
                },
            },
            {$sort: {discountPercent: -1}},
            {$limit: limit}
        );
    }

    pipeline.push(
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
            },
        },
        {$unwind: {path: '$category', preserveNullAndEmptyArrays: true}},
        {
            $project: {
                name: 1,
                description: 1,
                shortDescription: 1,
                images: 1,
                price: 1,
                discountPrice: 1,
                discountPercent: {
                    $multiply: [
                        {$divide: [{$subtract: ['$price', '$discountPrice']}, '$price']},
                        100,
                    ],
                },
                unit: 1,
                stock: 1,
                brand: 1,
                rating: 1,
                numReviews: 1,
                'category._id': 1,
                'category.name': 1,
                'category.slug': 1,
            },
        }
    );

    const deals = await Product.aggregate(pipeline);

    res.json({success: true, count: deals.length, data: deals});
});


// @desc    گرفتن جزئیات یک محصول
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('شناسه محصول نامعتبر است');
    }

    const product = await Product.findById(req.params.id)
        .populate('category')
        .lean();

    if (!product || !product.isActive) {
        res.status(404);
        throw new Error('محصول یافت نشد');
    }

    const hasDiscount =
        product.discountPrice > 0 && product.discountPrice < product.price;

    product.discountPercent = hasDiscount
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    // تعداد این محصول داخل سبد کاربر (برای مهمان یا محصول خارج از سبد: 0)
    product.inStock = product.stock > 0;
    product.quantity = 0;

    if (req.user) {
        const cart = await Cart.findOne(
            {user: req.user._id, 'items.product': product._id},
            {'items.$': 1}
        ).lean();

        product.quantity = cart?.items?.[0]?.quantity ?? 0;
    }

    product.reviews = (product.reviews || []).map((r) =>
        formatReview(r, req.user?._id)
    );

    res.json({success: true, data: product});
});


// @desc    ثبت نظر و امتیاز برای محصول
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const {rating, comment, isAnonymous} = req.body;

    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
        res.status(400);
        throw new Error('امتیاز باید عددی بین ۱ تا ۵ باشد');
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('محصول یافت نشد');
    }

    const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
        res.status(400);
        throw new Error('شما قبلا برای این محصول نظر ثبت کرده‌اید');
    }

    const review = {
        user: req.user._id,          // همیشه ذخیره می‌شه
        name: req.user.name,         // اسم واقعی همیشه ذخیره می‌شه
        rating: numericRating,
        comment,
        isAnonymous: isAnonymous === true || isAnonymous === 'true',
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
        product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length;

    await product.save();
    res.status(201).json({success: true, message: 'نظر شما ثبت شد'});
});

// @desc    لایک / دیسلایک یک نظر (تکرار همان دکمه، واکنش را برمی‌دارد)
// @route   POST /api/products/:id/reviews/:reviewId/react
// @access  Private
const reactToReview = asyncHandler(async (req, res) => {
    const {id, reviewId} = req.params;
    const {type} = req.body;

    if (!['like', 'dislike'].includes(type)) {
        res.status(400);
        throw new Error('نوع واکنش نامعتبر است');
    }

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) {
        res.status(400);
        throw new Error('شناسه نامعتبر است');
    }

    const product = await Product.findById(id);
    if (!product) {
        res.status(404);
        throw new Error('محصول یافت نشد');
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
        res.status(404);
        throw new Error('نظر یافت نشد');
    }

    const userId = req.user._id;
    const isSame = (u) => u.equals(userId);
    const sameType = type === 'like' ? review.likes : review.dislikes;
    const alreadyDid = sameType.some(isSame);

    // اول واکنش قبلی کاربر (هر نوعی) برداشته میشه
    review.likes = review.likes.filter((u) => !isSame(u));
    review.dislikes = review.dislikes.filter((u) => !isSame(u));

    // اگه همون دکمه رو دوباره زده بود، فقط برداشته میشه؛ وگرنه ثبت میشه
    if (!alreadyDid) {
        (type === 'like' ? review.likes : review.dislikes).push(userId);
    }

    await product.save();

    const {likesCount, dislikesCount, userReaction} = formatReview(review.toObject(), userId);
    res.json({success: true, data: {likesCount, dislikesCount, userReaction}});
});

module.exports = {
    getProducts,
    getDealProducts,
    getProductById,
    createProductReview,
    reactToReview
};
