import { useEffect, useState } from 'react';
import womenPower from '../assets/Women Power - Mobile.png';
import Navbar from '../components/Navbar';

const ROTATE_WORDS = ['CODE', 'CREATE', 'VIBE', 'SHINE'];

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATE_WORDS.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-ninja-black via-ninja-black/95 to-ninja-black text-ninja-white overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_65%)] from-ninja-green/5" />
      <Navbar />

      {/* Main Content */}
      <div className="relative">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-16 md:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative">
                <div className="absolute -left-4 -top-4 w-16 h-16 bg-ninja-green/10 rounded-full blur-xl" />
                <h1 className="font-monument text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight">
                  <span className="block">LEVEL UP</span>
                  <span className="relative inline-block h-[1.2em] w-full text-ninja-green" style={{ textShadow: '0 0 25px rgba(74, 222, 128, 0.25)' }}>
                    {ROTATE_WORDS.map((word, index) => (
                      <span
                        key={word}
                        className={`absolute left-0 top-0 transition-all duration-500 ${
                          index === wordIndex 
                            ? 'opacity-100 transform-none' 
                            : index < wordIndex 
                              ? 'opacity-0 translate-y-full'
                              : 'opacity-0 -translate-y-full'
                        }`}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                  <span className="relative block">
                    YOUR WAY
                    <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-ninja-purple/20 rounded-full blur-xl" />
                  </span>
                </h1>
                <h2 className="font-monument text-2xl md:text-3xl text-ninja-orange mt-5 leading-tight tracking-wide">
                  UNLOCK YOUR<br />
                  POTENTIAL
                </h2>
              </div>
              
              <div className="flex gap-4">
                <button className="px-7 py-3 bg-ninja-green text-ninja-black font-monument text-sm rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-ninja-green/20">
                  Start Your Journey
                </button>
                <button className="px-7 py-3 bg-transparent text-ninja-white font-monument text-sm rounded-lg border border-ninja-white/20 hover:border-ninja-green/50 hover:bg-ninja-green/5 transition-all duration-300">
                  Explore More
                </button>
              </div>
            </div>

            <div className={`relative transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-ninja-green/10 to-ninja-purple/10 rounded-[3rem] blur-3xl" />
              <img 
                src={womenPower} 
                alt="Women Power Illustration" 
                className="relative w-full h-auto max-w-[500px] mx-auto lg:ml-auto animate-float p-8"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ninja-green/5 to-transparent" />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '10K+', label: 'SQUAD SIZE' },
              { number: '200+', label: 'EPIC COURSES' },
              { number: '98%', label: 'WINNING RATE' },
              { number: '5.0', label: 'VIBE CHECK' }
            ].map((stat, index) => (
              <div
                key={index}
                className={`backdrop-blur-xl bg-white/5 rounded-xl p-6 text-center transition-all duration-500 hover:bg-white/10 ${
                  isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="font-monument text-3xl md:text-4xl text-ninja-green mb-2">{stat.number}</div>
                <div className="text-sm text-ninja-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mt-20 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: 'SKILL UP',
                description: 'Level up your skills with trending tech',
                features: ['Full-Stack Magic', 'Data Wizardry', 'Design Mastery']
              },
              { 
                title: 'PERKS',
                description: 'Experience learning that hits different',
                features: ['Live Sessions', 'Hands-on Labs', 'Pro Mentors']
              },
              { 
                title: 'TOOLKIT',
                description: 'Everything you need to slay',
                features: ['Study Guides', 'Practice Mode', 'Squad Support']
              }
            ].map((category, index) => (
              <div
                key={index}
                className={`group p-6 backdrop-blur-xl bg-white/5 rounded-xl transition-all duration-500 hover:bg-white/10 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <h3 className="font-monument text-xl mb-2 text-ninja-green group-hover:text-ninja-white transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-ninja-white/60 mb-4">{category.description}</p>
                <ul className="space-y-2.5">
                  {category.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-ninja-green" />
                      <span className="text-sm text-ninja-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 