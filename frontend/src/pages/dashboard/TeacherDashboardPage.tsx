import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar, 
  FiUsers, 
  FiBook, 
  FiBarChart2, 
  FiBell, 
  FiSearch, 
  FiMessageCircle, 
  FiSettings, 
  FiLogOut, 
  FiTrendingUp, 
  FiClock 
} from 'react-icons/fi';

// Components
import Calendar from '../../components/Calendar';
import TeacherCourses from './TeacherCourses';
import TeacherCalendar from './TeacherCalendar';
import TeacherStudents from './TeacherStudents';
import TeacherMessages from './TeacherMessages';
import Settings from '../Settings';

// Services and Types
import { dashboardService } from '../../services/dashboardService';
import { Course, Activity, DashboardStats, CalendarEvent } from '../../types/dashboard';

const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [notifications, setNotifications] = useState<Activity[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, coursesData, activitiesData, eventsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getCourses(),
          dashboardService.getActivities(),
          dashboardService.getEvents(),
        ]);

        setStats(statsData);
        setCourses(coursesData);
        setActivities(activitiesData);
        setEvents(eventsData);
        setNotifications(activitiesData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickStats = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || '0',
      change: '+12.5%',
      icon: FiUsers,
      color: 'text-ninja-green',
    },
    {
      title: 'Active Courses',
      value: stats?.activeCourses || '0',
      change: '+8.2%',
      icon: FiBook,
      color: 'text-ninja-purple',
    },
    {
      title: 'Teaching Hours',
      value: stats?.teachingHours || '0',
      change: '+15.3%',
      icon: FiClock,
      color: 'text-ninja-green',
    },
    {
      title: 'Course Progress',
      value: stats?.courseProgress || '0%',
      change: '+5.1%',
      icon: FiTrendingUp,
      color: 'text-ninja-purple',
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality here
  };

  const handleAlertToggle = (enabled: boolean) => {
    setAlertEnabled(enabled);
    if (enabled) {
      courses.forEach(course => {
        const courseTime = new Date();
        const [hours, minutes] = course.time.split(':');
        courseTime.setHours(parseInt(hours), parseInt(minutes));
        
        const timeUntilClass = courseTime.getTime() - new Date().getTime();
        if (timeUntilClass > 0) {
          setTimeout(() => {
            const notification: Activity = {
              id: `notification-${course.id}`,
              type: 'class',
              title: `Upcoming Class: ${course.name}`,
              description: `Your class starts in 30 minutes`,
              timestamp: new Date(),
            };
            setNotifications(prev => [notification, ...prev]);
          }, timeUntilClass - 30 * 60 * 1000);
        }
      });
    }
  };

  const handleJoinClass = async (courseId: string, meetingLink: string) => {
    try {
      const button = document.querySelector(`button[data-course-id="${courseId}"]`);
      if (button) {
        button.textContent = 'Joining...';
        button.setAttribute('disabled', 'true');
      }

      await dashboardService.joinClass(courseId);
      window.open(meetingLink, '_blank');

      const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        type: 'class',
        title: 'Class Joined',
        description: `You joined ${courses.find(c => c.id === courseId)?.name}`,
        timestamp: new Date(),
      };
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      console.error('Error joining class:', error);
    } finally {
      const button = document.querySelector(`button[data-course-id="${courseId}"]`);
      if (button) {
        button.textContent = 'Start Learning';
        button.removeAttribute('disabled');
      }
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ninja-black">
        <div className="text-ninja-green font-monument">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-ninja-black">
      {/* Sidebar */}
      <div className="w-64 bg-ninja-black/95 border-r border-ninja-white/10">
        <div className="p-6">
          <h2 className="text-2xl font-monument text-ninja-white">OviEdu</h2>
        </div>
        <nav className="mt-6 space-y-2">
          {[
            { id: 'overview', icon: FiBarChart2, label: 'Overview' },
            { id: 'courses', icon: FiBook, label: 'Courses' },
            { id: 'calendar', icon: FiCalendar, label: 'Calendar' },
            { id: 'students', icon: FiUsers, label: 'Students' },
            { id: 'messages', icon: FiMessageCircle, label: 'Messages' },
            { id: 'settings', icon: FiSettings, label: 'Settings' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full px-6 py-3 flex items-center text-ninja-white/80 hover:bg-ninja-green/10 hover:text-ninja-white transition-colors ${
                activeTab === id ? 'bg-ninja-green/10 text-ninja-white' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-monument text-sm">{label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 flex items-center text-ninja-white/80 hover:bg-ninja-green/10 hover:text-ninja-white transition-colors mt-auto"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            <span className="font-monument text-sm">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-ninja-black/95 border-b border-ninja-white/10 sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ninja-white/40" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-ninja-black/50 border border-ninja-white/10 rounded-lg pl-10 pr-4 py-2 text-ninja-white placeholder-ninja-white/40 focus:outline-none focus:border-ninja-green/50"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="p-2 rounded-full hover:bg-ninja-green/10 text-ninja-white/80 hover:text-ninja-white"
                >
                  <FiBell className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-ninja-purple rounded-full" />
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-ninja-black/95 border border-ninja-white/10 rounded-lg shadow-lg p-4">
                    <h3 className="font-monument text-sm text-ninja-white mb-2">Notifications</h3>
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="text-sm text-ninja-white/60 p-2 hover:bg-ninja-green/10 rounded">
                          <div className="font-monument text-ninja-white">{notification.title}</div>
                          <div className="text-xs">{notification.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-ninja-green/20 border border-ninja-green/30" />
                <span className="font-monument text-sm text-ninja-white">Teacher Name</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'overview' && (
          <div className="p-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-ninja-green/20 to-ninja-purple/20 rounded-lg p-8 mb-8">
              <h1 className="text-2xl font-monument text-ninja-white mb-2">Welcome back, Teacher!</h1>
              <p className="text-ninja-white/60">Here's what's happening with your courses today.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                      <span className="text-sm font-monument text-green-500">{stat.change}</span>
                    </div>
                    <h3 className="text-ninja-white/60 text-sm mb-1">{stat.title}</h3>
                    <p className="text-2xl font-monument text-ninja-white">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Main Content Area */}
              <div className="col-span-8 space-y-6">
                {/* Upcoming Classes */}
                <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-monument text-ninja-white">Upcoming Classes</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-ninja-white/60">Class Alerts</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={alertEnabled}
                          onChange={(e) => handleAlertToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-ninja-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-ninja-green after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ninja-green/20" />
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 bg-ninja-green/5 rounded-lg border border-ninja-green/20"
                      >
                        <div>
                          <h4 className="font-monument text-ninja-white">{course.name}</h4>
                          <p className="text-sm text-ninja-white/60">{course.class} • {course.time}</p>
                        </div>
                        <button
                          data-course-id={course.id}
                          onClick={() => handleJoinClass(course.id, course.meetingLink)}
                          className="px-4 py-2 bg-ninja-green text-ninja-black rounded-lg font-monument text-sm hover:bg-ninja-purple hover:text-ninja-white transition-colors"
                        >
                          Join Class
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-monument text-ninja-white mb-6">Recent Activities</h2>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-4 p-4 bg-ninja-green/5 rounded-lg"
                      >
                        <div className="w-12 h-12 rounded-lg bg-ninja-green/10 flex items-center justify-center">
                          <FiCalendar className="text-ninja-green" />
                        </div>
                        <div>
                          <h4 className="font-monument text-ninja-white">{activity.title}</h4>
                          <p className="text-sm text-ninja-white/60">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-4 space-y-6">
                {/* Calendar */}
                <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-monument text-ninja-white mb-4">Calendar</h2>
                  <Calendar events={events} />
                </div>

                {/* Upcoming Events */}
                <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-monument text-ninja-white mb-4">Upcoming Events</h2>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center space-x-4 p-4 bg-ninja-green/5 rounded-lg"
                      >
                        <div className="w-12 h-12 rounded-lg bg-ninja-green/10 flex items-center justify-center">
                          <FiCalendar className="text-ninja-green" />
                        </div>
                        <div>
                          <h4 className="font-monument text-ninja-white">{event.title}</h4>
                          <p className="text-sm text-ninja-white/60">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'courses' && <TeacherCourses />}
        {activeTab === 'calendar' && <TeacherCalendar />}
        {activeTab === 'students' && <TeacherStudents />}
        {activeTab === 'messages' && <TeacherMessages />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  );
};

export default TeacherDashboardPage; 