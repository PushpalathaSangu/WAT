import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUserGraduate, FaUserTie, FaUserShield } from 'react-icons/fa';
import axios from 'axios';
import loginImage from '../../assets/image1.jpg';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: ""
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    userType: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "", userType: "" };

    if (!formData.email.trim()) {
      newErrors.email = "*Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "*Invalid email format";
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "*Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "*Password must be at least 6 characters";
      valid = false;
    }

    if (!formData.userType) {
      newErrors.userType = "*Please select a user type";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/auth/login', {
        email: formData.email,
        password: formData.password,
        role: formData.userType.toLowerCase()
      });

      // Store user data in localStorage
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("name",user.name);
      localStorage.setItem("role",user.role);
      localStorage.setItem("_id",user.id);
     
    // ADD THIS: Store year separately if it exists in user object
    if (user.year) {
      localStorage.setItem("year", user.year);
    }
      // Show success message
      alert(`Welcome back, ${user.name}!`);

      // Navigate based on role
      const dashboardPaths = {
        'student': '/student-dashboard',
        'faculty': '/faculty-dashboard',
        'admin': '/admin-dashboard'
      };
      navigate(dashboardPaths[user.role.toLowerCase()] || '/');

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Please try again.";
      alert(errorMsg);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTypeIcon = () => {
    switch(formData.userType) {
      case 'Student': return <FaUserGraduate className="text-blue-500" />;
      case 'Faculty': return <FaUserTie className="text-green-500" />;
      case 'Admin': return <FaUserShield className="text-purple-500" />;
      default: return <FaUserGraduate className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Welcome Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            
          </div>
          
          <img 
            src={loginImage} 
            alt="Learning illustration" 
            className="w-64 h-64 object-contain mb-8 rounded-lg shadow-lg border-4 border-white transform hover:scale-105 transition duration-300"
          />
          
          <p className="text-center text-blue-100">
            Don't have an account?{' '}
            <Link 
              to="/" 
              className="font-semibold text-white hover:underline transition"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {getUserTypeIcon()}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Login to Your Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password:
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* User Type Selection */}
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                I am a...
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.userType ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white`}
              >
                <option value="">Select your role</option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.userType && <p className="mt-1 text-sm text-red-600">{errors.userType}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Loging in...' : 'Login'}
            </button>

            <div className="text-center text-sm text-gray-600 mt-4">
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;