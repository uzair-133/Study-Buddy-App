const materialModal = require('../models/materialModal');
const { uploadFile } = require('../services/storage.service');


const uploadMaterial = async (req, res) => {
    try {
        const file = req.file || (req.files && req.files[0]);

        if (!file) {
            return res.status(400).json({ message: "File is required" });
        }

        const { category, chapterId, subjectId } = req.body;
        const fileName = req.body.fileName || file.originalname;

        if (!category || !chapterId || !subjectId) {
            return res.status(400).json({ message: "category, chapterId, and subjectId are required fields" });
        }

        const result = await uploadFile(file.buffer.toString('base64'), file.originalname || fileName);

        const userId = req.user.id || req.user._id;
        const isTeacher = req.user.role === 'teacher';

        const material = await materialModal.create({
            fileName,
            fileUrl: result.url || result.fileUrl,
            category,
            studentId: isTeacher ? null : userId,
            teacherId: isTeacher ? userId : null,
            chapterId,
            subjectId
        });

        res.status(201).json({
            message: "Material Uploaded Successfully",
            material
        });
    }
    catch (err) {
        console.error("Error in uploadMaterial:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}

const getMaterial = async (req, res) => {
    try {
        const { chapterId, subjectId, category } = req.query;
        const userId = req.user.id || req.user._id;

        const filter = {};

        if (chapterId) filter.chapterId = chapterId;
        if (subjectId) filter.subjectId = subjectId;
        if (category) filter.category = category;

        // Agar specific chapter ya subject query me nahi hai, to sirf user ke apne materials dikhayein
        if (!chapterId && !subjectId) {
            filter.$or = [{ studentId: userId }, { teacherId: userId }];
        }

        const materials = await materialModal.find(filter).sort({ createdAt: -1 });
        res.status(200).json(materials);
    }
    catch (err) {
        console.error("Error in getMaterial:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}

const deleteMaterial = async (req, res) => {
    const { materialId } = req.params;
    try {
        const userId = req.user.id || req.user._id;
        const material = await materialModal.findOneAndDelete({
            _id: materialId,
            $or: [{ studentId: userId }, { teacherId: userId }]
        });

        if (!material) {
            return res.status(404).json({ message: "Material not found or unauthorized" });
        }

        res.status(200).json({
            message: "Material deleted successfully",
            material
        });
    }
    catch (err) {
        console.error("Error in deleteMaterial:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}



module.exports = {
    uploadMaterial,
    getMaterial,
    deleteMaterial
}
