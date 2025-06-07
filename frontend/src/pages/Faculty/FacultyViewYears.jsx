import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FacultySidebar from './FacultySidebar';
import { FaBars, FaArrowRight } from 'react-icons/fa';

export default function FacultyViewYears() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacultyYears = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/faculty/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.years) {
          setYears(response.data.years);
        }
      } catch (err) {
        console.error('Error fetching faculty years:', err);
        setError('Failed to load faculty data');
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyYears();
  }, []);

  const handleYearClick = (year) => {
    navigate(`/faculty/view-wats/${year}`);
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
        <h1 className="text-blue-600 font-bold text-lg">Select Year</h1>
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
          <FacultySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">
                Select Academic Year
              </h1>

              {years.length === 0 ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <p className="text-blue-800">No years assigned to you</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {years.map((year) => (
                    <div
                      key={year}
                      onClick={() => handleYearClick(year)}
                      className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 hover:-translate-y-1 border-l-4 border-blue-500"
                      role="button"
                      tabIndex="0"
                      onKeyPress={(e) => e.key === 'Enter' && handleYearClick(year)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg sm:text-xl font-semibold">Year {year}</h3>
                        <FaArrowRight className="text-blue-500" />
                      </div>
                      <p className="text-gray-600 mt-2 text-sm sm:text-base">View WATs for this year</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
