const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max file upload limit
});

const uploadMiddleware = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ message: `Upload Error: ${err.message}` });
    }
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

const {
  generateQuiz,
  submitQuizResult,
  getStudentQuizzes,
  getQuizById,
  deleteQuiz,
  askAssistant
} = require("../controller/quizController");
const { authStudent } = require("../middleware/authMiddleware");

// Single endpoint for generating quizzes (MCQ or Question Only mode) with optional PDF file upload
router.post("/generate", authStudent, uploadMiddleware, generateQuiz);

// Ask AI Assistant follow-up question
router.post("/ask-assistant", authStudent, askAssistant);

// Submit quiz score / user answers
router.post("/submit/:id", authStudent, submitQuizResult);

// Get student quiz history
router.get("/history", authStudent, getStudentQuizzes);

// Get single quiz by ID
router.get("/:id", authStudent, getQuizById);

// Delete quiz from history
router.delete("/:id", authStudent, deleteQuiz);

module.exports = router;
