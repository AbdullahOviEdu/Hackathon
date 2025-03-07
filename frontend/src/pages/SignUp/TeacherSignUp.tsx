import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import teacherIllustration from '../../assets/Happy Bunch - Chat.png';
import { registerTeacher } from '../../services/authService';

const TeacherSignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    subject: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Validate terms agreement
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call the API to register the teacher
      await registerTeacher({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        institution: formData.institution,
        subject: formData.subject
      });
      
      // Show success toast
      toast.success('Account created successfully!');
      
      // Redirect to teacher dashboard
      setTimeout(() => {
        navigate('/teacher/dashboard');
      }, 1500); // Short delay to allow the toast to be seen
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
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
    <div className="h-screen flex items-center justify-center bg-ninja-black p-4 overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden bg-ninja-black/50 backdrop-blur-xl border border-ninja-white/10">
        {/* Left Side - Illustration */}
        <div className="hidden md:block w-2/5 p-6 bg-gradient-to-br from-ninja-purple/10 to-ninja-green/10">
          <div className="flex items-center justify-center h-full">
            <img
              src={teacherIllustration}
              alt="Teacher"
              className="w-64 h-64 object-contain animate-float"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-6 overflow-hidden">
          <div className="mb-4">
            <h1 className="text-2xl font-monument text-ninja-white mb-1">Join as a Teacher</h1>
            <p className="text-sm text-ninja-white/60">Start inspiring minds today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-ninja-white/80 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-ninja-white/80 mb-1">
                Teacher Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                placeholder="teacher.name@school.edu"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="institution" className="block text-xs font-medium text-ninja-white/80 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                  placeholder="Your institution"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-ninja-white/80 mb-1">
                  Subject Area
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                  placeholder="Subject area"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-ninja-white/80 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-ninja-white/80 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-3 h-3 border-ninja-white/10 rounded focus:ring-ninja-purple text-ninja-purple"
                  required
                />
                <span className="ml-2 text-xs text-ninja-white/60">
                  I agree to the{' '}
                  <Link to="/terms" className="text-ninja-purple hover:text-ninja-green transition-colors">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-ninja-purple hover:text-ninja-green transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black font-monument text-sm rounded-lg hover:from-ninja-green hover:to-ninja-purple transition-all duration-500 disabled:opacity-70"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center text-xs text-ninja-white/60">
              <span>Already have an account? </span>
              <Link to="/signin/teacher" className="text-ninja-purple hover:text-ninja-green transition-colors">
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignUp; 