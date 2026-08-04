const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',authRoutes)

module.exports = app;