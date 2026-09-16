const Category = require('../models/Category');
const Product = require('../models/Product');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUtil');

// @desc    Get all categories with subcategories
// @route   GET /api/v1/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const filter = {};
    // Storefront nav asks for ?navbar=true; admin panel asks for everything.
    if (req.query.navbar === 'true') {
      filter.showInNavbar = true;
    }

    const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 });
    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by Slug or ID
// @route   GET /api/v1/categories/:identifier
// @access  Public
const getCategoryByIdentifier = async (req, res, next) => {
  try {
    const identifier = req.params.identifier;
    const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);

    const category = await Category.findOne({
      $or: [
        { slug: identifier.toLowerCase() },
        ...(isObjectId ? [{ _id: identifier }] : []),
      ],
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private (Admin)
const createCategory = async (req, res, next) => {
  try {
    const { name, description, subcategories, featured, icon, showInNavbar, displayOrder } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingCategory = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: 'Category already exists.' });
    }

    let imageResult = {
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      public_id: '',
    };

    if (req.file) {
      imageResult = await uploadToCloudinary(req.file.buffer, 'bazaro/categories');
    } else if (req.body.imageUrl) {
      imageResult = { url: req.body.imageUrl, public_id: '' };
    }

    let parsedSubcategories = [];
    if (subcategories) {
      const rawList = typeof subcategories === 'string' ? JSON.parse(subcategories) : subcategories;
      parsedSubcategories = rawList.map((sub) => {
        const subName = typeof sub === 'string' ? sub : sub.name;
        return {
          name: subName,
          slug: subName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        };
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image: imageResult,
      subcategories: parsedSubcategories,
      featured: featured === 'true' || featured === true,
      icon: icon || 'Shirt',
      showInNavbar: showInNavbar === undefined ? true : showInNavbar === 'true' || showInNavbar === true,
      displayOrder: Number(displayOrder) || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private (Admin)
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const { name, description, subcategories, featured, icon, showInNavbar, displayOrder } = req.body;

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (description !== undefined) category.description = description;
    if (featured !== undefined) category.featured = featured === 'true' || featured === true;
    if (icon !== undefined && icon !== '') category.icon = icon;
    if (showInNavbar !== undefined) category.showInNavbar = showInNavbar === 'true' || showInNavbar === true;
    if (displayOrder !== undefined && displayOrder !== '') category.displayOrder = Number(displayOrder) || 0;

    if (req.file) {
      if (category.image && category.image.public_id) {
        await deleteFromCloudinary(category.image.public_id);
      }
      category.image = await uploadToCloudinary(req.file.buffer, 'bazaro/categories');
    } else if (req.body.imageUrl) {
      category.image = { url: req.body.imageUrl, public_id: '' };
    }

    if (subcategories !== undefined) {
      const rawList = typeof subcategories === 'string' ? JSON.parse(subcategories) : subcategories;
      category.subcategories = rawList.map((sub) => {
        const subName = typeof sub === 'string' ? sub : sub.name;
        return {
          name: subName,
          slug: subName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        };
      });
    }

    const updatedCategory = await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully!',
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Check if products exist in category
    const productsCount = await Product.countDocuments({ category: category._id });
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${productsCount} products are currently assigned to this category. Reassign or delete products first.`,
      });
    }

    if (category.image && category.image.public_id) {
      await deleteFromCloudinary(category.image.public_id);
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryByIdentifier,
  createCategory,
  updateCategory,
  deleteCategory,
};
