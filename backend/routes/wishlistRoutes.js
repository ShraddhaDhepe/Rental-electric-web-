const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getWishlist, toggleWishlist, clearWishlist } = require('../controllers/wishlistController');

router.use(protect);

router.get('/', getWishlist);
router.post('/toggle/:productId', toggleWishlist);
router.delete('/clear', clearWishlist);

module.exports = router;
