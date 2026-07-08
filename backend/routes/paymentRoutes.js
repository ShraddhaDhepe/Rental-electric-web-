const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createRazorpayOrder,
  verifyPayment,
  getRazorpayKey
} = require('../controllers/paymentController');

router.use(protect);

router.get('/key', getRazorpayKey);
router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);

module.exports = router;
