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

subjectSchema.index({studentId:1})
subjectSchema.index({teacherId:1})
subjectSchema.index({classId:1})


subjectSchema.pre("validate", function () {
  const isStudentPersonal = this.studentId && !this.teacherId && !this.classId;
  const isTeacherPersonal = this.teacherId && !this.studentId && !this.classId;
  const isClassSubject = this.teacherId && this.classId && !this.studentId;

  if (!isStudentPersonal && !isTeacherPersonal && !isClassSubject) {
    throw new Error(
      "Subject student ya teacher ka personal ho, ya class ka jo teacher ne create ki hai"
    );
  }
});

const subjectModal = mongoose.model("subject", subjectSchema);

module.exports = subjectModal;
