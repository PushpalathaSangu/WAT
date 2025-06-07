// models/Faculty.js
// const mongoose = require("mongoose");

// const FacultySchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },

//   years: {
//     type: [String],
//     required: true,
//   },
//   subjects: {
//     type: Map,
//     of: [String], // { "E1": ["Math", "Physics"] }
//     required: true,
//   },
//   contact: {
//     type: String,
//     required: true,
//     match: [/^\d{10}$/, "Invalid contact number"],
//   },
// });

// module.exports = mongoose.model("Faculty", FacultySchema);

// models/Faculty.js
const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
  years: [String],
  subjects: {
    type: Map,
    of: [String] 
  }
});

module.exports = mongoose.model('Faculty', facultySchema);
