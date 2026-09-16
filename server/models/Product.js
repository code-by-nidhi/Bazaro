const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: String, required: true },
});

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, default: '' },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: [true, 'Product description is required'] },
    shortDescription: { type: String },
    price: { type: Number, required: [true, 'Product price is required'], min: 0 },
    discountPrice: { type: Number, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    subcategory: { type: String, required: true },
    brand: { type: String, required: true, trim: true },
    images: [imageSchema],
    stock: { type: Number, required: [true, 'Stock count is required'], default: 0, min: 0 },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numberOfReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: true },
    tags: [{ type: String, trim: true }],
    specifications: [specificationSchema],
    variants: {
      sizes: [{ type: String }],
      colors: [{ type: String }],
      weights: [{ type: String }],
      packSize: { type: String },
    },
  },
  { timestamps: true }
);

// Indexing for rapid text search
productSchema.index({ name: 'text', brand: 'text', tags: 'text', subcategory: 'text' });

module.exports = mongoose.model('Product', productSchema);
