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
    let mongoUri = process.env.MONGO_URI ? process.env.MONGO_URI.trim().replace(/^["']|["']$/g, '') : '';
    if (mongoUri.includes("mongodb+srv://") && !mongoUri.startsWith("mongodb+srv://")) {
        mongoUri = mongoUri.substring(mongoUri.indexOf("mongodb+srv://")).trim();
    } else if (mongoUri.includes("mongodb://") && !mongoUri.startsWith("mongodb://")) {
        mongoUri = mongoUri.substring(mongoUri.indexOf("mongodb://")).trim();
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("MongoDB is Connected successfully");
    } catch (err) {
        console.error("MongoDB is Not Connected. Reason:", err.message || err);
    }
};

module.exports = ConnectToDb;