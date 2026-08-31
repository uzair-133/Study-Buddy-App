const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")


const authStudent = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({
                message: "invalid request"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== "student") {
            return res.status(401).json({ message: "You have not access to this page" })
        }
       
        req.user = user
        next()
    }
    catch (err) {
        res.status(403).json({
            message: "unauthorized access"
        })
    }
}
const authTeacher = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({
                message: "invalid request"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== "teacher") {
            return res.status(401).json({ message: "YOU have not access to this page" })
        }
   
        req.user = user
        next()
    }
    catch (err) {
        res.status(403).json({
            message: "unauthorized access"
        })
    }
}
const authAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({
                message: "invalid request"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== "admin") {
            return res.status(401).json({ message: "YOU have not access to this page" })
        }
   
        req.user = user
        next()
    }
    catch (err) {
        res.status(403).json({
            message: "unauthorized access"
        })
    }
}


module.exports = {
    authStudent,
    authTeacher,
    authAdmin
}