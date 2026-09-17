const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { orderRules } = require('../middleware/validateMiddleware');

router.post('/razorpay-order', protect, orderRules, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);

module.exports = router;
