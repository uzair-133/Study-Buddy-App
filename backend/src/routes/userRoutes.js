const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const {authUser } = require('../middleware/authUser');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WebP, GIF) are allowed'), false);
    }
  }
});

const uploadProfileMiddleware = (req, res, next) => {
  upload.single('profileImage')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload Error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message || 'Error uploading file' });
    }
    next();
  });
};

router.patch('/profile', authUser, uploadProfileMiddleware, userController.updateProfile);
router.delete('/delete/:id', authUser, userController.deleteUser);
router.put('/update', authUser, userController.updateName);

module.exports = router;