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

    // Case A: Dashboard (Sirf 4 latest cards)
    if (dashboard === "true") {
      const subject = await getDashboardSubjects(userId, isTeacher);
      return res.status(200).json({ message: "Dashboard Subjects", subject });
    }

    // Case B: Kisi specific Class ke subjects
    if (classId) {
      if (!isTeacher) {
        const isMember = await classMemberShipModel.findOne({ studentId: userId, classId });
        if (!isMember) {
          return res.status(403).json({ message: "Aap is class ke member nahi hain" });
        }
      }
      const subject = await subjectModal.find({ classId }).sort({ createdAt: -1 });
      return res.status(200).json({ message: "Class Subjects", subject });
    }

    // Case C: User ke apne Personal subjects
    const filter = isTeacher
      ? { teacherId: userId, classId: null }
      : { studentId: userId, classId: null };

    const subject = await subjectModal.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ message: "Personal Subjects", subject });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
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
