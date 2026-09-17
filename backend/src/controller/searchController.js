const subjectModel = require("../models/subjectModel");
const chapterModel = require("../models/chapterModal");
const materialModel = require("../models/materialModal");

const searchAll = async (req, res) => {
  try {
    const { keyword, category } = req.query;

    if (!keyword || !keyword.trim()) {
      return res.status(200).json({
        message: "Get All Data",
        allData: { subject: [], chapter: [], material: [] },
      });
    }

    const studentId = req.user.id;
    const regex = { $regex: keyword.trim(), $options: "i" };

    const subject =
      !category || category === "all" || category === "subject"
        ? await subjectModel
            .find({ title: regex, studentId })
            .sort({ createdAt: -1 })
        : [];

    const chapter =
      !category || category === "all" || category === "chapter"
        ? await chapterModel
            .find({ title: regex, studentId })
            .populate("subjectId", "title")
            .sort({ createdAt: -1 })
        : [];

    const material =
      !category ||
      category === "all" ||
      category === "files" ||
      category === "material"
        ? await materialModel
            .find({ fileName: regex, studentId })
            .populate("subjectId", "title")
            .populate("chapterId", "title")
            .sort({ createdAt: -1 })
        : [];

    res.status(200).json({
      message: "Get All Data",
      allData: { subject, chapter, material },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { searchAll };
