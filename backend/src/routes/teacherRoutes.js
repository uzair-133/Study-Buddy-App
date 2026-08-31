const express = require("express");
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware')


router.get('/dashboard',authMiddleware.authTeacher, (req, res) => {
    res.json({ message: "Welcome to the teacher dashboard!" });
})

module.exports = router