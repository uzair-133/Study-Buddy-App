const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const studentRoutes = require('./routes/studentRoutes')
const adminroutes = require('./routes/adminRoutes')
const cookieParser = require('cookie-parser')
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes)

app.use('/api/teacher', teacherRoutes)

app.use('/api/student', studentRoutes)

app.use('/api/admin', adminroutes)

module.exports = app;