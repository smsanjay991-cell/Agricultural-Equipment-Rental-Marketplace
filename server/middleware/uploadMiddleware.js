const multer = require('multer');
const path = require('path');
const fs = require('fs');

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const isUserUpload = req.baseUrl && (req.baseUrl.includes('user') || req.baseUrl.includes('auth'));
    const folder = isUserUpload ? 'uploads/users/' : 'uploads/equipment/';
    const absolutePath = path.join(__dirname, '..', folder);
    ensureDirectoryExists(absolutePath);
    cb(null, absolutePath);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E6)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const prefix = req.baseUrl && (req.baseUrl.includes('user') || req.baseUrl.includes('auth')) ? 'user' : 'equipment';
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  }
});

function checkFileType(file, cb) {
  const allowedExtensions = /^\.(jpg|jpeg|png|webp)$/i;
  const allowedMimeTypes = /^image\/(jpeg|png|webp|x-png)$/i;

  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    const error = new Error('Invalid file type! Allowed image formats: jpg, jpeg, png, webp');
    error.code = 'INVALID_FILE_TYPE';
    return cb(error, false);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max limit
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  }
});

// Express middleware wrapper to catch Multer errors & return proper HTTP responses
const uploadSingleImage = (fieldname = 'image') => {
  return (req, res, next) => {
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      const uploader = upload.single(fieldname);
      uploader(req, res, (err) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              return res.status(413).json({
                success: false,
                message: 'File size exceeds maximum limit of 5MB'
              });
            }
            return res.status(400).json({
              success: false,
              message: `Upload error: ${err.message}`
            });
          } else if (err) {
            const status = err.code === 'INVALID_FILE_TYPE' ? 400 : 500;
            return res.status(status).json({
              success: false,
              message: err.message || 'Upload failed'
            });
          }
        }
        next();
      });
    } else {
      next();
    }
  };
};

module.exports = upload;
module.exports.uploadSingleImage = uploadSingleImage;
