import React, { useState } from 'react';
import axios from 'axios';
import { FaBars } from 'react-icons/fa';
import FacultySidebar from '../../pages/Faculty/FacultySidebar';

export default function CreateWAT() {
  const [step, setStep] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [watData, setWatData] = useState({
    subject: '',
    year: '',
    semester: '',
    watNumber: '',
    questions: [],
    startTime: '',
    endTime: ''
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    questionId: step,
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const [pastedInput, setPastedInput] = useState('');

  const handlePasteQuestion = (e) => {
    const pastedText = e.target.value;
    const lines = pastedText.split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');

    let questionText = '';
    let options = [];

    const optionPattern = /^[a-dA-D][).]\.?\s*(.*)/;
    const questionPattern = /^\d+[).]\.?\s*(.*)/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (questionPattern.test(line)) {
        questionText = line.replace(questionPattern, '$1').trim();
      }
      else if (optionPattern.test(line)) {
        const optionText = line.replace(optionPattern, '$1').trim();
        options.push(optionText);
      }
      else if (!questionText) {
        questionText = line;
      }
      else {
        if (options.length > 0) {
          options[options.length - 1] += ' ' + line;
        } else {
          questionText += ' ' + line;
        }
      }
    }

    while (options.length < 4) {
      options.push('');
    }

    if (questionText) {
      setCurrentQuestion({
        questionId: currentQuestionIndex + 1,
        questionText,
        options: options.slice(0, 4),
        correctAnswer: 0
      });
    }
  };

  const handleBasicDetailsSubmit = (e) => {
    e.preventDefault();
    const emptyQuestions = Array.from({ length: totalQuestions }, () => ({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    }));
    setWatData({ ...watData, questions: emptyQuestions });
    setStep(2);
  };

  const handleQuestionSubmit = () => {
    const correctAnswerIndex = parseInt(currentQuestion.correctAnswer);
    const correctAnswerText = currentQuestion.options[correctAnswerIndex];

    const questionData = {
      ...currentQuestion,
      correctAnswer: correctAnswerText
    };

    const updatedQuestions = [...watData.questions];
    updatedQuestions[currentQuestionIndex] = questionData;

    setWatData({ ...watData, questions: updatedQuestions });

    setCurrentQuestion({
      questionId: step,
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });

    setPastedInput('');

    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/wats/create', {
        ...watData,
        facultyId: "67fb967dc29fd5b9ffa18577"
      });

      alert("✅ WAT Created Successfully!");
      window.location.href = "/faculty-dashboard";
    } catch (err) {
      if (err.response && err.response.status === 409) {
        const existing = err.response.data.existingWat;
        if (existing.watNumber === watData.watNumber) {
          alert(`⚠️ WAT #${existing.watNumber} already exists for ${existing.subject} in ${existing.semester} ${existing.year}. Please use a different WAT number.`);
        } else {
          alert(`⚠️ Conflict: WAT #${existing.watNumber} for "${existing.subject}" is already scheduled from ${formatDate(existing.startTime)} to ${formatDate(existing.endTime)}. Please choose a different time.`);
        }
      } else if (err.response && err.response.status === 400) {
        alert(`❌ Invalid input: ${err.response.data.error}`);
      } else {
        console.error(err);
        alert('❌ Failed to create WAT. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden p-4 bg-white shadow flex justify-between items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-600 text-2xl"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <FacultySidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto mt-6 p-6 border rounded shadow bg-white">
            <h2 className="text-xl font-bold mb-4 text-center">Create WAT</h2>

            {step === 1 && (
              <form onSubmit={handleBasicDetailsSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Subject"
                  value={watData.subject}
                  onChange={(e) => setWatData({ ...watData, subject: e.target.value })}
                  required
                  className="w-full border p-2 rounded"
                />

                <div className="space-y-2">
                  <label className="block font-medium">Year:</label>
                  <div className="flex flex-wrap gap-4">
                    {['E1', 'E2', 'E3', 'E4'].map((year) => (
                      <label
                        key={year}
                        className="inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="year"
                          value={year}
                          checked={watData.year === year}
                          onChange={(e) => setWatData({ ...watData, year: e.target.value })}
                          className="mr-1"
                          required
                        />
                        {year}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-medium">Semester:</label>
                  <div className="flex flex-wrap gap-4">
                    {['Sem1', 'Sem2'].map((sem) => (
                      <label
                        key={sem}
                        className="inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="semester"
                          value={sem}
                          checked={watData.semester === sem}
                          onChange={(e) => setWatData({ ...watData, semester: e.target.value })}
                          className="mr-1"
                          required
                        />
                        {sem}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-medium">WAT Number:</label>
                  <div className="flex flex-wrap gap-4">
                    {['1', '2', '3', '4'].map((num) => (
                      <label
                        key={num}
                        className="inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="watNumber"
                          value={num}
                          checked={watData.watNumber === num}
                          onChange={(e) => setWatData({ ...watData, watNumber: e.target.value })}
                          className="mr-1"
                          required
                        />
                        WAT {num}
                      </label>
                    ))}
                  </div>
                </div>

                <input
                  type="number"
                  placeholder="Number of Questions"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(parseInt(e.target.value))}
                  required
                  className="w-full border p-2 rounded"
                  min="1"
                  max="100"
                />

                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                  Next
                </button>
              </form>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Question {currentQuestionIndex + 1}</h3>
                <textarea
                  placeholder="Paste question and options here"
                  value={pastedInput}
                  onChange={(e) => {
                    setPastedInput(e.target.value);
                    handlePasteQuestion(e);
                  }}
                  className="w-full border p-2 mb-2 rounded resize-none"
                  rows={5}
                />
                <div className="mb-2">
                  <label className="block">Question:</label>
                  <input
                    type="text"
                    value={currentQuestion.questionText}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                    className="w-full border p-2 mb-2 rounded"
                    required
                  />
                </div>
                {currentQuestion.options.map((opt, i) => (
                  <div key={i} className="mb-2">
                    <label className="block">Option {i + 1}:</label>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...currentQuestion.options];
                        newOptions[i] = e.target.value;
                        setCurrentQuestion({ ...currentQuestion, options: newOptions });
                      }}
                      className="w-full border p-2 rounded"
                      required
                    />
                  </div>
                ))}
                <label className="block my-2">Correct Option (Index: 0-3)</label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: parseInt(e.target.value) })}
                  className="w-full border p-2 mb-4 rounded"
                  required
                />
                <button
                  onClick={handleQuestionSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                >
                  {currentQuestionIndex + 1 === totalQuestions ? 'Next (Timing)' : 'Next Question'}
                </button>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold">Schedule WAT</h3>
                <label className="block">Start Time:</label>
                <input
                  type="datetime-local"
                  value={watData.startTime}
                  onChange={(e) => setWatData({ ...watData, startTime: e.target.value })}
                  required
                  className="w-full border p-2 rounded"
                />
                <label className="block">End Time:</label>
                <input
                  type="datetime-local"
                  value={watData.endTime}
                  onChange={(e) => setWatData({ ...watData, endTime: e.target.value })}
                  required
                  className="w-full border p-2 rounded"
                />
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                >
                  Submit WAT
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
