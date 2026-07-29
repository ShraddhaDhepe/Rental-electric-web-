const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  orderType: {
    type: String,
    enum: ['buy', 'rent'],
    required: true
  },
  rentalPlan: {
    duration: String,
    months: Number,
    monthlyRent: Number,
    totalAmount: Number,
    securityDeposit: Number,
    startDate: Date,
    endDate: Date
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  paymentInfo: {
    id: { type: String },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['razorpay', 'upi', 'cod', 'wallet'],
      default: 'upi'
    },
    paidAt: { type: Date }
  },
  itemsPrice: { type: Number, required: true, default: 0 },
  securityDeposit: { type: Number, default: 0 },
  deliveryCharges: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true, default: 0 },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Refund Initiated', 'Refunded'],
    default: 'Processing'
  },
  orderType: {
    type: String,
    enum: ['buy', 'rent', 'mixed'],
    default: 'buy'
  },
  rentalStatus: {
    type: String,
    enum: ['Active', 'Completed', 'Cancelled', 'Overdue'],
  },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String },
  trackingNumber: { type: String },
  invoiceNumber: { type: String }
}, { timestamps: true });

// Generate invoice number
orderSchema.pre('save', function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = 'INV-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
