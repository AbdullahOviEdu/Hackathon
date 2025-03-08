import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { setupAuthHeader } from './services/authService';
import Home from './pages/Home';
import StudentSignUp from './pages/SignUp/StudentSignUp';
import TeacherSignUp from './pages/SignUp/TeacherSignUp';
import StudentSignIn from './pages/SignIn/StudentSignIn';
import TeacherSignIn from './pages/SignIn/TeacherSignIn';
import Settings from './pages/Settings';
import Resources from './pages/Resources';
import Courses from './pages/Courses';
import Community from './pages/Community';
import Meetings from './pages/Meetings';
import Analytics from './pages/Analytics';
import CourseDetails from './pages/CourseDetails';
import StudentDashboard from './dashboard/StudentDashboard/StudentDashboard';
import TeacherDashboardPage from './pages/dashboard/TeacherDashboardPage';
import TeacherLearningBot from './pages/dashboard/TeacherLearningBot';
import TeacherVoiceAssistant from './pages/dashboard/TeacherVoiceAssistant';
import StudentDashboardLayout from './layouts/StudentDashboardLayout';
import StudentCourses from './pages/StudentCourses';
import Trivia from './pages/Trivia';
import RealTimeProjects from './pages/RealTimeProjects';
import CoinMenu from './pages/CoinMenu';
import StudentLearningBot from './pages/student/StudentLearningBot';
import StudentVoiceAssistant from './pages/student/StudentVoiceAssistant';

const App = () => {
  useEffect(() => {
    setupAuthHeader();
  }, []);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup/student" element={<StudentSignUp />} />
        <Route path="/signup/teacher" element={<TeacherSignUp />} />
        <Route path="/signin/student" element={<StudentSignIn />} />
        <Route path="/signin/teacher" element={<TeacherSignIn />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/community" element={<Community />} />
        
        {/* Student Dashboard Routes */}
        <Route path="/student-dashboard" element={<StudentDashboardLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="trivia" element={<Trivia />} />
          <Route path="projects" element={<RealTimeProjects />} />
          <Route path="coin-shop" element={<CoinMenu />} />
          <Route path="learning-bot" element={<StudentLearningBot />} />
          <Route path="voice-assistant" element={<StudentVoiceAssistant />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
        <Route path="/teacher/learning-bot" element={<TeacherLearningBot />} />
        <Route path="/teacher/voice-assistant" element={<TeacherVoiceAssistant />} />
      </Routes>
    </Router>
  );
};

export default App;

