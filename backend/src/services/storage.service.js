const path = require('path');
const { ImageKit } = require('@imagekit/nodejs');

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

const uploadFile = async (file, originalName = 'studyMaterialFile') => {
    const ext = path.extname(originalName) || '';
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFileName = `${baseName}_${Date.now()}${ext}`;

    const result = await client.files.upload({
        file,
        fileName: safeFileName,
        useUniqueFileName: true,
        folder: "/00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000studyBuddyFolder/files"
    });
    return result;
}

module.exports = { uploadFile };