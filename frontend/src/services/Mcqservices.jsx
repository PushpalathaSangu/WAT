
// import axios from "axios";
// export const GenerateMCQS = async (syllabus, count = 5) => {
//   const response = await axios.post("http://localhost:5000/api/mcqs/generate", {
//     syllabus,
//     count
//   });
//   console.log(response)
//   return response.data.data;
// };

// services/mcqService.js
import axios from "axios";

export const GenerateMCQS = async (syllabus, watId) => {
  try {
    console.log(syllabus)
    const response = await axios.post("http://localhost:4000/api/mcqs/generate", {
      watId,
      syllabus,
    
    });
    console.log("✅ MCQs received:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Axios error:", error.response?.data || error.message);
    throw error;
  }
};

