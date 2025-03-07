import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiUsers, 
  FiBook, 
  FiBarChart2, 
  FiSettings, 
  FiLogOut, 
  FiTrendingUp, 
  FiClock,
  FiUserPlus,
  FiCheck
} from 'react-icons/fi';
import { toast } from 'react-toastify';

// Components
import Navbar from '../../components/Navbar';
import Calendar from '../../components/Calendar';
import TeacherCourses from './TeacherCourses';
import TeacherCalendar from './TeacherCalendar';
import TeacherStudents from './TeacherStudents';
import TeacherConnections from './TeacherConnections';
import Settings from '../Settings';

// Services and Types
import { dashboardService } from '../../services/dashboardService';
import { Course, Activity, DashboardStats, CalendarEvent } from '../../types/dashboard';
import { getTeacherNotifications, markNotificationAsRead } from '../../services/teacherService';

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
        <div className="text-ninja-green font-monument">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-ninja-black">
      <Navbar />
      
      <div className="flex flex-1 pt-20">
        <div className="w-64 bg-ninja-black/95 border-r border-ninja-white/10">
          <div className="p-6">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-full px-4 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white/80 hover:bg-ninja-green/10 hover:text-ninja-white transition-colors flex items-center justify-between"
            >
              <span className="font-monument text-sm">Notifications</span>
              {unreadNotifications > 0 && (
                <span className="bg-ninja-purple text-ninja-black text-xs font-bold px-2 py-1 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute left-64 top-20 w-96 bg-ninja-black/95 border border-ninja-white/10 rounded-lg shadow-xl p-4 max-h-[80vh] overflow-y-auto">
                <h3 className="font-monument text-ninja-white text-lg mb-4">Notifications</h3>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`p-4 rounded-lg ${
                          notification.read
                            ? 'bg-ninja-black/30'
                            : 'bg-ninja-green/10 border-l-2 border-ninja-green'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-ninja-white mb-1">{notification.title}</div>
                            <div className="text-sm text-ninja-white/60 mb-2">{notification.message}</div>
                            <div className="text-xs text-ninja-white/40">
                              {new Date(notification.createdAt).toLocaleString()}
                            </div>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-2 hover:bg-ninja-green/10 rounded-full text-ninja-green"
                              title="Mark as read"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-ninja-white/60 py-4">No notifications</div>
                )}
              </div>
            )}
          </div>
          <nav className="mt-6 space-y-2">
            {[
              { id: 'overview', icon: FiBarChart2, label: 'Overview' },
              { id: 'courses', icon: FiBook, label: 'Courses' },
              { id: 'calendar', icon: FiCalendar, label: 'Calendar' },
              { id: 'students', icon: FiUsers, label: 'Students' },
              { id: 'connections', icon: FiUserPlus, label: 'Connections' },
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

        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Student Enrollment Stats */}
                <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-monument text-ninja-white text-lg">Student Enrollment</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex flex-col p-4 bg-ninja-black/30 rounded-lg border border-ninja-white/5"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ninja-purple/20 to-ninja-green/20 flex items-center justify-center mr-4">
                              <FiUsers className="text-ninja-green" />
                            </div>
                            <div>
                              <div className="font-monument text-ninja-white">{course.name}</div>
                              <div className="text-xs text-ninja-white/60">{course.class}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-2xl font-monument text-ninja-green">
                            {course.enrolledStudents?.length || 0}
                          </div>
                          <div className="text-sm text-ninja-white/60">Students Enrolled</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-ninja-white/10">
                    <div className="flex items-center justify-between">
                      <div className="text-ninja-white/60">Total Students Enrolled</div>
                      <div className="text-2xl font-monument text-ninja-green">
                        {courses.reduce((total, course) => total + (course.enrolledStudents?.length || 0), 0)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-monument text-ninja-white text-lg">Recent Activity</h2>
                  </div>
                  <div className="space-y-4">
                    {getCombinedActivities().slice(0, 5).map((activity) => (
                      <div
                        key={activity.id}
                        className={`flex items-start p-4 bg-ninja-black/30 rounded-lg border border-ninja-white/5 hover:border-ninja-green/30 transition-colors ${
                          activity.isNotification && !activity.read ? 'bg-ninja-green/10 border-l-2 border-ninja-green' : ''
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ninja-purple/20 to-ninja-green/20 flex items-center justify-center mr-4">
                          {activity.type === 'class' && <FiBook className="text-ninja-green" />}
                          {activity.type === 'enrollment' && <FiUserPlus className="text-ninja-green" />}
                          {activity.type === 'system' && <FiClock className="text-ninja-purple" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-monument text-ninja-white">{activity.title}</div>
                          <div className="text-xs text-ninja-white/60 mb-1">{activity.description}</div>
                          <div className="text-xs text-ninja-white/40">
                            {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && <TeacherCourses />}
            {activeTab === 'calendar' && <TeacherCalendar />}
            {activeTab === 'students' && <TeacherStudents />}
            {activeTab === 'connections' && <TeacherConnections />}
            {activeTab === 'settings' && <Settings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage; 