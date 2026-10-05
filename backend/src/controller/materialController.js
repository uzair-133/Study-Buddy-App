const materialModal = require("../models/materialModal");
const { uploadFile } = require("../services/storage.service");

// 1. Upload Study Material Controller
const uploadMaterial = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const { category, chapterId, subjectId } = req.body;
    const fileName = req.body.fileName || file.originalname;

    if (!category || !chapterId || !subjectId) {
      return res.status(400).json({ message: "category, chapterId, and subjectId are required" });
    }

    // File ko ImageKit par upload karein
    const result = await uploadFile(file.buffer.toString("base64"), fileName, "/studyBuddy/files");

    const userId = req.user.id || req.user._id;
    const isTeacher = req.user.role === "teacher";

    // Material database me save karein
    const material = await materialModal.create({
      fileName,
      fileUrl: result.url,
      category,
      studentId: isTeacher ? null : userId,
      teacherId: isTeacher ? userId : null,
      chapterId,
      subjectId,
    });

    res.status(201).json({
      message: "Material Uploaded Successfully",
      material,
    });
  } catch (err) {
    console.error("Upload Material Error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// 2. Get Study Materials Controller
const getMaterial = async (req, res) => {
  try {
    const { chapterId, subjectId, category } = req.query;
    const userId = req.user.id || req.user._id;

    const filter = {};
    if (chapterId) filter.chapterId = chapterId;
    if (subjectId) filter.subjectId = subjectId;
    if (category) filter.category = category;

    // Agar specific chapter/subject na ho to sirf user ke apne materials laye
    if (!chapterId && !subjectId) {
      filter.$or = [{ studentId: userId }, { teacherId: userId }];
    }

    const materials = await materialModal.find(filter).sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// 3. Delete Study Material Controller
const deleteMaterial = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const material = await materialModal.findOneAndDelete({
      _id: req.params.materialId,
      $or: [{ studentId: userId }, { teacherId: userId }],
    });

    if (!material) {
      return res.status(404).json({ message: "Material not found or unauthorized" });
    }

    res.status(200).json({
      message: "Material deleted successfully",
      material,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = {
  uploadMaterial,
  getMaterial,
  deleteMaterial,
};
