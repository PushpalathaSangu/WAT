const fs = require('fs');
const pdf = require('pdf-parse');
const axios = require('axios');

// Load PDF and extract text
async function extractTextFromPDF(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text;
}

// Call Gemini API
async function generateMCQs(pdfText) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const prompt = `
Generate 5 MCQs with 4 options and one correct answer from the following content:
${pdfText}
`;

    const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey,
        {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("\nGenerated MCQs:\n", text);
}

(async () => {
    const pdfText = await extractTextFromPDF('./CDC1.pdf');
    await generateMCQs(pdfText);
})();
