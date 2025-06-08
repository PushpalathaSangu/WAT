import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../Student/StudentSidebar';
import { FaBars, FaBook, FaSearch } from 'react-icons/fa';

export default function ViewMarks() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const student = JSON.parse(localStorage.getItem('user'));
        if (!student?.id) {
          navigate('/login');
          return;
        }

        const res = await axios.get(
          `http://localhost:4000/api/wats/submissions/${student.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        // Filter out invalid submissions
        const validSubmissions = res.data.filter((sub) => {
          return (
            typeof sub.score === 'number' &&
            typeof sub.totalQuestions === 'number' &&
            sub.watDetails?.subject &&
            sub.watDetails?.watNumber
          );
        });

        setSubmissions(validSubmissions);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError(
          err.response?.data?.error ||
            'Failed to fetch results. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [navigate]);

  const organizeResults = () => {
    const subjectMap = {};

    submissions.forEach((submission) => {
      const { subject, watNumber } = submission.watDetails;
      // Changed from *10 to *100 to get percentage, not *10
      const percentage = Math.round(
        (submission.score / submission.totalQuestions) * 10
      );

      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          subject,
          wats: {},
          percentages: [],
        };
      }

      subjectMap[subject].wats[watNumber] = {
        score: submission.score,
        total: submission.totalQuestions,
        percentage,
      };

      subjectMap[subject].percentages.push(percentage);
    });

    Object.values(subjectMap).forEach((subject) => {
      const sortedPercentages = [...subject.percentages].sort((a, b) => b - a);
      const best3 = sortedPercentages.slice(0, 3);

      subject.best3Avg =
        best3.length > 0
          ? Math.round(best3.reduce((sum, p) => sum + p, 0) / best3.length)
          : null;
    });

    const allWatNumbers = Array.from(
      new Set(submissions.map((sub) => sub.watDetails.watNumber))
    ).sort((a, b) => a - b);

    return {
      subjects: Object.values(subjectMap),
      watNumbers: allWatNumbers,
    };
  };

  const { subjects: subjectResults, watNumbers } = organizeResults();

  const filteredResults = subjectResults.filter((result) =>
    result.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your results...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto text-center py-12">
            <div className="text-red-500 text-xl font-medium mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar container with toggle for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md transform
          md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <StudentSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-blue-gray-800 bg-opacity-30 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <FaBars size={24} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Your WAT Results</h1>
          <div style={{ width: 24 }} /> {/* empty space for alignment */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              {/* Desktop title */}
              <h1 className="hidden md:block text-2xl font-bold text-gray-800">Your WAT Results</h1>
              <div className="relative w-full md:w-64">
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  className="pl-10 pr-3 py-2 border rounded-md w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <FaBook className="mx-auto text-4xl text-blue-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">No WATs Completed Yet</h3>
                <p className="text-gray-600 mb-4">You haven't completed any WATs yet.</p>
                <button
                  onClick={() => navigate('/student/wats')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  View Available WATs
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        {watNumbers.map((num) => (
                          <th
                            key={num}
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {num}
                          </th>
                        ))}
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Best 3 Avg
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredResults.length > 0 ? (
                        filteredResults.map((subject, idx) => (
                          <tr key={`${subject.subject}-${idx}`} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                              {subject.subject}
                            </td>
                            {watNumbers.map((num) => {
                              const wat = subject.wats[num];
                              return (
                                <td
                                  key={num}
                                  className={`px-6 py-4 text-center whitespace-nowrap font-semibold ${
                                    wat
                                      ? wat.percentage >= 6
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {wat ? `${wat.percentage}` : '--'}
                                </td>
                              );
                            })}
                            <td
                              className={`px-6 py-4 text-center whitespace-nowrap font-bold ${
                                subject.best3Avg >= 6? 'text-green-700' : 'text-red-700'
                              }`}
                            >
                              {subject.best3Avg !== null ? `${subject.best3Avg}` : '--'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={watNumbers.length + 2}
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            No subjects match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
