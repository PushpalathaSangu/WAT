import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FacultySidebar from './FacultySidebar';
import { FaBars } from 'react-icons/fa';

export default function FacultyProfile() {
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:4000/faculty/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFaculty(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            'Failed to fetch faculty profile. Please try again later.'
        );
        setLoading(false);
      });
  }, []);

  // Group subjects by year
  const groupSubjectsByYear = (assignedSubjects = []) => {
    const grouped = {};
    assignedSubjects.forEach(({ year, subject }) => {
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(subject);
    });
    return grouped;
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
        <h1 className="text-blue-600 font-bold text-lg">Faculty Panel</h1>
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

        {/* Profile Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-blue-600 text-white rounded-full w-24 h-24 flex items-center justify-center text-3xl font-semibold shadow-lg">
                {faculty?.name?.charAt(0).toUpperCase()}
              </div>

              <h2 className="mt-4 text-xl font-bold text-blue-600">
                {faculty?.name}
              </h2>
              <p className="mt-2 text-gray-600">Email: {faculty?.email}</p>
              <p className="mt-2 text-gray-600">Contact: {faculty?.contact}</p>
              <p className="mt-2 text-gray-600 mr-5">Assigned subjects:</p>

              {/* Assigned Years and Subjects */}
              <div className="mt-4 w-full max-w-xl text-center">
                {faculty?.assignedSubjects &&
                faculty.assignedSubjects.length > 0 ? (
                  Object.entries(
                    groupSubjectsByYear(faculty.assignedSubjects)
                  ).map(([year, subjects]) => (
                    <div key={year} className="mb-4">
                      <div className="flex justify-center gap-2 w-full">
                        <div className="text-center">
                          <span className="font-semibold text-blue-600">
                            {year}:
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          {subjects.map((subject, index) => (
                            <div key={index} className="text-gray-600">
                              {subject}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No assigned subjects found.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
