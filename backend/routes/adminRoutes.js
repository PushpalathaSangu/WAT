const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { authorizeRole } = require("../middleware/authorizeRole");
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken'); // Your auth middleware

// =======================
// Admin Registration
// =======================
router.post("/register", async (req, res) => {
  const { name, email, password, contactNumber } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      contactNumber,
    });

    await newAdmin.save();
    res.status(201).json({ success: true, message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin-only route
router.get("/login", authorizeRole("admin"), (req, res) => {
  res.json({ message: "Admin data accessed" });
});


// =======================
// Admin Login
// =======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin with this email does not exist." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id, role: "admin" }, process.env.JWT_SECRET || "secretkey", {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// =======================
// Admin Profile (View)
// =======================


router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const adminId = req.user.id; // assuming token payload contains { id, name, ... }
    const admin = await Admin.findById(adminId).select('-password'); // avoid sending password
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (err) {
    console.error('Error fetching admin profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



// =======================
// Admin Profile (Update)
// =======================
router.put("/update", authenticateToken,authorizeRole('admin'),async (req, res) => {
 
  try {
    console.log(req.body);
    const { name, email, contactNumber } = req.body;
    const adminId = req.user.id;
    
    // Basic validation
    if (!name || !email || !contactNumber) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Email validation
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Contact number validation
    if (!/^\d{10,15}$/.test(contactNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact number (10-15 digits required)"
      });
    }

    // Check if email exists for another admin
    const existingAdmin = await Admin.findOne({ email, _id: { $ne: adminId } });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email already in use by another admin"
      });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { name, email, contactNumber },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from response

    if (!updatedAdmin) {
      return res.status(404).json({ 
        success: false,
        message: "Admin not found" 
      });
    }

    // Return success response with updated data
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin: updatedAdmin
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

module.exports = router;