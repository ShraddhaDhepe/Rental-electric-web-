const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'demo_secret'
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {}
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Payment order creation failed' });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'demo_secret')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      // Update order as failed
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          'paymentInfo.status': 'failed',
          'paymentInfo.razorpay_order_id': razorpay_order_id
        });
      }
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update order as paid
    if (orderId) {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          'paymentInfo.status': 'paid',
          'paymentInfo.razorpay_order_id': razorpay_order_id,
          'paymentInfo.razorpay_payment_id': razorpay_payment_id,
          'paymentInfo.razorpay_signature': razorpay_signature,
          'paymentInfo.paidAt': new Date(),
          orderStatus: 'Confirmed'
        },
        { new: true }
      );

      // Clear user cart
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } }
      );

      return res.json({
        success: true,
        message: 'Payment verified successfully',
        order
      });
    }

    res.json({ success: true, message: 'Payment verified' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Razorpay key
// @route   GET /api/payment/key
exports.getRazorpayKey = async (req, res) => {
  res.json({ success: true, key: process.env.RAZORPAY_KEY_ID });
};
