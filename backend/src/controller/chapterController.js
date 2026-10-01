const chapterModel = require('../models/chapterModal');




//create chapter

const createChapter = async (req, res) => {
    try {
        const { title } = req.body;
        const subjectId = req.body.subjectId || req.params.subjectId;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        if (!subjectId) {
            return res.status(400).json({
                message: "subjectId is required"
            });
        }

        const userId = req.user.id || req.user._id;
        const isTeacher = req.user.role === 'teacher';

        const chapter = await chapterModel.create({
            title: title.trim(),
            subjectId,
            studentId: isTeacher ? null : userId,
            teacherId: isTeacher ? userId : null,
        });

        res.status(201).json({
            message: "Chapter Created Successfully",
            chapter
        });
    }
    catch (err) {
        console.error("Error in createChapter:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}

// get Chapter
const getChapter = async (req, res) => {
    try {
        const subjectId = req.params.subjectId || req.query.subjectId || req.body.subjectId;
        const userId = req.user.id || req.user._id;

        const filter = {};
        if (subjectId) {
            filter.subjectId = subjectId;
        } else {
            filter.$or = [{ studentId: userId }, { teacherId: userId }];
        }

        const chapter = await chapterModel.find(filter).sort({ createdAt: -1 });
        res.status(200).json({
            message: "Get All Chapter",
            chapter
        });
    }
    catch (err) {
        console.error("Error in getChapter:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
}

// delete chapter
const deleteChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const userId = req.user.id || req.user._id;
        const chapter = await chapterModel.findOne({
            _id: chapterId,
            $or: [{ studentId: userId }, { teacherId: userId }]
        });

        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        await chapter.deleteOne();
        res.status(200).json({ message: "Chapter deleted successfully" });
    }
    catch (err) {
        console.error("Error in deleteChapter:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

module.exports = {
    createChapter,
    getChapter,
    deleteChapter
}