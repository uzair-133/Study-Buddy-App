const express = require('express')
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')
const { createClass , joinClass , getMyClass ,  getJoinedClass } = require('../controller/classController')



router.post('/createClass', authMiddleware.authTeacher, createClass)
router.post('/classJoin',authMiddleware.authStudent, joinClass)
router.get('/getMyClass',authMiddleware.authTeacher,getMyClass)
router.get('/getJoinedClass',authMiddleware.authStudent,getJoinedClass)


module.exports = router