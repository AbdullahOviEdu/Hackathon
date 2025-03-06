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
    { href: '#courses', icon: handsPhone2, label: 'Courses' },
    { href: '#community', icon: handsPhone3, label: 'Community' },
    { href: '#resources', icon: handsPhone4, label: 'Resources' }
  ];

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

          {/* Right side with sign in */}
          <div className="flex-1 flex justify-end">
            <Link 
              to="/signup"
              className="hidden md:block relative px-6 py-2.5 bg-ninja-green text-ninja-black font-monument text-sm rounded-lg overflow-hidden group"
            >
              <span className="relative z-10 transition-colors group-hover:text-ninja-white">Sign Up</span>
              <div className="absolute inset-0 bg-ninja-purple transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
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
          <div className="bg-ninja-black/95 backdrop-blur-md border-t border-b border-ninja-white/10">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-2 gap-8">
                {navLinks.map((link) => (
                  <NavLink 
                    key={link.label}
                    {...link}
                    isActive={location.pathname === link.href}
                  />
                ))}
              </div>
              <Link
                to="/signup" 
                className="mt-8 block w-full px-6 py-3 bg-gradient-to-r from-ninja-green to-ninja-purple text-ninja-black font-monument text-sm rounded-lg hover:from-ninja-purple hover:to-ninja-green transition-all duration-500 text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 