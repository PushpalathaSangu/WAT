const express = require('express');
const router = express.Router();
const WatSubmission = require('../models/WatSubmission');
const mongoose = require('mongoose');

// Get all WAT submissions for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    const submissions = await WatSubmission.find({
      studentId: req.params.studentId
    }).select('watId -_id');

    res.json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit a WAT attempt
router.post('/', async (req, res) => {
  try {
    const { watId, studentId, answers } = req.body;

    if (!mongoose.Types.ObjectId.isValid(watId) || 
        !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid IDs' });
    }

    // Check for existing submission
    const existing = await WatSubmission.findOne({ watId, studentId });
    if (existing) {
      return res.status(400).json({ error: 'Already attempted this WAT' });
    }

    // Calculate score 
    const score = answers.filter(a => a.isCorrect).length;

    const submission = new WatSubmission({
      watId,
      studentId,
      answers,
      score
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;