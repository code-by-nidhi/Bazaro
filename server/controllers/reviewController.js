const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/v1/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review for a product
// @route   POST /api/v1/reviews
// @access  Private (User)
const addReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and comment.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
    });

    // Recalculate Product average rating
    const allReviews = await Review.find({ product: productId });
    const avgRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    product.numberOfReviews = allReviews.length;
    product.rating = Number(avgRating.toFixed(1));
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private (Admin)
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate product rating
    const allReviews = await Review.find({ product: productId });
    const product = await Product.findById(productId);
    if (product) {
      product.numberOfReviews = allReviews.length;
      product.rating = allReviews.length > 0
        ? Number((allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length).toFixed(1))
        : 0;
      await product.save();
    }

    res.json({
      success: true,
      message: 'Review deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  addReview,
  deleteReview,
};
