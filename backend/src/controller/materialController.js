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

    // File ko ImageKit par upload karnay kay liye
    const result = await uploadFile(file.buffer.toString("base64"), fileName, "/studyBuddy/files");

    const userId = req.user.id || req.user._id;
    const isTeacher = req.user.role === "teacher";


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
    const { chapterId, subjectId, category, page: pageQuery, limit: limitQuery } = req.query;
    const userId = req.user.id || req.user._id;

    const filter = {};
    if (chapterId) filter.chapterId = chapterId;
    if (subjectId) filter.subjectId = subjectId;
    if (category) filter.category = category;

    // Agar specific chapter/subject na ho to sirf user ke apne materials laye
    if (!chapterId && !subjectId) {
      filter.$or = [{ studentId: userId }, { teacherId: userId }];
    }

    // Pagination Validation
    if (
      pageQuery !== undefined &&
      (!/^[1-9]\d*$/.test(pageQuery) ||
        !Number.isSafeInteger(Number(pageQuery)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
    }

    if (
      limitQuery !== undefined &&
      (!/^[1-9]\d*$/.test(limitQuery) ||
        !Number.isSafeInteger(Number(limitQuery)) ||
        Number(limitQuery) > 50)
    ) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 50",
      });
    }

    const limit = Number(limitQuery ?? 10);
    const page = Number(pageQuery ?? 1);
    const skip = (page - 1) * limit;

    const totalMaterial = await materialModal.countDocuments(filter);
    const totalPages = Math.ceil(totalMaterial / limit);

    if (totalMaterial === 0) {
      return res.status(200).json({
        success: true,
        message: "No materials found",
        materials: [],
        currentPage: page,
        limit,
        totalMaterial: 0,
        totalPages: 0,
      });
    }

    if (page > totalPages) {
      return res.status(400).json({
        success: false,
        message: "Requested page is not available",
        totalPages,
      });
    }

    const materials = await materialModal
      .find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      message: "Materials fetched successfully",
      materials,
      currentPage: page,
      limit,
      totalMaterial,
      totalPages,
    });
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
