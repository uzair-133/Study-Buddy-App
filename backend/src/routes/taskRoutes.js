const express = require('express');
const router = express.Router();
const { createtask, getTask, updateTask, deleteTask } = require('../controller/taskController');
const { authStudent } = require('../middleware/authMiddleware');


router.post('/create', authStudent, createtask);
router.get('/get', authStudent, getTask);
router.patch('/update/:taskId', authStudent, updateTask);
router.delete('/delete/:taskId', authStudent, deleteTask);

module.exports = router;