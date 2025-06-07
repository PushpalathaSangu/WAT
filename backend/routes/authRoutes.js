// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Admin = require("../models/Admin");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  let UserModel;
  switch (role) {
    case "student":
      UserModel = Student;
      break;
    case "faculty":
      UserModel = Faculty;
      break;
    case "admin":
      UserModel = Admin;
      break;
    default:
      return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: `${role} not found` });
    console.log(user)

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET || "secretKey", {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      message: `${role} login successful`,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role,
        year:user.year
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
