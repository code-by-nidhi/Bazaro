const Banner = require('../models/Banner');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUtil');

// @desc    Get active banners
// @route   GET /api/v1/banners
// @access  Public
const getActiveBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ position: 1 });
    res.json({ success: true, count: banners.length, banners });
  } catch (error) {
    next(error);
  }
};

// @desc    Create banner
// @route   POST /api/v1/banners
// @access  Private (Admin)
const createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, link, category, position, active } = req.body;

    let imageResult = {
      url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80',
      public_id: '',
    };

    if (req.file) {
      imageResult = await uploadToCloudinary(req.file.buffer, 'bazaro/banners');
    } else if (req.body.imageUrl) {
      imageResult = { url: req.body.imageUrl, public_id: '' };
    }

    const banner = await Banner.create({
      title,
      subtitle,
      image: imageResult,
      link: link || '/shop',
      category: category || 'General',
      position: position ? Number(position) : 1,
      active: active === 'true' || active === true || active === undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Banner created successfully!',
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/v1/banners/:id
// @access  Private (Admin)
const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found.' });
    }
    if (banner.image && banner.image.public_id) {
      await deleteFromCloudinary(banner.image.public_id);
    }
    await banner.deleteOne();
    res.json({ success: true, message: 'Banner deleted successfully!' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActiveBanners,
  createBanner,
  deleteBanner,
};
