const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public/Authenticated GET, Admin restricted POST
router.route('/')
  .get(getCategories)
  .post(protect, authorizeRoles('admin'), createCategory);

// Public/Authenticated GET, Admin restricted PUT, DELETE
router.route('/:id')
  .get(getCategoryById)
  .put(protect, authorizeRoles('admin'), updateCategory)
  .delete(protect, authorizeRoles('admin'), deleteCategory);

module.exports = router;
