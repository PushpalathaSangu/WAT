import React from 'react';

import test1 from '../../assets/test1.jpg';
import test2 from '../../assets/test2.jpg';
import mcqs from '../../assets/mcqs.jpg';
import grade from '../../assets/grade.jpg';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">About Weekly Assessment Test (WAT)</h2>

     

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white border rounded-xl p-4 shadow hover:shadow-lg">
          <img src={test1} alt="Test Taking" className="w-full h-48 object-cover rounded mb-4" />
          <h3 className="text-xl font-semibold text-blue-600">1. Seamless Test Experience</h3>
          <p className="text-gray-600">Students can attempt weekly tests online with a clean and intuitive interface that supports multiple-choice questions (MCQs).</p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow hover:shadow-lg">
          <img src={grade} alt="Auto Grading" className="w-full h-48 object-cover rounded mb-4" />
          <h3 className="text-xl font-semibold text-blue-600">2. Automatic Grading</h3>
          <p className="text-gray-600">Student answers are automatically validated against correct options, and scores are instantly generated after submission.</p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow hover:shadow-lg">
          <img src={mcqs} alt="MCQ Interface" className="w-full h-48 object-cover rounded mb-4" />
          <h3 className="text-xl font-semibold text-blue-600">3. Easy Question Setup</h3>
          <p className="text-gray-600">Teachers can create, edit, and manage MCQ-based tests for different subjects and WAT numbers in just a few clicks.</p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow hover:shadow-lg">
          <img src={test2} alt="Performance Analytics" className="w-full h-48 object-cover rounded mb-4" />
          <h3 className="text-xl font-semibold text-blue-600">4. Performance Analytics</h3>
          <p className="text-gray-600">The system provides visual insights into student scores, question accuracy, and WAT trends for educators to evaluate progress.</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h4 className="text-xl font-bold text-gray-800 mb-2">Bringing Weekly Assessments Online</h4>
        <p className="text-gray-600 max-w-2xl mx-auto">
          With WAT, schools and colleges can easily track student learning, save grading time, and offer a consistent assessment experience—all online.
        </p>
      </div>
    </div>
  );
}
