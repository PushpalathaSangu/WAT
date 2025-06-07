import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserShield } from "react-icons/fa";
import adminRegisterImage from "../../assets/imag35.jpeg";
import axios from "axios";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "*Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "*Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "*Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "*Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "*Password must be at least 6 characters";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "*Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "*Contact number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/admin/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contact,
      });

      if (res.data.success) {
        setSuccessMessage("✅ Admin account created successfully!");
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        setFormData({ name: "", email: "", password: "", contact: "" });
        setErrors({});
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ server: errorMsg });
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
            <p className="text-blue-100 text-sm">Administrator Registration</p>
          </div>
          
          <img 
            src={adminRegisterImage} 
            alt="Admin registration" 
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
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="text-center mb-4">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaUserShield className="text-blue-500 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Admin Registration</h2>
          </div>

          {errors.server && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm mb-4">
              {errors.server}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm mb-4">
              {successMessage}
            </div>
          )}

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
                placeholder="admin@example.com"
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

            {/* Contact Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number:</label>
              <input
                type="text"
                name="contact"
                placeholder="10 digit phone number"
                value={formData.contact}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.contact ? 'border-red-500 animate-shake' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              {errors.contact && <p className="mt-1 text-xs text-red-600">{errors.contact}</p>}
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

export default AdminRegister;