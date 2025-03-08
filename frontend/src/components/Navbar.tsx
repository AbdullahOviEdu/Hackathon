import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import handsPhone1 from '../assets/Hands - Phone (1).png';
import handsPhone2 from '../assets/Hands - Phone (2).png';
import handsPhone3 from '../assets/Hands - Phone (3).png';
import handsPhone4 from '../assets/Hands - Phone (4).png';
import { isAuthenticated, logout } from '../services/authService';
import { FaCoins } from 'react-icons/fa';
import axios from 'axios';

interface NavLinkProps {
  href: string;
  icon: string;
  label: string;
  isActive?: boolean;
}

interface DropdownButtonProps {
  label: string;
  className?: string;
  options: { label: string; href: string }[];
}

const DropdownButton = ({ label, className = '', options }: DropdownButtonProps) => {
  return (
    <div className="relative group">
      <button
        className={className}
      >
        {label}
      </button>
      <div className="absolute right-0 mt-2 w-48 bg-ninja-black/95 backdrop-blur-md border border-ninja-white/10 rounded-lg overflow-hidden shadow-xl z-50 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        {options.map((option) => (
          <Link
            key={option.label}
            to={option.href}
            className="block px-4 py-2 text-sm text-ninja-white/80 hover:bg-ninja-white/5 transition-colors"
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

const NavLink = ({ href, icon, label, isActive }: NavLinkProps) => {
  return (
    <div className="relative group">
      <Link 
        to={href} 
        className={`block transition-all duration-300 ${isActive ? 'scale-105' : 'hover:scale-105'}`}
      >
        <div className="relative">
          <img 
            src={icon} 
            alt={label}
            className={`w-10 h-10 object-contain transition-all duration-300 ${
              isActive 
                ? 'opacity-100' 
                : 'opacity-70 group-hover:opacity-100'
            }`}
          />
          {isActive && (
            <div className="absolute -inset-1.5 bg-ninja-green/10 rounded-full -z-10 animate-pulse" />
          )}
        </div>
        <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-ninja-green to-ninja-purple px-3 py-1 rounded-lg text-xs font-monument opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-ninja-black backdrop-blur-sm">
          {label}
        </span>
      </Link>
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check authentication status
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setUserAuthenticated(authenticated);
      setUserType(localStorage.getItem('user_type'));
    };
    
    checkAuth();
    
    const fetchCoins = async () => {
      try {
        const token = localStorage.getItem('student_token') || localStorage.getItem('teacher_token');
        if (!token) return;
        
        const response = await axios.get('http://localhost:5000/api/coins', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCoins(response.data.coins);
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };
    
    fetchCoins();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCoinClick = () => {
    if (userType === 'student') {
      navigate('/student-dashboard/coin-menu');
    }
  };

  const navLinks = [
    { href: '/', icon: handsPhone1, label: 'Home' },
    { href: '/courses', icon: handsPhone2, label: 'Courses' },
    { href: '/community', icon: handsPhone3, label: 'Community' },
    { href: '/resources', icon: handsPhone1, label: 'Resources' },
  ];

  // Add dashboard link based on user type
  if (userAuthenticated) {
    if (userType === 'teacher') {
      navLinks.push({ href: '/teacher/dashboard', icon: handsPhone4, label: 'Dashboard' });
    } else if (userType === 'student') {
      navLinks.push({ href: '/student-dashboard', icon: handsPhone4, label: 'Dashboard' });
    }
  }

  const signInOptions = [
    { label: 'Sign in as Student', href: '/signin/student' },
    { label: 'Sign in as Teacher', href: '/signin/teacher' }
  ];

  const signUpOptions = [
    { label: 'Sign up as Student', href: '/signup/student' },
    { label: 'Sign up as Teacher', href: '/signup/teacher' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-ninja-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={handsPhone1} alt="Logo" className="h-12 w-auto" />
            <span className="ml-2 text-2xl font-monument text-white">RizzGuide</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                isActive={location.pathname === link.href}
              />
            ))}

            {/* Show coins for authenticated users */}
            {userAuthenticated && (
              <button
                onClick={handleCoinClick}
                className="flex items-center bg-yellow-400/20 px-4 py-2 rounded-full hover:bg-yellow-400/30 transition-colors"
              >
                <FaCoins className="text-yellow-400 mr-2 text-xl" />
                <span className="text-white font-bold">{coins}</span>
              </button>
            )}

            {/* Authentication Buttons */}
            {!userAuthenticated ? (
              <div className="flex items-center space-x-4">
                <DropdownButton
                  label="Sign In"
                  options={signInOptions}
                  className="text-white hover:text-ninja-green"
                />
                <DropdownButton
                  label="Sign Up"
                  options={signUpOptions}
                  className="bg-ninja-green text-white px-4 py-2 rounded-lg hover:bg-ninja-green/80"
                />
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="text-white hover:text-ninja-green transition-colors"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-ninja-green"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-ninja-black/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.href
                    ? 'text-white bg-ninja-green/20'
                    : 'text-white/70 hover:text-white hover:bg-ninja-green/10'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Show coins for authenticated users */}
            {userAuthenticated && (
              <button
                onClick={handleCoinClick}
                className="w-full flex items-center justify-center bg-yellow-400/20 px-4 py-2 rounded-lg hover:bg-yellow-400/30 transition-colors"
              >
                <FaCoins className="text-yellow-400 mr-2 text-xl" />
                <span className="text-white font-bold">{coins}</span>
              </button>
            )}

            {/* Authentication Buttons */}
            {!userAuthenticated ? (
              <div className="space-y-2">
                {signInOptions.map((option) => (
                  <Link
                    key={option.href}
                    to={option.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-ninja-green"
                  >
                    {option.label}
                  </Link>
                ))}
                {signUpOptions.map((option) => (
                  <Link
                    key={option.href}
                    to={option.href}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-ninja-green text-white hover:bg-ninja-green/80"
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full px-3 py-2 rounded-md text-base font-medium text-white hover:text-ninja-green"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 