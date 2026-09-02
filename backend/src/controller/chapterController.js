const chapterModel = require('../models/chapterModal');




//create chapter

const createChapter = async (req, res) => {
    try {
        const { title } = req.body;
        const { subjectId } = req.params
        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            })
        }
        const chapter = await chapterModel.create({
            title,
            subjectId,              // ✅ URL se mili hui subjectId
            studentId: req.user.id   // ✅ token se mili hui student ID
        })
        res.status(201).json({
            message: "Chapter Created Successfully",
            chapter
        })
    }
    catch (err) {
        res.status(500).json({
            message: "internal server error"
        })

    }
}

// get Chapter
const getChapter = async (req, res) => {
    try {

        const { subjectId } = req.params 
        const chapter = await chapterModel.find({
          subjectId   // ✅ is Subject ke Chapters dhoondo
        }).sort({ createdAt: -1 })
        res.status(201).json({
            message: "Get All Chapter",
            chapter
        })
    }
    catch (err) {
        res.status(500).json({
            message: "internal server error"
        })

    }
}


// delete chapter


const deleteChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const chapter = await chapterModel.findOne({
            _id: chapterId,
            studentId: req.user.id  
        })

        if (!chapter) {
            return res.status(404).json({ message: "Subject not found" })
        }
        await chapter.deleteOne();
        res.status(200).json({ message: "Subject deleted successfully" })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = {
    createChapter,
    getChapter,
    deleteChapter
}