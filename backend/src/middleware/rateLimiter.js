const rateLimit = require('express-rate-limit')

const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit:5,

    statusCode: 429,
    skipSuccessfulRequests: true, 
    message:{
        success:false,
        message:"Too Many Login Attempt. Try Again later."
    },
    standardHeaders:"draft-8",
    legacyHeaders:false
})

module.exports = {
    loginLimit
}