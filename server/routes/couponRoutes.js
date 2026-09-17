const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon,
} = require('../controllers/couponController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { applyCouponRules, createCouponRules } = require('../middleware/validateMiddleware');

router.post('/validate', protect, applyCouponRules, validateCoupon);
router.get('/', protect, adminOnly, getAllCoupons);
router.post('/', protect, adminOnly, createCouponRules, createCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

module.exports = router;
