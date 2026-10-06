const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: {
        type: "String",
        required: true,
        trim: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    joinCode: {
        type: "String",
        unique: true,
        required: true,
        uppercase: true,
        trim: true,
    },
},{ timestamps: true })

classSchema.index({
    teacherId:1,
    createdAt: -1 
})


const classModel = mongoose.model('class', classSchema)


module.exports = classModel