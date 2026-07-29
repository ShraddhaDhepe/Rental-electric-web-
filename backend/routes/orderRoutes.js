const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

router.use(protect);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.get('/admin/all', admin, getAllOrders);
router.put('/admin/:id/status', admin, updateOrderStatus);

module.exports = router;
