const razorpayInstance = require('../config/razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { verifyRazorpaySignature } = require('../utils/razorpayUtil');

// @desc    Create Razorpay Order (Server-side price verification)
// @route   POST /api/v1/payments/razorpay-order
// @access  Private (User)
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    if (!shippingAddress || !shippingAddress.addressLine || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Please select a valid shipping address.' });
    }

    // SERVER-SIDE CALCULATE TOTAL AMOUNT
    let itemsPrice = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const productDoc = await Product.findById(item.product);
      if (!productDoc) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }

      if (productDoc.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for '${productDoc.name}'. Only ${productDoc.stock} left in stock.`,
        });
      }

      const effectivePrice = productDoc.discountPrice || productDoc.price;
      itemsPrice += effectivePrice * item.quantity;

      validatedItems.push({
        product: productDoc._id,
        name: productDoc.name,
        price: effectivePrice,
        quantity: item.quantity,
        image: productDoc.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        selectedVariant: item.selectedVariant || {},
      });
    }

    // Validate Coupon
    let discountAmount = 0;
    if (couponCode) {
      const couponDoc = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() },
      });

      if (couponDoc && itemsPrice >= couponDoc.minimumPurchase) {
        if (couponDoc.discountType === 'percentage') {
          discountAmount = (itemsPrice * couponDoc.discountValue) / 100;
          if (couponDoc.maximumDiscount && discountAmount > couponDoc.maximumDiscount) {
            discountAmount = couponDoc.maximumDiscount;
          }
        } else {
          discountAmount = couponDoc.discountValue;
        }
      }
    }

    const taxPrice = Math.round(itemsPrice * 0.05); // 5% GST/Tax
    const shippingPrice = itemsPrice > 999 ? 0 : 70; // Free shipping over ₹999
    const totalAmount = Math.max(0, Math.round(itemsPrice - discountAmount + taxPrice + shippingPrice));

    // Create Draft Order in MongoDB first
    const dbOrder = await Order.create({
      user: req.user._id,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Pending',
      itemsPrice,
      discountAmount: Math.round(discountAmount),
      taxPrice,
      shippingPrice,
      totalAmount,
      orderStatus: 'Pending',
    });

    // Options for Razorpay SDK (amount in paise)
    const options = {
      amount: totalAmount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${dbOrder._id}`,
      notes: {
        dbOrderId: dbOrder._id.toString(),
        userId: req.user._id.toString(),
      },
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpayInstance.orders.create(options);
    } catch (rzpErr) {
      console.warn('[Razorpay API Warning - Fallback Order Created]:', rzpErr.message);
      // Generate standard mock razorpay order if API key is invalid/unconfigured in dev environment
      razorpayOrder = {
        id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        amount: options.amount,
        currency: 'INR',
        receipt: options.receipt,
      };
    }

    // Save Razorpay Order ID to draft order
    dbOrder.paymentResult = {
      razorpayOrderId: razorpayOrder.id,
    };
    await dbOrder.save();

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      dbOrderId: dbOrder._id,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_bazaro_key_id',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/v1/payments/verify
// @access  Private (User)
const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { dbOrderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!dbOrderId || !razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({ success: false, message: 'Payment verification parameters missing.' });
    }

    const order = await Order.findById(dbOrderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Verify Cryptographic Signature
    let isValid = false;
    if (razorpayOrderId.startsWith('order_mock_')) {
      // Mock payment bypass for dev mode without active Razorpay account
      isValid = true;
    } else {
      isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    }

    if (!isValid) {
      order.paymentStatus = 'Failed';
      order.orderStatus = 'Cancelled';
      await order.save();
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    // Mark Order as Confirmed and Paid
    order.paymentStatus = 'Completed';
    order.orderStatus = 'Confirmed';
    order.paymentResult = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: razorpaySignature || 'mock_signature',
    };

    await order.save();

    // Decrement product stock in DB
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.json({
      success: true,
      message: 'Payment verified and order confirmed successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
