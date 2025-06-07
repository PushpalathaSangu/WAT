import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';

const UpdateSub = () => {
  const years = ['E1', 'E2', 'E3', 'E4'];
  const semesters = ['sem1', 'sem2'];
  const [selectedYear, setSelectedYear] = useState('E1');
  const [selectedSemester, setSelectedSemester] = useState('sem1');
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin');
      const response = await axios.get(
        `http://localhost:4000/api/subjects/${selectedYear}/${selectedSemester}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const fetchedSubjects = response.data.subjects || [];
      setSubjects(fetchedSubjects);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedSemester]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value
    };
    setSubjects(updatedSubjects);
  };

  const addNewSubject = () => {
    setSubjects([...subjects, { code: '', name: '', isNew: true }]);
  };

  const removeSubject = (index) => {
    const subjectToRemove = subjects[index];

    if (subjectToRemove.isNew) {
      const updatedSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(updatedSubjects);
      return;
    }

    const shouldRemove = window.confirm('Are you sure you want to remove this subject?');
    if (shouldRemove) {
      const updatedSubjects = [...subjects];
      updatedSubjects[index] = {
        ...updatedSubjects[index],
        isDeleted: true
      };
      setSubjects(updatedSubjects);
    }
  };

  const restoreSubject = (index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      isDeleted: false
    };
    setSubjects(updatedSubjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('admin');

      // Prepare the payload
      const payload = {
        subjects: subjects
          .filter(subject => !subject.isDeleted)
          .map(subject => ({
            _id: subject._id,
            code: subject.code,
            name: subject.name
          })),
        deletedSubjects: subjects
          .filter(subject => subject.isDeleted && subject._id)
          .map(subject => subject._id)
      };

      const response = await axios.put(
        `http://localhost:4000/api/subjects/${selectedYear}/${selectedSemester}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(response.data.message || 'Subjects updated successfully!');
      fetchSubjects(); // Refresh the data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update subjects');
    } finally {
      setLoading(false);
    }
  };

  const displayedSubjects = subjects.filter(subject => !subject.isDeleted);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Mobile Top Bar - z-20 (below sidebar) */}
      <div className="md:hidden p-4 bg-white shadow flex justify-between items-center sticky top-0 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-600 text-2xl"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <h1 className="text-xl font-semibold text-blue-700">Update Subjects</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - z-30 (highest) */}
        <div
          className={
            `fixed inset-y-0 left-0 z-30 w-64 bg-blue-600 shadow-md transform
            md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          }
        >
          <AdminSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        {/* Overlay - z-25 (between header and sidebar) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-blue-gray-800 bg-opacity-30 backdrop-blur-sm z-25 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        {/* Main Content - z-10 (lowest) */}
        <main className="flex-1 overflow-y-auto z-10 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center md:text-left">Update Subjects</h1>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {/* Year and Semester selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>
                        {sem.replace('sem', 'Semester ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>


              {/* Loading spinner */}
              {loading && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-2">Loading...</span>
                </div>
              )}

              {/* Error and success messages */}
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                  <p>{success}</p>
                </div>
              )}
              {/* Subjects form */}
              <form onSubmit={handleSubmit} className="max-w-full">
                <div className="mb-4">
                  {displayedSubjects.length === 0 && !loading ? (
                    <div className="text-center py-4 text-gray-500">
                      No subjects found for the selected year and semester.
                    </div>
                  ) : (
                    displayedSubjects.map((subject, index) => (
                      <div
                        key={subject._id || `new-${index}`}
                        className="grid grid-cols-12 gap-4 mb-4 items-end"
                      >
                        <div className="col-span-12 sm:col-span-5">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Name
                          </label>
                          <input
                            type="text"
                            value={subject.name}
                            onChange={(e) => handleSubjectChange(
                              subjects.findIndex(s =>
                                (subject._id && s._id === subject._id) ||
                                (!subject._id && s === subject)
                              ),
                              'name',
                              e.target.value
                            )}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div className="col-span-12 sm:col-span-5">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Code
                          </label>
                          <input
                            type="text"
                            value={subject.code}
                            onChange={(e) => handleSubjectChange(
                              subjects.findIndex(s =>
                                (subject._id && s._id === subject._id) ||
                                (!subject._id && s === subject)
                              ),
                              'code',
                              e.target.value
                            )}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="col-span-12 sm:col-span-2">
                          <button
                            type="button"
                            onClick={() => removeSubject(
                              subjects.findIndex(s =>
                                (subject._id && s._id === subject._id) ||
                                (!subject._id && s === subject)
                              )
                            )}
                            className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Deleted subjects */}
                {subjects.some(s => s.isDeleted) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Deleted Subjects</h3>
                    <div className="bg-gray-100 p-4 rounded">
                      {subjects.filter(s => s.isDeleted).map((subject, index) => (
                        <div
                          key={`deleted-${subject._id || index}`}
                          className="grid grid-cols-12 gap-4 mb-2 items-center"
                        >
                          <div className="col-span-12 sm:col-span-5 line-through text-gray-500">
                            {subject.name}
                          </div>
                          <div className="col-span-12 sm:col-span-5 line-through text-gray-500">
                            {subject.code}
                          </div>
                          <div className="col-span-12 sm:col-span-2">
                            <button
                              type="button"
                              onClick={() => restoreSubject(
                                subjects.findIndex(s =>
                                  (subject._id && s._id === subject._id) ||
                                  (!subject._id && s === subject))
                              )}
                              className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                            >
                              Restore
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buttons: Add Subject and Submit */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <button
                    type="button"
                    onClick={addNewSubject}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Add Subject
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </>
                    ) : 'Update Subjects'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateSub;