import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaInfoCircle, 
  FaSignInAlt, 
  FaUserPlus,
  FaUserGraduate,
  FaUserTie,
  FaUserShield,
  FaCalendarAlt,
  FaTimes,
  FaBars
} from 'react-icons/fa';

import logo from '../../assets/logo.png';
import WAT_ABSTRACT from '../../assets/WAT_ABSTRACT.pdf';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, [location]);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/studentregister" ||
    location.pathname === "/facultyregister" ||
    location.pathname === "/adminregister";

  const isHomePage = location.pathname === "/";

  // Close all menus when location changes
  useEffect(() => {
    setIsOpen(false);
    setIsRegisterOpen(false);
  }, [location]);

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 mr-2 rounded-full border-2 border-white"
          />
          <h1 className="text-xl font-bold">Weekly Assessment Tests</h1>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="focus:outline-none text-white hover:text-yellow-300 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`md:flex items-center md:space-x-6 ${isOpen ? 
          'block absolute top-full left-0 right-0 bg-blue-600 shadow-lg md:shadow-none md:relative md:bg-transparent py-2 md:py-0' : 
          'hidden'} md:flex md:mt-0`}>
          
          {/* Home */}
          <div className="relative md:inline-block w-full md:w-auto">
            <Link
              to="/"
              className="flex items-center px-4 py-3 md:px-3 md:py-2 hover:text-yellow-300 transition-colors"
              onMouseEnter={() => setHoveredLink('home')}
              onMouseLeave={() => setHoveredLink(null)}
              onClick={() => setIsOpen(false)}
            >
              <FaHome className="mr-2" />
              Home
            </Link>
            <span className={`absolute bottom-0 left-4 md:left-3 h-0.5 bg-yellow-300 transition-all duration-300 ${
              hoveredLink === 'home' || (hoveredLink === null && location.pathname === "/") ? 'w-[calc(100%-2rem)] md:w-full' : 'w-0'
            }`}></span>
          </div>

          {/* About */}
          <div className="relative md:inline-block w-full md:w-auto">
            <Link
              to="/about"
              className="flex items-center px-4 py-3 md:px-3 md:py-2 hover:text-yellow-300 transition-colors"
              onMouseEnter={() => setHoveredLink('about')}
              onMouseLeave={() => setHoveredLink(null)}
              onClick={() => setIsOpen(false)}
            >
              <FaInfoCircle className="mr-2" />
              About
            </Link>
            <span className={`absolute bottom-0 left-4 md:left-3 h-0.5 bg-yellow-300 transition-all duration-300 ${
              hoveredLink === 'about' || (hoveredLink === null && location.pathname === "/about") ? 'w-[calc(100%-2rem)] md:w-full' : 'w-0'
            }`}></span>
          </div>

          {/* Show Login/Register on home page OR if not authenticated and not on auth pages */}
          {(isHomePage || (!isAuthenticated && !isAuthPage)) && (
            <>
              {/* Login */}
              <div className="relative md:inline-block w-full md:w-auto">
                <Link
                  to="/login"
                  className="flex items-center px-4 py-3 md:px-3 md:py-2 hover:text-yellow-300 transition-colors"
                  onMouseEnter={() => setHoveredLink('login')}
                  onMouseLeave={() => setHoveredLink(null)}
                  onClick={() => setIsOpen(false)}
                >
                  <FaSignInAlt className="mr-2" />
                  Login
                </Link>
                <span className={`absolute bottom-0 left-4 md:left-3 h-0.5 bg-yellow-300 transition-all duration-300 ${
                  hoveredLink === 'login' || (hoveredLink === null && location.pathname === "/login") ? 'w-[calc(100%-2rem)] md:w-full' : 'w-0'
                }`}></span>
              </div>
              
              {/* Register */}
              <div className="relative md:inline-block w-full md:w-auto">
                <button
                  onClick={() => setIsRegisterOpen(!isRegisterOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 md:px-3 md:py-2 hover:text-yellow-300 transition-colors"
                  onMouseEnter={() => setHoveredLink('register')}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <div className="flex items-center">
                    <FaUserPlus className="mr-2" />
                    Register
                  </div>
                  {isRegisterOpen ? (
                    <svg className="ml-2 h-4 w-4 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="ml-2 h-4 w-4 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                <span className={`absolute bottom-0 left-4 md:left-3 h-0.5 bg-yellow-300 transition-all duration-300 ${
                  hoveredLink === 'register' ? 'w-[calc(100%-2rem)] md:w-full' : 'w-0'
                }`}></span>
                {isRegisterOpen && (
                  <div className={`${isOpen ? 'pl-8' : 'absolute mt-0 md:mt-2'} w-full md:w-48 bg-blue-700 md:bg-white text-white md:text-black rounded-md md:shadow-lg z-50 border-0 md:border border-gray-200`}>
                    <Link
                      to="/studentregister"
                      className="flex items-center px-4 py-3 md:py-2 hover:bg-blue-600 md:hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setIsRegisterOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      <FaUserGraduate className="mr-2 text-yellow-300 md:text-blue-600" />
                      Student
                    </Link>
                    <Link
                      to="/facultyregister"
                      className="flex items-center px-4 py-3 md:py-2 hover:bg-blue-600 md:hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setIsRegisterOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      <FaUserTie className="mr-2 text-yellow-300 md:text-green-600" />
                      Faculty
                    </Link>
                    <Link
                      to="/adminregister"
                      className="flex items-center px-4 py-3 md:py-2 hover:bg-blue-600 md:hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setIsRegisterOpen(false);
                        setIsOpen(false);
                      }}
                    >
                      <FaUserShield className="mr-2 text-yellow-300 md:text-purple-600" />
                      Admin
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* WAT TIMETABLE */}
          <div className="px-4 py-3 md:px-0 md:py-0">
            <a
              href={WAT_ABSTRACT}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-yellow-400 text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition duration-300 w-full md:w-auto"
              onClick={() => setIsOpen(false)}
            >
              <FaCalendarAlt className="mr-2" />
              WAT TIMETABLE
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;