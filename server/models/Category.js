const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true, trim: true },
});

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Category name is required'], unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, default: '' },
    },
    subcategories: [subcategorySchema],
    featured: { type: Boolean, default: false },
    // Lucide icon name rendered beside the category in the navbar / home grid.
    icon: { type: String, default: 'Shirt', trim: true },
    // Controls whether the category appears in the storefront navigation.
    showInNavbar: { type: Boolean, default: true },
    // Lower numbers sort first in the navbar; ties fall back to name.
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ displayOrder: 1, name: 1 });

module.exports = mongoose.model('Category', categorySchema);
