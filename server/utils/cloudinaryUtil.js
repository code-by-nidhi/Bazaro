const cloudinary = require('../config/cloudinary');

/**
 * Upload buffer or file to Cloudinary with fallback handling.
 * If Cloudinary is unconfigured or fails, returns standard placeholder structure.
 */
const uploadToCloudinary = (fileBuffer, folder = 'bazaro/products') => {
  return new Promise((resolve) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'demo') {
      // Fallback response for unconfigured Cloudinary credentials
      return resolve({
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        public_id: `fallback_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error || !result) {
          console.warn('[Cloudinary Upload Fallback]:', error?.message || 'Upload failed');
          return resolve({
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            public_id: `fallback_${Date.now()}`,
          });
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId.startsWith('fallback_')) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.warn('[Cloudinary Delete Warning]:', error.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
