const classModel = require("../models/classModel");
const classMemberShipModel = require("../models/classMembershipModel");
const { generateJoinCode } = require("../utils/generateJoinCode");

const createClass = async (req, res) => {
  try {
    const { className } = req.body;
    const teacherId = req.user?._id || req.user?.id || req.body.teacherId;

    if (!className || !teacherId) {
      return res.status(400).json({
        success: false,
        message: "ClassName And Teacher Id is required",
      });
    }

    const code = await generateJoinCode();

    const classData = await classModel.create({
      className: className.trim(),
      teacherId,
      joinCode: code,
    });
    res.status(201).json({
      success: true,
      message: "Class Created Successfully",
      data: classData,
    });
  } catch (err) {
    console.error("Create class error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const joinClass = async (req, res) => {
  try {
    const { joinCode } = req.body;
    const studentId = req.user?._id || req.user?.id || req.body.studentId;

    if (!joinCode) {
      return res.status(400).json({
        success: false,
        message: "Enter Join Code",
      });
    }

    const targetedClass = await classModel.findOne({
      joinCode: joinCode.trim().toUpperCase(),
    });
    if (!targetedClass) {
      return res.status(500).json({
        success: false,
        message: "No class Match with this Code",
      });
    }
    const alreadyJoined = await classMemberShipModel.findOne({
      studentId,
      classId: targetedClass._id,
    });

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: "Already Joined",
      });
    }
    const membership = await classMemberShipModel.create({
      studentId,
      classId: targetedClass._id,
    });
    return res.status(200).json({
      success: true,
      message: `${targetedClass.className} class joined successfully!`,
      data: membership,
    });
  } catch (error) {
    console.error("Join Class Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyClass = async (req, res) => {
  try {
    const teacherId = req.user?._id || req.user?.id;
    if (!teacherId) {
      return res.status(500).json({
        success: false,
        message: "TeacherId Is required",
      });
    }
    const allClass = await classModel
      .find({ teacherId })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Get All Classes",
      allclass: allClass,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "internel server error",
    });
  }
};

const getJoinedClass = async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id;
    if (!studentId) {
      return res.status(500).json({
        success: false,
        message: "StudentId Is required",
      });
    }
    const allJoined = await classMemberShipModel
      .find({ studentId })
      .populate({
        path: "classId",
        populate: { path: "teacherId", select: "name email profileImage" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Joined Classes successfully fetched",
      count: allJoined.length,
      data: allJoined,
    });
  } catch (err) {
    console.error("Get Joined Class Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// sirf 1 specific student wo class chor raha hai baki kay pass wo class rahya gi
const leaveClass = async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id;
    const { classId } = req.params;

    const membership = await classMemberShipModel.findOneAndDelete({
      studentId,
      classId,
    });
    if (!membership) {
      return res.status(404).json({
        success: false,
        message:
          "you are not a member of this class this class is already leave",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Class successfully left",
    });
  } catch (error) {
    console.error("Leave Class Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// Delete Class Controller
const deleteClass = async (req, res) => {
  try {
    const teacherId = req.user?._id || req.user?.id;
    const { classId } = req.params;

    const deletedClass = await classModel.findOneAndDelete({
      _id: classId,
      teacherId,
    });

    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message:
          "Class nahi mili ya aapke paas delete karne ka ikhtiyar nahi hai",
      });
    }

    await classMemberShipModel.deleteMany({ classId });

    return res.status(200).json({
      success: true,
      message: `${deletedClass.className} class aur uske members successfully delete ho gaye`,
    });
  } catch (error) {
    console.error("Delete Class Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Single Class by ID
const getClassById = async (req, res) => {
  try {
    const { classId } = req.params;
    const targetedClass = await classModel.findById(classId);
    if (!targetedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: targetedClass,
    });
  } catch (error) {
    console.error("Get Class By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createClass,
  joinClass,
  getMyClass,
  getJoinedClass,
  leaveClass,
  deleteClass,
  getClassById,
};
