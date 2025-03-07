import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiBook, FiBell, FiSearch, FiMessageCircle, FiSettings, FiLogOut, FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../../components/Navbar';
import Calendar from '../../components/Calendar';
import { dashboardService } from '../../services/dashboardService';
import { Course, Activity, DashboardStats, CalendarEvent } from '../../types/dashboard';
import { getStudentProfile, getEnrolledCourses } from '../../services/studentService';
import { StudentData } from '../../services/studentService';
import { CourseData } from '../../services/courseService';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [notifications, setNotifications] = useState<Activity[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch mock data for now
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

      // Fetch real student data from the database
      try {
        const studentData = await getStudentProfile();
        setStudentProfile(studentData);
        
        const enrolledCoursesData = await getEnrolledCourses();
        setEnrolledCourses(enrolledCoursesData);
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Failed to fetch your profile data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      const filteredCourses = courses.filter(course => 
        course.name.toLowerCase().includes(searchLower) ||
        course.class.toLowerCase().includes(searchLower)
      );
      setCourses(filteredCourses);
    } else {
      dashboardService.getCourses().then(setCourses);
    }
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

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleScheduleMeet = () => {
    navigate('/schedule-meet');
  };

  const handleContinueLearning = () => {
    if (courses.length > 0) {
      handleJoinClass(courses[0].id, courses[0].meetingLink);
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
      toast.success('Successfully joined the class!');
    } catch (error) {
      console.error('Error joining class:', error);
      toast.error('Failed to join the class');
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
    navigate('/');
    toast.info('You have been logged out');
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-ninja-black">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <FiLoader className="w-8 h-8 text-ninja-green animate-spin" />
          <span className="ml-2 text-ninja-white">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-ninja-black">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Global Navbar */}
      <Navbar />
      
      {/* Dashboard Content */}
      <div className="flex flex-1 pt-20"> {/* Add padding-top to account for the navbar */}
        {/* Sidebar */}
        <div className="w-64 bg-ninja-black/95 border-r border-ninja-white/10">
          <nav className="mt-6 space-y-2">
            <div className="px-6 py-3 bg-ninja-green/10 cursor-pointer flex items-center text-ninja-white">
              <FiBook className="mr-3" />
              <span className="font-monument text-sm">Dashboard</span>
            </div>
            <div 
              onClick={() => handleNavigation('/student-dashboard/connections')}
              className="px-6 py-3 hover:bg-ninja-green/10 cursor-pointer flex items-center text-ninja-white/80 hover:text-ninja-white"
            >
              <FiUsers className="mr-3" />
              <span className="font-monument text-sm">Connections</span>
            </div>
            <div 
              onClick={() => handleNavigation('/student-dashboard/messages')}
              className="px-6 py-3 hover:bg-ninja-green/10 cursor-pointer flex items-center text-ninja-white/80 hover:text-ninja-white"
            >
              <FiMessageCircle className="mr-3" />
              <span className="font-monument text-sm">Messages</span>
            </div>
            <div 
              onClick={() => handleNavigation('/student-dashboard/meetings')}
              className="px-6 py-3 hover:bg-ninja-green/10 cursor-pointer flex items-center text-ninja-white/80 hover:text-ninja-white"
            >
              <FiCalendar className="mr-3" />
              <span className="font-monument text-sm">Meetings</span>
            </div>
            <div 
              onClick={() => handleNavigation('/student-dashboard/settings')}
              className="px-6 py-3 hover:bg-ninja-green/10 cursor-pointer flex items-center text-ninja-white/80 hover:text-ninja-white"
            >
              <FiSettings className="mr-3" />
              <span className="font-monument text-sm">Settings</span>
            </div>
            <div 
              onClick={handleLogout}
              className="mt-auto px-6 py-3 hover:bg-ninja-green/10 cursor-pointer flex items-center text-ninja-white/80 hover:text-ninja-white"
            >
              <FiLogOut className="mr-3" />
              <span className="font-monument text-sm">Logout</span>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Dashboard Header */}
          

          {/* Dashboard Content */}
          <div className="p-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-ninja-purple/20 to-ninja-green/20 rounded-lg p-8 mb-8">
              <h1 className="text-2xl font-monument text-ninja-white mb-2">
                Welcome back, {studentProfile?.fullName?.split(' ')[0] || 'Student'}!
              </h1>
              <p className="text-ninja-white/60">Continue your learning journey today.</p>
              <button
                onClick={handleContinueLearning}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black font-monument text-sm rounded-lg hover:from-ninja-green hover:to-ninja-purple transition-all duration-500"
              >
                Continue Learning
              </button>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enrolled Courses */}
              <div className="lg:col-span-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-monument text-ninja-white text-lg">Your Courses</h2>
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
                  </div>
                </div>
                
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                      <div
                        key={course._id}
                        className="flex items-center justify-between p-4 bg-ninja-black/30 rounded-lg border border-ninja-white/5 hover:border-ninja-green/30 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ninja-purple/20 to-ninja-green/20 flex items-center justify-center mr-4">
                            <FiBook className="text-ninja-green" />
                          </div>
                          <div>
                            <div className="font-monument text-ninja-white">{course.title}</div>
                            <div className="text-xs text-ninja-white/60">
                              {course.grade} • {course.duration}
                            </div>
                          </div>
                        </div>
                        <button
                          data-course-id={course._id}
                          onClick={() => handleJoinClass(course._id || '', '#')}
                          className="px-4 py-2 bg-ninja-green/10 text-ninja-green text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors"
                        >
                          Start Learning
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-ninja-white/60 mb-4">You haven't enrolled in any courses yet.</p>
                    <button
                      onClick={() => navigate('/courses')}
                      className="px-4 py-2 bg-ninja-green/10 text-ninja-green text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors"
                    >
                      Browse Courses
                    </button>
                  </div>
                )}
              </div>

              {/* Calendar */}
              <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-monument text-ninja-white text-lg">Calendar</h2>
                </div>
                <Calendar events={events} />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-monument text-ninja-white text-lg">Recent Activity</h2>
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
                      {activity.type === 'assignment' && <FiCalendar className="text-ninja-green" />}
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
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 