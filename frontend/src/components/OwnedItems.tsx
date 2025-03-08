import React, { useState, useEffect } from 'react';
import { FaJs, FaReact, FaShoppingCart, FaChartBar, FaPlay } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface PurchaseItem {
  id: string;
  name: string;
  description: string;
  type: 'course' | 'project';
  icon: React.ElementType;
  color: string;
}

const purchaseItems: PurchaseItem[] = [
  {
    id: 'course-1',
    name: 'Advanced JavaScript Mastery',
    description: 'Master modern JavaScript concepts and best practices.',
    type: 'course',
    icon: FaJs,
    color: 'from-yellow-400 to-yellow-600'
  },
  {
    id: 'course-2',
    name: 'React Development',
    description: 'Build modern web applications with React.',
    type: 'course',
    icon: FaReact,
    color: 'from-cyan-400 to-blue-500'
  },
  {
    id: 'project-1',
    name: 'E-commerce Platform',
    description: 'Complete e-commerce project with shopping cart.',
    type: 'project',
    icon: FaShoppingCart,
    color: 'from-green-400 to-emerald-600'
  },
  {
    id: 'project-2',
    name: 'Social Media Dashboard',
    description: 'Analytics dashboard with real-time data.',
    type: 'project',
    icon: FaChartBar,
    color: 'from-purple-400 to-purple-600'
  }
];

const OwnedItems: React.FC = () => {
  const [ownedItems, setOwnedItems] = useState<PurchaseItem[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'course' | 'project'>('all');

  useEffect(() => {
    // Get purchased items from localStorage
    const savedPurchases = localStorage.getItem('purchasedItems');
    if (savedPurchases) {
      const purchasedIds = JSON.parse(savedPurchases);
      const items = purchaseItems.filter(item => purchasedIds.includes(item.id));
      setOwnedItems(items);
    }
  }, []);

  const filteredItems = ownedItems.filter(
    item => selectedType === 'all' || item.type === selectedType
  );

  if (ownedItems.length === 0) {
    return (
      <div className="bg-white/5 rounded-xl p-8 text-center">
        <h3 className="text-xl text-white/60 mb-4">No items purchased yet</h3>
        <p className="text-white/40">Visit the coin shop to unlock courses and projects!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-monument text-white">My Library</h2>
        <div className="inline-flex bg-white/5 rounded-lg p-1">
          {['all', 'course', 'project'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as typeof selectedType)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedType === type
                  ? 'bg-ninja-green text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}s
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-ninja-green/50 transition-all duration-300"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`aspect-video bg-gradient-to-br ${item.color} p-8 flex flex-col items-center justify-center relative group`}>
                <Icon className="text-white text-5xl mb-4 transition-transform duration-300 group-hover:scale-90" />
                <span className="text-white font-medium">
                  {item.type === 'course' ? 'Course' : 'Project'}
                </span>
                <motion.button
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlay className="text-white text-4xl" />
                </motion.button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-white/60 text-sm">{item.description}</p>
                <div className="mt-4 flex justify-end">
                  <span className="text-ninja-green text-sm">Ready to start</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OwnedItems; 