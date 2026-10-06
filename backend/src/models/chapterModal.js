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


chapterSchema.index({
    subjectId:1,
    createdAt: -1
})
chapterSchema.index({ 
    studentId: 1 
});
chapterSchema.index({
    teacherId: 1 
});

const chapterModel = mongoose.model("chapter",chapterSchema);

module.exports = chapterModel;