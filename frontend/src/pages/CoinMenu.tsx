import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaJs, FaReact, FaShoppingCart, FaChartBar, FaGraduationCap, FaCrown, FaGem, FaCoins, FaLock, FaUnlock, FaList, FaRobot, FaPalette, FaHeartbeat } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface PurchaseItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'course' | 'project';
  icon: React.ElementType;
  color: string;
  features: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const purchaseItems: PurchaseItem[] = [
  {
    id: 'course-1',
    name: 'Advanced JavaScript Mastery',
    description: 'Master modern JavaScript concepts and best practices. Learn ES6+, async programming, and more.',
    cost: 50,
    type: 'course',
    icon: FaJs,
    color: 'from-yellow-400 to-yellow-600',
    features: ['ES6+ Features', 'Async Programming', 'Design Patterns', 'Performance Optimization'],
    level: 'Advanced'
  },
  {
    id: 'course-2',
    name: 'React Development',
    description: 'Build modern web applications with React. Master hooks, context, and state management.',
    cost: 75,
    type: 'course',
    icon: FaReact,
    color: 'from-cyan-400 to-blue-500',
    features: ['React Hooks', 'State Management', 'Component Patterns', 'Performance Tips'],
    level: 'Intermediate'
  },
  {
    id: 'course-3',
    name: 'Python for Beginners',
    description: 'Start your programming journey with Python. Learn fundamentals and build your first applications.',
    cost: 30,
    type: 'course',
    icon: FaGraduationCap,
    color: 'from-blue-400 to-blue-600',
    features: ['Basic Syntax', 'Data Structures', 'File Handling', 'Error Handling'],
    level: 'Beginner'
  },
  {
    id: 'course-4',
    name: 'Data Science Essentials',
    description: 'Learn the fundamentals of data science using Python, pandas, and numpy.',
    cost: 100,
    type: 'course',
    icon: FaChartBar,
    color: 'from-purple-400 to-purple-600',
    features: ['Data Analysis', 'Visualization', 'Machine Learning Basics', 'Statistical Methods'],
    level: 'Intermediate'
  },
  {
    id: 'course-5',
    name: 'Mobile App Development',
    description: 'Create cross-platform mobile apps using React Native and modern tools.',
    cost: 85,
    type: 'course',
    icon: FaReact,
    color: 'from-indigo-400 to-indigo-600',
    features: ['React Native', 'Mobile UI/UX', 'App Store Deployment', 'Native Modules'],
    level: 'Advanced'
  },
  {
    id: 'course-6',
    name: 'Web Security Fundamentals',
    description: 'Learn essential web security concepts and best practices for secure applications.',
    cost: 65,
    type: 'course',
    icon: FaLock,
    color: 'from-red-400 to-red-600',
    features: ['Authentication', 'Authorization', 'OWASP Top 10', 'Security Testing'],
    level: 'Intermediate'
  },
  {
    id: 'project-1',
    name: 'E-commerce Platform',
    description: 'Complete e-commerce project with shopping cart, payment integration, and admin dashboard.',
    cost: 100,
    type: 'project',
    icon: FaShoppingCart,
    color: 'from-green-400 to-emerald-600',
    features: ['Shopping Cart', 'Payment Gateway', 'Admin Dashboard', 'Order Management'],
    level: 'Advanced'
  },
  {
    id: 'project-2',
    name: 'Social Media Dashboard',
    description: 'Analytics dashboard with real-time data visualization, user metrics, and engagement tracking.',
    cost: 125,
    type: 'project',
    icon: FaChartBar,
    color: 'from-purple-400 to-purple-600',
    features: ['Real-time Analytics', 'User Metrics', 'Data Visualization', 'Performance Tracking'],
    level: 'Intermediate'
  },
  {
    id: 'project-3',
    name: 'Task Management App',
    description: 'Build a collaborative task management application with real-time updates.',
    cost: 80,
    type: 'project',
    icon: FaList,
    color: 'from-blue-400 to-blue-600',
    features: ['Real-time Updates', 'Team Collaboration', 'Task Analytics', 'File Sharing'],
    level: 'Intermediate'
  },
  {
    id: 'project-4',
    name: 'AI Chat Application',
    description: 'Create an AI-powered chat application with natural language processing.',
    cost: 150,
    type: 'project',
    icon: FaRobot,
    color: 'from-teal-400 to-teal-600',
    features: ['NLP Integration', 'Real-time Chat', 'Voice Commands', 'Chatbot Training'],
    level: 'Advanced'
  },
  {
    id: 'project-5',
    name: 'Portfolio Website',
    description: 'Design and develop a modern portfolio website with animations and CMS.',
    cost: 45,
    type: 'project',
    icon: FaPalette,
    color: 'from-pink-400 to-pink-600',
    features: ['Responsive Design', 'Animations', 'CMS Integration', 'SEO Optimization'],
    level: 'Beginner'
  },
  {
    id: 'project-6',
    name: 'Fitness Tracking App',
    description: 'Build a comprehensive fitness tracking application with progress visualization.',
    cost: 90,
    type: 'project',
    icon: FaHeartbeat,
    color: 'from-red-400 to-red-600',
    features: ['Workout Tracking', 'Progress Charts', 'Nutrition Log', 'Social Features'],
    level: 'Intermediate'
  }
];

