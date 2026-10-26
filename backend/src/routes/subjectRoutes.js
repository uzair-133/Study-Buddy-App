const express = require('express');
const router = express.Router();
const { createSubject, getSubject, deleteSubject, getSubjectById } = require('../controller/subjectController');
const {authStudent}  = require('../middleware/authMiddleware')

// /api/subject/create
router.post('/create', authStudent, createSubject);

// /api/subject/getSubject
router.get('/getSubject', authStudent, getSubject);

// /api/subject/:subjectId
router.get('/:subjectId', authStudent, getSubjectById);

// /api/subject/delete/:subjectId
router.delete('/delete/:subjectId', authStudent, deleteSubject);

module.exports = router;