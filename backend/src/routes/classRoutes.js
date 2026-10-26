const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createClass, joinClass, getMyClass, getJoinedClass, leaveClass, deleteClass, getClassById, } = require("../controller/classController");


// /api/class/createClass
router.post("/createClass", authMiddleware.authTeacher, createClass);

// /api/class/classJoin
router.post("/classJoin", authMiddleware.authStudent, joinClass);

// /api/class/getMyClass
router.get("/getMyClass", authMiddleware.authTeacher, getMyClass);

// /api/class/getJoinedClass
router.get("/getJoinedClass", authMiddleware.authStudent, getJoinedClass);

// Single class detail (both teacher and student can access)
// /api/class/:classId
router.get("/:classId", authMiddleware.authStudent, getClassById);

// Student can only class leave 
// /api/class/leaveClass/id
router.delete("/leaveClass/:classId", authMiddleware.authStudent, leaveClass);

// Teacher apni class delete karega
//  /api/class/deleteClass/id
router.delete("/deleteClass/:classId", authMiddleware.authTeacher, deleteClass);

module.exports = router;
