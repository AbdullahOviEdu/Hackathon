import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import teacherIllustration from '../../assets/Happy Bunch - Chat.png';
import { loginTeacher } from '../../services/authService';

const TeacherSignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Call the API to login the teacher
      await loginTeacher(formData.email, formData.password);
      
      // Show success toast
      toast.success('Login successful!');
      
      // Redirect to teacher dashboard
      setTimeout(() => {
        navigate('/teacher/dashboard');
      }, 1000); // Short delay to allow the toast to be seen
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ninja-black p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-6xl flex rounded-2xl overflow-hidden bg-ninja-black/50 backdrop-blur-xl border border-ninja-white/10">
        {/* Left Side - Illustration */}
        <div className="hidden md:block w-1/2 p-12 bg-gradient-to-br from-ninja-purple/10 to-ninja-green/10">
          <div className="flex items-center justify-center h-full">
            <img
              src={teacherIllustration}
              alt="Teacher"
              className="w-92 h-92 object-contain animate-float"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-monument text-ninja-white mb-2">Welcome Back, Teacher!</h1>
            <p className="text-ninja-white/60">Continue inspiring minds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ninja-white/80 mb-2">
                Teacher Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                placeholder="teacher.name@school.edu"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ninja-white/80 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 border-ninja-white/10 rounded focus:ring-ninja-purple text-ninja-purple"
                />
                <span className="ml-2 text-sm text-ninja-white/60">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-ninja-purple hover:text-ninja-green transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black font-monument rounded-lg hover:from-ninja-green hover:to-ninja-purple transition-all duration-500 disabled:opacity-70"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="text-center text-ninja-white/60">
              <span>Don't have an account? </span>
              <Link to="/signup/teacher" className="text-ninja-purple hover:text-ninja-green transition-colors">
                Sign up here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignIn; 