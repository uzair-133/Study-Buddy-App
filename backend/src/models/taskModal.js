const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subject"
    }
}, { timestamps: true });

taskSchema.index({
    studentId:1,
    createdAt: -1
})

const taskModal = mongoose.model('task', taskSchema);

module.exports = taskModal;