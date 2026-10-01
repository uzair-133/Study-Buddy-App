const mongoose = require("mongoose");



const chapterSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    required: true
},
studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null
},
teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null
}
},{timestamps:true});

const chapterModel = mongoose.model("chapter",chapterSchema);

module.exports = chapterModel;