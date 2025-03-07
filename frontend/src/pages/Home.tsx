import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import womenPower from '../assets/Women Power - Mobile.png';
import Navbar from '../components/Navbar';
import ChatBot from '../components/ChatBot';
// Import icons
import { FaUserNinja, FaBookOpen, FaChartLine, FaHeadset } from 'react-icons/fa';
import { IoRocketSharp, IoFlashSharp, IoStar } from 'react-icons/io5';

const ROTATE_WORDS = ['CODE', 'CREATE', 'LEARN', 'GROW'];
const TECH_STACK = ['React', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'GraphQL'];

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [, setTechIndex] = useState(0);

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

  return (
    <div className="min-h-screen bg-ninja-black text-ninja-white overflow-hidden">
      <Navbar />

      {/* Main Content */}
      <div className="relative">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Main Heading */}
              <h1 className="font-monument text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight mb-6">
                <span className="block">LEVEL UP</span>
                <span className="text-ninja-green block h-[1.2em] overflow-hidden">
                  {ROTATE_WORDS.map((word, index) => (
                    <span
                      key={word}
                      className={`block transition-all duration-300 ${
                        index === wordIndex 
                          ? 'opacity-100 transform-none' 
                          : 'opacity-0 absolute'
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </span>
                <span className="block">YOUR WAY</span>
              </h1>
              
              {/* Subheading */}
              <h2 className="font-monument text-xl md:text-2xl text-ninja-orange mb-8">
                MASTER THE FUTURE OF TECH
              </h2>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link 
                  to="/signup"
                  className="px-6 py-3 bg-ninja-green text-ninja-black font-monument text-sm rounded-md hover:bg-ninja-green/90 transition-colors"
                >
                  Start Your Journey
                </Link>
                <Link 
                  to="/course/1"
                  className="px-6 py-3 bg-transparent text-ninja-white font-monument text-sm rounded-md border border-ninja-white/20 hover:border-ninja-white/40 transition-colors"
                >
                  Explore Courses
                </Link>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-4 text-ninja-white/60">
                {TECH_STACK.slice(0, 6).map((tech, index) => (
                  <span 
                    key={index} 
                    className="text-sm font-monument"
                  >
                    {tech}
                    {index < 5 && <span className="ml-4 text-ninja-white/20">•</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column - Image */}
            <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                <img 
                  src={womenPower} 
                  alt="Women Power Illustration" 
                  className="w-full h-auto max-w-[450px] mx-auto lg:ml-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-16 md:mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { number: '10K+', label: 'ACTIVE NINJAS', icon: <FaUserNinja /> },
              { number: '200+', label: 'COURSES', icon: <FaBookOpen /> },
              { number: '98%', label: 'SUCCESS RATE', icon: <FaChartLine /> },
              { number: '24/7', label: 'SUPPORT', icon: <FaHeadset /> }
            ].map((stat, index) => (
              <div
                key={index}
                className={`bg-ninja-black border border-white/5 rounded-md p-5 text-center transition-opacity duration-300 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-ninja-green mb-3 flex justify-center">
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <div className="font-monument text-2xl md:text-3xl text-white mb-1">{stat.number}</div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-16 md:mt-24 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { 
                title: 'LEARN',
                description: 'Master cutting-edge tech skills',
                features: ['Interactive Courses', 'Real Projects', 'Expert Guidance'],
                icon: <IoRocketSharp />,
                color: 'text-ninja-green'
              },
              { 
                title: 'BUILD',
                description: 'Create amazing projects',
                features: ['Hands-on Labs', 'Code Reviews', 'Portfolio Building'],
                icon: <IoFlashSharp />,
                color: 'text-ninja-purple'
              },
              { 
                title: 'GROW',
                description: 'Accelerate your tech career',
                features: ['Career Support', 'Industry Network', 'Job Placement'],
                icon: <IoStar />,
                color: 'text-ninja-orange'
              }
            ].map((category, index) => (
              <div
                key={index}
                className={`bg-ninja-black border border-white/5 rounded-md p-6 transition-opacity duration-300 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`${category.color} mb-4 text-xl`}>{category.icon}</div>
                <h3 className="font-monument text-lg mb-2 text-white">
                  {category.title}
                </h3>
                <p className="text-sm text-white/60 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-ninja-green" />
                      <span className="text-xs text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="bg-ninja-black border border-white/5 rounded-md p-8 text-center">
            <h2 className="font-monument text-2xl md:text-3xl mb-4">
              Ready to Begin Your <span className="text-ninja-green">Journey</span>?
            </h2>
            <p className="text-sm text-white/60 mb-6 max-w-lg mx-auto">
              Join thousands of aspiring developers who have transformed their careers through our platform.
            </p>
            <Link 
              to="/signup"
              className="inline-block px-6 py-3 bg-ninja-green text-ninja-black font-monument text-sm rounded-md hover:bg-ninja-green/90 transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Home; 