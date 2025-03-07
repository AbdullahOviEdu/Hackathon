import React, { useEffect, useState } from 'react';

// Try to import framer-motion, but provide a fallback if it's not available
let motion: any = null;
let AnimatePresence: any = null;

try {
  const framerMotion = require('framer-motion');
  motion = framerMotion.motion;
  AnimatePresence = framerMotion.AnimatePresence;
} catch (error) {
  console.warn('framer-motion not available, using fallback animation');
}

interface CoinAnimationProps {
  show: boolean;
  onComplete: () => void;
  position?: { x: number; y: number };
}

const CoinAnimation: React.FC<CoinAnimationProps> = ({ show, onComplete, position = { x: 0, y: 0 } }) => {
  const [isVisible, setIsVisible] = useState(show);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    setIsVisible(show);
    if (show) {
      // If framer-motion is not available, use a simple animation with setInterval
      if (!motion) {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 0.1;
          setAnimationProgress(progress);
          if (progress >= 1) {
            clearInterval(interval);
            setIsVisible(false);
            onComplete();
          }
        }, 100);
        return () => clearInterval(interval);
      } else {
        // If framer-motion is available, use a timeout
        const timer = setTimeout(() => {
          setIsVisible(false);
          onComplete();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [show, onComplete]);

  // If framer-motion is not available, use a simple CSS animation
  if (!motion || !AnimatePresence) {
    if (!isVisible) return null;
    
    const animationStyle = {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 50,
      left: position.x,
      top: position.y - (100 * animationProgress),
      opacity: 1 - animationProgress,
      transform: `scale(${0.5 + (0.5 * animationProgress)})`,
      transition: 'all 0.1s ease-out'
    };
    
    return (
      <div style={animationStyle as React.CSSProperties}>
        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-500">
          <span className="text-yellow-800 font-bold">+1</span>
        </div>
      </div>
    );
  }

  // If framer-motion is available, use it for better animations
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0,
            scale: 0,
            x: position.x,
            y: position.y
          }}
          animate={{ 
            opacity: 1,
            scale: 1,
            y: position.y - 100,
          }}
          exit={{ 
            opacity: 0,
            y: position.y - 150
          }}
          transition={{ 
            duration: 1,
            ease: "easeOut"
          }}
          className="fixed pointer-events-none z-50"
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-500">
            <span className="text-yellow-800 font-bold">+1</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CoinAnimation; 