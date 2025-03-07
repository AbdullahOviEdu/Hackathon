import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import handsPhone1 from '../assets/Hands - Phone (1).png';
import handsPhone2 from '../assets/Hands - Phone (2).png';
import handsPhone3 from '../assets/Hands - Phone (3).png';
import handsPhone4 from '../assets/Hands - Phone.png';

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', icon: handsPhone1, label: 'Home' },
    { href: '/courses', icon: handsPhone2, label: 'Courses' },
    { href: '/community', icon: handsPhone3, label: 'Community' },
    { href: '/resources', icon: handsPhone4, label: 'Resources' }
  ];

  const signInOptions = [
    { label: 'Sign in as Student', href: '/signin/student' },
    { label: 'Sign in as Teacher', href: '/signin/teacher' }
  ];

  const signUpOptions = [
    { label: 'Sign up as Student', href: '/signup/student' },
    { label: 'Sign up as Teacher', href: '/signup/teacher' }
  ];

  // Set to false to show auth buttons
  const isAuthenticated = false;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-ninja-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center h-20">
          {/* Spacer for left side */}
          <div className="flex-1" />
          
          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <NavLink 
                key={link.label}
                {...link}
                isActive={location.pathname === link.href}
              />
            ))}
          </div>

          {/* Right side with auth buttons */}
          <div className="flex-1 flex justify-end gap-2">
            {isAuthenticated ? (
              <button className="hidden md:flex items-center gap-2 px-4 py-2 text-ninja-white/60 hover:text-ninja-white transition-colors">
                <span>🔔</span>
                <span className="w-2 h-2 bg-ninja-green rounded-full" />
              </button>
            ) : (
              <>
                <DropdownButton 
                  label="Sign In"
                  options={signInOptions}
                  className="hidden md:block px-6 py-2.5 text-ninja-white/80 font-monument text-sm hover:text-ninja-white transition-colors"
                />
                <DropdownButton 
                  label="Sign Up"
                  options={signUpOptions}
                  className="hidden md:block relative px-6 py-2.5 bg-ninja-green text-ninja-black font-monument text-sm rounded-lg overflow-hidden group"
                />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
          >
            <div className="relative w-6 flex flex-col gap-1.5">
              <span className={`w-full h-0.5 bg-ninja-white transform transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`} />
              <span className={`w-full h-0.5 bg-ninja-white transition-opacity duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`} />
              <span className={`w-full h-0.5 bg-ninja-white transform transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute left-0 right-0 top-full transform transition-all duration-300 ${
          isMenuOpen 
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-4 invisible'
        }`}>
          <div className="bg-ninja-black/95 backdrop-blur-md border-t border-b border-ninja-white/10 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-2 gap-8 mb-8">
                {navLinks.map((link, index) => (
                  <div 
                    key={link.label} 
                    className={`transition-all duration-300 transform ${
                      isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`} 
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <NavLink 
                      {...link}
                      isActive={location.pathname === link.href}
                    />
                  </div>
                ))}
              </div>
              {!isAuthenticated && (
                <div className="mt-6">
                  {/* Sign In Section */}
                  <div className={`mb-6 transition-all duration-300 transform ${
                    isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`} style={{ transitionDelay: `${navLinks.length * 50 + 50}ms` }}>
                    <div className="flex items-center mb-3 px-2">
                      <div className="w-1 h-4 bg-ninja-purple rounded-full mr-2"></div>
                      <div className="text-ninja-white font-monument text-sm">Sign In</div>
                    </div>
                    <div className="bg-ninja-black/30 rounded-lg overflow-hidden border border-ninja-white/5">
                      {signInOptions.map((option, index) => (
                        <Link
                          key={option.label}
                          to={option.href}
                          className="flex items-center px-4 py-3 text-sm text-ninja-white/80 hover:bg-ninja-white/5 transition-colors border-b border-ninja-white/5 last:border-b-0 hover:pl-5"
                          style={{ transitionDelay: `${navLinks.length * 50 + 100 + index * 50}ms` }}
                        >
                          <span className="w-2 h-2 bg-ninja-purple/50 rounded-full mr-2"></span>
                          {option.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sign Up Section */}
                  <div className={`transition-all duration-300 transform ${
                    isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`} style={{ transitionDelay: `${navLinks.length * 50 + 200}ms` }}>
                    <div className="flex items-center mb-3 px-2">
                      <div className="w-1 h-4 bg-ninja-green rounded-full mr-2"></div>
                      <div className="text-ninja-white font-monument text-sm">Sign Up</div>
                    </div>
                    <div className="bg-ninja-black/30 rounded-lg overflow-hidden border border-ninja-white/5">
                      {signUpOptions.map((option, index) => (
                        <Link
                          key={option.label}
                          to={option.href}
                          className="flex items-center px-4 py-3 text-sm text-ninja-white/80 hover:bg-ninja-white/5 transition-colors border-b border-ninja-white/5 last:border-b-0 hover:pl-5"
                          style={{ transitionDelay: `${navLinks.length * 50 + 250 + index * 50}ms` }}
                        >
                          <span className="w-2 h-2 bg-ninja-green/50 rounded-full mr-2"></span>
                          {option.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 