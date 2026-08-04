require('dotenv').config()
const sendEmailVerification = require('./src/utils/sendEmail')

sendEmailVerification("seconduzair63@gmail.com",'http://test-link.com')
.then(()=>{
    console.log("Email sent successfully")
})
.catch((err)=>{
    console.log("Error sending email",err)
})