require('dotenv').config()
const {sendVerificationEmail} = require('./src/utils/sendEmail')

sendVerificationEmail("seconduzair63@gmail.com",'http://test-link.com')
.then(()=>{
    console.log("Email sent successfully")
})
.catch((err)=>{
    console.log("Error sending email",err)
})