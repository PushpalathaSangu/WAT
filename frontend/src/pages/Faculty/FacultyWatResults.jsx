import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import FacultySidebar from "./FacultySidebar";
import {
  FaBars,
  FaArrowLeft,
  FaUserGraduate,
  FaFileDownload,
  FaSearch,
} from "react-icons/fa";

export default function FacultyWatResults() {
  const { watId } = useParams();
  const [results, setResults] = useState([]);
  const [watDetails, setWatDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const [watResponse, resultsResponse] = await Promise.all([
          axios.get(`http://localhost:4000/api/wats/wat/${watId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:4000/api/wats/wat-submissions/${watId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!watResponse.data.success) {
          throw new Error("Failed to fetch WAT details");
        }

        if (!resultsResponse.data.success) {
          throw new Error("Failed to fetch WAT results");
        }

        setWatDetails(watResponse.data.data);
        setResults(resultsResponse.data.data);
      } catch (err) {
        console.error("Error fetching WAT results:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load WAT results. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [watId]);

  const filteredResults = results.filter(
    (result) =>
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (result.email && result.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const downloadResults = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Roll No,Student ID,Name,Email,Score\n";

    results.forEach((result) => {
      csvContent += `${result.rollNumber},${result.studentId},${result.studentName},${result.email || "N/A"},${result.score}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute(
      "href",
      encodedUri
    );
    link.setAttribute(
      "download",
      `${watDetails?.subject}_WAT${watDetails?.watNumber}_results.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600"
          aria-label="Go Back"
        >
          <FaArrowLeft size={20} />
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex flex-col">
                <button
                  onClick={() => navigate(-1)}
                  className="hidden md:flex items-center text-blue-600 hover:text-blue-800 mb-2"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to WATs
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 truncate">
                  WAT Results
                </h1>
                {watDetails && (
                  <div className="mt-2 text-blue-600 space-y-1">
                    <p className="font-medium truncate">
                      {watDetails.subject} - WAT {watDetails.watNumber}
                    </p>
                    <p className="text-sm">
                      Year: {watDetails.year} • Semester: {watDetails.semester}
                    </p>
                    <p className="text-sm">
                      Total Questions: {watDetails.questions.length}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Loading / Error / Results */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p>{error}</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Controls */}
                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Student Results
                    </h2>
                    <p className="text-sm text-gray-600">
                      {results.length} student{results.length !== 1 ? "s" : ""} attempted this WAT
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search students..."
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search Students"
                      />
                    </div>
                    <button
                      onClick={downloadResults}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center text-sm whitespace-nowrap"
                      aria-label="Export Results as CSV"
                    >
                      <FaFileDownload className="mr-2" />
                      Export Results
                    </button>
                  </div>
                </div>

                {/* Results Table */}
                {filteredResults.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Roll No
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Student ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredResults.map((result, index) => (
                          <tr
                            key={result._id}
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.rollNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.studentId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-2 text-sm text-gray-900">
                              <FaUserGraduate className="text-blue-500" />
                              <span>{result.studentName}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.email || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                              {result.score} / {watDetails?.questions.length}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="p-6 text-center text-gray-500">No results found.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 