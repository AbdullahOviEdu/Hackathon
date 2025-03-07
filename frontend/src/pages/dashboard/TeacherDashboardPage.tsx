import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiCalendar, 
  FiUsers, 
  FiBook, 
  FiBarChart2, 

  FiMessageCircle, 
  FiSettings, 
  FiLogOut, 
  FiTrendingUp, 
  FiClock 
} from 'react-icons/fi';

// Components
import Navbar from '../../components/Navbar';
import Calendar from '../../components/Calendar';
import TeacherCourses from './TeacherCourses';
import TeacherCalendar from './TeacherCalendar';
import TeacherStudents from './TeacherStudents';
import TeacherMessages from './TeacherMessages';
import Settings from '../Settings';

// Services and Types
import { dashboardService } from '../../services/dashboardService';
import { Course, Activity, DashboardStats, CalendarEvent } from '../../types/dashboard';

// Update the Course type to include the missing properties
interface ExtendedCourse extends Course {
  day: string;
  students: number;
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
  const [, setNotifications] = useState<Activity[]>([]);
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
        // Cast the courses to ExtendedCourse type
        setCourses(coursesData as ExtendedCourse[]);
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
    <div className="flex flex-col h-screen bg-ninja-black">
      {/* Global Navbar */}
      <Navbar />
      
      {/* Dashboard Content */}
      <div className="flex flex-1 pt-20"> {/* Add padding-top to account for the navbar */}
        {/* Sidebar */}
        <div className="w-64 bg-ninja-black/95 border-r border-ninja-white/10">
          <div className="p-6">
          
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
          {/* Dashboard Header */}
          

          {/* Dashboard Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={index}
                        className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-6 hover:border-ninja-green/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-ninja-black/50 ${stat.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="text-ninja-white/60 text-sm">
                            <span className="text-ninja-green">{stat.change}</span> this month
                          </div>
                        </div>
                        <div className="font-monument text-ninja-white text-2xl mb-1">{stat.value}</div>
                        <div className="text-ninja-white/60 text-sm">{stat.title}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Upcoming Classes */}
                  <div className="lg:col-span-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-monument text-ninja-white text-lg">Upcoming Classes</h2>
                      <div className="flex items-center">
                        <label className="flex items-center mr-4 text-sm text-ninja-white/60">
                          <input
                            type="checkbox"
                            checked={alertEnabled}
                            onChange={(e) => handleAlertToggle(e.target.checked)}
                            className="mr-2 h-3 w-3 rounded border-ninja-white/10 text-ninja-purple focus:ring-ninja-purple"
                          />
                          Alert me
                        </label>
                        <Link to="/teacher/calendar" className="text-ninja-purple text-sm hover:text-ninja-green transition-colors">
                          View All
                        </Link>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {courses.slice(0, 3).map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-4 bg-ninja-black/30 rounded-lg border border-ninja-white/5 hover:border-ninja-green/30 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ninja-purple/20 to-ninja-green/20 flex items-center justify-center mr-4">
                              <FiBook className="text-ninja-green" />
                            </div>
                            <div>
                              <div className="font-monument text-ninja-white">{course.name}</div>
                              <div className="text-xs text-ninja-white/60">
                                {course.day} • {course.time} • {course.students} students
                              </div>
                            </div>
                          </div>
                          <button
                            data-course-id={course.id}
                            onClick={() => handleJoinClass(course.id, course.meetingLink)}
                            className="px-4 py-2 bg-ninja-green/10 text-ninja-green text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors"
                          >
                            Start Learning
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calendar */}
                  <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-monument text-ninja-white text-lg">Calendar</h2>
                      <Link to="/teacher/calendar" className="text-ninja-purple text-sm hover:text-ninja-green transition-colors">
                        View All
                      </Link>
                    </div>
                    <Calendar events={events} />
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-monument text-ninja-white text-lg">Recent Activity</h2>
                    <button className="text-ninja-purple text-sm hover:text-ninja-green transition-colors">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start p-4 bg-ninja-black/30 rounded-lg border border-ninja-white/5 hover:border-ninja-green/30 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ninja-purple/20 to-ninja-green/20 flex items-center justify-center mr-4">
                          {activity.type === 'class' && <FiBook className="text-ninja-green" />}
                          {activity.type === 'message' && <FiMessageCircle className="text-ninja-purple" />}
                          {activity.type === 'assignment' && <FiBarChart2 className="text-ninja-green" />}
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
            {activeTab === 'messages' && <TeacherMessages />}
            {activeTab === 'settings' && <Settings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage; 