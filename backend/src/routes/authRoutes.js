const express = require('express')
const router = express.Router();
const authController = require('../controller/authController')
const ValidationRules = require('../middleware/validation.middleware')

// /api/auth.Post/signup
router.post('/signup', ValidationRules.signupUserValidationRules, authController.SignUp);
// /api/auth/Post/login
router.post('/login', ValidationRules.loginUserValidationRules, authController.LogIn)

router.post('/logout',authController.logOut)

router.get('/verify-email/:token',authController.verifyEmail)

router.post('/forgot-password', authController.forgetPassword)
router.post('/reset-password/:token', authController.resetPassword)

module.exports = router