import { useState } from 'react';
import { Link } from 'react-router-dom';
import teacherIllustration from '../../assets/Happy Bunch - Chat.png';

const TeacherSignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    subject: '',
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Teacher signup:', formData);
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
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="mb-8">
            <h1 className="text-3xl font-monument text-ninja-white mb-2">Join as a Teacher</h1>
            <p className="text-ninja-white/60">Start inspiring minds today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pb-16">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-ninja-white/80 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                placeholder="Your full name"
                required
              />
            </div>

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
              <label htmlFor="institution" className="block text-sm font-medium text-ninja-white/80 mb-2">
                Institution
              </label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                placeholder="Your school or institution"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-ninja-white/80 mb-2">
                Subject Area
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                placeholder="Your main subject area"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-ninja-white/80 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-4 h-4 border-ninja-white/10 rounded focus:ring-ninja-purple text-ninja-purple"
                  required
                />
                <span className="ml-2 text-sm text-ninja-white/60">
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
              className="w-full py-3 px-4 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black font-monument rounded-lg hover:from-ninja-green hover:to-ninja-purple transition-all duration-500"
            >
              Create Account
            </button>

            <div className="text-center text-ninja-white/60">
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