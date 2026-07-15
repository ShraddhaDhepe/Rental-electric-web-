const express    = require('express');
const router     = express.Router();
const { protect } = require('../middleware/auth');
const { confirmUpiPayment } = require('../controllers/paymentController');

router.use(protect);

router.post('/confirm-upi', confirmUpiPayment);

module.exports = router;
