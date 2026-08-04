const mongoose = require('mongoose');

const ConnectToDb = async()=> {
    try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB is Connected")
    }
    catch(err){
      console.log("MongoDB is Not Connected",err)  
    }
}
module.exports = ConnectToDb