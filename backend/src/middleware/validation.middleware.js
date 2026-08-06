const { body, validationResult } = require('express-validator')


const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next()
}

const signupUserValidationRules = [

    body("name")
    .isString()
    .withMessage("username must be a string")
    .isLength({min:3, max:20})
    .withMessage("Length is too short. name must be 3 to 20 character"),


    body("email")
    .isEmail()
    .withMessage("Invalid email address"),


    body("password")
    .isLength({min:6, max:20})
    .withMessage("Password must be 6 to 20 character long"),

    validateResult
]

const loginUserValidationRules = [
    body("email")
    .isEmail()
    .withMessage("Invalid email address"),

    body("password")
    .isLength({min:6, max:20})
    .withMessage("Password must be 6 to 20 character long"),

    validateResult
]

module.exports = {
    signupUserValidationRules,
    loginUserValidationRules
}