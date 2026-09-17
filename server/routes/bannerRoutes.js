const express = require('express');
const router = express.Router();
const {
  getActiveBanners,
  createBanner,
  deleteBanner,
} = require('../controllers/bannerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { createBannerRules } = require('../middleware/validateMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getActiveBanners);
router.post('/', protect, adminOnly, upload.single('image'), createBannerRules, createBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

module.exports = router;
