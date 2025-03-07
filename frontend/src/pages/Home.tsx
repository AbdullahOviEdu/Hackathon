import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCode, FiBook, FiAward, FiUsers, FiClock, FiStar } from 'react-icons/fi';
import womenPower from '../assets/Women Power - Mobile.png';
import Navbar from '../components/Navbar';
import ChatBot from '../components/ChatBot';

const ROTATE_WORDS = ['CODE', 'CREATE', 'LEARN', 'GROW'];
const TECH_STACK = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Node.js', color: '#68A063' },
  { name: 'Python', color: '#FFD43B' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'GraphQL', color: '#E535AB' }
];

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [techIndex, setTechIndex] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATE_WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTechIndex((prev) => (prev + 1) % TECH_STACK.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-ninja-black text-ninja-white overflow-hidden">
      <Navbar />

      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ninja-black via-ninja-black/95 to-ninja-black" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-ninja-purple/20 rounded-full filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-ninja-green/20 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-ninja-orange/20 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div 
          className="max-w-6xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div variants={itemVariants}>
              {/* Main Heading */}
              <h1 className="font-monument text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight mb-6">
                <motion.span 
                  className="block bg-gradient-to-r from-ninja-white via-ninja-green to-ninja-white bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  LEVEL UP
                </motion.span>
                <span className="text-ninja-green block h-[1.2em] overflow-hidden">
                  {ROTATE_WORDS.map((word, index) => (
                    <motion.span
                      key={word}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ 
                        y: index === wordIndex ? 0 : 40,
                        opacity: index === wordIndex ? 1 : 0
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="block absolute"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
                <motion.span 
                  className="block bg-gradient-to-r from-ninja-white via-ninja-purple to-ninja-white bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  YOUR WAY
                </motion.span>
              </h1>
              
              {/* Subheading */}
              <motion.h2 
                className="font-monument text-xl md:text-2xl text-ninja-orange mb-8"
                variants={itemVariants}
              >
                MASTER THE FUTURE OF TECH
              </motion.h2>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-wrap gap-4 mb-12"
                variants={itemVariants}
              >
                <Link 
                  to="/signup"
                  className="group relative px-6 py-3 bg-ninja-green text-ninja-black font-monument text-sm rounded-md overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Your Journey
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-ninja-green via-ninja-purple to-ninja-green bg-[length:200%] animate-gradient" />
                </Link>
                <Link 
                  to="/courses"
                  className="px-6 py-3 bg-ninja-black/50 text-ninja-white font-monument text-sm rounded-md border border-ninja-white/20 hover:border-ninja-green/50 hover:bg-ninja-green/5 transition-all duration-300"
                >
                  Explore Courses
                </Link>
              </motion.div>

              {/* Tech Stack */}
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                {TECH_STACK.map((tech, index) => (
                  <motion.span
                    key={tech.name}
                    className="text-sm font-monument px-3 py-1 rounded-full bg-ninja-black/50 border border-ninja-white/10"
                    style={{
                      color: tech.color,
                      borderColor: `${tech.color}20`
                    }}
                    whileHover={{
                      scale: 1.05,
                      borderColor: tech.color,
                      backgroundColor: `${tech.color}10`
                    }}
                  >
                    {tech.name}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                className="relative z-10"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <img 
                  src={womenPower} 
                  alt="Women Power Illustration" 
                  className="w-full h-auto max-w-[450px] mx-auto lg:ml-auto drop-shadow-2xl"
                />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-ninja-purple/20 via-ninja-green/20 to-ninja-orange/20 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-20 relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ninja-green/5 to-transparent" />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { number: '10K+', label: 'ACTIVE NINJAS', icon: <FiUsers className="w-6 h-6" /> },
              { number: '200+', label: 'EPIC COURSES', icon: <FiBook className="w-6 h-6" /> },
              { number: '98%', label: 'SUCCESS RATE', icon: <FiStar className="w-6 h-6" /> },
              { number: '24/7', label: 'SUPPORT', icon: <FiCode className="w-6 h-6" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="backdrop-blur-xl bg-white/5 rounded-xl p-6 text-center"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-ninja-green mb-3">
                  {stat.icon}
                </div>
                <div className="font-monument text-2xl sm:text-3xl text-ninja-green mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-ninja-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-20 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: 'LEARN',
                description: 'Master cutting-edge tech skills',
                features: ['Interactive Courses', 'Real Projects', 'Expert Guidance'],
                icon: '🚀',
                color: 'from-ninja-green'
              },
              { 
                title: 'BUILD',
                description: 'Create amazing projects',
                features: ['Hands-on Labs', 'Code Reviews', 'Portfolio Building'],
                icon: '⚡',
                color: 'from-ninja-purple'
              },
              { 
                title: 'GROW',
                description: 'Accelerate your tech career',
                features: ['Career Support', 'Industry Network', 'Job Placement'],
                icon: '🌟',
                color: 'from-ninja-orange'
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                className="group relative p-6 backdrop-blur-xl bg-white/5 rounded-xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-b ${category.color} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <div className="relative">
                  <div className="text-4xl mb-4">
                    {category.icon}
                  </div>
                  <h3 className="font-monument text-xl mb-2 text-ninja-green group-hover:text-ninja-white transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-ninja-white/60 mb-4">{category.description}</p>
                  <ul className="space-y-2.5">
                    {category.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex} 
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index * 0.2) + (featureIndex * 0.1) }}
                      >
                        <motion.div 
                          className="w-1.5 h-1.5 rounded-full bg-ninja-green"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.5, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: featureIndex * 0.2
                          }}
                        />
                        <span className="text-sm text-ninja-white/80">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 md:p-12 border border-white/10 overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-ninja-green/10 via-ninja-purple/10 to-ninja-orange/10"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="relative z-10">
              <motion.h2 
                className="font-monument text-3xl md:text-4xl text-center mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Ready to Begin Your <span className="text-ninja-green">Journey</span>?
              </motion.h2>
              <motion.p 
                className="text-ninja-white/60 text-center mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Join thousands of aspiring developers who have transformed their careers through our platform. Start your coding adventure today!
              </motion.p>
              <motion.div 
                className="flex justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link 
                  to="/signup"
                  className="group relative px-8 py-4 bg-ninja-green text-ninja-black font-monument text-sm rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started Now
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-ninja-green via-ninja-purple to-ninja-green"
                    animate={{
                      backgroundPosition: ["0%", "100%", "0%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Home; 