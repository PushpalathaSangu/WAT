import React from 'react';
import { useState, useEffect } from "react";
import { GenerateMCQS } from "../../services/Mcqservices";
import axios from "axios";
import FacultySidebar from "../Faculty/FacultySidebar";
import { FaBars } from "react-icons/fa";

const GenerateMcqs = () => {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);

  // Existing states
  const [step, setStep] = useState(1);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [watDetails, setWatDetails] = useState({
    subject: "",
    year: "",
    semester: "",
    watNumber: "",
    startTime: "",
    endTime: "",
  });
  const [syllabus, setSyllabus] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingWATs, setExistingWATs] = useState([]);
  const [conflictDetails, setConflictDetails] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMCQs, setShowMCQs] = useState(false);

  // Fetch faculty profile to get assigned years and subjects
  useEffect(() => {
    const fetchFacultyProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated.');
          return;
        }

        const response = await axios.get("http://localhost:4000/faculty/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setFaculty(response.data);
        const uniqueYears = [...new Set(response.data.assignedSubjects.map(sub => sub.year))];
        setYears(uniqueYears);
      } catch (err) {
        console.error("Failed to fetch faculty profile:", err);
        setError(
          err.response?.data?.message ||
          'Failed to fetch faculty profile. Please try again later.'
        );
      }
    };
    
    fetchFacultyProfile();
  }, []);

  // Fetch subjects when year is selected
  useEffect(() => {
    if (selectedYear && faculty) {
      const yearSubjects = faculty.assignedSubjects
        .filter(sub => sub.year === selectedYear)
        .map(sub => sub.subject);
        
      setSubjects(yearSubjects);
    }
  }, [selectedYear, faculty]);

  // Fetch existing WATs when subject is selected
  useEffect(() => {
    if (watDetails.subject && watDetails.year) {
      const fetchExistingWATs = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/wats/by-year-subject`,
            {
              params: {
                year: watDetails.year,
                subject: watDetails.subject,
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );

          if (response.data.success) {
            setExistingWATs(response.data.data || []);
          } else {
            console.log("No WATs found:", response.data.message);
            setExistingWATs([]);
          }
        } catch (err) {
          console.error("Failed to fetch existing WATs:", {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message
          });
          setExistingWATs([]);
        }
      };
      fetchExistingWATs();
    } else {
      setExistingWATs([]);
    }
  }, [watDetails.subject, watDetails.year]);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedSubjects([]);
    setWatDetails(prev => ({ ...prev, year, subject: "" }));
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubjects([subject]);
    setWatDetails(prev => ({ ...prev, subject }));
  };

  const checkTimeConflict = (newWat, existingWats) => {
    const newStart = new Date(newWat.startTime);
    const newEnd = new Date(newWat.endTime);
    
    const conflicts = existingWats.filter(wat => {
      const existingStart = new Date(wat.startTime);
      const existingEnd = new Date(wat.endTime);
      
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
    
    return conflicts.length > 0 ? conflicts : null;
  };

  const handleWatDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setConflictDetails(null);

    try {
      // First check for time conflicts
      const conflicts = checkTimeConflict(watDetails, existingWATs);
      if (conflicts) {
        setConflictDetails(conflicts);
        throw new Error("Time conflict detected with existing WAT(s)");
      }

      const payload = {
        ...watDetails,
        startTime: new Date(watDetails.startTime).toISOString(),
        endTime: new Date(watDetails.endTime).toISOString()
      };

      const response = await axios.post(
        "http://localhost:4000/api/wats/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        localStorage.setItem("currentWatId", response.data.data.id);
        setStep(2);
      } else {
        throw new Error(response.data.message || "Failed to create WAT");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message;
      setError(errorMessage);
      console.error("WAT creation error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!syllabus.trim()) {
      setError("Please enter syllabus content");
      return;
    }
  
    setLoading(true);
    setError("");
    setShowSuccess(false);
  
    try {
      const watId = localStorage.getItem('currentWatId');
      if (!watId) {
        throw new Error("No WAT selected. Please select a WAT first.");
      }
      
      const result = await GenerateMCQS(syllabus, watId);
      if (result.mcqs) {
        setMcqs(result.mcqs);
        setShowSuccess(true);
        setShowMCQs(false);
      } else {
        throw new Error("No MCQs were generated");
      }
    } catch (error) {
      console.error("Generation error:", {
        message: error.message,
        response: error.response?.data
      });
      
      setError(error.response?.data?.error || 
              error.response?.data?.message || 
              error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWatDetails(prev => ({ ...prev, [name]: value }));
  };

  const formatDateTime = (dateTimeString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Mobile Top Bar */}
      <div className="md:hidden p-4 bg-white shadow flex justify-between items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-600 text-2xl"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <h1 className="text-blue-600 font-bold text-lg">Generate MCQs</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform
            md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <FacultySidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-blue-gray-800 bg-opacity-30 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {/* Success Alert */}
            {showSuccess && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <h3 className="text-xl font-bold text-green-600">Success!</h3>
                    </div>
                    <button 
                      onClick={() => setShowSuccess(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mb-6">
                    <p className="text-lg mb-2">WAT is created successfully!</p>
                    <p className="text-gray-700">{mcqs.length} MCQs have been generated and saved.</p>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowSuccess(false);
                        setShowMCQs(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View MCQs
                    </button>
                    <button
                      onClick={() => {
                        setShowSuccess(false);
                        setStep(1);
                        setSyllabus("");
                        setMcqs([]);
                      }}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Create New
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 1 ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Enter WAT Details</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Select Year</h3>
                  <div className="flex flex-wrap gap-2">
                    {years.map(year => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearSelect(year)}
                        className={`px-4 py-2 rounded ${selectedYear === year ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedYear && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Select Subject</h3>
                    <div className="flex flex-wrap gap-2">
                      {subjects.map(subject => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => handleSubjectSelect(subject)}
                          className={`px-4 py-2 rounded ${selectedSubjects.includes(subject) ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {watDetails.subject && (
                  <form onSubmit={handleWatDetailsSubmit}>
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Select Semester</h3>
                      <select
                        name="semester"
                        value={watDetails.semester}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="">Select Semester</option>
                        <option value="sem1">Sem 1</option>
                        <option value="sem2">Sem 2</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Select WAT Number</h3>
                      <div className="flex gap-4">
                        {['wat1', 'wat2', 'wat3', 'wat4'].map(wat => (
                          <label key={wat} className="flex items-center">
                            <input
                              type="radio"
                              name="watNumber"
                              value={wat}
                              checked={watDetails.watNumber === wat}
                              onChange={handleInputChange}
                              className="mr-2"
                              required
                            />
                            {wat.toUpperCase()}
                          </label>
                        ))}
                      </div>
                      
                      {existingWATs.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p>Existing WATs for {watDetails.subject}:</p>
                          <ul className="list-disc list-inside ml-4">
                            {existingWATs.map(wat => (
                              <li key={wat._id}>
                                WAT {wat.watNumber} - {formatDateTime(wat.startTime)} to {formatDateTime(wat.endTime)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Start Time</label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        value={watDetails.startTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">End Time</label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        value={watDetails.endTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                      {loading ? "Processing..." : "Submit WAT Details"}
                    </button>
                    
                    {error && !conflictDetails && (
                      <p className="text-red-500 mt-2">{error}</p>
                    )}
                    
                    {conflictDetails && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        <h4 className="font-bold">Time Conflict Detected!</h4>
                        <p>The selected time overlaps with existing WAT(s):</p>
                        <ul className="list-disc list-inside ml-4">
                          {conflictDetails.map(wat => (
                            <li key={wat._id}>
                              <span className="font-semibold">{wat.subject}</span> - WAT {wat.watNumber} 
                              ({formatDateTime(wat.startTime)} to {formatDateTime(wat.endTime)})
                            </li>
                          ))}
                        </ul>
                        <p className="mt-2 font-medium">Please choose a different time slot.</p>
                      </div>
                    )}
                  </form>
                )}
              </div>
            ) : (
              <>
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <h3 className="font-semibold">WAT Details:</h3>
                  <p>Subject: {watDetails.subject}</p>
                  <p>Year: {watDetails.year}</p>
                  <p>Semester: {watDetails.semester}</p>
                  <p>WAT: {watDetails.watNumber}</p>
                  <p>Time: {formatDateTime(watDetails.startTime)} to {formatDateTime(watDetails.endTime)}</p>
                </div>

                <h2 className="text-xl font-bold mb-2">Paste Syllabus</h2>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={8}
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  placeholder="Paste syllabus here..."
                />
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setStep(1)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
                  >
                    {loading ? "Generating..." : "Generate MCQs"}
                  </button>
                </div>
                
                {error && <p className="text-red-500 mt-2">{error}</p>}

                {mcqs.length > 0 && !showMCQs && (
                  <button
                    onClick={() => setShowMCQs(true)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Show Generated MCQs ({mcqs.length})
                  </button>
                )}

                {showMCQs && mcqs.length > 0 && (
                  <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Generated MCQs ({mcqs.length})</h3>
                      <button
                        onClick={() => setShowMCQs(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Hide
                      </button>
                    </div>
                    <ul className="space-y-4">
                      {mcqs.map((q, idx) => (
                        <li key={idx} className="border p-3 rounded shadow">
                          <p className="font-medium">{idx + 1}. {q.questionText}</p>
                          <ul className="list-disc list-inside ml-4 mt-2">
                            {q.options.map((opt, i) => (
                              <li 
                                key={i} 
                                className={`${opt === q.correctAnswer ? "font-bold text-green-700" : ""}`}
                              >
                                {opt}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GenerateMcqs;