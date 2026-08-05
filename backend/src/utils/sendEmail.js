const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD

    }
})

const sendVerificationEmail = async (toEmail, Link) => {
    await transporter.sendMail({
        from: `Study Buddy <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Verify Your Study Buddy App',
        html: `
    <h2>Welcome to study Buddy app</h2>
    <p>Please click the link below to verify your email:</p>
    <a href='${Link}'>Verify Email</a>
    `

    })

}

const resetPasswordEmail = async (toEmail, link) => {
    await transporter.sendMail({
        from: `Study buddy <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Reset your StudyBuddy password',
        html: `
        <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
      <a href="${link}">Reset Password</a>
      <p>If you didn't request this, you can ignore this email.</p>
       `
    })
}

module.exports = {
    sendVerificationEmail,
    resetPasswordEmail
}