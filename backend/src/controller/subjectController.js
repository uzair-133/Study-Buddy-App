const subjectModal = require("../models/subjectModel");
const classMemberShipModel = require("../models/classMembershipModel");

// 1. Create Subject Controller
const createSubject = async (req, res) => {
  try {
    const { title, classId } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Subject title is required" });
    }

    const userId = req.user.id || req.user._id;
    const isTeacher = req.user.role === "teacher";

    const subject = await subjectModal.create({
      title: title.trim(),
      studentId: isTeacher ? null : userId,
      teacherId: isTeacher ? userId : null,
      classId: isTeacher && classId ? classId : null,
    });

    res.status(201).json({ message: "Subject Created Successfully", subject });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Helper: Dashboard ke 4 cards (2 personal + 2 class subjects)
const getDashboardSubjects = async (userId, isTeacher) => {
  if (!isTeacher) {
    // Student: 2 personal + 2 joined class subjects
    const personal = await subjectModal
      .find({ studentId: userId, classId: null })
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();
    personal.forEach((s) => (s.type = "personal"));

    const memberships = await classMemberShipModel.find({ studentId: userId }).select("classId");
    const classIds = memberships.map((m) => m.classId);

    const joined = await subjectModal
      .find({ classId: { $in: classIds } })
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();
    joined.forEach((s) => (s.type = "joined"));

    return [...personal, ...joined];
  } else {
    // Teacher: 2 personal + 2 class subjects
    const personal = await subjectModal
      .find({ teacherId: userId, classId: null })
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();
    personal.forEach((s) => (s.type = "personal"));

    const classSubjects = await subjectModal
      .find({ teacherId: userId, classId: { $ne: null } })
      .sort({ createdAt: -1 })
      .limit(2)
      .lean();
    classSubjects.forEach((s) => (s.type = "joined"));

    return [...personal, ...classSubjects];
  }
};

// 2. Get Subjects Controller (Dashboard, Class, ya Personal)
const getSubject = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const isTeacher = req.user.role === "teacher";
    const { classId, dashboard } = req.query;
    const {page:pageQuery,limit:limitQuery } = req.query;

    // Case A: Dashboard (Sirf 4 latest cards)
    if (dashboard === "true") {
      const subject = await getDashboardSubjects(userId, isTeacher);
      return res.status(200).json({ message: "Dashboard Subjects", subject });
    }

    // Case B vs Case C: Determine filter and response message
    let filter;
    let messageType;

    if (classId) {
      if (!isTeacher) {
        const isMember = await classMemberShipModel.findOne({ studentId: userId, classId });
        if (!isMember) {
          return res.status(403).json({ message: "Aap is class ke member nahi hain" });
        }
      }
      filter = { classId };
      messageType = "Class Subjects";
    } else {
      filter = isTeacher
        ? { teacherId: userId, classId: null }
        : { studentId: userId, classId: null };
      messageType = "Personal Subjects";
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

    const totalSubject = await subjectModal.countDocuments(filter);
    const totalPages = Math.ceil(totalSubject / limit);

    if (totalSubject === 0) {
      return res.status(200).json({
        success: true,
        message: "No subject found",
        subject: [],
        currentPage: page,
        limit,
        totalSubject: 0,
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

    const subject = await subjectModal
      .find(filter)
      .sort({ createdAt: -1,_id:-1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: messageType,
      subject,
      currentPage: page,
      limit,
      totalSubject,
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// 3. Delete Subject Controller
const deleteSubject = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const subject = await subjectModal.findOneAndDelete({
      _id: req.params.subjectId,
      $or: [{ studentId: userId }, { teacherId: userId }],
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 4. Get Single Subject By ID Controller
const getSubjectById = async (req, res) => {
  try {
    const subject = await subjectModal.findById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json({ subject });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createSubject,
  getSubject,
  deleteSubject,
  getSubjectById,
};
