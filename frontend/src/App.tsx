import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Settings from './pages/Settings';
import Resources from './pages/Resources';
import Courses from './pages/Courses';
import Community from './pages/Community';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </Router>
  );
};

export default App;
