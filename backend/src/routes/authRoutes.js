const express = require('express')
const router = express.Router();
const authController = require('../controller/authController')
const ValidationRules = require('../middleware/validation.middleware')
const {authUser} = require('../middleware/authUser')
const {loginLimit} = require('../middleware/rateLimiter')
// /api/auth/signup
router.post('/signup', ValidationRules.signupUserValidationRules, authController.SignUp);

// /api/auth/login
router.post('/login', ValidationRules.loginUserValidationRules,loginLimit, authController.LogIn);

// /api/auth/logout
router.post('/logout', authController.logOut);

// /api/auth/me
router.get('/me', authUser, authController.getMe);

// /api/auth/verify-email/:token
router.get('/verify-email/:token', authController.verifyEmail);

// /api/auth/forgot-password
router.post('/forgot-password', authController.forgetPassword);

// /api/auth/reset-password/:token
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;