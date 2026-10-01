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
      default: null,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "class",
      default: null,
    },
  },
  { timestamps: true },
);

subjectSchema.pre("validate", function (next) {
  const isPersonal = this.studentId && !this.classId
  const classSubject = this.teacherId && this.classId && !this.studentId

  if (!isPersonal && !classSubject) {
    next(
      new Error("Subject student ka personal ho,Ya class ka jo teacher nay create ki hai")
    )
  }
  else {
    next()
  }

})

const subjectModal = mongoose.model("subject", subjectSchema);

module.exports = subjectModal;
