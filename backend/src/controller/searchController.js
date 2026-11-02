const mongoose = require("mongoose");
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

    const userObjId = new mongoose.Types.ObjectId(userId);
    const isTeacher = req.user.role === "teacher";
    const regex = { $regex: keyword.trim(), $options: "i" };

    let subjectFilter = { title: regex };
    let chapterFilter = { title: regex };
    let materialFilter = { fileName: regex };

    // Teacher ya Student ke mutabiq permissions set karein
    if (isTeacher) {
      subjectFilter.teacherId = userObjId;
      chapterFilter.teacherId = userObjId;
      materialFilter.teacherId = userObjId;
    } else {
      // Student: Joined classes + Personal data
      const memberships = await classMemberShipModel
        .find({ studentId: userObjId })
        .select("classId")
        .lean();
      const classIds = memberships.map((m) => m.classId);

      const userSubjects = await subjectModel
        .find({ $or: [{ studentId: userObjId }, { classId: { $in: classIds } }] })
        .select("_id")
        .lean();
      const subjectIds = userSubjects.map((s) => s._id);

      subjectFilter.$or = [{ studentId: userObjId }, { classId: { $in: classIds } }];
      chapterFilter.$or = [{ studentId: userObjId }, { subjectId: { $in: subjectIds } }];
      materialFilter.$or = [{ studentId: userObjId }, { subjectId: { $in: subjectIds } }];
    }

    const needAll = !category || category === "all";

    // 1. Subject Pipeline: $match -> $sort -> $limit
    const subjectPromise = (needAll || category === "subject")
      ? subjectModel.aggregate([
          { $match: subjectFilter },
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
        ])
      : Promise.resolve([]);

    // 2. Chapter Pipeline: $match -> $sort -> $limit -> $lookup (subjects) -> $unwind -> $project
    const chapterPromise = (needAll || category === "chapter")
      ? chapterModel.aggregate([
          { $match: chapterFilter },
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "subjects",
              localField: "subjectId",
              foreignField: "_id",
              as: "subjectDetails",
            },
          },
          {
            $unwind: {
              path: "$subjectDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              title: 1,
              createdAt: 1,
              updatedAt: 1,
              subjectId: {
                _id: "$subjectDetails._id",
                title: "$subjectDetails.title",
              },
            },
          },
        ])
      : Promise.resolve([]);

    // 3. Material Pipeline: $match -> $sort -> $limit -> $lookup (subjects) -> $unwind -> $lookup (chapters) -> $unwind -> $project
    const materialPromise = (needAll || category === "material" || category === "files")
      ? materialModel.aggregate([
          { $match: materialFilter },
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "subjects",
              localField: "subjectId",
              foreignField: "_id",
              as: "subjectDetails",
            },
          },
          {
            $unwind: {
              path: "$subjectDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "chapters",
              localField: "chapterId",
              foreignField: "_id",
              as: "chapterDetails",
            },
          },
          {
            $unwind: {
              path: "$chapterDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              fileName: 1,
              fileUrl: 1,
              category: 1,
              createdAt: 1,
              subjectId: {
                _id: "$subjectDetails._id",
                title: "$subjectDetails.title",
              },
              chapterId: {
                _id: "$chapterDetails._id",
                title: "$chapterDetails.title",
              },
            },
          },
        ])
      : Promise.resolve([]);

    // Teeno pipelines ko parallel run karein (Maximum Speed)
    const [subject, chapter, material] = await Promise.all([
      subjectPromise,
      chapterPromise,
      materialPromise,
    ]);

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
