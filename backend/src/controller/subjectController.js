const subjectModal = require("../models/subjectModel");



//Create Subject Controller

const createSubject = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Subject title is Required" })
        }
        const subject = await subjectModal.create({
            title,
            studentId: req.user.id
        })
        res.status(201).json({
            message: "Subject Created Successfully",
            subject
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
}


// Get All Subject 

const getSubject = async (req, res) => {
    try {
        const subject = await subjectModal.find({ studentId: req.user.id }).sort({ createdAt: -1 })
        res.status(200).json({
            message: "Get All Subject",
            subject
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

// DElete SubJect 

const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params

    const subject = await subjectModal.findOne({
      _id: subjectId,
      studentId: req.user.id
    })

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" })
    }

    await subject.deleteOne()

    res.status(200).json({ message: "Subject deleted successfully" })

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal server error" })
  }
}


module.exports = {
    createSubject,
    getSubject,
    deleteSubject
}   