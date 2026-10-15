const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")


const getToken = (req) => {
    if (req.cookies && req.cookies.token) return req.cookies.token;
    if (req.headers && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
};

const authStudent = async (req, res, next) => {
    try {
        const token = getToken(req);
        if (!token) {
            return res.status(403).json({
                message: "invalid request"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!["student", "teacher", "admin"].includes(decoded.role)) {
            return res.status(401).json({ message: "You have not access to this page" })
        }
       
        req.user = decoded
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
        const token = getToken(req);
        if (!token) {
            return res.status(403).json({
                message: "invalid request"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!["teacher", "admin"].includes(decoded.role)) {
            return res.status(401).json({ message: "YOU have not access to this page" })
        }
   
        req.user = decoded
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
        const token = getToken(req);
        if (!token) {
            return res.status(403).json({
                message: "invalid request"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role !== "admin") {
            return res.status(401).json({ message: "YOU have not access to this page" })
        }
   
        req.user = decoded
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