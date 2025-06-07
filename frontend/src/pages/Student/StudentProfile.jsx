import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentSidebar from './StudentSidebar';
import { 
  FaBars, 
  FaUserGraduate, 
  FaEnvelope, 
  FaIdCard, 
  FaHashtag, 
  FaCalendarAlt, 
  FaBook, 
  FaUsers, 
  FaPhone,
  FaUserCircle,
  FaGraduationCap,
  FaUniversity,
  FaHome,
  FaInfoCircle
} from 'react-icons/fa';

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('User not authenticated. Please login.');
      setLoading(false);
      return;
    }

    axios
      .get('http://localhost:4000/student/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStudent(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching student profile:', err);
        setError(
          err.response?.data?.message ||
          'Failed to fetch student profile. Please try again later.'
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-xl font-medium mb-4">{error}</div>
          <button
            onClick={() => window.location.href = '/student-login'}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-blue-600 font-bold text-lg">Student Portal</h1>
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
          <StudentSidebar
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
          <div className="max-w-4xl mx-auto">
            {/* Single Profile Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Profile Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                      <FaUserGraduate className='w-32 h-32' />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start">
                      <FaGraduationCap className="mr-2 text-xl" />
                      <h1 className="text-2xl font-bold">{student?.name}</h1>
                    </div>
                    <p className="text-blue-100 font-medium">{student?.studentId}</p>
                    <div className="flex items-center justify-center md:justify-start mt-2">
                      <span>{student?.year} Year - Section {student?.section}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                    <FaHome className="mr-2 text-blue-500" />
                    Personal Information
                  </h2>
                  
                  <ProfileDetailItem
                    icon={<FaUserCircle className="text-blue-500" />}
                    label="Full Name"
                    value={student?.name}
                  />
                  
                  <ProfileDetailItem
                    icon={<FaEnvelope className="text-blue-500" />}
                    label="Email Address"
                    value={student?.email}
                  />
                  
                  <ProfileDetailItem
                    icon={<FaPhone className="text-blue-500" />}
                    label="Contact Number"
                    value={student?.phone}
                  />
                  
                  <ProfileDetailItem
                    icon={<FaInfoCircle className="text-blue-500" />}
                    label="Date of Birth"
                    value={student?.dob || 'Not available'}
                  />
                </div>

                {/* Academic Information */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center">
                    <FaUniversity className="mr-2 text-blue-500" />
                    Academic Information
                  </h2>
                  
                  <ProfileDetailItem
                    icon={<FaIdCard className="text-blue-500" />}
                    label="Student ID"
                    value={student?.studentId}
                  />
                  
                  <ProfileDetailItem
                    icon={<FaHashtag className="text-blue-500" />}
                    label="Roll Number"
                    value={student?.rollNumber}
                  />
                  
                  <ProfileDetailItem
                    icon={<FaCalendarAlt className="text-blue-500" />}
                    label="Academic Year"
                    value={student?.year}
                  />
                  
                  <ProfileDetailItem
                    icon={<FaBook className="text-blue-500" />}
                    label="Current Semester"
                    value={student?.semester}
                  />
                  
                  <ProfileDetailItem
                    icon={<FaUsers className="text-blue-500" />}
                    label="Class Section"
                    value={student?.section}
                  />
                  
                  <ProfileDetailItem
                    icon={<FaGraduationCap className="text-blue-500" />}
                    label="Department"
                    value={student?.department || 'Not available'}
                  />
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex justify-end">
                  <span className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Enhanced Profile Detail Component
function ProfileDetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start group">
      <div className="flex-shrink-0 h-5 w-5 mt-1 mr-3 transform group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
          {label}
        </p>
        <p className="text-md font-semibold text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">
          {value || 'Not available'}
        </p>
      </div>
    </div>
  );
}