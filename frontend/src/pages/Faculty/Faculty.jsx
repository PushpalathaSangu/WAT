import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserGraduate, FaClipboardList, FaPlusCircle } from 'react-icons/fa';
import FacultySidebar from './FacultySidebar';

export default function Faculty() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [facultyName, setFacultyName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('facultyName');
    if (storedName) {
      setFacultyName(storedName);
    }
  }, []);

  const cards = [
    {
      title: 'Create WAT',
      description: 'Create a new WAT using syllabus.',
      icon: <FaPlusCircle className="text-3xl text-purple-600 mb-3" />,
      onClick: () => navigate('/faculty/mcqs'),
    },
    {
      title: 'View WATs',
      description: 'View all active WATs.',
      icon: <FaClipboardList className="text-3xl text-green-600 mb-3" />,
      onClick: () => navigate('/faculty/view-wats'),
    },
    {
      title: 'Student Details',
      description: 'View year-wise student data.',
      icon: <FaUserGraduate className="text-3xl text-blue-600 mb-3" />,
      onClick: () => navigate('/faculty/students-details'),
    },
  ];

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
        <h1 className="text-blue-600 font-bold text-lg">Faculty Dashboard</h1>
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

        {/* Overlay}
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
                Welcome, {facultyName || 'Faculty'} 👋
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Here's what you can do today
              </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  onClick={card.onClick}
                  className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 cursor-pointer active:scale-95"
                  role="button"
                  tabIndex="0"
                  onKeyPress={(e) => e.key === 'Enter' && card.onClick()}
                >
                  <div className="flex flex-col items-center text-center">
                    {card.icon}
                    <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}