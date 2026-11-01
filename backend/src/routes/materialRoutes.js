const express = require("express");
const router = express.Router();
const { uploadMaterial, getMaterial, deleteMaterial } = require("../controller/materialController");
const multer = require("multer");
const path = require("path");
const os = require("os");
const authMiddleware = require("../middleware/authMiddleware");

// OS ke temp folder me stream write hoga (0 RAM consumption per file)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max file size limit
});

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

//  POST /api/material/uploadMaterial
router.post("/uploadMaterial", authMiddleware.authStudent, uploadMiddleware, uploadMaterial);

// GET /api/material/materials
router.get("/materials", authMiddleware.authStudent, getMaterial);

// DELETE /api/material/materials/:materialId
router.delete("/materials/:materialId", authMiddleware.authStudent, deleteMaterial);

module.exports = router;
