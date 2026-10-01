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

materialSchema.pre("validate",function(next) {
    const isStudent = this.studentId && !this.teacherId
    const isTeacher = this.teacherId && !this.studentId
    if(!isStudent && !isTeacher){
        next(
            new Error("teacher ya student id required hai")
        )
    }
    else{
        next()
    }
})

const materialModel = mongoose.model("material", materialSchema);

module.exports = materialModel;



