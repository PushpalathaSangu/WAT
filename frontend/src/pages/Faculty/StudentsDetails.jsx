import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FacultySidebar from './FacultySidebar';
import { FaBars, FaArrowLeft } from 'react-icons/fa';

export default function StudentsDetails() {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedYears = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get('http://localhost:4000/faculty/assigned-years', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setYears(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch assigned years');
        }
      } catch (err) {
        console.error('Error fetching years:', err);
        setError(err.response?.data?.message || 'Failed to load assigned years');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedYears();
  }, []);

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
        <h1 className="text-blue-600 font-bold text-lg">Student Details</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Assigned Years</h1>
              <button 
                onClick={() => navigate(-1)}
                className="hidden md:block px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Back
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p>{error}</p>
              </div>
            ) : years.length === 0 ? (
              <div className="text-center py-12 px-4">
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No Years Assigned
                </h3>
                <p className="text-gray-500 mb-4">
                  You haven't been assigned to any years yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {years.map((year) => (
                  <div 
                    key={year} 
                    onClick={() => navigate(`/faculty/student-details/${year}`)}
                    className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg border-l-4 border-blue-500"
                    role="button"
                    tabIndex="0"
                    onKeyPress={(e) => e.key === 'Enter' && navigate(`/faculty/student-details/${year}`)}
                  >
                    <div className="flex flex-col items-center">
                      <h2 className="text-4xl font-bold text-blue-600 mb-2">{year}</h2>
                      <p className="text-gray-600">Year</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}