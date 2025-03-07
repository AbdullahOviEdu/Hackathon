import React, { useState } from 'react';
import { FiSearch, FiFilter, FiMessageCircle, FiUserPlus } from 'react-icons/fi';

interface Connection {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  rating: number;
  students: number;
  isConnected: boolean;
}

const Connections: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Mock data
  const connections: Connection[] = [
    {
      id: '1',
      name: 'Nikols Helmet',
      role: 'UI/UX Designer',
      expertise: ['UI Design', 'User Research', 'Prototyping'],
      rating: 4.9,
      students: 1234,
      isConnected: true,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Web Developer',
      expertise: ['React', 'Node.js', 'TypeScript'],
      rating: 4.8,
      students: 956,
      isConnected: false,
    },
    {
      id: '3',
      name: 'Michael Chen',
      role: 'Data Scientist',
      expertise: ['Python', 'Machine Learning', 'Data Analysis'],
      rating: 4.7,
      students: 789,
      isConnected: true,
    },
  ];

  const filters = ['All', 'Connected', 'Pending', 'UI/UX', 'Development', 'Data Science'];

  const handleConnect = (connectionId: string) => {
    // Add connection logic here
    console.log('Connecting with:', connectionId);
  };

  const handleMessage = (connectionId: string) => {
    // Add messaging logic here
    console.log('Messaging:', connectionId);
  };

  const filteredConnections = connections.filter(connection => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        connection.name.toLowerCase().includes(query) ||
        connection.role.toLowerCase().includes(query) ||
        connection.expertise.some(exp => exp.toLowerCase().includes(query))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-ninja-black p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-monument text-ninja-white mb-2">Connections</h1>
        <p className="text-ninja-white/60">Connect with mentors and fellow learners</p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative flex-1 max-w-2xl">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ninja-white/40" />
          <input
            type="text"
            placeholder="Search connections..."
            className="w-full bg-ninja-black/50 border border-ninja-white/10 rounded-lg pl-10 pr-4 py-2 text-ninja-white placeholder-ninja-white/40 focus:outline-none focus:border-ninja-green/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="p-2 hover:bg-ninja-green/10 rounded-full">
          <FiFilter className="text-ninja-white/60" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter === selectedFilter ? null : filter)}
            className={`px-4 py-2 rounded-full text-sm font-monument transition-colors ${
              selectedFilter === filter
                ? 'bg-ninja-green text-ninja-black'
                : 'bg-ninja-white/5 text-ninja-white/60 hover:bg-ninja-green/10 hover:text-ninja-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConnections.map((connection) => (
          <div
            key={connection.id}
            className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6 hover:border-ninja-green/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-ninja-green/20 border border-ninja-green/30"></div>
                <div>
                  <h3 className="font-monument text-ninja-white">{connection.name}</h3>
                  <p className="text-sm text-ninja-white/60">{connection.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-ninja-green">★</span>
                <span className="text-sm text-ninja-white">{connection.rating}</span>
              </div>
            </div>

            {/* Expertise */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {connection.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs rounded-full bg-ninja-green/10 text-ninja-green"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-ninja-white/40">{connection.students} students</p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleMessage(connection.id)}
                  className="p-2 hover:bg-ninja-green/10 rounded-full text-ninja-white/60 hover:text-ninja-white"
                >
                  <FiMessageCircle className="w-5 h-5" />
                </button>
                {!connection.isConnected && (
                  <button
                    onClick={() => handleConnect(connection.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-ninja-green text-ninja-black rounded-lg hover:bg-ninja-purple hover:text-ninja-white transition-colors"
                  >
                    <FiUserPlus className="w-4 h-4" />
                    <span className="text-sm font-monument">Connect</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections; 