const CoinMenu: React.FC = () => {
  const [coins, setCoins] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'course' | 'project'>('all');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    fetchCoinBalance();
    const savedPurchases = localStorage.getItem('purchasedItems');
    if (savedPurchases) {
      setPurchasedItems(JSON.parse(savedPurchases));
    }
  }, []);

  const fetchCoinBalance = async () => {
    try {
      const token = localStorage.getItem('student_token');
      if (!token) {
        toast.error('Please sign in to view your coins');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/coins', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCoins(response.data.coins);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching coins:', error);
      toast.error('Failed to fetch coin balance');
      setLoading(false);
    }
  };

  const handlePurchase = async (item: PurchaseItem) => {
    if (purchasedItems.includes(item.id)) {
      toast.error('You already own this item!');
      return;
    }

    if (coins < item.cost) {
      toast.error('Not enough coins!');
      return;
    }

    try {
      const token = localStorage.getItem('student_token');
      if (!token) {
        toast.error('Please sign in to make purchases');
        return;
      }

      const deductResponse = await axios.post(
        'http://localhost:5000/api/coins/deduct',
        { amount: item.cost },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!deductResponse.data.success) {
        throw new Error('Failed to deduct coins');
      }

      setCoins(deductResponse.data.newBalance);
      
      const newPurchasedItems = [...purchasedItems, item.id];
      setPurchasedItems(newPurchasedItems);
      localStorage.setItem('purchasedItems', JSON.stringify(newPurchasedItems));
      
      toast.success(`Successfully purchased ${item.name}!`);
    } catch (error) {
      console.error('Error processing purchase:', error);
      toast.error('Failed to process purchase');
      fetchCoinBalance();
    }
  };

  const filteredItems = purchaseItems.filter(
    item => selectedType === 'all' || item.type === selectedType
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ninja-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-ninja-green border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-ninja-black">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-ninja-purple/20 to-ninja-green/20 blur-3xl"></div>
          <div className="relative">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <h1 className="text-5xl font-monument text-white mb-4">Coin Shop</h1>
                <p className="text-xl text-white/60">Level up your skills with premium content</p>
              </div>
              <motion.div 
                className="flex items-center gap-6 bg-white/5 backdrop-blur-xl px-8 py-6 rounded-2xl border border-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FaCoins className="text-yellow-400 text-4xl" />
                <div>
                  <p className="text-white/60">Your Balance</p>
                  <p className="text-3xl font-bold text-white">{coins} <span className="text-yellow-400">coins</span></p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white/5 backdrop-blur-xl rounded-xl p-1.5">
            {['all', 'course', 'project'].map((type) => (
              <motion.button
                key={type}
                onClick={() => setSelectedType(type as typeof selectedType)}
                className={`px-8 py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
                  selectedType === type
                    ? 'bg-gradient-to-r from-ninja-purple to-ninja-green text-white'
                    : 'text-white/60 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {type === 'all' && <FaCrown className="inline-block mr-2" />}
                {type === 'course' && <FaGraduationCap className="inline-block mr-2" />}
                {type === 'project' && <FaGem className="inline-block mr-2" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </motion.button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isOwned = purchasedItems.includes(item.id);
              const canAfford = coins >= item.cost;
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -10 }}
                  onHoverStart={() => setHoveredItem(item.id)}
                  onHoverEnd={() => setHoveredItem(null)}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-ninja-green/50 transition-all duration-500"
                >
                  <div className={`aspect-video bg-gradient-to-br ${item.color} p-8 flex flex-col items-center justify-center relative`}>
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full">
                      <FaCoins className="text-yellow-400" />
                      <span className="text-white font-bold">{item.cost}</span>
                    </div>
                    <Icon className="text-white text-6xl mb-4" />
                    <span className="text-white font-medium px-4 py-1 rounded-full bg-black/30 backdrop-blur-md">
                      {item.level}
                    </span>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3">{item.name}</h3>
                    <p className="text-white/60 mb-6">{item.description}</p>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {item.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-white/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-ninja-green"></div>
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <motion.button
                        onClick={() => handlePurchase(item)}
                        disabled={isOwned || !canAfford}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                          isOwned
                            ? 'bg-ninja-green/20 text-ninja-green'
                            : !canAfford
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-gradient-to-r from-ninja-purple to-ninja-green text-white hover:from-ninja-green hover:to-ninja-purple'
                        }`}
                        whileHover={
                          !isOwned && canAfford
                            ? { scale: 1.02 }
                            : {}
                        }
                        whileTap={
                          !isOwned && canAfford
                            ? { scale: 0.98 }
                            : {}
                        }
                      >
                        {isOwned ? (
                          <>
                            <FaUnlock className="inline-block mr-2" />
                            Owned
                          </>
                        ) : !canAfford ? (
                          <>
                            <FaLock className="inline-block mr-2" />
                            Insufficient Coins
                          </>
                        ) : (
                          'Purchase Now'
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CoinMenu; 