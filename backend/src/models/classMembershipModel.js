const mongoose = require('mongoose');

const classMemberShipSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "class"
    },
}, { timestamps: true })

// remove duplicate entries for the same student and class combination
classMemberShipSchema.index({ studentId: 1, classId: 1 }, { unique: true });

const classMemberShipModel = mongoose.model("membership", classMemberShipSchema)

module.exports = classMemberShipModel