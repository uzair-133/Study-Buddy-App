const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminroutes = require("./routes/adminRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const cookieParser = require("cookie-parser");
const materialRoutes = require('./routes/materialRoutes')
const taskRoutes =  require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/teacher", teacherRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/admin", adminroutes);

app.use("/api/subject", subjectRoutes);

app.use("/api/chapter", chapterRoutes);

app.use("/api/material",materialRoutes)

app.use("/api/task", taskRoutes);

app.use("/api/user", userRoutes);

app.use("/api/search", searchRoutes);


module.exports = app;
