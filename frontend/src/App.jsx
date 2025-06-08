import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from './pages/Home/Home.jsx';
import About from './pages/About/About.jsx';
import Login from './pages/Login/Login.jsx';

import FacultyRegister from './pages/Faculty/FacultyRegister.jsx';
import StudentRegister from './pages/Student/StudentRegister.jsx';
import AdminRegister from './pages/Admin/AdminRegister.jsx';



// Admin
import Admin from './pages/Admin/Admin.jsx';
import AdminProfile from './pages/Admin/AdminProfile.jsx';
import UpdateProfile from './pages/Admin/UpdateProfile.jsx';
import Subjects from './pages/Admin/Subjects.jsx';
//import StudentDetails from './pages/Admin/StudentDetails.jsx';
import FacultyDetails from './pages/Admin/FacultyDetails.jsx';
import ViewSubjects from './pages/Admin/ViewSubjects.jsx';
import UpdateSub from './pages/Admin/UpdateSub.jsx';
import StudentManagement from './pages/Admin/StudentManagement.jsx';
import YearStudents from './pages/Admin/YearStudents.jsx';
import SectionStudents from './pages/Admin/SectionStudents.jsx';


// Student
import Student from './pages/Student/Student.jsx';
import StudentProfile from "./pages/Student/StudentProfile.jsx";
import StudentProfileUpdate from "./pages/Student/StudentUpdate.jsx";
import WATAttemptPage from './pages/Student/WatAttemptPage.jsx';
import ViewMarks from "./pages/Student/ViewMarks.jsx";
import ViewWats from "./pages/Student/ViewWats.jsx";



// Faculty
import Faculty from './pages/Faculty/Faculty.jsx';
import FacultyProfile from './pages/Faculty/FacultyProfile.jsx';
import FacultyUpdateProfile from './pages/Faculty/FacultyUpdateProfile.jsx';

import StudentsDetails from './pages/Faculty/StudentsDetails.jsx';
import StudentYearDetails from './pages/Faculty/StudentYearDetails.jsx';
import CreateWATPage from './pages/Faculty/CreateWatPage.jsx';
import FacultyViewYears from "./pages/Faculty/FacultyViewYears.jsx";
import FacultyWATsByYear from "./pages/Faculty/FacultyWatsByYear.jsx";
import SectionDetails from "./pages/Faculty/SectionDetails.jsx";
import StudentsList from "./pages/Faculty/StudentsList.jsx";
import GenerateMcqs  from './pages/Faculty/GenerateMcqs.jsx';
import FacultyWatResults from './pages/Faculty/FacultyWatResults.jsx';

const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/studentregister" || location.pathname === "/facultyregister" || location.pathname === "/adminregister";

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route path="/login" element={<Login />} />
          <Route path="/studentregister" element={<StudentRegister />} />
          <Route path="/facultyregister" element={<FacultyRegister />} />
          <Route path="/adminregister" element={<AdminRegister />} />

          {/* Student Routes */}
          <Route path="/student-dashboard" element={<Student />} />
          <Route path="/student/profile" element={<StudentProfile/>}/>
          <Route path="/student/update-profile" element={<StudentProfileUpdate />}/>
          <Route path="/student/wats" element={<ViewWats/>}/>
          <Route path="/student/wat-marks" element={<ViewMarks/>}/>
          <Route path="/wats/:id" element={<WATAttemptPage />} />
      
          

          {/* Faculty Routes */}
          <Route path="/faculty-dashboard" element={<Faculty />} />
          <Route path="/faculty/profile" element={<FacultyProfile />} />
          <Route path="/faculty/update-profile" element={<FacultyUpdateProfile />} />
          <Route path="faculty/create-wat" element={<CreateWATPage />} />
          <Route path="/faculty/students-details" element={<StudentsDetails  />} />
          <Route path="/faculty/students/year/:year" element={<StudentYearDetails />} />
          <Route path="/faculty/view-wats" element={<FacultyViewYears />} />
          <Route path="/faculty/view-wats/:year" element={<FacultyWATsByYear />} />
          <Route path="/faculty/student-details/:year" element={<SectionDetails />} />
          <Route path="/faculty/student-details/:year/:section" element={<StudentsList />} />
          <Route path="/faculty/students/year/:year" element={<StudentYearDetails />} />
          <Route path="/faculty/mcqs" element={<GenerateMcqs/>} />
          <Route path="/faculty/wat-results/:watId" element={<FacultyWatResults />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<Admin />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/update-profile" element={<UpdateProfile />} />
          <Route path="/admin/subjects" element={<Subjects />} />
          <Route path="/admin/students" element={<StudentManagement />} />
          <Route path="/admin/students/:year" element={<YearStudents />} />
          <Route path="/admin/students/:year/:section" element={<SectionStudents />} />
          <Route path="/admin/faculty" element={<FacultyDetails />} />
          <Route path="/admin/view-subjects" element={<ViewSubjects />} />
          <Route path="/admin/update-subjects" element={<UpdateSub />} />

     
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default App;