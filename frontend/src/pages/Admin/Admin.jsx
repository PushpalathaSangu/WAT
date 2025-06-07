import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaBookOpen, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';

export default function Admin() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('adminName');
    if (storedName) {
      setAdminName(storedName);
    }
  }, []);

  const cards = [
    {
      title: 'Year-wise Subjects',
      description: 'Manage and view subjects categorized by academic year.',
      icon: <FaBookOpen className="text-3xl text-blue-600 mb-3" />,
      actions: [
        { label: 'Add', route: '/admin/subjects' },
        { label: 'View', route: '/admin/view-subjects' },
        { label: 'Update', route: '/admin/update-subjects' },
      ],
    },
    {
      title: 'Students',
      description: 'View, add, or update student records.',
      icon: <FaUserGraduate className="text-3xl text-green-600 mb-3" />,
      actions: [{ label: 'Manage Students', route: '/admin/students' }],
    },
    {
      title: 'Faculty',
      description: 'Manage faculty information and assignments.',
      icon: <FaChalkboardTeacher className="text-3xl text-purple-600 mb-3" />,
      actions: [{ label: 'Manage Faculty', route: '/admin/faculty' }],
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
        <h1 className="text-blue-600 font-bold text-lg">Admin Dashboard</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-600 shadow-md transform
            md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
                Welcome back, {adminName || 'Admin'} 👋
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Here's what you can manage today
              </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex flex-col items-center text-center">
                    {card.icon}
                    <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {card.actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => navigate(action.route)}
                          className="px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
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
