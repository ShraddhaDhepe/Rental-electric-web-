const Wishlist = require('../models/Wishlist');

// @desc    Get user wishlist
// @route   GET /api/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'products',
      'name images buyPrice brand category rating numReviews availableForRent rentalPlans stock'
    );

    res.json({ success: true, wishlist: wishlist || { products: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add/Remove product from wishlist (toggle)
// @route   POST /api/wishlist/toggle/:productId
exports.toggleWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const productIndex = wishlist.products.indexOf(req.params.productId);
    let message;

    if (productIndex > -1) {
      wishlist.products.splice(productIndex, 1);
      message = 'Removed from wishlist';
    } else {
      wishlist.products.push(req.params.productId);
      message = 'Added to wishlist';
    }

    await wishlist.save();
    res.json({ success: true, message, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist/clear
exports.clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $set: { products: [] } }
    );
    res.json({ success: true, message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
