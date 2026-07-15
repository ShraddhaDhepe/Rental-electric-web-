const Order = require('../models/Order');
const Cart  = require('../models/Cart');

// @desc  Confirm UPI payment (customer self-reports after scanning)
// @route POST /api/payment/confirm-upi
exports.confirmUpiPayment = async (req, res) => {
  try {
    const { orderId, upiTxnId } = req.body;

    if (!orderId) return res.status(400).json({ success: false, message: 'orderId required' });

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        'paymentInfo.status':  'paid',
        'paymentInfo.method':  'upi',
        'paymentInfo.id':      upiTxnId || `UPI-${Date.now()}`,
        'paymentInfo.paidAt':  new Date(),
        orderStatus: 'Confirmed'
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });

    res.json({ success: true, message: 'Payment confirmed', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
