const Product = require('../models/Product');
const Category = require('../models/Category');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUtil');

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // Search filter (name, brand, tags)
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { brand: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } },
        { subcategory: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Category filter by Slug or ObjectId
    if (req.query.category) {
      const categoryDoc = await Category.findOne({
        $or: [
          { slug: req.query.category.toLowerCase() },
          ...(req.query.category.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: req.query.category }] : []),
        ],
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Subcategory filter
    if (req.query.subcategory) {
      query.subcategory = { $regex: new RegExp(`^${req.query.subcategory}$`, 'i') };
    }

    // Brand filter
    if (req.query.brand) {
      const brands = req.query.brand.split(',');
      query.brand = { $in: brands.map((b) => new RegExp(`^${b.trim()}$`, 'i')) };
    }

    // Rating filter
    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    // Stock / Availability filter
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Special Flags (featured, bestseller, trending, newArrival)
    if (req.query.featured === 'true') query.featured = true;
    if (req.query.bestseller === 'true') query.bestseller = true;
    if (req.query.trending === 'true') query.trending = true;
    if (req.query.newArrival === 'true') query.newArrival = true;

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_low_high':
          sort = { price: 1 };
          break;
        case 'price_high_low':
          sort = { price: -1 };
          break;
        case 'rating':
          sort = { rating: -1 };
          break;
        case 'popular':
          sort = { numberOfReviews: -1 };
          break;
        case 'discount':
          sort = { discountPercentage: -1 };
          break;
        case 'newest':
        default:
          sort = { createdAt: -1 };
          break;
      }
    }

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured sections data (featured, bestsellers, trending, new arrivals)
// @route   GET /api/v1/products/featured
// @access  Public
const getFeaturedSections = async (req, res, next) => {
  try {
    const featured = await Product.find({ featured: true }).populate('category', 'name slug').limit(8);
    const bestsellers = await Product.find({ bestseller: true }).populate('category', 'name slug').limit(8);
    const trending = await Product.find({ trending: true }).populate('category', 'name slug').limit(8);
    const newArrivals = await Product.find({ newArrival: true }).populate('category', 'name slug').limit(8);

    res.json({
      success: true,
      featured,
      bestsellers,
      trending,
      newArrivals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by Slug
// @route   GET /api/v1/products/slug/:slug
// @access  Public
const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Fetch related products in same category
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
    })
      .limit(6)
      .populate('category', 'name slug');

    res.json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private (Admin)
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      category,
      subcategory,
      brand,
      stock,
      sku,
      featured,
      bestseller,
      trending,
      newArrival,
      tags,
      specifications,
      variants,
    } = req.body;

    const slug = (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'bazaro/products');
        uploadedImages.push(result);
      }
    } else if (req.body.imageUrl) {
      uploadedImages.push({ url: req.body.imageUrl, public_id: '' });
    } else {
      uploadedImages.push({
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        public_id: '',
      });
    }

    const calculatedDiscountPrice = discountPrice ? Number(discountPrice) : Number(price);
    const discountPercentage = price > calculatedDiscountPrice
      ? Math.round(((price - calculatedDiscountPrice) / price) * 100)
      : 0;

    const product = await Product.create({
      name,
      slug,
      description,
      shortDescription,
      price: Number(price),
      discountPrice: calculatedDiscountPrice,
      discountPercentage,
      category,
      subcategory,
      brand,
      images: uploadedImages,
      stock: Number(stock),
      sku: sku || `SKU-${Date.now()}`,
      featured: featured === 'true' || featured === true,
      bestseller: bestseller === 'true' || bestseller === true,
      trending: trending === 'true' || trending === true,
      newArrival: newArrival === 'true' || newArrival === true,
      tags: typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : tags || [],
      specifications: typeof specifications === 'string' ? JSON.parse(specifications) : specifications || [],
      variants: typeof variants === 'string' ? JSON.parse(variants) : variants || {},
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private (Admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const {
      name,
      description,
      shortDescription,
      price,
      discountPrice,
      category,
      subcategory,
      brand,
      stock,
      sku,
      featured,
      bestseller,
      trending,
      newArrival,
      tags,
      specifications,
      variants,
    } = req.body;

    if (name) {
      product.name = name;
      product.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + product._id.toString().slice(-4);
    }

    if (description) product.description = description;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (category) product.category = category;
    if (subcategory) product.subcategory = subcategory;
    if (brand) product.brand = brand;
    if (stock !== undefined) product.stock = Number(stock);
    if (sku) product.sku = sku;

    if (price !== undefined) {
      product.price = Number(price);
      const calculatedDiscountPrice = discountPrice !== undefined ? Number(discountPrice) : product.discountPrice;
      product.discountPrice = calculatedDiscountPrice;
      product.discountPercentage = product.price > calculatedDiscountPrice
        ? Math.round(((product.price - calculatedDiscountPrice) / product.price) * 100)
        : 0;
    }

    if (featured !== undefined) product.featured = featured === 'true' || featured === true;
    if (bestseller !== undefined) product.bestseller = bestseller === 'true' || bestseller === true;
    if (trending !== undefined) product.trending = trending === 'true' || trending === true;
    if (newArrival !== undefined) product.newArrival = newArrival === 'true' || newArrival === true;

    if (tags !== undefined) {
      product.tags = typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : tags;
    }

    if (specifications !== undefined) {
      product.specifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
    }

    if (variants !== undefined) {
      product.variants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    }

    // Handle Image uploads if provided
    if (req.files && req.files.length > 0) {
      let uploadedImages = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'bazaro/products');
        uploadedImages.push(result);
      }
      product.images = [...product.images, ...uploadedImages];
    }

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully!',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private (Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Clean up Cloudinary images if stored
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await deleteFromCloudinary(img.public_id);
        }
      }
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getFeaturedSections,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
