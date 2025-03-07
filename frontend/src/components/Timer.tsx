import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const getTimerColor = () => {
    if (timeLeft > 30) return 'text-green-500';
    if (timeLeft > 10) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center justify-center mb-4">
      <div className={`text-xl font-bold ${getTimerColor()}`}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5 ml-4">
        <div 
          className={`h-2.5 rounded-full ${getTimerColor().replace('text-', 'bg-')}`} 
          style={{ width: `${(timeLeft / duration) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer; 