
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WAT = require('../models/Wat'); // Adjust path if needed
const WatSubmission = require('../models/WatSubmission');
const authenticateToken =require('../middleware/authenticateToken')


// Update WAT creation endpoint
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { year, semester, subject, watNumber, startTime, endTime } = req.body;

    // Validate required fields
    if (!year || !semester || !subject || !watNumber || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Convert and validate times
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Check for duplicate WAT number
    const duplicateWAT = await WAT.findOne({
      year,
      semester,
      subject,
      watNumber,
      facultyId: req.user.id
    });

    if (duplicateWAT) {
      return res.status(409).json({
        success: false,
        message: `WAT ${watNumber} already exists for this subject`
      });
    }

    // Check for time conflicts
    const timeConflict = await WAT.findOne({
      facultyId: req.user.id,
      $or: [
        { startTime: { $lt: end, $gte: start } },
        { endTime: { $gt: start, $lte: end } },
        { startTime: { $lte: start }, endTime: { $gte: end } }
      ]
    });

    if (timeConflict) {
      return res.status(409).json({
        success: false,
        message: 'Time conflict with existing WAT',
        conflictingWAT: {
          id: timeConflict._id,
          subject: timeConflict.subject,
          watNumber: timeConflict.watNumber,
          startTime: timeConflict.startTime,
          endTime: timeConflict.endTime
        }
      });
    }

    // Create new WAT
    const newWAT = await WAT.create({
      facultyId: req.user.id,
      year,
      semester,
      subject,
      watNumber,
      startTime: start,
      endTime: end,
      
    });

    res.status(201).json({
      success: true,
      message: 'WAT created successfully',
      data: {
        id: newWAT._id,
        watNumber: newWAT.watNumber,
        subject: newWAT.subject
      }
    });

  } catch (error) {
    console.error('WAT creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});
router.get('/by-year/:year', async (req, res) => {
  try {
    const { year } = req.params;
    console.log(`Fetching WATs for year: ${year}`);
    
    // Temporary: Return all WATs to verify connection is working
    const allWats = await WAT.find({});
    console.log('All WATs in DB:', allWats);
    
    // Then filter by year
    const wats = await WAT.find({ year: year });
    console.log('Filtered WATs:', wats);
    
    res.json(wats);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});


// GET /api/wats/active/by-year/:year
router.get('/active/by-year/:year', async (req, res) => {
  try {
    const { year } = req.params;
    const now = new Date();

    const wats = await WAT.find({
      year,
      startTime: { $lte: now },
      endTime: { $gte: now }
    });
    res.json(wats);
  } catch (error) {
    console.error('Error fetching active WATs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// GET /api/wats/display/:id Get full WAT details including questions
router.get('/display/:id', async (req, res) => {
  try {
    const wat = await WAT.findById(req.params.id);
   
    if (!wat) {
      return res.status(404).json({ error: 'WAT not found' });
    }
    res.json(wat);  // Will return the full WAT with questions
  } catch (error) {
    console.error('Error fetching WAT by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { watId, studentId, answers } = req.body;
    const tabSwitches = req.body.tabSwitches || 0;
    const autoSubmitted = req.body.autoSubmitted || false;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(watId)) {
      return res.status(400).json({ error: 'Invalid WAT ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid Student ID' });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'Answers must be a non-empty array' });
    }

    // Find the WAT
    const wat = await WAT.findById(watId);
    if (!wat) {
      return res.status(404).json({ error: 'WAT not found' });
    }

    // Calculate score and validate answers
    let score = 0;
    const processedAnswers = [];
    const questionMap = new Map(wat.questions.map(q => [q._id.toString(), q]));

    for (const answer of answers) {
      if (!mongoose.Types.ObjectId.isValid(answer.questionId)) {
        continue; // or return error
      }

      const question = questionMap.get(answer.questionId.toString());
      if (!question) {
        continue; // question not found in this WAT
      }

      const isCorrect = answer.selectedOption === question.correctAnswer;
      if (isCorrect) score++;

      processedAnswers.push({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect
      });
    }

    // Create or update submission
    const submissionData = {
      watId,
      studentId,
      answers: processedAnswers,
      score,
      tabSwitches,
      autoSubmitted
    };

    const submission = await WatSubmission.findOneAndUpdate(
      { watId, studentId },
      submissionData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      score,
      totalQuestions: wat.questions.length,
      submissionId: submission._id
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all WAT submissions for a specific student
router.get('/submissions/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate studentId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    // Fetch submissions with WAT details
    const submissions = await WatSubmission.aggregate([
      {
        $match: { studentId: new mongoose.Types.ObjectId(studentId) }
      },
      {
        $lookup: {
          from: 'wats',
          localField: 'watId',
          foreignField: '_id',
          as: 'watDetails'
        }
      },
      {
        $unwind: '$watDetails'
      },
      {
        $project: {
          _id: 1,
          score: 1,
          totalQuestions: { $size: '$watDetails.questions' },
          submittedAt: 1,
          watDetails: {
            subject: 1,
            watNumber: 1,
            semester: 1,
            year: 1
          }
        }
      },
      {
        $sort: { submittedAt: -1 } // Newest first
      }
    ]);

    res.status(200).json(submissions);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/by-year-faculty/:year/:facultyId', async (req, res) => {
  try {
    const { year, facultyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(facultyId)) {
      return res.status(400).json({ error: 'Invalid facultyId' });
    }

    const wats = await WAT.find({ year, facultyId }).sort({ startTime: 1 });

    res.status(200).json(wats);
  } catch (error) {
    console.error('Error fetching WATs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get WATs by year and subject --mcqs generation

router.get('/by-year-subject', authenticateToken, async (req, res) => {
  try {
    const { year, subject } = req.query;
    
    if (!year || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Year and subject are required'
      });
    }

    const wats = await WAT.find({ year, subject });
    
    res.status(200).json({
      success: true,
      data: wats,
      message: wats.length > 0 
        ? 'WATs retrieved successfully' 
        : 'No WATs found for the given criteria'
    });
    
  } catch (err) {
    console.error('Error fetching WATs:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

// Update WAT with MCQs and syllabus
router.put('/:id', authenticateToken, async (req, res) => {
        
  try {
    const { mcqs, syllabus } = req.body;
    
    // Validate input
    if (!mcqs || !Array.isArray(mcqs)) {
      return res.status(400).json({
        success: false,
        message: 'MCQs must be provided as an array'
      });
    }

    const wat = await WAT.findById(req.params.id);
    if (!wat) {
      return res.status(404).json({ 
        success: false,
        message: 'WAT not found' 
      });
    }

    // Verify ownership
    if (wat.facultyId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this WAT' 
      });
    }

    // Validate each MCQ
    const validatedMCQs = mcqs.map(mcq => {
      if (!mcq.questionText || !mcq.options || !mcq.correctAnswer) {
        throw new Error('Each MCQ must have questionText, options, and correctAnswer');
      }
      return {
        questionText: mcq.questionText,
        options: mcq.options,
        correctAnswer: mcq.correctAnswer
      };
    });

    // Update WAT document
    wat.mcqs = validatedMCQs;
    wat.syllabus = syllabus || wat.syllabus;
    wat.status = 'generated';
    wat.updatedAt = Date.now();

    await wat.save();
    
    res.json({
      success: true,
      message: 'MCQs saved successfully',
      data: {
        id: wat._id,
        mcqsCount: wat.mcqs.length,
        status: wat.status
      }
    });
    
  } catch (err) {
    console.error('WAT update error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
});


// Add this to your existing watRoutes.js
router.get('/submissions/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid student ID format' });
    }

    const submissions = await WatSubmission.find({ studentId })
      .select('watId -_id');

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// Get WAT details by ID
router.get('/wat/:id', authenticateToken, async (req, res) => {
  try {
    const wat = await WAT.findById(req.params.id);
    if (!wat) {
      return res.status(404).json({ success: false, message: 'WAT not found' });
    }
    res.json({ success: true, data: wat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all submissions for a WAT with student details
router.get('/wat-submissions/:watId', authenticateToken, async (req, res) => {
  try {
    const submissions = await WatSubmission.find({ watId: req.params.watId })
      .populate('studentId', 'studentId name rollNumber email') 
      .lean();
    
    
    const results = submissions.map(sub => ({
      _id: sub._id,
      score: sub.score,
      studentId:sub.studentId.studentId,
      rollNumber: sub.studentId.rollNumber,
      studentName: sub.studentId.name,
      email: sub.studentId.email,
      submittedAt: sub.submittedAt
    }));
    console.log(results);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Get WAT results for a student
router.get('/results/:watId/:studentId', authenticateToken, async (req, res) => {
  
  try {
    console.log("hello");
    const { watId, studentId } = req.params;

    // Verify authorization - student can only view their own results
    if (req.user.id !== studentId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view these results' 
      });
    }

    // Find the submission and populate basic WAT info
    const submission = await WatSubmission.findOne({
      watId,
      studentId
    }).lean();

    if (!submission) {
      return res.status(404).json({ 
        success: false,
        message: 'Submission not found' 
      });
    }

    // Get the full WAT with questions to compare answers
    const wat = await WAT.findById(watId)
      .select('questions subject watNumber')
      .lean();

    if (!wat) {
      return res.status(404).json({ 
        success: false,
        message: 'WAT not found' 
      });
    }

    // Create a map of questions for quick lookup
    const questionMap = new Map();
    wat.questions.forEach(question => {
      questionMap.set(question._id.toString(), question);
    });

    // Process each answer to include question details and correctness
    const detailedAnswers = submission.answers.map(answer => {
      const question = questionMap.get(answer.questionId.toString());
      
      if (!question) {
        return {
          ...answer,
          questionText: 'Question not found',
          isCorrect: false,
          correctAnswer: 'N/A'
        };
      }

      return {
        ...answer,
        questionText: question.questionText,
        options: question.options,
        isCorrect: answer.selectedOption === question.correctAnswer,
        correctAnswer: question.correctAnswer
      };
    });

    // Calculate percentage score
    const totalQuestions = wat.questions.length;
    const percentageScore = Math.round((submission.score / totalQuestions) * 100);

    // Prepare the response
    const response = {
      success: true,
      data: {
        watDetails: {
          _id: wat._id,
          subject: wat.subject,
          watNumber: wat.watNumber,
          totalQuestions
        },
        submissionDetails: {
          score: submission.score,
          percentage: percentageScore,
          submittedAt: submission.submittedAt
        },
        answers: detailedAnswers
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Error fetching WAT results:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;