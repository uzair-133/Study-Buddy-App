const crypto = require('crypto')
const classModel = require('../models/classModel')


const generateJoinCode = async () => {

    const character = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let uniqueCode = ""
    let isUnique = false

    while (!isUnique) {
        let result = "";
        const randomBytes = crypto.randomBytes(6)

        for (let i = 0; i < 6; i++) {
            result += character[randomBytes[i] % character.length]
        }
        const existingClass = await classModel.findOne({ joinCode: result })
        if (!existingClass) {
            uniqueCode = result;
            isUnique = true
        }
    }
    return uniqueCode
}


module.exports = {
    generateJoinCode
}