import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentSignUp from './pages/SignUp/StudentSignUp';
import TeacherSignUp from './pages/SignUp/TeacherSignUp';
import StudentSignIn from './pages/SignIn/StudentSignIn';
import TeacherSignIn from './pages/SignIn/TeacherSignIn';
import Settings from './pages/Settings';
import Resources from './pages/Resources';
import Courses from './pages/Courses';
import Community from './pages/Community';
import TeacherDashboard from './components/TeacherDashboard';
import Messages from './pages/Messages';
import Connections from './pages/Connections';
import Meetings from './pages/Meetings';
import Analytics from './pages/Analytics';
import CourseDetails from './pages/CourseDetails';

const App = () => {
  return (
    <Router>
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
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher-dashboard/messages" element={<Messages />} />
        <Route path="/teacher-dashboard/connections" element={<Connections />} />
        <Route path="/teacher-dashboard/meetings" element={<Meetings />} />
        <Route path="/teacher-dashboard/settings" element={<Settings />} />
        <Route path="/teacher-dashboard/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
};

export default App;
