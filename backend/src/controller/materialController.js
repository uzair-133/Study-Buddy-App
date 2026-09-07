const materialModal = require('../models/materialModal');
const { uploadFile } = require('../services/storage.service');


const uploadMaterial = async (req, res) => {
    try {
        const { fileName } = req.body;
        const file = req.file;

        const result = await uploadFile(file.buffer.toString('base64'))

        const material = await materialModal.create({
            uri: result.fileUrl,
            fileName,
            category
        })
        res.status(201).json({
            message: "Material Uploaded Successfully",
            material

        })
    }
    catch (err) {
        res.status(500).json({
            message: "internal server error", err
        })
    }
}
const getMaterial = async (req, res) => {

    const { studentId, chapterId, subjectId } = req.query;
    try {
        const materials = await materialModal.find({
            studentId,
            chapterId,
            subjectId

        })
        res.status(200).json(materials)
    }
    catch (err) {
        res.status(500).json({
            message: "internal server error", err
        })
    }
}
const deleteMaterial = async (req, res) => {
    const { materialId } = req.params;
    try {
        const material = await materialModal.findByIdAndDelete(materialId)  
        res.status(200).json({
            message: "Material deleted successfully",
            material
        })
    }
    catch (err) {
        res.status(500).json({
            message: "internal server error", err
        })
    }

}


module.exports = {
    uploadMaterial,
    getMaterial,
    deleteMaterial
}
