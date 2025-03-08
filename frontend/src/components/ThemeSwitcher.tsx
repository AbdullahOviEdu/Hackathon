import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`fixed bottom-6 right-6 p-4 rounded-xl z-50 backdrop-blur-xl shadow-lg border ${
        theme === 'dark' 
          ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' 
          : 'bg-ninja-black/10 text-ninja-black border-ninja-black/20 hover:bg-ninja-black/20'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      layout
      transition={{
        type: "spring",
        stiffness: 700,
        damping: 30
      }}
    >
      <motion.div
        className="relative w-6 h-6"
        style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: theme === 'dark' ? 1 : 0,
            scale: theme === 'dark' ? 1 : 0,
            rotate: theme === 'dark' ? 0 : -180,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            color: theme === 'dark' ? '#ffa500' : '#000000'
          }}
        >
          <FiMoon className="w-6 h-6" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            opacity: theme === 'light' ? 1 : 0,
            scale: theme === 'light' ? 1 : 0,
            rotate: theme === 'light' ? 0 : 180,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            color: theme === 'light' ? '#ffa500' : '#ffffff'
          }}
        >
          <FiSun className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeSwitcher; 