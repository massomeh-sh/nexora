const express = require('express');
const {
  getProducts,
  getDealProducts,
  getProductById,
  createProductReview,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/deals', getDealProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
