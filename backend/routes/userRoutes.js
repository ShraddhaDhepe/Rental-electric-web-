const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');

router.use(protect);

// User address routes
router.post('/address', addAddress);
router.put('/address/:id', updateAddress);
router.delete('/address/:id', deleteAddress);

// Admin routes
router.get('/', admin, getAllUsers);
router.get('/:id', admin, getUserById);
router.put('/:id/role', admin, updateUserRole);
router.delete('/:id', admin, deleteUser);

module.exports = router;
