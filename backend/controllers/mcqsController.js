// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const MCQ = require("../models/MCQS");
// require("dotenv").config();

// const generateMcqsFromSyllabus = async (req, res) => {
//   // console.log("Hi");
//   // console.log("✅ Hit backend /generate route with:", req.body); // ADD THIS
//   try {
//     const { syllabus, count = 10 } = req.body;

//     if (!syllabus) {
//       return res.status(400).json({ error: "Syllabus text is required." });
//     }

//     console.log("Hello");
//     // Prompt to send to Gemini API
//     const prompt = `
// You are an AI question generator.

// Based on the following syllabus, generate ${count} multiple-choice questions in JSON format:

// Syllabus:
// """${syllabus}"""

// Format the output in JSON like this:
// \`\`\`json
// [
//   {
//     "questionText": "What is the capital of France?",
//     "options": ["Berlin", "Madrid", "Paris", "Rome"],
//     "correctAnswer": "Paris"
//   }
// ]
// \`\`\`

// Only return valid JSON in a code block.
// `;

//     // Initialize Google Gemini API
   
//     const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Get result from Gemini
//     const result = await model.generateContent([prompt]);
//     const response = result.response.text();

//     // Clean and parse JSON from response
//     const jsonString = response.replace(/```json|```/g, "").trim();
//     const mcqs = JSON.parse(jsonString);

//     // Save to MongoDB
//     const savedMcqs = await MCQ.insertMany(mcqs);

//     // Send response to frontend
//     res.status(201).json({
//       message: "MCQs generated and saved successfully.",
//       data: savedMcqs,
//     });
//   } catch (err) {
//     console.error("Error generating MCQs:", err);
//     res.status(500).json({ error: "Failed to generate questions." });
//   }
// };

// module.exports = { generateMcqsFromSyllabus };

const { GoogleGenerativeAI } = require("@google/generative-ai");
const WAT = require("../models/Wat"); // Make sure this path is correct
require("dotenv").config();

const generateMcqsFromSyllabus = async (req, res) => {

  try {
    const {syllabus,watId, count = 10 } = req.body;

    if (!watId || !syllabus) {
      return res.status(400).json({ error: "watId and syllabus are required." });
    }

    // Prompt to send to Gemini API
    const prompt = `
You are an AI question generator.

Based on the following syllabus, generate ${count} multiple-choice questions in JSON format:

Syllabus:
"""${syllabus}"""

Format the output in JSON like this:
\`\`\`json
[
  {
    "questionText": "What is the capital of France?",
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correctAnswer": "Paris"
  }
]
\`\`\`

Only return valid JSON in a code block.
`;

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate response
    const result = await model.generateContent([prompt]);
    const response = result.response.text();

    // Clean and parse JSON
    const jsonString = response.replace(/```json|```/g, "").trim();
    const mcqs = JSON.parse(jsonString);

    // Update the WAT document: push questions
    const updatedWat = await WAT.findByIdAndUpdate(
      watId,
      { $push: { questions: { $each: mcqs } } },
      { new: true }
    );

    if (!updatedWat) {
      return res.status(404).json({ error: "WAT document not found." });
    }

    res.status(200).json({
      message: "MCQs generated and added to WAT successfully.",
      wat: updatedWat,
      mcqs: mcqs
    });
  } catch (err) {
    console.error("Error generating MCQs:", err);
    res.status(500).json({ error: "Failed to generate and update questions." });
  }
};

module.exports = { generateMcqsFromSyllabus };

