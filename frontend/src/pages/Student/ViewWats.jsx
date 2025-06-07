import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../Student/StudentSidebar';
import { 
  FaBars, FaClock, FaBook, FaHourglassStart, FaHourglassEnd, 
  FaChevronDown, FaChevronUp, FaCheck, FaTimes 
} from 'react-icons/fa';

export default function ViewWats() {
  const [wats, setWats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentYear, setStudentYear] = useState('');
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedWat, setExpandedWat] = useState(null);
  const [watResults, setWatResults] = useState({});
  const [attemptedWats, setAttemptedWats] = useState([]);
  const navigate = useNavigate();

  // Load attempted WATs from localStorage on component mount
  useEffect(() => {
    const savedAttempts = localStorage.getItem('attemptedWats');
    if (savedAttempts) {
      setAttemptedWats(JSON.parse(savedAttempts));
    }
  }, []);

  // Fetch student year on component mount
  useEffect(() => {
    const year = localStorage.getItem('year');
    if (year) {
      setStudentYear(year);
    } else {
      setError('Student year not found. Please log in again.');
      setLoading(false);
      navigate('/student-login');
    }
  }, [navigate]);

  // Fetch WATs when studentYear changes
  useEffect(() => {
    if (!studentYear) return;

    const fetchWats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:4000/api/wats/by-year/${studentYear}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!response.data || response.data.length === 0) {
          setError('No WATs found for your year');
        } else {
          const sortedWats = response.data.sort((a, b) => 
            new Date(b.startTime) - new Date(a.startTime)
          );
          setWats(sortedWats);
          
          // Fetch results for completed WATs
          const completedWats = sortedWats.filter(wat => 
            new Date(wat.endTime) < new Date() || 
            attemptedWats.includes(wat._id)
          );
          await fetchWatResults(completedWats);
        }
      } catch (err) {
        console.error('Error fetching WATs:', err);
        setError(err.response?.data?.message || 'Failed to load WATs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWats();
  }, [studentYear, attemptedWats]);

  // Fetch results for completed WATs
  const fetchWatResults = async (completedWats) => {
    try {
      const studentId = localStorage.getItem('userId');
      if (!studentId) return;
      
      const results = {};
      
      for (const wat of completedWats) {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/wats/results/${wat._id}/${studentId}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          
          if (response.data) {
            results[wat._id] = response.data;
          }
        } catch (err) {
          console.error(`Error fetching results for WAT ${wat._id}:`, err);
          results[wat._id] = { error: 'Results not available' };
        }
      }
      
      setWatResults(results);
    } catch (err) {
      console.error('Error fetching WAT results:', err);
    }
  };

  // Mark WAT as attempted in local state
  const markWatAsAttempted = (watId) => {
    const updatedAttempts = [...attemptedWats, watId];
    setAttemptedWats(updatedAttempts);
    localStorage.setItem('attemptedWats', JSON.stringify(updatedAttempts));
  };

  // Calculate duration in hours and minutes
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const currentTime = new Date();

  // Categorize WATs into active, upcoming, completed
  const categorizeWats = () => {
    const active = [];
    const upcoming = [];
    const completed = [];

    wats.forEach(wat => {
      const start = new Date(wat.startTime);
      const end = new Date(wat.endTime);
      
      if (currentTime < start) {
        upcoming.push(wat);
      } else if (currentTime > end || attemptedWats.includes(wat._id)) {
        completed.push(wat);
      } else {
        active.push(wat);
      }
    });

    return { active, upcoming, completed };
  };

  const { active, upcoming, completed } = categorizeWats();

  // Format date and time for display
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const toggleExpandWat = (watId) => {
    setExpandedWat(expandedWat === watId ? null : watId);
  };

  // Handle WAT attempt
  const handleWatAttempt = (watId) => {
    // Mark as attempted before navigating
    markWatAsAttempted(watId);
    navigate(`/wats/${watId}`);
  };

  // Render detailed results for a completed WAT
  const renderResultDetails = (watId) => {
    const result = watResults[watId];
    
    if (!result) return <div className="text-gray-500 text-sm mt-2">Loading results...</div>;
    if (result.error) return <div className="text-red-500 text-sm mt-2">{result.error}</div>;
    if (!result.data) return <div className="text-gray-500 text-sm mt-2">No results available</div>;

    const { submissionDetails, watDetails, answers } = result.data;

    return (
      <div className="mt-4 space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Your Score:</span>
            <span className="font-bold">
              {submissionDetails.score} / {watDetails.totalQuestions} 
              ({submissionDetails.percentage}%)
            </span>
          </div>
          <div className="mt-2 text-sm">
            <span className="font-medium">Submitted At:</span> {formatDateTime(submissionDetails.submittedAt)}
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Question Details:</h4>
          <div className="space-y-4">
            {answers.map((answer, qIndex) => (
              <div key={qIndex} className={`border rounded-lg p-3 ${answer.isCorrect ? 'border-green-200' : 'border-red-200'}`}>
                <div className="flex items-start">
                  <div className={`flex-shrink-0 mt-1 mr-2 ${answer.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {answer.isCorrect ? <FaCheck /> : <FaTimes />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Q{qIndex + 1}: {answer.questionText}</p>
                    
                    {/* Display the submitted answer */}
                    <div className="mt-2">
                      <p className="text-sm font-medium">Your Answer:</p>
                      <div className="bg-gray-50 p-2 rounded mt-1">
                        {answer.selectedOption || "No answer submitted"}
                      </div>
                    </div>

                    {/* Display correct answer if wrong */}
                    {!answer.isCorrect && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Correct Answer:</p>
                        <div className="bg-green-50 p-2 rounded mt-1">
                          {answer.correctAnswer}
                        </div>
                      </div>
                    )}

                    {/* Display explanation if available */}
                    {answer.explanation && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Explanation:</p>
                        <div className="bg-blue-50 p-2 rounded mt-1 text-sm">
                          {answer.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render a section of WATs (active/upcoming/completed)
  const renderWatSection = (title, wats, status) => {
    if (wats.length === 0) return null;

    const statusColors = {
      active: 'bg-green-100 text-green-800 border-green-500',
      upcoming: 'bg-blue-100 text-blue-800 border-blue-500',
      completed: 'bg-gray-100 text-gray-800 border-gray-400'
    };

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className={`w-3 h-3 rounded-full mr-2 ${statusColors[status].split(' ')[0]}`}></span>
          {title} ({wats.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wats.map((wat) => {
            const isAttempted = attemptedWats.includes(wat._id);
            const currentStatus = isAttempted ? 'completed' : status;
            
            return (
              <div 
                key={wat._id} 
                className={`rounded-lg shadow-md overflow-hidden border-l-4 cursor-pointer transition-all ${
                  currentStatus === 'active' ? 'border-green-500 hover:shadow-lg' :
                  currentStatus === 'upcoming' ? 'border-blue-500 hover:shadow-lg' : 
                  'border-gray-400 hover:shadow-md'
                }`}
                onClick={() => toggleExpandWat(wat._id)}
              >
                <div className="bg-white p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {wat.subject}
                      </h3>
                      <p className="text-gray-600">WAT {wat.watNumber}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isAttempted ? statusColors.completed : statusColors[status]
                    }`}>
                      {isAttempted ? 'Attempted' : 
                       currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                    </span>
                  </div>

                  {expandedWat === wat._id && (
                    <div className="mt-4 space-y-2 animate-fadeIn">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaHourglassStart className="mr-2 text-blue-500" />
                        <span>Starts: {formatDateTime(wat.startTime)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaHourglassEnd className="mr-2 text-blue-500" />
                        <span>Ends: {formatDateTime(wat.endTime)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaClock className="mr-2 text-blue-500" />
                        <span>Duration: {calculateDuration(wat.startTime, wat.endTime)}</span>
                      </div>
                      {wat.description && (
                        <div className="mt-2 text-sm text-gray-700">
                          <p className="font-medium">Description:</p>
                          <p>{wat.description}</p>
                        </div>
                      )}
                      
                      {/* Show results for completed/attempted WATs */}
                      {(currentStatus === 'completed' || isAttempted) && renderResultDetails(wat._id)}
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <button 
                      className="text-blue-600 text-sm flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandWat(wat._id);
                      }}
                    >
                      {expandedWat === wat._id ? (
                        <>
                          <FaChevronUp className="mr-1" /> Less details
                        </>
                      ) : (
                        <>
                          <FaChevronDown className="mr-1" /> More details
                        </>
                      )}
                    </button>

                    {currentStatus === 'active' && !isAttempted && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWatAttempt(wat._id);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
                      >
                        Attempt Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
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
        <h1 className="text-blue-600 font-bold text-lg">WAT Examinations</h1>
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
          <StudentSidebar
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
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Weekly Assessment Tests ({studentYear})
              </h1>
              <div className="flex items-center text-sm text-gray-500">
                <FaClock className="mr-1" />
                {currentTime.toLocaleDateString()}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                <p>{error}</p>
              </div>
            ) : wats.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <FaBook className="text-blue-500 text-3xl" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No WATs Scheduled
                </h3>
                <p className="text-gray-500">
                  There are currently no WATs available for your year.
                </p>
              </div>
            ) : (
              <>
                {renderWatSection("Active WATs", active, 'active')}
                {renderWatSection("Upcoming WATs", upcoming, 'upcoming')}
                {renderWatSection("Completed WATs", completed, 'completed')}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}