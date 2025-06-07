import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaCheckCircle, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import StudentSidebar from './StudentSidebar';

export default function Student() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentYear, setStudentYear] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [wats, setWats] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const year = localStorage.getItem('year');
    const id = localStorage.getItem('_id');
    const name = localStorage.getItem('studentName');

    if (year && id) {
      setStudentYear(year);
      setStudentId(id);
      setStudentName(name || 'Student');
    } else {
      setError('Student data not found. Please log in again.');
      setLoading(false);
      navigate('/student-login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!studentYear || !studentId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [watsRes, subsRes] = await Promise.all([
          axios.get(`http://localhost:4000/api/wats/active/by-year/${studentYear}`),
          axios.get(`http://localhost:4000/api/wats/submissions/student/${studentId}`)
        ]);
        setWats(watsRes.data);
        setSubmissions(subsRes.data);
        if (!watsRes.data.length) {
          setError('No active WATs found for your year');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load WATs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentYear, studentId]);

  const hasAttempted = (watId) => submissions.some((s) => s.watId === watId);

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
        <h1 className="text-blue-600 font-bold text-lg">Student Dashboard</h1>
        <div className="w-6" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform
          md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
            {/* Welcome Message */}
            <div className="text-center mb-8 px-2 sm:px-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                Welcome, {studentName || 'Student'} 👋
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Here are your available WATs for Year {studentYear}
              </p>
            </div>

            {/* Error / Loading */}
            {error ? (
              <div className="text-center text-red-500 text-sm">{error}</div>
            ) : loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100 border-t-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
                {wats.map((wat) => {
                  const attempted = hasAttempted(wat._id);
                  return (
                    <div
                      key={wat._id}
                      className={`bg-white p-4 sm:p-6 rounded-xl shadow-md border transition-all duration-200 transform hover:-translate-y-1
                        ${attempted ? 'opacity-80 bg-gray-100' : ''}`}
                    >
                      <div className="flex flex-col items-center text-center">
                        {attempted ? (
                          <FaCheckCircle className="text-3xl text-green-600 mb-3" />
                        ) : (
                          <FaEdit className="text-3xl text-blue-600 mb-3" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-800">
                          {wat.subject} - WAT {wat.watNumber}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(wat.startTime).toLocaleString()} -{' '}
                          {new Date(wat.endTime).toLocaleString()}
                        </p>
                        {attempted ? (
                          <p className="mt-3 text-sm font-medium text-green-700">
                            Attempted ✅
                          </p>
                        ) : (
                          <a
                            href={`/wats/${wat._id}`}
                            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                          >
                            Attempt Now
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
