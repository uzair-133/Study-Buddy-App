const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

const subjectModal = mongoose.model("subject", subjectSchema);

module.exports = subjectModal;
