const mongoose = require('mongoose');
// const {generateJoinCode} = require('../utils/generateJoinCode')
const ConnectToDb = async()=> {
    try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB is Connected")
    // const code = await generateJoinCode();
    // console.log(code)
    }
    catch(err){
      console.log("MongoDB is Not Connected",err)  
    }
}
module.exports = ConnectToDb