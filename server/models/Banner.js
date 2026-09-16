const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, default: '' },
    },
    link: { type: String, default: '/shop' },
    category: { type: String },
    active: { type: Boolean, default: true },
    position: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
