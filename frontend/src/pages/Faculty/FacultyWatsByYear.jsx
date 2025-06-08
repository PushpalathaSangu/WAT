import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import FacultySidebar from './FacultySidebar';
import { 
  FaBars, 
  FaClock, 
  FaCalendarAlt, 
  FaBook, 
  FaHourglassStart, 
  FaHourglassEnd,
  FaArrowLeft,
  FaPlus,
  FaCheckCircle
} from 'react-icons/fa';

export default function FacultyWatsByYear() {
  const { year } = useParams();
  const [wats, setWats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(
          `http://localhost:4000/faculty/wats/${year}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (!response.data.success || response.data.data.length === 0) {
          setError(`No WATs found for year ${year}`);
        } else {
          // Sort WATs by start time (newest first)
          const sortedWats = response.data.data.sort((a, b) => 
            new Date(b.startTime) - new Date(a.startTime)
          );
          setWats(sortedWats);
        }
      } catch (err) {
        console.error('Error fetching WATs:', err);
        setError(err.response?.data?.message || 'Failed to load WATs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWats();
  }, [year]);

  const currentTime = new Date();

  const getWatStatus = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    
    if (currentTime < startTime) return 'upcoming';
    if (currentTime > endTime) return 'completed';
    return 'active';
  };

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

  // Separate WATs by status
  const categorizedWats = {
    active: wats.filter(wat => getWatStatus(wat.startTime, wat.endTime) === 'active'),
    upcoming: wats.filter(wat => getWatStatus(wat.startTime, wat.endTime) === 'upcoming'),
    completed: wats.filter(wat => getWatStatus(wat.startTime, wat.endTime) === 'completed'),
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
        <h1 className="text-blue-600 font-bold text-lg">Year {year} WATs</h1>
        <button 
          onClick={() => navigate(-1)} 
          className="text-blue-600 text-2xl"
          aria-label="Go back"
        >
          <FaArrowLeft />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={
            `fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform
            md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          }
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
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="mb-4 sm:mb-0">
                <button 
                  onClick={() => navigate('/faculty/view-wats')}
                  className="hidden md:flex items-center text-blue-600 hover:text-blue-800 mb-2 text-sm sm:text-base"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Years
                </button>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                  Your WATs for Year {year}
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-1" />
                  {currentTime.toLocaleDateString()}
                </div>
                <button 
                  onClick={() => navigate(`/faculty/mcqs`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md flex items-center text-sm w-full sm:w-auto justify-center"
                >
                  <FaPlus className="mr-2" />
                  Create WAT
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p>{error}</p>
              </div>
            ) : wats.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                  <FaBook className="text-blue-500 text-3xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">
                  No WATs Created Yet
                </h3>
                <p className="text-gray-500 mb-4 text-sm sm:text-base">
                  You haven't created any WATs for year {year} yet.
                </p>
                <button
                  onClick={() => navigate(`/faculty/create-wat?year=${year}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center text-sm sm:text-base"
                >
                  <FaPlus className="mr-2" />
                  Create Your First WAT
                </button>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {/* Active WATs */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Active WATs</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {categorizedWats.active.length > 0 ? (
                      categorizedWats.active.map((wat) => (
                        <div 
                          key={wat._id} 
                          className="rounded-lg shadow-md overflow-hidden border-l-4 border-green-500 hover:shadow-lg transition-all duration-200"
                          onClick={() => navigate(`/faculty/wat-results/${wat._id}`)}
                          role="button"
                          tabIndex="0"
                          onKeyPress={(e) => e.key === 'Enter' && navigate(`/faculty/wat-results/${wat._id}`)}
                        >
                          <div className="bg-white p-4 sm:p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">{wat.subject}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                  WAT {wat.watNumber} • Semester {wat.semester}
                                </p>
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </div>
                            <div className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm">
                              <div className="flex items-center text-gray-600">
                                <FaHourglassStart className="mr-2 text-blue-500" />
                                <span>Starts: {formatDateTime(wat.startTime)}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <FaHourglassEnd className="mr-2 text-blue-500" />
                                <span>Ends: {formatDateTime(wat.endTime)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full bg-gray-50 rounded-lg p-6 text-center text-gray-500 text-sm sm:text-base">
                        No active WATs
                      </div>
                    )}
                  </div>
                </div>

                {/* Upcoming WATs */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Upcoming WATs</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {categorizedWats.upcoming.length > 0 ? (
                      categorizedWats.upcoming.map((wat) => (
                        <div 
                          key={wat._id} 
                          className="rounded-lg shadow-md overflow-hidden border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200"
                          onClick={() => navigate(`/faculty/wat-details/${wat._id}`)}
                          role="button"
                          tabIndex="0"
                          onKeyPress={(e) => e.key === 'Enter' && navigate(`/faculty/wat-details/${wat._id}`)}
                        >
                          <div className="bg-white p-4 sm:p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">{wat.subject}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                  WAT {wat.watNumber} • Semester {wat.semester}
                                </p>
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                Upcoming
                              </span>
                            </div>
                            <div className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm">
                              <div className="flex items-center text-gray-600">
                                <FaHourglassStart className="mr-2 text-blue-500" />
                                <span>Starts: {formatDateTime(wat.startTime)}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <FaHourglassEnd className="mr-2 text-blue-500" />
                                <span>Ends: {formatDateTime(wat.endTime)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full bg-gray-50 rounded-lg p-6 text-center text-gray-500 text-sm sm:text-base">
                        No upcoming WATs
                      </div>
                    )}
                  </div>
                </div>

                {/* Completed WATs */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Completed WATs</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {categorizedWats.completed.length > 0 ? (
                      categorizedWats.completed.map((wat) => (
                        <div 
                          key={wat._id} 
                          className="rounded-lg shadow-md overflow-hidden border-l-4 border-gray-400 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="bg-white p-4 sm:p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">{wat.subject}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                  WAT {wat.watNumber} • Semester {wat.semester}
                                </p>
                              </div>
                              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                Completed
                              </span>
                            </div>
                            <div className="mt-3 sm:mt-4 space-y-2 text-xs sm:text-sm">
                              <div className="flex items-center text-gray-600">
                                <FaHourglassStart className="mr-2 text-blue-500" />
                                <span>Starts: {formatDateTime(wat.startTime)}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <FaHourglassEnd className="mr-2 text-blue-500" />
                                <span>Ends: {formatDateTime(wat.endTime)}</span>
                              </div>
                            </div>
                            <div className="mt-3 sm:mt-4">
                              <button
                                onClick={() => navigate(`/faculty/wat-results/${wat._id}`)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-1 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm flex items-center justify-center"
                              >
                                <FaCheckCircle className="mr-1" /> View Results
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full bg-gray-50 rounded-lg p-6 text-center text-gray-500 text-sm sm:text-base">
                        No completed WATs
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}