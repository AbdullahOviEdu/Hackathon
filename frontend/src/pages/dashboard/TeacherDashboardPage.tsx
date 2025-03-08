import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiUsers, 
  FiBook, 
  FiBarChart2, 
  FiSettings, 
  FiLogOut, 
  FiClock,
  FiUserPlus,
  FiCheck
} from 'react-icons/fi';
import { FaRobot, FaMicrophone } from 'react-icons/fa';

// Components
import Navbar from '../../components/Navbar';
import Calendar from '../../components/Calendar';
import TeacherCourses from './TeacherCourses';
import TeacherCalendar from './TeacherCalendar';
import TeacherStudents from './TeacherStudents';
// import TeacherConnections from './TeacherConnections';
import Settings from '../Settings';

// Services and Types
import { dashboardService } from '../../services/dashboardService';
import { Course, Activity, DashboardStats, CalendarEvent } from '../../types/dashboard';
import { getTeacherNotifications, markNotificationAsRead } from '../../services/teacherService';
import { toast } from 'react-toastify';

// Update the Course type to include the missing properties
interface ExtendedCourse extends Course {
  day: string;
  students: number;
  enrolledStudents?: {
    _id: string;
    fullName: string;
    email: string;
    grade: string;
    school: string;
  }[];
}

interface Notification {
  _id: string;
  type: 'enrollment' | 'message' | 'system';
  title: string;
  message: string;
  courseId?: string;
  studentId?: string;
  read: boolean;
  createdAt: Date;
}

const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<ExtendedCourse[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    
    // Set up polling interval for updates
    const pollingInterval = setInterval(() => {
      fetchDashboardData();
    }, 30000); // Poll every 30 seconds

    // Cleanup polling on unmount
    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [coursesData, notificationsData] = await Promise.all([
        dashboardService.getCourses(),
        getTeacherNotifications()
      ]);

      setCourses(coursesData as ExtendedCourse[]);
      setNotifications(notificationsData);
      setUnreadNotifications(notificationsData.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to load dashboard data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadNotifications(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  const getCombinedActivities = () => {
    const notificationActivities = notifications.map(notification => ({
      id: notification._id,
      type: notification.type,
      title: notification.title,
      description: notification.message,
      timestamp: new Date(notification.createdAt),
      isNotification: true,
      read: notification.read
    }));

    const combinedActivities = [...activities, ...notificationActivities].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    return combinedActivities;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ninja-black">
        <div className="text-ninja-green font-monument text-sm sm:text-base">Loading...</div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', icon: FiBarChart2, label: 'Overview' },
    { id: 'courses', icon: FiBook, label: 'Courses' },
    { id: 'calendar', icon: FiCalendar, label: 'Calendar' },
    { id: 'students', icon: FiUsers, label: 'Students' },
    { id: 'connections', icon: FiUserPlus, label: 'Connections' },
    { id: 'settings', icon: FiSettings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-screen bg-ninja-black">
      <Navbar />
      
      <div className="flex flex-1 pt-16 sm:pt-20">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed bottom-4 right-4 z-50 lg:hidden bg-ninja-green text-ninja-black p-3 rounded-full shadow-lg"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-ninja-black/95 border-r border-ninja-white/10 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4 sm:p-6">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-full px-3 sm:px-4 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white/80 hover:bg-ninja-green/10 hover:text-ninja-white transition-colors flex items-center justify-between"
            >
              <span className="font-monument text-xs sm:text-sm">Notifications</span>
              {unreadNotifications > 0 && (
                <span className="bg-ninja-purple text-ninja-black text-xs font-bold px-2 py-1 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute left-64 top-20 w-72 sm:w-96 bg-ninja-black/95 border border-ninja-white/10 rounded-lg shadow-xl p-4 max-h-[80vh] overflow-y-auto">
                <h3 className="font-monument text-ninja-white text-base sm:text-lg mb-4">Notifications</h3>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-3 sm:p-4 rounded-lg ${
                          notification.read
                            ? 'bg-ninja-black/30'
                            : 'bg-ninja-green/10 border-l-2 border-ninja-green'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-ninja-white text-sm sm:text-base mb-1">{notification.title}</div>
                            <div className="text-xs sm:text-sm text-ninja-white/60 mb-2">{notification.message}</div>
                            <div className="text-xs text-ninja-white/40">
                              {new Date(notification.createdAt).toLocaleString()}
                            </div>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-1.5 sm:p-2 hover:bg-ninja-green/10 rounded-full text-ninja-green"
                              title="Mark as read"
                            >
                              <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-ninja-white/60 py-4 text-sm">No notifications</div>
                )}
              </div>
            )}
          </div>

          <nav className="mt-4 sm:mt-6 space-y-1 sm:space-y-2">
            {menuItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center text-ninja-white/80 hover:bg-ninja-green/10 hover:text-ninja-white transition-colors ${
                  activeTab === id ? 'bg-ninja-green/10 text-ninja-white' : ''
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                <span className="font-monument text-xs sm:text-sm">{label}</span>
              </button>
            ))}

            <Link
              to="/teacher/learning-bot"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-ninja-white/80 hover:bg-ninja-green/10 hover:text-ninja-white transition-colors"
            >
              <FaRobot className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              <span className="font-monument text-xs sm:text-sm">Learning Bot</span>
            </Link>

            <Link
              to="/teacher/voice-assistant"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-4 sm:px-6 py-2.5 sm:py-3 text-ninja-white/80 hover:bg-ninja-green/10 hover:text-ninja-white transition-colors"
            >
              <FaMicrophone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              <span className="font-monument text-xs sm:text-sm">Voice Assistant</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center text-ninja-white/80 hover:bg-ninja-green/10 hover:text-ninja-white transition-colors mt-4 sm:mt-6"
            >
              <FiLogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              <span className="font-monument text-xs sm:text-sm">Logout</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Render active tab content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Stats Cards */}
                {stats && Object.entries(stats).map(([key, value]) => (
                  <div key={key} className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-4 sm:p-6">
                    <h3 className="text-xs sm:text-sm text-ninja-white/60 mb-2">{key}</h3>
                    <div className="text-lg sm:text-2xl font-monument text-ninja-white">{value}</div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-monument text-ninja-white mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {getCombinedActivities().map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 text-sm">
                      <div className="w-8 h-8 rounded-full bg-ninja-green/10 flex items-center justify-center text-ninja-green">
                        <FiClock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-ninja-white">{activity.title}</div>
                        <div className="text-ninja-white/60 text-xs">{activity.description}</div>
                        <div className="text-ninja-white/40 text-xs mt-1">
                          {activity.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* {activeTab === 'courses' && <TeacherCourses courses={courses} />}
          {activeTab === 'calendar' && <TeacherCalendar events={events} />}
          {activeTab === 'students' && <TeacherStudents courses={courses} />} */}
          {/* {activeTab === 'connections' && <TeacherConnections />} */}
          {activeTab === 'settings' && <Settings />}
        </div>
      </div>

      {/* Overlay f                         h
      or mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default TeacherDashboardPage; 