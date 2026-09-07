const express = require('express')
const router = express.Router();
const { uploadMaterial, getMaterial, deleteMaterial } = require('../controller/materialController')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/uploadMaterial', upload.single('file'), uploadMaterial);
router.get('/materials', getMaterial);
router.delete('/materials/:materialId', deleteMaterial);