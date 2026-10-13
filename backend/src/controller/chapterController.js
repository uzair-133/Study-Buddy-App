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
        const {page:pageQuery,limit:limitQuery} = req.query;
    


        const filter = {};
        if (subjectId) {
            filter.subjectId = subjectId;
        } else {
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

    const page = Number(pageQuery ?? 1);
    const limit = Number(limitQuery ?? 10);
    const skip = (page - 1) * limit;
     const totalChapter = await chapterModel.countDocuments(filter);
   const totalPages = Math.ceil(totalChapter/limit)

       if (totalChapter === 0) {
      return res.status(200).json({
        success: true,
        message: "No Chapter found",
        chapter: [],
        currentPage: page,
        limit,
        totalChapter: 0,
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
        const chapter = await chapterModel.find(filter).sort({ createdAt: -1,_id:-1 }).skip(skip).limit(limit);
        res.status(200).json({
            success: true,
            message: "Get All Chapter",
            chapter,
            currentPage: page,
            limit,
            totalChapter,
            totalPages,
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