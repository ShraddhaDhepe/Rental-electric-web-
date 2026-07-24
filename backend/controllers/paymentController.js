const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// Verify Razorpay Payment
exports.verifyRazorpayPayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed"
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        "paymentInfo.status": "paid",
        "paymentInfo.method": "razorpay",
        "paymentInfo.id": razorpay_payment_id,
        "paymentInfo.paidAt": new Date(),
        orderStatus: "Confirmed"
      },
      {
        new: true
      }
    );

    await Cart.findOneAndUpdate(
      {
        user: req.user._id
      },
      {
        $set: {
          items: []
        }
      }
    );

    res.json({
      success: true,
      order
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

};