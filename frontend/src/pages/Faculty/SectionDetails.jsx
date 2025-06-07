import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FacultySidebar from './FacultySidebar';
import { FaBars, FaArrowLeft } from 'react-icons/fa';

export default function SectionDetails() {
  const { year } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sections = ['A', 'B', 'C', 'D', 'E'];

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
        <h1 className="text-blue-600 font-bold text-lg">Year {year} Sections</h1>
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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <button 
                  onClick={() => navigate('/faculty/student-details')}
                  className="hidden md:flex items-center text-blue-600 hover:text-blue-800 mb-2"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Years
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Sections for Year {year}
                </h1>
              </div>
            </div>

            {/* Section Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {sections.map((section) => (
                <div 
                  key={section} 
                  onClick={() => navigate(`/faculty/student-details/${year}/${section}`)}
                  className="bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-xl border-l-4 border-green-500 text-center"
                  role="button"
                  tabIndex="0"
                  onKeyPress={(e) => e.key === 'Enter' && navigate(`/faculty/student-details/${year}/${section}`)}
                >
                  <h2 className="text-4xl font-extrabold text-green-600 mb-2">{section}</h2>
                  <p className="text-gray-600 font-medium">Section</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}