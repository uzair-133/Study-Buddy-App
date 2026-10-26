const express = require('express')
const router = express.Router()
const { authStudent } = require('../middleware/authMiddleware')
const { createChapter, getChapter, deleteChapter } = require('../controller/chapterController')


// /api/chapter/createChapter
router.post('/createChapter', authStudent, createChapter);
// /api/chapter/createChapter/6ace12165ca2701c272d858b
router.post('/createChapter/:subjectId', authStudent, createChapter);

// /api/chapter/getchapter
router.get('/getchapter', authStudent, getChapter);
//  /api/chapter/getchapter/id
router.get('/getchapter/:subjectId', authStudent, getChapter);

// /api/chapter/delete/id
router.delete('/delete/:chapterId', authStudent, deleteChapter);

module.exports = router;