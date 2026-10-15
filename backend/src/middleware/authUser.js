const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
    try {
        const token = (req.cookies && req.cookies.token) || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
        if (!token) {
            return res.status(400).json({
                message: "user not found"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch (err) {
        res.status(403).json({
            message: "unauthorized access"
        })
    }
}

module.exports = { authUser }