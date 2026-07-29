const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getBrands
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/brands', getBrands);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);
router.post('/:id/review', protect, addReview);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
