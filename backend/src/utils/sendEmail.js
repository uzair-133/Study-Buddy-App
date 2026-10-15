const nodemailer = require('nodemailer');

const getTransporter = () => {
    const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim().replace(/^["']|["']$/g, '') : '';
    const pass = process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.trim().replace(/[\s"']/g, '') : '';

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use direct SSL for reliable cloud delivery
        auth: {
            user,
            pass,
        },
    });
};

const sendVerificationEmail = async (toEmail, Link) => {
    const transporter = getTransporter();
    const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim().replace(/^["']|["']$/g, '') : '';

    console.log(`Sending verification email to: ${toEmail}`);
    const info = await transporter.sendMail({
        from: `"Study Buddy" <${user}>`,
        to: toEmail,
        subject: 'Verify Your Study Buddy App',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #4f46e5;">Welcome to Study Buddy!</h2>
            <p style="color: #4b5563; font-size: 16px;">Please click the button below to verify your email address:</p>
            <div style="margin: 25px 0;">
                <a href="${Link}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link in your browser:</p>
            <p style="color: #4f46e5; word-break: break-all; font-size: 13px;">${Link}</p>
        </div>
        `,
    });
    console.log(`Verification email sent successfully! MessageId: ${info.messageId}`);
    return info;
};

const resetPasswordEmail = async (toEmail, link) => {
    const transporter = getTransporter();
    const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim().replace(/^["']|["']$/g, '') : '';

    console.log(`Sending reset password email to: ${toEmail}`);
    const info = await transporter.sendMail({
        from: `"Study Buddy" <${user}>`,
        to: toEmail,
        subject: 'Reset your StudyBuddy password',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #e11d48;">Password Reset Request</h2>
            <p style="color: #4b5563; font-size: 16px;">Click the button below to reset your password. This link expires in 15 minutes.</p>
            <div style="margin: 25px 0;">
                <a href="${link}" style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
        `,
    });
    console.log(`Reset email sent successfully! MessageId: ${info.messageId}`);
    return info;
};

module.exports = {
    sendVerificationEmail,
    resetPasswordEmail,
};