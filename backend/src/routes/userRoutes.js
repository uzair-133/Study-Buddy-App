const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const {authUser } = require('../middleware/authUser');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max file size limit
});


router.patch('/profile', authUser, upload.single('profileImage'), userController.updateProfile);
router.delete('/delete/:id', authUser, userController.deleteUser);
router.put('/update', authUser, userController.updateName);

module.exports = router;