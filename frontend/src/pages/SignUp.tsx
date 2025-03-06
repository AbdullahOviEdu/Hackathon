import { useState, useCallback, useEffect } from 'react';
import miroodle1 from '../assets/Miroodles - Color Comp (1).png';
import miroodle2 from '../assets/Miroodles - Color Comp (2).png';
import miroodle3 from '../assets/Miroodles - Color Comp (3).png';
import miroodle4 from '../assets/Miroodles - Color Comp.png';
import Navbar from '../components/Navbar';

interface DraggableMiroodleProps {
  src: string;
  rotation: string;
  className?: string;
}

const SignUp = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const DraggableMiroodle = ({ src, rotation, className = '' }: DraggableMiroodleProps) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }, [position]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isDragging) return;
      
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
      }
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
      <div
        onMouseDown={handleMouseDown}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          userSelect: 'none'
        }}
        className={`absolute transition-all duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      >
        <img 
          src={src} 
          alt="" 
          className={`w-48 h-48 object-contain transform ${rotation} animate-float brightness-0 invert opacity-30 hover:opacity-40 transition-opacity`}
          onLoad={() => setIsLoaded(true)}
          draggable={false}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ninja-black via-ninja-black/95 to-ninja-black text-ninja-white overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_65%)] from-ninja-green/5" />
      <Navbar />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-16 md:pt-24">
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          {/* Miroodles Decorations */}
          <div className="absolute inset-0 overflow-visible">
            <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              {/* First Miroodle */}
              <DraggableMiroodle 
                src={miroodle1}
                rotation="rotate-[42deg]"
                className="top-[5%] left-[5%]"
              />
              
              {/* Second Miroodle */}
              <DraggableMiroodle 
                src={miroodle2}
                rotation="-rotate-[15deg]"
                className="top-[8%] right-[5%]"
              />
              
              {/* Third Miroodle */}
              <DraggableMiroodle 
                src={miroodle3}
                rotation="rotate-[95deg]"
                className="bottom-[5%] left-[5%]"
              />
              
              {/* Fourth Miroodle */}
              <DraggableMiroodle 
                src={miroodle4}
                rotation="-rotate-[68deg]"
                className="bottom-[8%] right-[5%]"
              />
            </div>
          </div>

          {/* Form Section - Centered */}
          <div className={`relative z-10 w-full max-w-md transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 shadow-xl">
              <h1 className="font-monument text-3xl md:text-4xl mb-6 text-ninja-green text-center">
                JOIN THE SQUAD
              </h1>
              
              <form className="space-y-6" onLoad={() => setIsLoaded(true)}>
                <div className="space-y-2">
                  <label className="block text-sm text-ninja-white/80">Username</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white placeholder-white/20"
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-ninja-white/80">Email</label>
                  <input 
                    type="email"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white placeholder-white/20"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-ninja-white/80">Password</label>
                  <input 
                    type="password"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white placeholder-white/20"
                    placeholder="Create a password"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-ninja-green text-ninja-black font-monument text-sm rounded-lg hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-ninja-green/20"
                >
                  Create Account
                </button>

                <div className="text-center text-sm text-ninja-white/60">
                  Already have an account?{' '}
                  <a href="/signin" className="text-ninja-green hover:text-ninja-white transition-colors">
                    Sign In
                  </a>
                </div>
              </form>
            </div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-ninja-green/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-ninja-purple/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;