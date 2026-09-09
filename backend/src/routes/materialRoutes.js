const express = require("express");
const router = express.Router();
const { uploadMaterial, getMaterial, deleteMaterial, } = require("../controller/materialController");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB max file size limit
});
const authMiddleware = require("../middleware/authMiddleware");



const uploadMiddleware = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `Upload Error: ${err.message}` });
    }
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

router.post( "/uploadMaterial",authMiddleware.authStudent,  uploadMiddleware, uploadMaterial);
router.get("/materials", authMiddleware.authStudent, getMaterial);
router.delete(  "/materials/:materialId", authMiddleware.authStudent,  deleteMaterial);


module.exports = router;

