const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc    Create new order (For COD orders directly or draft creation)
// @route   POST /api/v1/orders
// @access  Private (User)
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    if (!shippingAddress || !shippingAddress.addressLine || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Please select a valid shipping address.' });
    }

    // SERVER-SIDE PRICING & STOCK VALIDATION
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
          message: `Insufficient stock for '${productDoc.name}'. Only ${productDoc.stock} available.`,
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

    // Handle Coupon Server-Side Validation
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

        // Increment coupon count
        couponDoc.usedCount += 1;
        await couponDoc.save();
      }
    }

    const taxPrice = Math.round(itemsPrice * 0.05); // 5% GST/Tax
    const shippingPrice = itemsPrice > 999 ? 0 : 70; // Free shipping over ₹999
    const totalAmount = Math.max(0, Math.round(itemsPrice - discountAmount + taxPrice + shippingPrice));

    const order = await Order.create({
      user: req.user._id,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      itemsPrice,
      discountAmount: Math.round(discountAmount),
      taxPrice,
      shippingPrice,
      totalAmount,
      orderStatus: 'Confirmed',
    });

    // Update Product Stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's orders
// @route   GET /api/v1/orders/my-orders
// @access  Private (User)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name slug images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/v1/orders/:id
// @access  Private (User / Admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'name slug images brand');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Ensure user can only view their own order unless Admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot access another user order.' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: orders.length,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
        order.paymentStatus = 'Completed';
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully!',
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
