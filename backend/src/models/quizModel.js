const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
    },
  ],
  correctAnswer: {
    type: String,
  },
  userAnswer: {
    type: String,
    default: null,
  },
  isCorrect: {
    type: Boolean,
    default: null,
  },
});

const quizSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subject",
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chapter",
    },
    subjectName: {
      type: String,
      default: "",
    },
    chapterName: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "difficult"],
      default: "medium",
      required: true,
    },
    mode: {
      type: String,
      enum: ["mcq", "question"],
      default: "mcq",
      required: true,
    },
    questionCount: {
      type: Number,
      default: 10,
    },
    questions: [quizQuestionSchema],
    score: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["generated", "completed"],
      default: "generated",
    },
  },
  { timestamps: true, strictPopulate: false }
);

module.exports = mongoose.model("Quiz", quizSchema);
