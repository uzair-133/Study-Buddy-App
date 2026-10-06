const mongoose = require("mongoose")


const materialSchema = new mongoose.Schema({
    fileName: {
        type: String, required: true
    },
    fileUrl: {
        type: String, required: true
    },
    category: {
        type: String, enum: ["lecture", "handwritten", "slide", "important_question"], required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId, ref: "user", default: null
    },
    teacherId:{
        type:mongoose.Schema.Types.ObjectId, ref:"user", default:null
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId, ref: "chapter", required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId, ref: "subject", required: true
    },
}, { timestamps: true })

materialSchema.index({
    studentId:1
})
materialSchema.index({
    teacherId:1
})
materialSchema.index({
    chapterId: 1,
    category: 1,
    createdAt: -1,
});
materialSchema.index({
    subjectId: 1,
    category: 1,
    createdAt: -1,
});

materialSchema.pre("validate", function() {
    const isStudent = this.studentId && !this.teacherId;
    const isTeacher = this.teacherId && !this.studentId;
    if (!isStudent && !isTeacher) {
        throw new Error("teacher ya student id required hai");
    }
});

const materialModel = mongoose.model("material", materialSchema);

module.exports = materialModel;



