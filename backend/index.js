require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./conn/conn");
const facultyRoutes = require("./routes/facultyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes=require("./routes/studentRoutes");
const userAuth=require("./routes/authRoutes");
const watRoutes = require('./routes/watRoutes'); 
const subjectRoutes = require('./routes/subjectRoutes');
const mcqRoutes = require("./routes/mcqRoutes");


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

connectDB();

app.use("/student",studentRoutes);
app.use("/faculty", facultyRoutes);
app.use("/admin", adminRoutes);
app.use("/auth",userAuth);
app.use('/api/wats', watRoutes);
app.use('/api/mcqs',mcqRoutes);
app.use('/api/subjects', subjectRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
