import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiMessageCircle, FiUserPlus, FiMail, FiLoader, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { TeacherData } from '../services/teacherService';
import { getAllTeachers, connectWithTeacher } from '../services/connectionService';

interface TeacherConnection extends TeacherData {
  connectionStatus: 'pending' | 'accepted' | 'rejected' | null;
}

const Connections: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<TeacherConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const teachersData = await getAllTeachers();
      setTeachers(teachersData.map(teacher => ({
        ...teacher,
        connectionStatus: teacher.connectionStatus as TeacherConnection['connectionStatus']
      })));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const filters = ['All', 'Connected', 'Pending', 'Math', 'Science', 'Languages', 'Arts'];

  const handleConnect = async (teacherId: string) => {
    try {
      await connectWithTeacher(teacherId);
      setTeachers(prev => prev.map(teacher => 
        teacher._id === teacherId ? { ...teacher, connectionStatus: 'pending' } : teacher
      ));
      toast.success('Connection request sent successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send connection request');
    }
  };

  const handleMessage = (teacherId: string) => {
    // Only allow messaging if connection is accepted
    const teacher = teachers.find(t => t._id === teacherId);
    if (teacher?.connectionStatus !== 'accepted') {
      toast.error('You can only message teachers who have accepted your connection request');
      return;
    }
    window.location.href = `/student-dashboard/messages?teacherId=${teacherId}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const filteredTeachers = teachers.filter(teacher => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        teacher.fullName.toLowerCase().includes(query) ||
        teacher.subject.toLowerCase().includes(query) ||
        teacher.institution.toLowerCase().includes(query)
      );
    }
    if (selectedFilter && selectedFilter !== 'All') {
      if (selectedFilter === 'Connected') {
        return teacher.connectionStatus === 'accepted';
      }
      if (selectedFilter === 'Pending') {
        return teacher.connectionStatus === 'pending';
      }
      return teacher.subject.toLowerCase().includes(selectedFilter.toLowerCase());
    }
    return true;
  });

  const getConnectionStatusBadge = (status: string | null) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-500 flex items-center">
            <FiClock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-ninja-green/20 text-ninja-green">
            Connected
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-500">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ninja-black p-8 flex items-center justify-center">
        <FiLoader className="w-8 h-8 text-ninja-green animate-spin" />
        <span className="ml-2 text-ninja-white">Loading teachers...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ninja-black p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-monument text-ninja-white mb-2">Connect with Teachers</h1>
        <p className="text-ninja-white/60">Find and connect with expert teachers in various subjects</p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative flex-1 max-w-2xl">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ninja-white/40" />
          <input
            type="text"
            placeholder="Search teachers by name, subject, or institution..."
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

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher._id}
            className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6 hover:border-ninja-green/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-ninja-green/20 border border-ninja-green/30 flex items-center justify-center text-2xl text-ninja-green font-monument">
                  {teacher.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-monument text-ninja-white">{teacher.fullName}</h3>
                  <p className="text-sm text-ninja-white/60">{teacher.subject}</p>
                  <p className="text-xs text-ninja-white/40">{teacher.institution}</p>
                  {getConnectionStatusBadge(teacher.connectionStatus)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEmail(teacher.email)}
                  className="p-2 hover:bg-ninja-green/10 rounded-full text-ninja-white/60 hover:text-ninja-white"
                  title="Send Email"
                >
                  <FiMail className="w-5 h-5" />
                </button>
                {teacher.connectionStatus === 'accepted' && (
                  <button
                    onClick={() => handleMessage(teacher._id || '')}
                    className="p-2 hover:bg-ninja-green/10 rounded-full text-ninja-white/60 hover:text-ninja-white"
                    title="Send Message"
                  >
                    <FiMessageCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              {!teacher.connectionStatus && (
                <button
                  onClick={() => handleConnect(teacher._id || '')}
                  className="flex items-center space-x-2 px-4 py-2 bg-ninja-green text-ninja-black rounded-lg hover:bg-ninja-purple hover:text-ninja-white transition-colors"
                >
                  <FiUserPlus className="w-4 h-4" />
                  <span className="text-sm font-monument">Connect</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections; 