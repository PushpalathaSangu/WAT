import React from 'react';
import homeImage from '../../assets/home.jpeg';
import { FaClipboardCheck, FaChartLine, FaCalendarAlt, FaUserGraduate, FaUserTie, FaUserShield, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const userTypes = [
    {
      role: "Student",
      icon: <FaUserGraduate className="w-12 h-12 mx-auto mb-4 text-blue-600 group-hover:text-white transition-colors duration-300" />,
      description: "Take weekly assessments, track your progress, and receive personalized feedback to improve your performance.",
      benefits: [
        "Personalized dashboard",
        "Performance analytics",
        "Subject-wise breakdown"
      ],
      color: "bg-blue-600"
    },
    {
      role: "Faculty",
      icon: <FaUserTie className="w-12 h-12 mx-auto mb-4 text-green-600 group-hover:text-white transition-colors duration-300" />,
      description: "Create and manage assessments, monitor student progress, and provide targeted guidance to your class.",
      benefits: [
        "Assessment creator",
        "Class performance reports",
        "Automated grading"
      ],
      color: "bg-green-600"
    },
    {
      role: "Admin",
      icon: <FaUserShield className="w-12 h-12 mx-auto mb-4 text-purple-600 group-hover:text-white transition-colors duration-300" />,
      description: "Manage the entire assessment platform, oversee user accounts, and generate institutional reports.",
      benefits: [
        "User management",
        "Institutional analytics",
        "System configuration"
      ],
      color: "bg-purple-600"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === userTypes.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? userTypes.length - 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Weekly Assessment <span className="text-blue-600 hover:text-blue-700 transition-colors duration-300">Tests</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto hover:text-gray-700 transition-colors duration-300">
          Track your progress, identify strengths, and improve weaknesses with our comprehensive weekly assessment platform.
        </p>
        
        <div className="flex justify-center mb-8 group">
          <img 
            src={homeImage} 
            alt="Weekly Assessment Visual" 
            className="w-full max-w-2xl rounded-lg shadow-xl border-4 border-white transform group-hover:scale-[1.02] transition-transform duration-500 ease-in-out" 
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <button 
            onClick={() => navigate('/login')}
            className="relative bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <span className="relative z-10">Login</span>
            <span className="absolute inset-0 bg-blue-700 opacity-0 hover:opacity-100 rounded-lg transition-opacity duration-300"></span>
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="relative bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-8 border border-blue-600 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <span className="relative z-10">Sign Up</span>
            <span className="absolute inset-0 bg-gray-100 opacity-0 hover:opacity-100 rounded-lg transition-opacity duration-300"></span>
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 hover:text-gray-900 transition-colors duration-300">
            Benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<FaClipboardCheck className="w-8 h-8 group-hover:text-blue-600 transition-colors duration-300" />}
              title="Comprehensive Tests"
              description="Weekly tests covering all major subjects and topics to ensure complete evaluation."
              color="blue"
            />
            <FeatureCard 
              icon={<FaChartLine className="w-8 h-8 group-hover:text-green-600 transition-colors duration-300" />}
              title="Progress Tracking"
              description="Visual analytics to track your improvement over time and identify patterns."
              color="green"
            />
            <FeatureCard 
              icon={<FaCalendarAlt className="w-8 h-8 group-hover:text-purple-600 transition-colors duration-300" />}
              title="Regular Schedule"
              description="Consistent weekly schedule to build discipline and regular evaluation habits."
              color="purple"
            />
            <FeatureCard 
              icon={<FaUserGraduate className="w-8 h-8 group-hover:text-indigo-600 transition-colors duration-300" />}
              title="Expert Evaluation"
              description="Tests designed by subject matter experts to ensure quality and relevance."
              color="indigo"
            />
          </div>
        </div>
      </div>

      {/* User Types Carousel */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 hover:text-gray-900 transition-colors duration-300">
            Designed For Everyone
          </h2>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {userTypes.map((user, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div 
                      className={`group bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${hoveredCard === index ? 'ring-2 ring-blue-500' : ''}`}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="text-center">
                        <div className={`p-2 rounded-full inline-block mb-6 group-hover:${user.color} group-hover:text-white transition-all duration-300`}>
                          {user.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                          {user.role}
                        </h3>
                        <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                          {user.description}
                        </p>
                        <ul className="text-left max-w-md mx-auto space-y-2 mb-6">
                          {user.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                              <span className="text-green-500 mr-2 group-hover:text-green-600 transition-colors duration-300">✓</span>
                              <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                                {benefit}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => navigate('/register')}
                          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                          Get Started
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              <FaChevronLeft className="text-gray-600 hover:text-gray-900 transition-colors duration-300" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              <FaChevronRight className="text-gray-600 hover:text-gray-900 transition-colors duration-300" />
            </button>
            
            <div className="flex justify-center mt-8 space-x-2">
              {userTypes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }) => {
  const colorClasses = {
    blue: 'hover:border-blue-200 hover:bg-blue-50',
    green: 'hover:border-green-200 hover:bg-green-50',
    purple: 'hover:border-purple-200 hover:bg-purple-50',
    indigo: 'hover:border-indigo-200 hover:bg-indigo-50'
  };

  return (
    <div className={`group bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${colorClasses[color]}`}>
      <div className={`text-gray-600 mb-4 group-hover:text-${color}-600 transition-colors duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
};

export default Home;