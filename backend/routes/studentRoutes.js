const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose=require("mongoose")
const Student = require("../models/Student");
const WatSubmission=require('../models/WatSubmission');
const { authorizeRole } = require("../middleware/authorizeRole");

const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// ✅ Login-protected route
router.get("/login", authorizeRole("student"), (req, res) => {
  res.json({ message: `Welcome, Student ${req.user.id}` });
});

// ✅ Student Registration Route
// router.post("/register", async (req, res) => {
//   const {
//     name,
//     email,
//     password,
//     year,
//     semester,
//     section,
//     studentId,
//     rollNumber,
//     phone,
//   } = req.body;

//   try {
//     const existingStudent = await Student.findOne({ email });
//     if (existingStudent) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const student = new Student({
//       name,
//       email,
//       password: hashedPassword,
//       year,
//       semester,
//       section,
//       studentId,
//       rollNumber,
//       phone,
//     });

//     await student.save();
//     res.status(201).json({ message: "Student registration successful" });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
router.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    year,
    semester,
    section,
    studentId,
    rollNumber,
    phone,
  } = req.body;

  try {
    // Enhanced validation
    if (!name || !email || !password || !year || !semester || !studentId || !section) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required",
        missingFields: [
          !name && "name",
          !email && "email",
          !password && "password",
          !year && "year",
          !semester && "semester",
          !section && "section",
          !studentId && "studentId"
        ].filter(Boolean)
      });
    }

    // Validate email format
    if (!/^rr\d{6}@rguktrkv\.ac\.in$/i.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email must be in format rrXXXXXX@rguktrkv.ac.in"
      });
    }

    // Validate student ID format
    if (!/^R\d{6}$/i.test(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student ID must be in format RXXXXXX"
      });
    }

    // Check for existing student
    const existingStudent = await Student.findOne({ 
      $or: [{ email }, { studentId }, { rollNumber }] 
    });
    
    if (existingStudent) {
      let conflictField = "";
      if (existingStudent.email === email) conflictField = "Email";
      else if (existingStudent.studentId === studentId) conflictField = "Student ID";
      else if (existingStudent.rollNumber === rollNumber) conflictField = "Roll Number";
      
      return res.status(400).json({ 
        success: false,
        message: `${conflictField} already registered`
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new student
    const student = new Student({
      name,
      email: email.toLowerCase(), // normalize email
      password: hashedPassword,
      year,
      semester,
      section,
      studentId,
      rollNumber: Number(rollNumber),
      phone
    });

    await student.save();
    
    res.status(201).json({ 
      success: true,
      message: "Student registration successful",
      data: {
        id: student._id,
        studentId: student.studentId,
        email: student.email
      }
    });
    
  } catch (error) {
    console.error("Registration Error:", error);
    
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
});
// ✅ Student Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { studentId: student._id, role: "student" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: {
        name: student.name,
        email: student.email,
        year: student.year,
        semester: student.semester,
        section: student.section,
        studentId: student.studentId,
        rollNumber: student.rollNumber,
        phone: student.phone,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id; // assuming token payload contains { id, name, ... }
    const student = await Student.findById(studentId).select('-password'); // avoid sending password
    if (!student) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(student);
  } catch (err) {
    console.error('Error fetching admin profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put("/update", authenticateToken, authorizeRole('student'), async (req, res) => {
  try {
    console.log('Received update request:', req.body);
    console.log('Authenticated user ID:', req.user.id);

    const { name, email, phone, rollNumber, year, semester, section } = req.body;
    const studentId = req.user.id;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false,
        message: "Name, email and phone are required" 
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (!/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number (10-15 digits required)"
      });
    }

    const existingStudent = await Student.findOne({ email, _id: { $ne: studentId } });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "Email already in use by another student"
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { 
        name, 
        email, 
        phone,
        rollNumber,
        year,
        semester,
        section
      },
      { new: true, runValidators: true }
    ).select('-password');
    console.log("updated data",updatedStudent);
    if (!updatedStudent) {
      return res.status(404).json({ 
        success: false,
        message: "Student not found" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      student: updatedStudent
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});


// Get students by year and section
router.get('/api/students', async (req, res) => {
  try {
    const { year, section } = req.query;
    
    if (!year || !section) {
      return res.status(400).json({ 
        error: 'Both year and section parameters are required' 
      });
    }

    const students = await Student.find({ 
      year: year.toUpperCase(), 
      section: section.toUpperCase() 
    })
    .sort({ rollNumber: 1 })
    .select('name rollNumber studentId email year section');

    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Server error while fetching students' });
  }
});



// GET /students?year=E1&section=A
router.get('/', async (req, res) => {  // Note: just '/' because prefix is already "/students"
  try {
    const { year, section } = req.query;
    
    if (!year || !section) {
      return res.status(400).json({ 
        error: 'Both year and section parameters are required' 
      });
    }

    const students = await Student.find({ 
      year: year.toUpperCase(), 
      section: section.toUpperCase() 
    }).sort('rollNumber');

    res.json(students);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// get students count
router.get('/students/count', async (req, res) => {
  try {
    const { year, section } = req.query;
    
    if (!year || !section) {
      return res.status(400).json({ message: 'Year and section are required' });
    }

    const count = await Student.countDocuments({ 
      year: year.toUpperCase(), 
      section: section.toUpperCase() 
    });

    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get student details with WAT marks by year
router.get('/:studentId', async (req, res) => {
  try {
    // Validate studentId
    if (!mongoose.Types.ObjectId.isValid(req.params.studentId)) {
      return res.status(400).json({ error: 'Invalid student ID format' });
    }

    // Get student basic info
    const student = await Student.findById(req.params.studentId)
      .select('-password -createdAt -updatedAt -__v');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get WAT submissions grouped by year
    const submissionsByYear = await WatSubmission.aggregate([
      { $match: { studentId: mongoose.Types.ObjectId(req.params.studentId) } },
      {
        $lookup: {
          from: 'wats',
          localField: 'watId',
          foreignField: '_id',
          as: 'watDetails'
        }
      },
      { $unwind: '$watDetails' },
      {
        $group: {
          _id: '$watDetails.year',
          submissions: {
            $push: {
              _id: '$_id',
              score: '$score',
              totalQuestions: { $size: '$watDetails.questions' },
              submittedAt: '$submittedAt',
              subject: '$watDetails.subject',
              watNumber: '$watDetails.watNumber',
              semester: '$watDetails.semester'
            }
          }
        }
      },
      {
        $project: {
          year: '$_id',
          submissions: 1,
          _id: 0
        }
      },
      { $sort: { year: 1 } } // Sort by year ascending
    ]);

    // Transform data for easier frontend consumption
    const watMarksByYear = submissionsByYear.reduce((acc, yearData) => {
      acc[yearData.year] = yearData.submissions;
      return acc;
    }, {});

    res.json({
      ...student.toObject(),
      watMarksByYear
    });

  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// Get student's WAT submissions 
router.get('/submissions/:studentId', authenticateToken, async (req, res) => {
  try {
    const submissions = await WatSubmission.find({ studentId: req.params.studentId })
      .populate('watId', 'subject watNumber year semester startTime endTime');
    
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

