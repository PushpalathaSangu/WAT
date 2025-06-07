import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserGraduate } from "react-icons/fa";
import axios from "axios";
import image2 from "../../assets/image3.jpeg";

const StudentRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    year: "",
    semester: "",
    section: "",
    studentId: "",
    rollNumber: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "*Name is required";
    if (!formData.email.trim()) newErrors.email = "*Email is required";
    else if (!/^rr\d{6}@rguktrkv\.ac\.in$/i.test(formData.email))
      newErrors.email = "*Email must be in format rrXXXXXX@rguktrkv.ac.in";
    if (!formData.password.trim()) newErrors.password = "*Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "*Password must be at least 6 characters";
    if (!formData.year) newErrors.year = "*Please select your year";
    if (!formData.semester) newErrors.semester = "*Please select your semester";
    if (!formData.section) newErrors.section = "*Please select your section";
    if (!formData.studentId.trim())
      newErrors.studentId = "*Student ID is required";
    else if (!/^R\d{6}$/i.test(formData.studentId))
      newErrors.studentId = "*Student ID must be in format RXXXXXX";
    if (!formData.rollNumber.trim())
      newErrors.rollNumber = "*Roll Number is required";
    else if (!/^\d+$/.test(formData.rollNumber))
      newErrors.rollNumber = "*Roll Number must be a number";
    else if (Number(formData.rollNumber) < 1 || Number(formData.rollNumber) > 72)
      newErrors.rollNumber = "*Roll Number must be between 1 and 72";
    if (!formData.phone.trim()) newErrors.phone = "*Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "*Phone number must be 10 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/student/register", 
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.message === "Student registration successful") {
        navigate("/login");
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row" style={{ maxHeight: '700px' }}>
        {/* Left Side - Welcome Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white flex flex-col items-center justify-center">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="text-blue-100 text-sm">Join our learning community</p>
          </div>
          
          <img 
            src={image2} 
            alt="Learning illustration" 
            className="w-48 h-48 object-contain mb-4 rounded-lg shadow-lg border-4 border-white hover:scale-105 transition-transform duration-300"
          />
          
          <p className="text-center text-blue-100 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-white hover:underline transition-all">
              Login
            </Link>
          </p>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto" style={{
    scrollbarWidth: 'none',  /* Firefox */
    msOverflowStyle: 'none', /* IE/Edge */
  }}>
          <div className="text-center mb-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaUserGraduate className="text-blue-500 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Student Registration</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.name ? 'border-red-500 animate-shake' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
              <input
                type="email"
                name="email"
                placeholder="rrXXXXXX@rguktrkv.ac.in"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.email ? 'border-red-500 animate-shake' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    errors.password ? 'border-red-500 animate-shake' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* Student ID Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID:</label>
              <input
                type="text"
                name="studentId"
                placeholder="RXXXXXX"
                value={formData.studentId}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.studentId ? 'border-red-500 animate-shake' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.studentId && <p className="mt-1 text-xs text-red-600">{errors.studentId}</p>}
            </div>

            {/* Year & Semester */}
            <div className="flex space-x-2">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Year:</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    errors.year ? 'border-red-500 animate-shake' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")] bg-no-repeat bg-[right_0.5rem_center] bg-[size:1.5em_1.5em]`}
                >
                  <option value="">Select Year</option>
                  <option value="E1">E1</option>
                  <option value="E2">E2</option>
                  <option value="E3">E3</option>
                  <option value="E4">E4</option>
                </select>
                {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester:</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    errors.semester ? 'border-red-500 animate-shake' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")] bg-no-repeat bg-[right_0.5rem_center] bg-[size:1.5em_1.5em]`}
                >
                  <option value="">Select Semester</option>
                  <option value="sem1">Sem1</option>
                  <option value="sem2">Sem2</option>
                </select>
                {errors.semester && <p className="mt-1 text-xs text-red-600">{errors.semester}</p>}
              </div>
            </div>

            {/* Section & Roll No */}
            <div className="flex space-x-2">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Section:</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    errors.section ? 'border-red-500 animate-shake' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")] bg-no-repeat bg-[right_0.5rem_center] bg-[size:1.5em_1.5em]`}
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
                {errors.section && <p className="mt-1 text-xs text-red-600">{errors.section}</p>}
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number:</label>
                <input
                  type="text"
                  name="rollNumber"
                  placeholder="1-72"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg border ${
                    errors.rollNumber ? 'border-red-500 animate-shake' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
                {errors.rollNumber && <p className="mt-1 text-xs text-red-600">{errors.rollNumber}</p>}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
              <input
                type="text"
                name="phone"
                placeholder="10 digit phone number"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.phone ? 'border-red-500 animate-shake' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
                isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:translate-y-[-1px] hover:shadow-md'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Registering...
                </span>
              ) : (
                'Register'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;