const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createClass,
  joinClass,
  getMyClass,
  getJoinedClass,
  leaveClass,
  deleteClass,
  getClassById,
} = require("../controller/classController");

router.post("/createClass", authMiddleware.authTeacher, createClass);
router.post("/classJoin", authMiddleware.authStudent, joinClass);
router.get("/getMyClass", authMiddleware.authTeacher, getMyClass);
router.get("/getJoinedClass", authMiddleware.authStudent, getJoinedClass);
// Single class detail (both teacher and student can access)
router.get("/:classId", authMiddleware.authStudent, getClassById);
// Student class leave karega
router.delete("/leaveClass/:classId", authMiddleware.authStudent, leaveClass);
// Teacher apni class delete karega
router.delete("/deleteClass/:classId", authMiddleware.authTeacher, deleteClass);

module.exports = router;
