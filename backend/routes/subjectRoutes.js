const express = require('express');
const router = express.Router();
const Subject = require('../models/Subjects');
// const authenticateToken = require('../middleware/authenticateToken');
const verifyToken = require('../middleware/verifyToken');

// POST: Add subjects
router.post('/add', async (req, res) => {
  try {
    const { year, semester, subjects } = req.body;
    const existing = await Subject.findOne({ year, semester });

    if (existing) {
      // Update if already exists
      existing.subjects = subjects;
      await existing.save();
      return res.status(200).json({ message: 'Subjects updated successfully' });
    }

    const newEntry = new Subject({ year, semester, subjects });
    await newEntry.save();
    res.status(201).json({ message: 'Subjects added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET: Fetch subjects by year and semester
router.get('/:year/:semester', async (req, res) => {
  try {
    const { year, semester } = req.params;
    const subjectData = await Subject.findOne({ year, semester });
    res.status(200).json(subjectData || {});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error });
  }
});


// PUT: Update subjects for specific year and semester
router.put('/:year/:semester', async (req, res) => {
  try {
    const { year, semester } = req.params;
    const { subjects } = req.body;

    // Validate input
    if (!year || !semester || !Array.isArray(subjects)) {
      return res.status(400).json({ 
        success: false,
        message: 'Year, semester and subjects array are required' 
      });
    }

    const updated = await Subject.findOneAndUpdate(
      { year, semester },
      { subjects },
      { new: true, upsert: true }
    );

    res.status(200).json({ 
      success: true,
      message: 'Subjects updated successfully',
      data: updated
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during update',
      error: error.message 
    });
  }
});

router.get('/', async (req, res) => {
  try {
    // Fetch all subjects from database
    const subjects = await Subject.find().lean();
    
    // Organize subjects by year and semester
    const organizedSubjects = {};
    
    subjects.forEach(subjectDoc => {
      const { year, semester } = subjectDoc;
      
      if (!organizedSubjects[year]) {
        organizedSubjects[year] = {
          sem1: [],
          sem2: []
        };
      }
      
      // Add subjects to the appropriate semester
      organizedSubjects[year][semester] = subjectDoc.subjects.map(sub => ({
        code: sub.code,
        name: sub.name
      }));
    });
    
    res.status(200).json(organizedSubjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch subjects',
      error: error.message 
    });
  }
});
module.exports = router;

