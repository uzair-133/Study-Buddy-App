const mongoose = require("mongoose")


const materialSchema = new mongoose.Schema({
 fileName:{type:String,required:true},
 fileUrl:{type:String,required:true},
 category:{type:String,enum:["lecture","handwritten","slide","important_question"],required: true},
 studentId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
 chapterId:{type:mongoose.Schema.Types.ObjectId,ref:"chapter",required:true},
 subjectId:{type:mongoose.Schema.Types.ObjectId,ref:"subject",required:true},
},{timestamps:true})

const materialModel = mongoose.model("material",materialSchema);

module.exports = materialModel;



