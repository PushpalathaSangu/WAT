import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import FacultySidebar from './FacultySidebar';
import { FaBars, FaArrowLeft, FaSearch } from 'react-icons/fa';

export default function StudentsList() {
  const { year, section } = useParams();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';
    setSearchTerm(searchQuery);
  }, [location.search]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get(
          `http://localhost:4000/faculty/students/${year}/${section}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setStudents(response.data.data);
          setFilteredStudents(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch students');
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err.response?.data?.message || 'Failed to load student details');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [year, section]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    navigate(`?search=${value}`, { replace: true });
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
        <h1 className="text-blue-600 font-bold text-lg">Y{year} Sec {section}</h1>
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

        {/* Overlay with professional blue-gray color */}
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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <button
                  onClick={() => navigate(`/faculty/student-details/${year}`)}
                  className="hidden md:flex items-center text-blue-600 hover:text-blue-800 mb-2"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Sections
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Students of Year {year} Section {section}
                </h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by Student ID or Name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      navigate('', { replace: true });
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? `Showing ${filteredStudents.length} students matching: ${searchTerm}` : `Showing all ${students.length} students`}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p>{error}</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  {searchTerm ? 'No matching students found' : 'No Students Found'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 'Try a different search term' : `There are no students in Year ${year} Section ${section}.`}
                </p>
              </div>
            ) : (
              <>
                {/* Table on medium and above */}
                <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.year}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.section}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Card layout for small screens */}
                <div className="md:hidden space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student._id} className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Student ID</p>
                          <p className="text-sm font-medium">{student.studentId}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Name</p>
                          <p className="text-sm font-medium">{student.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Email</p>
                          <p className="text-sm truncate">{student.email}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Year/Sec</p>
                          <p className="text-sm font-medium">{student.year}/{student.section}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}