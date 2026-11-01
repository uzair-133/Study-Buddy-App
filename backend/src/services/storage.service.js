const path = require('path');
const fs = require('fs');
const { ImageKit } = require('@imagekit/nodejs');

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

// 1. Buffer upload (Profile images / small files)
const uploadFile = async (file, originalName = 'studyMaterialFile', folder = '/studyBuddy/files') => {
  const ext = path.extname(originalName) || '';
  const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeFileName = `${baseName}_${Date.now()}${ext}`;

  const result = await client.files.upload({
    file,
    fileName: safeFileName,
    useUniqueFileName: true,
    folder: folder
  });
  return result;
};

// 2. Stream upload for study materials (Zero RAM usage - safe for 100+ concurrent uploads)
const uploadFileStream = async (filePath, originalName = 'studyMaterialFile', folder = '/studyBuddy/files') => {
  const ext = path.extname(originalName) || '';
  const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeFileName = `${baseName}_${Date.now()}${ext}`;

  const fileStream = fs.createReadStream(filePath);

  try {
    const result = await client.files.upload({
      file: fileStream,
      fileName: safeFileName,
      useUniqueFileName: true,
      folder: folder
    });
    return result;
  } finally {
    // Hamesha temp file ko disk se delete karein (chahe upload pass ho ya fail)
    fs.promises.unlink(filePath).catch((err) => {
      console.error("Temp file cleanup failed:", err.message);
    });
  }
};

module.exports = { uploadFile, uploadFileStream };
