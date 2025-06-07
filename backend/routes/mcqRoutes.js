const express = require("express");
const router = express.Router();
const { generateMcqsFromSyllabus } = require("../controllers/mcqsController.js");

router.post("/generate", generateMcqsFromSyllabus);

module.exports = router;