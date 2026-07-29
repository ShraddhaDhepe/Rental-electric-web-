const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Product = require('../models/Product');

// @desc    Get all reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .select('reviews rating numReviews')
      .populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, reviews: product.reviews, rating: product.rating, numReviews: product.numReviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a review (admin or owner)
router.delete('/:productId/:reviewId', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const review = product.reviews.id(req.params.reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    product.reviews.pull(req.params.reviewId);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.length
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

    await product.save();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
