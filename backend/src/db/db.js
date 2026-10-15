const mongoose = require('mongoose');

let isConnected = false;

const ConnectToDb = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }
    if (!process.env.MONGO_URI) {
        console.error("MongoDB Error: process.env.MONGO_URI is undefined or empty!");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("MongoDB is Connected successfully");
    } catch (err) {
        console.error("MongoDB is Not Connected. Reason:", err.message || err);
    }
};

module.exports = ConnectToDb;