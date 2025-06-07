


const mongoose = require('mongoose');

const watSubmissionSchema = new mongoose.Schema({
  watId: { type: mongoose.Schema.Types.ObjectId, ref: 'WAT', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedOption: { type: String, required: true }
  }],
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

watSubmissionSchema.index({ watId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('WatSubmission', watSubmissionSchema);