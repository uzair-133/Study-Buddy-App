const quizModel = require("../models/quizModel");
const subjectModel = require("../models/subjectModel");
const chapterModel = require("../models/chapterModal");
const materialModel = require("../models/materialModal");
const geminiService = require("../services/gemini.service");

/**
 * Generate Quiz Controller
 * Ek hi endpoint logic jo mode ('mcq' | 'question') aur difficulty ('easy' | 'medium' | 'difficult') handle karta hai.
 * Supports direct PDF/File uploads via Multer.
 */
const generateQuiz = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const {
      subjectId,
      chapterId,
      difficulty = "medium",
      mode = "mcq",
      questionCount = 10,
      content = "",
    } = req.body;

    let subjectName = "";
    let chapterName = "";

    // 1. Agar Subject / Chapter pass kiye hon to unke names layein
    if (subjectId) {
      const subject = await subjectModel.findById(subjectId);
      if (subject) subjectName = subject.title;
    }
    if (chapterId) {
      const chapter = await chapterModel.findById(chapterId);
      if (chapter) chapterName = chapter.title;
    }

    // 2. Direct File upload check (agar user ne naya file upload kiya ho)
    const uploadedFile = req.file || (req.files && req.files[0]);
    let fileBuffer = uploadedFile ? uploadedFile.buffer : null;
    let mimeType = uploadedFile ? uploadedFile.mimetype : null;
    if (uploadedFile && !chapterName) chapterName = uploadedFile.originalname;

    // 3. Agar direct file upload na ho to Chapter ki saved PDF ImageKit se fetch karein
    if (!fileBuffer && chapterId) {
      try {
        const chapterMaterial = await materialModel
          .findOne({ chapterId })
          .sort({ createdAt: -1 });

        if (chapterMaterial && chapterMaterial.fileUrl) {
          const fileRes = await fetch(chapterMaterial.fileUrl);
          if (fileRes.ok) {
            const arrayBuf = await fileRes.arrayBuffer();
            fileBuffer = Buffer.from(arrayBuf);
            mimeType = fileRes.headers.get("content-type") || "application/pdf";
          }
        }
      } catch (fetchErr) {
        console.warn("Chapter material fetch warning:", fetchErr.message);
      }
    }

    // 4. Fallback text content agar file na milay
    const textContent =
      content ||
      `Generate a quiz about ${subjectName || "General Topic"} ${
        chapterName ? "- " + chapterName : ""
      }. Focus on core concepts.`;

    // 4. Gemini AI se quiz generate karein
    const questions = await geminiService.generateQuizContent({
      textContent,
      fileBuffer,
      mimeType,
      difficulty,
      mode,
      questionCount: Number(questionCount) || 10,
      subjectName,
      chapterName,
    });

    // 5. Database me quiz record save karein
    const quiz = await quizModel.create({
      userId,
      subjectId: subjectId || null,
      chapterId: chapterId || null,
      subjectName: subjectName || "General",
      chapterName: chapterName || (uploadedFile ? uploadedFile.originalname : "General"),
      difficulty: String(difficulty).toLowerCase(),
      mode: String(mode).toLowerCase(),
      questionCount: questions.length,
      questions,
      score: 0,
      totalQuestions: questions.length,
      status: "generated",
    });

    res.status(201).json({
      success: true,
      message: "Quiz generated successfully",
      quiz,
    });
  } catch (error) {
    console.error("Generate Quiz Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate quiz",
    });
  }
};

/**
 * Submit Quiz Results (for MCQ mode submission or saving score)
 */
const submitQuizResult = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params; // quizId
    const { answers } = req.body; // array of { questionId, selectedAnswer } or { index, selectedAnswer }

    const quiz = await quizModel.findOne({
      _id: id,
      $or: [{ userId }, { studentId: userId }],
    });
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    let score = 0;

    if (Array.isArray(answers) && quiz.mode === "mcq") {
      answers.forEach((ans) => {
        let questionItem = null;

        if (ans.questionId) {
          questionItem = quiz.questions.id(ans.questionId);
        } else if (typeof ans.index === "number" && quiz.questions[ans.index]) {
          questionItem = quiz.questions[ans.index];
        }

        if (questionItem) {
          questionItem.userAnswer = ans.selectedAnswer;
          const isMatch =
            String(questionItem.correctAnswer).trim().toLowerCase() ===
            String(ans.selectedAnswer).trim().toLowerCase();

          questionItem.isCorrect = isMatch;
          if (isMatch) score++;
        }
      });
    }

    quiz.score = score;
    quiz.status = "completed";
    await quiz.save();

    return res.status(200).json({
      success: true,
      message: "Quiz score submitted successfully",
      score,
      totalQuestions: quiz.totalQuestions,
      quiz,
    });
  } catch (error) {
    console.error("Error in submitQuizResult controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz results",
    });
  }
};

/**
 * Get Student Quiz History (Recent Quizzes list)
 */
const getStudentQuizzes = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const quizzes = await quizModel
      .find({ $or: [{ userId }, { studentId: userId }] })
      .populate("subjectId", "title")
      .populate("chapterId", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    console.error("Error in getStudentQuizzes controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student quizzes",
    });
  }
};

/**
 * Get Single Quiz Details by ID
 */
const getQuizById = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    const quiz = await quizModel
      .findOne({
        _id: id,
        $or: [{ userId }, { studentId: userId }],
      })
      .populate("subjectId", "title")
      .populate("chapterId", "title");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    return res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("Error in getQuizById controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz details",
    });
  }
};

/**
 * Delete Quiz History Item
 */
const deleteQuiz = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { id } = req.params;

    const deleted = await quizModel.findOneAndDelete({
      _id: id,
      $or: [{ userId }, { studentId: userId }],
    });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteQuiz controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete quiz",
    });
  }
};

/**
 * Ask AI Assistant Follow-Up Question Controller
 */
const askAssistant = async (req, res) => {
  try {
    const { questionsText, userQuery } = req.body;
    if (!userQuery) {
      return res
        .status(400)
        .json({ success: false, message: "userQuery is required" });
    }

    const answer = await geminiService.askQuizAssistant({
      questionsText,
      userQuery,
    });
    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("Error in askAssistant controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get answer from AI Assistant",
    });
  }
};

module.exports = {
  generateQuiz,
  submitQuizResult,
  getStudentQuizzes,
  getQuizById,
  deleteQuiz,
  askAssistant,
};
