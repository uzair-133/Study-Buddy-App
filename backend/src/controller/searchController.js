const subjectModel = require("../models/subjectModel");
const chapterModel = require("../models/chapterModal");
const materialModel = require("../models/materialModal");


const searchAll = async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword) {
            return res.status(400).json({ message: "Keyword is required" })
        }
        const subject = await subjectModel.find({
            title: { $regex: keyword, $options: "i" },
            studentId: req.user.id,
        })

        const chapter = await chapterModel.find({
            title: { $regex: keyword, $options: "i" },
            studentId: req.user.id,
        })

        const material = await materialModel.find({
            fileName: { $regex: keyword, $options: "i" },
            studentId: req.user.id,
        })

        const allData = {
            subject: subject,
            chapter: chapter,
            material: material
        }
        res.status(200).json({
            message: "Get All Data",
            allData
        })
    }
    catch (err) {
        res.status(500).json({
            message: "internal Server Error"
        })
    }
}


module.exports = {searchAll}