const express = require('express');
const router = express.Router();
const { createtask, getTask, updateTask, deleteTask } = require('../controller/taskController');
const { authStudent } = require('../middleware/authMiddleware');


// /api/task/create
router.post('/create', authStudent, createtask);

// /api/task/get
router.get('/get', authStudent, getTask);

// /api/task/update/:taskId
router.patch('/update/:taskId', authStudent, updateTask);

// /api/task/delete/:taskId
router.delete('/delete/:taskId', authStudent, deleteTask);

module.exports = router;