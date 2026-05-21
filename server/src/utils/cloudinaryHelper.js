const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const uploadImage = async (fileBuffer, folder = 'phonebook') => {
  if (!fileBuffer) return null;

  if (!isCloudinaryConfigured()) {
    // Fallback: return base64 Data URI so images render during local testing
    return `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto:good' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary stream upload error:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteImage = async (imageUrl) => {
  if (!imageUrl || !isCloudinaryConfigured()) return;

  if (imageUrl.includes('res.cloudinary.com')) {
    try {
      // Cloudinary URL structure: https://res.cloudinary.com/cloud-name/image/upload/v12345/folder/public-id.ext
      const parts = imageUrl.split('/');
      const uploadIdx = parts.indexOf('upload');
      
      if (uploadIdx !== -1) {
        // public ID is everything after the version segment (v12345)
        const pathSegments = parts.slice(uploadIdx + 2); // skips version
        const lastSegment = pathSegments[pathSegments.length - 1];
        const dotIdx = lastSegment.lastIndexOf('.');
        
        pathSegments[pathSegments.length - 1] = lastSegment.substring(0, dotIdx);
        const publicId = pathSegments.join('/');
        
        await cloudinary.uploader.destroy(publicId);
        console.log(`Cloudinary image deleted successfully: ${publicId}`);
      }
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error.message);
    }
  }
};

module.exports = {
  uploadImage,
  deleteImage
};
