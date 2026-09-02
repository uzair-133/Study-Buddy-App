const express = require('express');
const router = express.Router();
const { createSubject, getSubject, deleteSubject } = require('../controller/subjectController');
const {authStudent}  = require('../middleware/authMiddleware')

router.post('/create', authStudent, createSubject)
router.get('/getSubject', authStudent, getSubject);
router.delete('/delete/:subjectId', authStudent, deleteSubject)

module.exports = router;