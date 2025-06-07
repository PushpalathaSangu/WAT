import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserTie } from "react-icons/fa";
import image2 from "../../assets/imag35.jpeg";

const FacultyRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    years: [],
    subjects: new Map(), // Using Map to match your schema
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState({});
  const [fetchingSubjects, setFetchingSubjects] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState("sem1"); // Track selected semester

  const yearOptions = ["E1", "E2", "E3", "E4"];
  const semesterOptions = ["sem1", "sem2"];

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/subjects");
        if (response.ok) {
          const data = await response.json();
          setAvailableSubjects(data);
        } else {
          console.error("Failed to fetch subjects");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setFetchingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        setIsRegistered(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isRegistered]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleYearChange = (e) => {
    const { value, checked } = e.target;
    let newYears = [...formData.years];
    const newSubjects = new Map(formData.subjects);

    if (checked) {
      newYears.push(value);
      // Initialize with empty array for the year if not exists
      if (!newSubjects.has(value)) {
        newSubjects.set(value, []);
      }
    } else {
      newYears = newYears.filter((year) => year !== value);
      newSubjects.delete(value);
    }

    setFormData({ ...formData, years: newYears, subjects: newSubjects });
  };

  const handleSubjectToggle = (year, subjectCode) => {
    const newSubjects = new Map(formData.subjects);
    const currentSubjects = newSubjects.get(year) || [];
    const subjectIndex = currentSubjects.indexOf(subjectCode);

    if (subjectIndex === -1) {
      // Add subject if not already selected
      newSubjects.set(year, [...currentSubjects, subjectCode]);
    } else {
      // Remove subject if already selected
      newSubjects.set(year, currentSubjects.filter(code => code !== subjectCode));
    }

    setFormData({ ...formData, subjects: newSubjects });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "*Name is required";
    if (!formData.email.trim()) newErrors.email = "*Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "*Email is invalid";

    if (!formData.password.trim()) newErrors.password = "*Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "*Password must be at least 6 characters";

    if (formData.years.length === 0)
      newErrors.years = "*Please select at least one year";

    // Check if at least one subject is selected
    let hasSubjects = false;
    formData.subjects.forEach(subjects => {
      if (subjects.length > 0) {
        hasSubjects = true;
      }
    });

    if (!hasSubjects) {
      newErrors.subjects = "*Please select at least one subject";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "*Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "*Contact must be a valid 10-digit number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        // Convert Map to object for JSON serialization
        const subjectsObj = {};
        formData.subjects.forEach((value, key) => {
          subjectsObj[key] = value;
        });

        const response = await fetch("http://localhost:4000/faculty/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            subjects: subjectsObj
          }),
        });

        if (response.ok) {
          setIsRegistered(true);
          setFormData({
            name: "",
            email: "",
            password: "",
            contact: "",
            years: [],
            subjects: new Map(),
          });
          setErrors({});
          navigate("/login");
        } else {
          const errorData = await response.json();
          console.error("Failed to register the faculty:", errorData.message);
        }
      } catch (error) {
        console.error("Error occurred while registering:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (fetchingSubjects) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] bg-gradient-to-br from-blue-50 to-gray-100 p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-700">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[90vh] bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row" style={{ maxHeight: '700px' }}>
        {/* Left Side - Welcome Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white flex flex-col items-center justify-center">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">Welcome</h1>
            <p className="text-blue-100 text-sm">Join our teaching community</p>
          </div>
          
          <img 
            src={image2} 
            alt="Teaching illustration" 
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
              <FaUserTie className="text-blue-500 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Faculty Registration</h2>
          </div>

          {isRegistered && (
            <div className="text-green-600 text-sm font-medium text-center bg-green-100 p-2 rounded mb-4">
              Successfully Registered!
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
                placeholder="your@email.com"
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

            {/* Years Handling */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years Handling:</label>
              <div className="grid grid-cols-2 gap-2">
                {yearOptions.map((year) => (
                  <label key={year} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={year}
                      checked={formData.years.includes(year)}
                      onChange={handleYearChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{year}</span>
                  </label>
                ))}
              </div>
              {errors.years && <p className="mt-1 text-xs text-red-600">{errors.years}</p>}
            </div>

            {/* Semester Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Semester:</label>
              <div className="flex space-x-4">
                {semesterOptions.map((semester) => (
                  <label key={semester} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="semester"
                      value={semester}
                      checked={selectedSemester === semester}
                      onChange={() => setSelectedSemester(semester)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm capitalize">
                      {semester === "sem1" ? "Sem1" : "Sem2"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subjects Selection */}
            {formData.years.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Subjects for {selectedSemester === "sem1" ? "Semester 1" : "Semester 2"}:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {formData.years.map((year) => (
                    <div key={year} className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-600">{year} Subjects:</h3>
                      {availableSubjects[year]?.[selectedSemester]?.length > 0 ? (
                        availableSubjects[year][selectedSemester].map((subject) => (
                          <label key={subject.code} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                            <input
                              type="checkbox"
                              checked={formData.subjects.get(year)?.includes(subject.name) || false}
                              onChange={() => handleSubjectToggle(year, subject.name)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">
                              {subject.code} - {subject.name}
                            </span>
                          </label>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">No subjects available for {year}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.subjects && (
              <p className="mt-1 text-xs text-red-600">{errors.subjects}</p>
            )}

            {/* Contact Number */}
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
              disabled={loading}
              className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all ${
                loading ? 'opacity-75 cursor-not-allowed' : 'hover:translate-y-[-1px] hover:shadow-md'
              }`}
            >
              {loading ? (
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

export default FacultyRegister;