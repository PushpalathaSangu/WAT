import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaSignOutAlt, 
  FaBars,
  FaChalkboardTeacher,
  FaPlusCircle,
  FaListAlt,
  FaUserGraduate,
  FaUserEdit
} from 'react-icons/fa';

export default function FacultySidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('faculty')) || { name: 'F' };
  const firstLetter = user?.name?.charAt(0).toUpperCase() || 'F';

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem('faculty');
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const navItems = [
    { label: 'Faculty', icon: <FaChalkboardTeacher />, path: '/faculty-dashboard' },
    { label: 'Profile', icon: <FaUserCircle />, path: '/faculty/profile' },
    { label: 'Update Profile', icon: <FaUserEdit />, path: '/faculty/update-profile' },
    { label: 'Create WAT', icon: <FaPlusCircle />, path: '/faculty/mcqs' },
    { label: 'View WATs', icon: <FaListAlt />, path: '/faculty/view-wats' },
    { label: 'Student Details', icon: <FaUserGraduate />, path: '/faculty/students-details' }
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden bg-blue-600 p-3 flex justify-between items-center text-white sticky top-0 z-40">
        <div className="text-xl font-semibold">Faculty Panel</div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <FaBars className="text-2xl" />
        </button>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-blue-600 p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center pb-4 border-b border-blue-300">
          <div className="bg-white text-blue-600 rounded-full w-20 h-20 flex items-center justify-center text-3xl font-semibold shadow-lg transition duration-300 ease-in-out hover:scale-110 hover:shadow-xl">
            {firstLetter}
          </div>
          <br />
          <p className="text-blue-100 text-sm">{user?.email || ''}</p>
          <p className="text-blue-100 text-sm font-medium mt-1">{user?.department || 'Faculty'}</p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 flex flex-col space-y-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2 text-left rounded transition ${
                location.pathname === item.path
                  ? 'bg-white text-blue-900 font-semibold shadow-md'
                  : 'text-white hover:bg-blue-200 hover:text-blue-900'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-left rounded hover:bg-red-200 text-red-100 hover:text-red-800 transition mt-4"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </div>
    </>
  );
}