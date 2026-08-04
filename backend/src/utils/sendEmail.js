const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD

    }
})

const sendVerificationEmail = async (toEmail,Link)=> {
 await transporter.sendMail({
    from:`Study Buddy <${process.env.EMAIL_USER}`,
    to:toEmail,
    subject:'Verify Your Study Buddy App',
    html:`
    <h2>Welcome to study Buddy app</h2>
    <p>Please click the link below to verify your email:</p>
    <a href='${Link}'>Verify Email</a>
    `

 })

}

module.exports = sendVerificationEmail