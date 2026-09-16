const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_bazaro_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_bazaro_key_secret',
});

module.exports = instance;
