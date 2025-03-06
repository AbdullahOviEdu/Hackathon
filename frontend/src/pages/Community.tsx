import { useState } from 'react';
import Navbar from '../components/Navbar';

const Community = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('discussions');

  // Sample community data
  const discussions = [
    {
      id: 1,
      title: 'Best practices for React performance optimization',
      author: 'Sarah Johnson',
      avatar: 'S',
      category: 'Frontend',
      replies: 24,
      likes: 156,
      isHot: true,
      lastActive: '2h ago'
    },
    {
      id: 2,
      title: 'How to structure large-scale Node.js applications?',
      author: 'Mike Wilson',
      avatar: 'M',
      category: 'Backend',
      replies: 18,
      likes: 92,
      isHot: true,
      lastActive: '4h ago'
    },
    {
      id: 3,
      title: 'Tips for acing technical interviews',
      author: 'Emma Davis',
      avatar: 'E',
      category: 'Career',
      replies: 45,
      likes: 234,
      isHot: true,
      lastActive: '1h ago'
    }
  ];

  const topMembers = [
    { name: 'Alex Chen', avatar: 'A', role: 'Full Stack Ninja', contributions: 156 },
    { name: 'Lisa Wang', avatar: 'L', role: 'Frontend Master', contributions: 142 },
    { name: 'David Kim', avatar: 'D', role: 'DevOps Expert', contributions: 128 }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'React Advanced Workshop',
      date: 'Mar 15, 2024',
      time: '10:00 AM PST',
      attendees: 128,
      speaker: 'Sarah Johnson',
      category: 'Workshop'
    },
    {
      id: 2,
      title: 'Tech Career AMA Session',
      date: 'Mar 18, 2024',
      time: '2:00 PM PST',
      attendees: 256,
      speaker: 'Mike Wilson',
      category: 'AMA'
    }
  ];

  // Tab content components
  const DiscussionsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Discussions */}
      <div className="lg:col-span-2 space-y-6">
        {discussions.map((discussion, index) => (
          <div
            key={discussion.id}
            className={`backdrop-blur-xl bg-white/5 rounded-xl p-6 transition-all duration-500 hover:bg-white/10 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
            onLoad={() => setIsLoaded(true)}
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ninja-green to-ninja-purple flex items-center justify-center text-sm">
                {discussion.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-ninja-white/80">{discussion.author}</span>
                  <span className="text-ninja-white/40">•</span>
                  <span className="text-sm text-ninja-white/60">{discussion.lastActive}</span>
                </div>
                <h3 className="font-monument text-lg mb-2 hover:text-ninja-green transition-colors cursor-pointer">
                  {discussion.title}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-ninja-green">
                    {discussion.category}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-ninja-white/60">
                    <span>💬 {discussion.replies}</span>
                    <span>❤️ {discussion.likes}</span>
                  </div>
                </div>
              </div>
              {discussion.isHot && (
                <div className="px-2 py-1 bg-ninja-orange/20 rounded-md">
                  <span className="text-ninja-orange text-sm">🔥 Hot</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Top Members */}
        <div className={`backdrop-blur-xl bg-white/5 rounded-xl p-6 transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <h2 className="font-monument text-xl mb-4">Top Contributors</h2>
          <div className="space-y-4">
            {topMembers.map((member, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ninja-green to-ninja-purple flex items-center justify-center text-sm">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-monument text-sm">{member.name}</div>
                  <div className="text-xs text-ninja-white/60">{member.role}</div>
                </div>
                <div className="text-ninja-green text-sm">
                  {member.contributions} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className={`backdrop-blur-xl bg-white/5 rounded-xl p-6 transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <h2 className="font-monument text-xl mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="text-ninja-green text-xs mb-2">{event.category}</div>
                <h3 className="font-monument text-sm mb-2">{event.title}</h3>
                <div className="text-xs text-ninja-white/60">
                  <div>📅 {event.date}</div>
                  <div>⏰ {event.time}</div>
                  <div>👥 {event.attendees} attending</div>
                </div>
                <button className="w-full mt-3 py-2 bg-ninja-green/20 text-ninja-green text-sm rounded-lg hover:bg-ninja-green/30 transition-colors">
                  Join Event
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const EventsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {upcomingEvents.map((event, index) => (
        <div
          key={event.id}
          className={`backdrop-blur-xl bg-white/5 rounded-xl p-6 transition-all duration-500 hover:bg-white/10 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-ninja-green">
              {event.category}
            </span>
            <span className="text-sm text-ninja-white/60">👥 {event.attendees}</span>
          </div>
          <h3 className="font-monument text-xl mb-3">{event.title}</h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-ninja-white/60">
              <span>📅</span>
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ninja-white/60">
              <span>⏰</span>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-ninja-white/60">
              <span>👤</span>
              <span>Speaker: {event.speaker}</span>
            </div>
          </div>
          <button className="w-full py-3 bg-ninja-green text-ninja-black font-monument text-sm rounded-lg hover:scale-105 transition-all duration-300">
            Register Now
          </button>
        </div>
      ))}
    </div>
  );

  const MembersTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {topMembers.map((member, index) => (
        <div
          key={index}
          className={`backdrop-blur-xl bg-white/5 rounded-xl p-6 transition-all duration-500 hover:bg-white/10 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ninja-green to-ninja-purple flex items-center justify-center text-2xl">
              {member.avatar}
            </div>
            <div>
              <h3 className="font-monument text-xl">{member.name}</h3>
              <p className="text-ninja-white/60">{member.role}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-sm text-ninja-white/60">Contributions</span>
              <span className="text-ninja-green font-monument">{member.contributions}</span>
            </div>
            <button className="w-full py-2 bg-ninja-green/20 text-ninja-green text-sm rounded-lg hover:bg-ninja-green/30 transition-colors">
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-ninja-black via-ninja-black/95 to-ninja-black text-ninja-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_65%)] from-ninja-green/5" />
      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-16 md:pt-24">
        {/* Header */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="font-monument text-4xl md:text-5xl mb-4">
            Join Our <span className="text-ninja-green">Community</span>
          </h1>
          <p className="text-ninja-white/60 max-w-2xl">
            Connect with fellow developers, share knowledge, and grow together. Join discussions, attend events, and be part of our thriving community.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mt-12 mb-8 border-b border-white/10">
          {['discussions', 'events', 'members'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-monument text-sm transition-all ${
                activeTab === tab
                  ? 'text-ninja-green border-b-2 border-ninja-green'
                  : 'text-ninja-white/60 hover:text-ninja-white'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div>
          {activeTab === 'discussions' && <DiscussionsTab />}
          {activeTab === 'events' && <EventsTab />}
          {activeTab === 'members' && <MembersTab />}
        </div>
      </main>
    </div>
  );
};

export default Community; 