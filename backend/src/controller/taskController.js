const taskModal = require('../models/taskModal')

const createtask = async (req, res) => {
  try {
    const { title, note, date, month, subject } = req.body
    if (!title || !note || !date || !month || !subject) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const task = await taskModal.create({
      title, note, date, month, subject,
      studentId: req.user.id
    })

    res.status(201).json({ message: "Task Added Successfully", task })
  } catch (err) {
    res.status(500).json({ message: "internal server error", err })
  }
}

const getTask = async (req, res) => {
  try {
    const task = await taskModal.find({ studentId: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json({ message: "Get all task", task })
  } catch (err) {
    res.status(500).json({ message: "internal server error", err })
  }
}

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params
    const task = await taskModal.findOne({ _id: taskId, studentId: req.user.id })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    task.isCompleted = !task.isCompleted
    await task.save()

    res.status(200).json({ message: "Task updated successfully", task })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal server error" })
  }
}

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params
    const task = await taskModal.findOne({ _id: taskId, studentId: req.user.id })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    await task.deleteOne()
    res.status(200).json({ message: "Task deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Internal server error" })
  }
}

module.exports = { createtask, getTask, updateTask, deleteTask }