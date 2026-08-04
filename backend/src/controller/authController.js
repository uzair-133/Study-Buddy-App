const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
        const user = await userModel.create({
            name,
            email,
            password: hashed,
            role
        })
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
        const token = jwt.sign({
            id: user._id,
            role: user.role,
        }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        res.cookie("token", token, {
            httpOnly: true
        });
        res.status(200).json({
            message: "LOgin Successfully",
            user: {
                id: user._id,
                name: user.name,
                role: user.role
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


module.exports = {
    SignUp,
    LogIn
}