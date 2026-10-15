const express = require('express');
const {
    getProducts,
    getDealProducts,
    getProductById,
    createProductReview,
    reactToReview,
} = require('../controllers/productController');
const {protect} = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');


const router = express.Router();

router.get('/', getProducts);
router.get('/deals', getDealProducts);
router.get('/:id', optionalAuth, getProductById);
router.post('/:id/reviews', protect, createProductReview);
router.post('/:id/reviews/:reviewId/react', protect, reactToReview);

module.exports = router;
