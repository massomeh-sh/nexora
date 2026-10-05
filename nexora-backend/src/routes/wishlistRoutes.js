const express = require('express');
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist, mergeWishlist, clearWishlist,
} = require('../controllers/wishlistController');
const {protect} = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.post('/toggle', toggleWishlist);
router.delete('/:productId', removeFromWishlist);
router.post('/merge', mergeWishlist);
router.delete('/', protect, clearWishlist)

module.exports = router;
