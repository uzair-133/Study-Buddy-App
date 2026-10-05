const express = require('express');
const router = express.Router();
const { createSubject, getSubject, deleteSubject, getSubjectById } = require('../controller/subjectController');
const {authStudent}  = require('../middleware/authMiddleware')

router.post('/create', authStudent, createSubject)
router.get('/getSubject', authStudent, getSubject);
router.get('/:subjectId', authStudent, getSubjectById);
router.delete('/delete/:subjectId', authStudent, deleteSubject)

module.exports = router;