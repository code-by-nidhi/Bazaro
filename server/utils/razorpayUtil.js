const crypto = require('crypto');

/**
 * Verify Razorpay payment signature using HMAC-SHA256
 */
const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_bazaro_key_secret';
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};

module.exports = { verifyRazorpaySignature };
