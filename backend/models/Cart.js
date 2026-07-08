const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  // For rental items
  orderType: {
    type: String,
    enum: ['buy', 'rent'],
    required: true,
    default: 'buy'
  },
  rentalPlan: {
    duration: String,
    months: Number,
    monthlyRent: Number,
    totalAmount: Number,
    securityDeposit: Number
  },
  // For buy items
  price: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  couponCode: { type: String },
  discount: { type: Number, default: 0 }
}, { timestamps: true });

// Virtual to compute total
cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((total, item) => {
    if (item.orderType === 'rent' && item.rentalPlan) {
      return total + (item.rentalPlan.totalAmount + item.rentalPlan.securityDeposit);
    }
    return total + (item.price * item.quantity);
  }, 0);
});

cartSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
