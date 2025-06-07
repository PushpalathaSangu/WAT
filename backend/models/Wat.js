

const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [String], 
  correctAnswer: String 
});
const watSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Faculty' },
  courseName: { type: String },
  year: { type: String, required: true },//ex:E1,E2,E3
  semester: { type: String },
  watNumber: { type: String, required: true },
  subject: { type: String, required: true },
  startTime: { type: Date, required: true },  
  endTime: { type: Date, required: true },    
  questions: { type: [questionSchema], required: true },
  status: { type: String, enum: ['created', 'generated', 'published'], default: 'created' },
});
const WAT = mongoose.model('WAT', watSchema);
module.exports = WAT;
