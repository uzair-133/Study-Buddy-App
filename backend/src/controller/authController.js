const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const {sendVerificationEmail,  resetPasswordEmail} = require('../utils/sendEmail')

// signup controller
const SignUp = async (req, res) => {
    try {
        const { name, email, password, role = "student" } = req.body;

        const UserExist = await userModel.findOne({
            $or: [
                { name },
                { email }
            ]
        })
        if (UserExist) {
            return res.status(400).json({ message: "User Already Exist. So go to Login Page" })
        }
        const hashed = await bcrypt.hash(password, 10)

        const verificationToken = crypto.randomBytes(32).toString('hex')
        const user = await userModel.create({
            name,
            email,
            password: hashed,
            role,
            systemRole:false,
            isVerified: false,
            verificationToken
        })
        const verificationLink = `http://localhost:5173/verify-email/${verificationToken}`
        await sendVerificationEmail(email, verificationLink)
        res.status(201).json({
            message: "User Created Successfully",
            user
        })
    }
    catch (err) {
        res.status(500).json({
            message: "internal server error", err
        })
    }
}

// verify email controller
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await userModel.findOne({ verificationToken: token })
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification link" })
        }
        user.isVerified = true
        user.verificationToken = undefined
        await user.save()
        res.json({ message: "Email verified successfully! You can now log in." })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

// forget password controller
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(403).json({
                message: "invalid Email"
            })
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000
        await user.save()

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`
        await  resetPasswordEmail(user.email, resetLink)
        res.json({ message: "Password reset link sent to your email" })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
}

// reset password controller
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body

        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset link" })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()
        res.json({ message: "Password reset successful! You can now log in." })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal server error" })
    }
}


// login controller
const LogIn = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel.findOne({
            $or: [
                { name },
                { email }
            ]
        })
        if (!user) {
            return res.status(404).json({
                message: "USer Not Found"

            })
        }
        const isMAtch = await bcrypt.compare(password, user.password)
        if (!isMAtch) {
            return res.status(400).json({
                message: "Password Not Match"
            })
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in" })
        }
        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        });
        res.status(200).json({
            message: "Login Successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            }
        })
    }
    catch (err) {
        res.status(500).json({
            message: "internal server error",
            err
        })
        console.log(err)
    }
}

const logOut = async (req,res) => {

    res.clearCookie("token")
    res.status(200).json({
        message:"LogOut user"
    })

}


module.exports = {
    SignUp,
    verifyEmail,
    forgetPassword,
    resetPassword,
    LogIn,
    logOut
}