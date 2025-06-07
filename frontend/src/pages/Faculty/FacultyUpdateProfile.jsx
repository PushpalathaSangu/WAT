import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacultySidebar from './FacultySidebar';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';

export default function FacultyUpdateProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [facultyData, setFacultyData] = useState({
    name: '',
    email: '',
    contact: '',
    years: [],
    subjects: {}
  });

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:4000/faculty/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          // Convert subjects Map to plain object if needed
          const subjects = res.data.subjects instanceof Map
            ? Object.fromEntries(res.data.subjects)
            : res.data.subjects || {};

          setFacultyData({
            name: res.data.name || '',
            email: res.data.email || '',
            contact: res.data.contact || '',
            years: res.data.years || [],
            subjects: subjects
          });
        }
      } catch (error) {
        console.error('Error fetching faculty data', error);
        setError('Failed to load profile data');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
  }, [navigate]);

  const handleChange = (e) => {
    setFacultyData({ ...facultyData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const updateData = {
        ...facultyData,
        contact: facultyData.contact
      };

      const res = await axios.put(
        'http://localhost:4000/faculty/update',
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (res.data.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => navigate('/faculty/profile'), 1500);
      } else {
        setError(res.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error("Update error:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (error.response.status === 400) {
          setError(error.response.data.message ||
            'Validation error. Please check your inputs.');
        } else {
          setError(error.response.data?.message ||
            'Error updating profile. Please try again.');
        }
      } else if (error.request) {
        setError('No response from server. Please try again.');
      } else {
        setError('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !facultyData.name) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Mobile Top Bar */}
      <div className="md:hidden p-4 bg-white shadow flex justify-between items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-600 text-2xl focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <h1 className="text-lg font-semibold text-blue-600">Update Profile</h1>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
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

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-blue-gray-800 bg-opacity-30 backdrop-blur-sm z-20 md:hidden"
            aria-hidden="true"
          />
        )}

        <main className="flex-1 p-6 overflow-y-auto flex justify-center items-start">
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mt-6 sm:mt-10 sm:px-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center sm:hidden">
              Update Profile
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-300">
                {success}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  type="text"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md
                             focus:ring-blue-500 focus:border-blue-500 transition"
                  value={facultyData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md
                             focus:ring-blue-500 focus:border-blue-500 transition"
                  value={facultyData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  name="contact"
                  type="tel"
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md
                             focus:ring-blue-500 focus:border-blue-500 transition"
                  value={facultyData.contact}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  title="10 digit phone number"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-md
                           hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
