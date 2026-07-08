const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  avatar: { type: String }
}, { timestamps: true });

const rentalPlanSchema = new mongoose.Schema({
  duration: { type: String, required: true }, // e.g. "3 months", "6 months", "12 months"
  months: { type: Number, required: true },
  monthlyRent: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  discount: { type: Number, default: 0 } // percentage discount
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  brand: {
    type: String,
    required: [true, 'Please enter product brand'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please enter product category'],
    enum: [
      'Television',
      'Refrigerator',
      'Washing Machine',
      'Air Conditioner',
      'Laptop',
      'Smartphone',
      'Microwave',
      'Geyser',
      'Furniture',
      'Other'
    ]
  },
  subcategory: { type: String },
  images: [
    {
      public_id: { type: String },
      url: { type: String, required: true }
    }
  ],
  buyPrice: { type: Number, required: true },
  originalPrice: { type: Number },
  rentalPlans: [rentalPlanSchema],
  stock: { type: Number, required: true, default: 0, min: [0, 'Stock cannot be negative'] },
  availableForRent: { type: Boolean, default: true },
  availableForBuy: { type: Boolean, default: true },
  specifications: [
    {
      key: { type: String },
      value: { type: String }
    }
  ],
  features: [{ type: String }],
  tags: [{ type: String }],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  condition: {
    type: String,
    enum: ['New', 'Refurbished', 'Used-Good', 'Used-Fair'],
    default: 'New'
  },
  deliveryDays: { type: Number, default: 3 },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Virtual for discount percentage on buy price
productSchema.virtual('discountPercentage').get(function () {
  if (this.originalPrice && this.originalPrice > this.buyPrice) {
    return Math.round(((this.originalPrice - this.buyPrice) / this.originalPrice) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
