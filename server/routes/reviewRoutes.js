const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  addReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/product/:productId', getProductReviews);
router.post('/', protect, addReview);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
