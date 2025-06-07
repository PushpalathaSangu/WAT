const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    enum: ['E1', 'E2', 'E3', 'E4'], 
  },
  semester: {
    type: String,
    required: true,
    enum: ['sem1', 'sem2'],
  },
  subjects: [
    {
      code: { type: String ,required:true},  
      name: { type: String, required: true }   
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
