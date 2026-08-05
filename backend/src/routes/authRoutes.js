const express = require('express')
const router = express.Router();
const authController = require('../controller/authController')

// /api/auth.Post/signup
router.post('/signup', authController.SignUp);
// /api/auth/Post/login
router.post('/login', authController.LogIn)

router.get('/verify-email/:token',authController.verifyEmail)

router.post('/forgot-password', authController.forgetPassword)
router.post('/reset-password/:token', authController.resetPassword)

module.exports = router