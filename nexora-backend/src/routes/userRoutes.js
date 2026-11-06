const express = require('express');
const { protect } = require('../middleware/auth'); // مسیر و اسم را با پروژه‌ات یکی کن
const c = require('../controllers/userController');

const router = express.Router();
router.use(protect);

router.route('/me').get(c.getMe).put(c.updateMe);
router.put('/me/password', c.changePassword);
router.get('/me/summary', c.getSummary);
router.get('/me/reviews', c.getMyReviews);

router.route('/me/addresses').get(c.getAddresses).post(c.addAddress);
router.route('/me/addresses/:addressId').put(c.updateAddress).delete(c.deleteAddress);

router.get('/me/wishlist', c.getWishlist);
router.post('/me/wishlist/:productId', c.toggleWishlist);

module.exports = router;