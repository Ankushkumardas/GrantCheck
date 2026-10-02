const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (ext === '.pdf' || mime === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type '${file.originalname}'. Only standard PDF documents are supported for grant completeness review.`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25 MB max limit
  }
});

// Helper to remove temporary file after text extraction
function removeTempFile(filePath) {
  // No-op for memory storage
}

module.exports = {
  upload,
  removeTempFile
};
