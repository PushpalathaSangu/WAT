// const mongoose = require("mongoose");
// const studentSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   year: {
//     type: String,
//     required: true,
//     enum: ['E1', 'E2', 'E3', 'E4']
//   },
//   section: {
//     type: String,
//     required: true,
//     enum: ['A', 'B', 'C', 'D', 'E']
//   },
//   semester: {
//     type: String,
//     required: true,
//     enum: ['sem1', 'sem2'] // Correct way
//   },
//   studentId: {
//     type: String,
//     required: true,
//     unique: true,
//     match: /^R\d{6}$/ // Correct regex format for Student ID
//   },
//   rollNumber: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 72
//   },
//   phone: {
//     type: String,
//     required: true,
//     match: /^\d{10}$/ // Ensures phone number is exactly 10 digits
//   }
// }, { timestamps: true });

// const Student = mongoose.model("Student", studentSchema);
// module.exports = Student;
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  year: { type: String, required: true, enum: ['E1', 'E2', 'E3', 'E4'] },
  section: { type: String, required: true, enum: ['A', 'B', 'C', 'D', 'E'] },
  semester: { type: String, required: true, enum: ['sem1', 'sem2'] },
  studentId: { type: String, required: true, unique: true, match: /^R\d{6}$/ },
  rollNumber: { type: Number, required: true, min: 1, max: 72 },
  phone: { type: String, required: true, match: /^\d{10}$/ }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);