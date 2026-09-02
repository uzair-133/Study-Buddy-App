const express = require('express')
const router = express.Router()
const {authStudent}  = require('../middleware/authMiddleware')
const {createChapter, getChapter,deleteChapter} = require('../controller/chapterController')


router.post('/createChapter',authStudent,createChapter);
router.get('/getchapter',authStudent,getChapter);
router.delete('/delete/:chapterId',authStudent,deleteChapter);


module.exports = router;