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
    const isUserUpload = req.baseUrl.includes('user') || req.baseUrl.includes('auth');
    const folder = isUserUpload ? 'uploads/users/' : 'uploads/equipment/';
    const absolutePath = path.join(__dirname, '..', folder);
    ensureDirectoryExists(absolutePath);
    cb(null, absolutePath);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpg, jpeg, png, webp)'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;
