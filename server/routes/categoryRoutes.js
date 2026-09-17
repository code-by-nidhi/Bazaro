const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryByIdentifier,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { createCategoryRules, updateCategoryRules } = require('../middleware/validateMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getCategories);
router.get('/:identifier', getCategoryByIdentifier);

router.post('/', protect, adminOnly, upload.single('image'), createCategoryRules, createCategory);
router.put('/:id', protect, adminOnly, upload.single('image'), updateCategoryRules, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
