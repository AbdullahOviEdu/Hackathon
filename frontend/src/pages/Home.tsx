import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useAnimation } from 'framer-motion';
import { FiArrowRight, FiCode, FiBook, FiAward, FiUsers, FiClock, FiStar, FiMousePointer } from 'react-icons/fi';
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

const COLORS = {
  primary: '#00ff00',    // ninja-green
  secondary: '#800080',  // ninja-purple
  accent: '#ffa500',     // ninja-orange
  background: '#0a0a0a', // ninja-black
  text: '#ffffff',       // white
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  card: 'rgba(255, 255, 255, 0.05)'
};

const GRADIENTS = {
  primary: 'rgba(0,255,0,0.1)',
  secondary: 'rgba(128,0,128,0.1)',
  accent: 'rgba(255,165,0,0.1)'
};

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [techIndex, setTechIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll();
  const controls = useAnimation();

  // Smooth scroll progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Mouse move effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    controls.start("visible");
  }, [controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATE_WORDS.length);
    }, 2000);
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

  // Parallax scroll effect
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  // Interactive hover effect for tech stack
  const techStackVariants = {
    hover: (custom: string) => ({
      scale: 1.1,
      boxShadow: `0 0 20px ${custom}40`,
      transition: { duration: 0.3 }
    })
  };

  return (
    <motion.div 
      className="min-h-screen overflow-hidden relative bg-ninja-black text-white"
    >
      <Navbar />

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-50"
        style={{ 
          scaleX, 
          transformOrigin: "0%",
          backgroundColor: COLORS.primary
        }}
      />

      {/* Animated Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: yBg, opacity: opacityBg }}
      >
        <motion.div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to br, ${COLORS.background}, rgba(10,10,10,0.95), ${COLORS.background})`
          }}
        />
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              `radial-gradient(circle at 0% 0%, ${GRADIENTS.primary} 0%, transparent 50%)`,
              `radial-gradient(circle at 100% 100%, ${GRADIENTS.secondary} 0%, transparent 50%)`,
              `radial-gradient(circle at 0% 100%, ${GRADIENTS.accent} 0%, transparent 50%)`,
              `radial-gradient(circle at 0% 0%, ${GRADIENTS.primary} 0%, transparent 50%)`
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

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
            <motion.div 
              variants={itemVariants}
              style={{
                x: mousePosition.x * -1,
                y: mousePosition.y * -1
              }}
            >
              {/* Main Heading with enhanced animation */}
              <motion.h1 
                className="font-monument text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight mb-6"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.span 
                  className="block bg-gradient-to-r from-ninja-white via-ninja-green to-ninja-white bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0%", "100%", "0%"],
                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                  }}
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
                      transition={{ 
                        duration: 0.5, 
                        ease: "easeOut",
                        opacity: { duration: 0.2 }
                      }}
                      className="block absolute"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
                <motion.span 
                  className="block bg-gradient-to-r from-ninja-white via-ninja-purple to-ninja-white bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0%", "100%", "0%"],
                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  YOUR WAY
                </motion.span>
              </motion.h1>

              {/* Tech Stack with enhanced interactivity */}
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                {TECH_STACK.map((tech, index) => (
                  <motion.span
                    key={tech.name}
                    className="text-sm font-monument px-3 py-1 rounded-full bg-ninja-black/50 border border-ninja-white/10 cursor-pointer"
                    style={{ color: tech.color }}
                    variants={techStackVariants}
                    custom={tech.color}
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      y: [0, -5, 0],
                      transition: {
                        duration: 2,
                        delay: index * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    {tech.name}
                  </motion.span>
                ))}
              </motion.div>

              {/* Interactive CTA Button */}
              <motion.div 
                className="flex flex-wrap gap-4 mt-8"
                variants={itemVariants}
              >
                <Link 
                  to="/signup"
                  className="group relative px-6 py-3 bg-ninja-green text-ninja-black font-monument text-sm rounded-md overflow-hidden transition-all duration-300"
                >
                  <motion.span 
                    className="relative z-10 flex items-center gap-2"
                    whileHover={{ x: 5 }}
                  >
                    Start Your Journey
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <FiArrowRight />
                    </motion.div>
                  </motion.span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-ninja-green via-ninja-purple to-ninja-green"
                    animate={{
                      backgroundPosition: ["0%", "100%", "0%"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column - Interactive Image */}
            <motion.div
              variants={itemVariants}
              className="relative"
              style={{
                x: mousePosition.x,
                y: mousePosition.y
              }}
            >
              <motion.div
                className="relative z-10"
                animate={{
                  y: [-10, 10],
                  rotate: [-2, 2]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
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
                  background: [
                    "radial-gradient(circle at center, rgba(128,0,128,0.2), transparent)",
                    "radial-gradient(circle at center, rgba(0,255,0,0.2), transparent)",
                    "radial-gradient(circle at center, rgba(255,165,0,0.2), transparent)"
                  ]
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

        {/* Enhanced Stats Section */}
        <motion.div 
          className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-20 relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(to bottom, transparent, rgba(0,255,0,0.05), transparent)",
                "linear-gradient(to bottom, transparent, rgba(128,0,128,0.05), transparent)",
                "linear-gradient(to bottom, transparent, rgba(255,165,0,0.05), transparent)"
              ]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { 
                number: '10K+', 
                label: 'ACTIVE NINJAS', 
                icon: <FiUsers className="w-6 h-6" />,
                color: COLORS.primary
              },
              { 
                number: '200+', 
                label: 'EPIC COURSES', 
                icon: <FiBook className="w-6 h-6" />,
                color: COLORS.secondary
              },
              { 
                number: '98%', 
                label: 'SUCCESS RATE', 
                icon: <FiStar className="w-6 h-6" />,
                color: COLORS.accent
              },
              { 
                number: '24/7', 
                label: 'SUPPORT', 
                icon: <FiCode className="w-6 h-6" />,
                color: COLORS.primary
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className={`backdrop-blur-xl rounded-xl p-6 text-center cursor-pointer ${
                  'bg-white/5'
                }`}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: "rgba(255,255,255,0.1)",
                  y: -5
                }}
              >
                <div style={{ color: stat.color }}>{stat.icon}</div>
                <motion.div 
                  className="font-monument text-2xl sm:text-3xl mb-2"
                  style={{ color: stat.color }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-white/60">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Features Section */}
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
                color: COLORS.primary,
                gradient: 'from-ninja-green'
              },
              { 
                title: 'BUILD',
                description: 'Create amazing projects',
                features: ['Hands-on Labs', 'Code Reviews', 'Portfolio Building'],
                icon: '⚡',
                color: COLORS.secondary,
                gradient: 'from-ninja-purple'
              },
              { 
                title: 'GROW',
                description: 'Accelerate your tech career',
                features: ['Career Support', 'Industry Network', 'Job Placement'],
                icon: '🌟',
                color: COLORS.accent,
                gradient: 'from-ninja-orange'
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                className={`group relative p-6 backdrop-blur-xl rounded-xl overflow-hidden cursor-pointer ${
                  'bg-white/5'
                }`}
              >
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-b ${category.gradient} to-transparent opacity-0 group-hover:opacity-10`}
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="text-4xl mb-4"
                    style={{ position: 'relative' }}
                  >
                    {category.icon}
                  </motion.div>
                  <motion.h3 
                    className="font-monument text-xl mb-2 text-ninja-green group-hover:text-ninja-white transition-colors"
                    style={{ color: category.color }}
                  >
                    {category.title}
                  </motion.h3>
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
                        whileHover={{
                          x: 5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm text-ninja-white/80">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced CTA Section */}
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
              className="absolute inset-0"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(0,255,0,0.1), rgba(128,0,128,0.1))",
                  "linear-gradient(45deg, rgba(128,0,128,0.1), rgba(255,165,0,0.1))",
                  "linear-gradient(45deg, rgba(255,165,0,0.1), rgba(0,255,0,0.1))"
                ]
              }}
              transition={{
                duration: 6,
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
                Ready to Begin Your{" "}
                <motion.span 
                  className="text-ninja-green"
                  animate={{
                    color: ["#00ff00", "#800080", "#ffa500", "#00ff00"]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Journey
                </motion.span>
                ?
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
                  className="group relative px-8 py-4 bg-ninja-green text-ninja-black font-monument text-sm rounded-lg overflow-hidden transition-all duration-300"
                >
                  <motion.span 
                    className="relative z-10 flex items-center gap-2"
                    whileHover={{ x: 5 }}
                  >
                    Get Started Now
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <FiArrowRight />
                    </motion.div>
                  </motion.span>
                  <motion.div 
                    className="absolute inset-0"
                    animate={{
                      background: [
                        `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.secondary})`,
                        `linear-gradient(45deg, ${COLORS.secondary}, ${COLORS.accent})`,
                        `linear-gradient(45deg, ${COLORS.accent}, ${COLORS.primary})`
                      ]
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
      <motion.div
        className="fixed bottom-4 right-4 z-[60]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <ChatBot />
      </motion.div>

      {/* Mouse Follower */}
      <motion.div
        className="fixed w-4 h-4 rounded-full pointer-events-none z-50 hidden md:block"
        style={{
          backgroundColor: 'rgba(0, 255, 0, 0.3)',
          x: mousePosition.x * 50,
          y: mousePosition.y * 50,
          scale: useSpring(1, {
            stiffness: 500,
            damping: 30
          }),
          opacity: useSpring(0.3, {
            stiffness: 500,
            damping: 30
          })
        }}
      />
    </motion.div>
  );
};

export default Home; 