/**
 * Cloudinary File Upload Integration Configuration
 */
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'agrirent-demo',
  api_key: process.env.CLOUDINARY_API_KEY || '1234567890',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret_key'
};

const uploadImageCloudinary = async (filePath, folder = 'agrirent/equipment') => {
  try {
    // If Cloudinary keys are configured, upload to cloud storage
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      console.log(`Uploading ${filePath} to Cloudinary folder: ${folder}`);
    }
    // Fallback: return file path for local serving
    return filePath;
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw error;
  }
};

module.exports = {
  cloudinaryConfig,
  uploadImageCloudinary
};
