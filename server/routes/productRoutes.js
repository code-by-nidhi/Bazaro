const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedSections,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { createProductRules, updateProductRules } = require('../middleware/validateMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/featured', getFeaturedSections);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

router.post('/', protect, adminOnly, upload.array('images', 5), createProductRules, createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProductRules, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
