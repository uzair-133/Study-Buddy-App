const subjectModal = require("../models/subjectModel");
const classMemberShipModel = require("../models/classMembershipModel");

// Create Subject Controller
const createSubject = async (req, res) => {
  try {
    const { title, classId } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Subject title is Required" });
    }

    const userId = req.user.id || req.user._id;
    const isTeacher = req.user.role === "teacher";

    const subjectData = {
      title: title.trim(),
      studentId: isTeacher ? null : userId,
      teacherId: isTeacher ? userId : null,
      classId: isTeacher && classId ? classId : null,
    };

    const subject = await subjectModal.create(subjectData);
    res.status(201).json({
      message: "Subject Created Successfully",
      subject,
    });
  } catch (err) {
    console.error("Create Subject Error:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// Get All Subject
const getSubject = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const isTeacher = req.user.role === "teacher";
    const { classId } = req.query;

    let filter = {};

    if (classId) {
      if (isTeacher) {
        filter = { classId, teacherId: userId };
      } else {
        // Student ke liye check karein ke student ne class join ki hui hai
        const isMember = await classMemberShipModel.findOne({
          studentId: userId,
          classId,
        });

        if (!isMember) {
          return res.status(403).json({
            message: "Aap is class ke member nahi hain",
          });
        }

        filter = { classId };
      }
    } else {
      // Agar classId na ho to sirf personal subjects
      filter = isTeacher
        ? { teacherId: userId, classId: null }
        : { studentId: userId, classId: null };
    }

    const subject = await subjectModal
      .find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Get All Subject",
      subject,
    });
  } catch (err) {
    console.error("Get Subject Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Subject
const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const userId = req.user.id || req.user._id;

    const subject = await subjectModal.findOne({
      _id: subjectId,
      $or: [{ studentId: userId }, { teacherId: userId }],
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await subject.deleteOne();

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error("Delete Subject Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createSubject,
  getSubject,
  deleteSubject,
};
