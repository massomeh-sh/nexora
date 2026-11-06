const express = require('express');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
} = require('../controllers/orderController');
const {protect, admin} = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);


module.exports = router;
