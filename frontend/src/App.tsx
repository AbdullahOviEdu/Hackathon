import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import StudentSignUp from './pages/SignUp/StudentSignUp';
import TeacherSignUp from './pages/SignUp/TeacherSignUp';
import StudentSignIn from './pages/SignIn/StudentSignIn';
import TeacherSignIn from './pages/SignIn/TeacherSignIn';
import Settings from './pages/Settings';
import Resources from './pages/Resources';
import Courses from './pages/Courses';
import Community from './pages/Community';
import Connections from './pages/Connections';
import Meetings from './pages/Meetings';
import Analytics from './pages/Analytics';
import CourseDetails from './pages/CourseDetails';
import StudentDashboard from './dashboard/StudentDashboard/StudentDashboard';
import TeacherDashboardPage from './pages/dashboard/TeacherDashboardPage';
<<<<<<< Updated upstream
import TeacherConnections from './pages/dashboard/TeacherConnections';
import StudentDashboardLayout from './layouts/StudentDashboardLayout';
import StudentCourses from './pages/StudentCourses';
=======
import TeacherLearningBot from './pages/dashboard/TeacherLearningBot';
import TeacherVoiceAssistant from './pages/dashboard/TeacherVoiceAssistant';
>>>>>>> Stashed changes

const App = () => {
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
<<<<<<< Updated upstream
        
        {/* Student Dashboard Routes */}
        <Route path="/student-dashboard" element={<StudentDashboardLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="connections" element={<Connections />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Teacher Dashboard Route */}
        <Route path="/teacher/dashboard/*" element={<TeacherDashboardPage />} />
=======
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-dashboard/messages" element={<Messages />} />
        <Route path="/student-dashboard/connections" element={<Connections />} />
        <Route path="/student-dashboard/meetings" element={<Meetings />} />
        <Route path="/student-dashboard/settings" element={<Settings />} />
        <Route path="/student-dashboard/analytics" element={<Analytics />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
        <Route path="/teacher/learning-bot" element={<TeacherLearningBot />} />
        <Route path="/teacher/voice-assistant" element={<TeacherVoiceAssistant />} />
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
};

export default App;
