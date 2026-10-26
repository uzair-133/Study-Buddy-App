const express = require("express");
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware')


// /api/student/dashboard
router.get('/dashboard', authMiddleware.authStudent, (req, res) => {
    res.json({ message: "Welcome to the student dashboard!"});
});

module.exports = router