const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    گرفتن لیست محصولات (با فیلتر، جستجو و صفحه‌بندی)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
        ? {$text: {$search: req.query.keyword}}
        : {};

    const categoryFilter = req.query.category
        ? {category: req.query.category}
        : {};

    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);

    const filter = {
        isActive: true,
        ...keyword,
        ...categoryFilter,
        ...(Object.keys(priceFilter).length ? {price: priceFilter} : {}),
    };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .populate('category', 'name slug')
        .sort({createdAt: -1})
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        success: true,
        data: products,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
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
    const product = await Product.findById(req.params.id).populate(
        'category',
        'name slug'
    );

    if (!product) {
        res.status(404);
        throw new Error('محصول یافت نشد');
    }

    res.json({success: true, data: product});
});

// @desc    ثبت نظر و امتیاز برای محصول
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const {rating, comment} = req.body;
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
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
        product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length;

    await product.save();
    res.status(201).json({success: true, message: 'نظر شما ثبت شد'});
});

module.exports = {
    getProducts,
    getDealProducts,
    getProductById,
    createProductReview,
};
