const mongoose = require('mongoose');

let isConnected = false;

const ConnectToDb = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("MongoDB is Connected");
    } catch (err) {
        console.log("MongoDB is Not Connected", err);
    }
};

module.exports = ConnectToDb;