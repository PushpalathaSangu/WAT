import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';
import AdminSidebar from './AdminSidebar';

export default function YearStudents() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sections = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Mobile Top Bar - Lower z-index */}
      <div className="md:hidden p-4 bg-white shadow flex justify-between items-center sticky top-0 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-600 text-2xl"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-blue-600">
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-blue-800">{year} Year Sections</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Higher z-index */}
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

        {/* Overlay - Between header and sidebar in z-index */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-blue-gray-800 bg-opacity-30 backdrop-blur-sm z-25 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Back Navigation & Title - Desktop */}
            <div className="mb-8 hidden md:block">
              <button
                onClick={() => navigate('/admin/students')}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-3"
              >
                <FiArrowLeft className="mr-2" />
                Back to All Years
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {year} Year Sections
              </h1>
              <p className="text-gray-600 mt-1">Select a section to view students.</p>
            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {sections.map((section) => (
                <div
                  key={section}
                  onClick={() => navigate(`/admin/students/${year}/${section}`)}
                  className="cursor-pointer bg-white p-6 rounded-xl border-l-4 border-green-500 shadow hover:shadow-lg transition-all duration-200"
                >
                  <h2 className="text-3xl font-bold text-green-600 text-center mb-2">{section}</h2>
                  <p className="text-center text-gray-600">Section</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}