const subjectModel = require("../models/subjectModel");
const chapterModel = require("../models/chapterModal");
const materialModel = require("../models/materialModal");
const classMemberShipModel = require("../models/classMembershipModel");

// Search Controller (Subjects, Chapters, Materials)
const searchAll = async (req, res) => {
  try {
    const { keyword, category } = req.query;

    // Agar keyword empty ho to empty results return karein
    if (!keyword || !keyword.trim()) {
      return res.status(200).json({
        message: "Get All Data",
        allData: { subject: [], chapter: [], material: [] },
      });
    }

    const userId = req.user.id || req.user._id;
    const isTeacher = req.user.role === "teacher";
    const regex = { $regex: keyword.trim(), $options: "i" };

    let subjectFilter = { title: regex };
    let chapterFilter = { title: regex };
    let materialFilter = { fileName: regex };

    // Teacher ya Student ke mutabiq permissions set karein
    if (isTeacher) {
      subjectFilter.teacherId = userId;
      chapterFilter.teacherId = userId;
      materialFilter.teacherId = userId;
    } else {
      // Student: Joined classes + Personal data
      const memberships = await classMemberShipModel.find({ studentId: userId }).select("classId");
      const classIds = memberships.map((m) => m.classId);

      const userSubjects = await subjectModel
        .find({ $or: [{ studentId: userId }, { classId: { $in: classIds } }] })
        .select("_id");
      const subjectIds = userSubjects.map((s) => s._id);

      subjectFilter.$or = [{ studentId: userId }, { classId: { $in: classIds } }];
      chapterFilter.$or = [{ studentId: userId }, { subjectId: { $in: subjectIds } }];
      materialFilter.$or = [{ studentId: userId }, { subjectId: { $in: subjectIds } }];
    }

    // Category ke mutabiq queries run karein
    const needAll = !category || category === "all";

    const subject = (needAll || category === "subject")
      ? await subjectModel.find(subjectFilter).sort({ createdAt: -1 }).limit(10)
      : [];

    const chapter = (needAll || category === "chapter")
      ? await chapterModel.find(chapterFilter).populate("subjectId", "title").sort({ createdAt: -1 }).limit(10)
      : [];

    const material = (needAll || category === "material" || category === "files")
      ? await materialModel
          .find(materialFilter)
          .populate("subjectId", "title")
          .populate("chapterId", "title")
          .sort({ createdAt: -1 })
          .limit(10)
      : [];

    res.status(200).json({
      message: "Get All Data",
      allData: { subject, chapter, material },
    });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { searchAll };
