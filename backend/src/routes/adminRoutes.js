const express = require("express");
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware')


// /api/admin/dashboard
router.get('/dashboard', authMiddleware.authAdmin, (req, res) => {
    res.json({ message: "Welcome to the admin dashboard!"});
});

module.exports = router