import React, { useState, useEffect } from 'react';
import { FiBook, FiBell, FiSearch, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

import { dashboardService } from '../../services/dashboardService';
import { Course, Activity, DashboardStats, CalendarEvent } from '../../types/dashboard';
import { getStudentProfile, getEnrolledCourses } from '../../services/studentService';
import { StudentData } from '../../services/studentService';
import { CourseData } from '../../services/courseService';

const StudentDashboard: React.FC = () => {
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
      
      // Fetch student data and enrolled courses first
      const [studentData, enrolledCoursesData] = await Promise.all([
        getStudentProfile(),
        getEnrolledCourses()
      ]);

      setStudentProfile(studentData);
      setEnrolledCourses(enrolledCoursesData);

      // Try to fetch activities and events, but don't block if they fail
      try {
        const [activitiesData, eventsData] = await Promise.all([
          dashboardService.getActivities(),
          dashboardService.getEvents(),
        ]);

        setActivities(activitiesData);
        setEvents(eventsData);
        setNotifications(activitiesData.slice(0, 3));
      } catch (error) {
        console.error('Error fetching additional dashboard data:', error);
        // Don't show error toast for these as they're not critical
        setActivities([]);
        setEvents([]);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to load dashboard data. Please try again later.');
      }
      // Set empty data on error
      setStudentProfile(null);
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      const filteredCourses = courses.filter(course => 
        course.title?.toLowerCase().includes(searchLower) ||
        course.grade?.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower)
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
        const [hours, minutes] = course.time?.split(':') || ['0', '0'];
        courseTime.setHours(parseInt(hours), parseInt(minutes));
        
        const timeUntilClass = courseTime.getTime() - new Date().getTime();
        if (timeUntilClass > 0) {
          setTimeout(() => {
            const notification: Activity = {
              id: `notification-${course.id}`,
              type: 'notification',
              title: `Upcoming Class: ${course.title || ''}`,
              description: `Your class starts in 30 minutes`,
              timestamp: new Date(),
              isNotification: true,
              read: false
            };
            setNotifications(prev => [notification, ...prev]);
          }, timeUntilClass - 30 * 60 * 1000);
        }
      });
    }
  };

  const handleContinueLearning = () => {
    if (enrolledCourses.length > 0) {
      const firstCourse = enrolledCourses[0];
      handleJoinClass(firstCourse._id || '', firstCourse.meetingLink || '#');
    } else {
      toast.info('No courses enrolled yet. Browse courses to get started!');
    }
  };

  const handleJoinClass = async (courseId: string, meetingLink: string) => {
    try {
      const button = document.querySelector(`button[data-course-id="${courseId}"]`);
      if (button) {
        button.textContent = 'Joining...';
        button.setAttribute('disabled', 'true');
      }

      if (!meetingLink || meetingLink === '#') {
        toast.error('Meeting link not available. Please contact your teacher.');
        return;
      }

      await dashboardService.joinClass(courseId);
      window.open(meetingLink, '_blank');

      const course = enrolledCourses.find(c => c._id === courseId);
      const newActivity: Activity = {
        id: `activity-${Date.now()}`,
        type: 'class',
        title: 'Class Joined',
        description: `You joined ${course?.title || 'class'}`,
        timestamp: new Date(),
        isNotification: false,
        read: true
      };
      setActivities(prev => [newActivity, ...prev]);
      toast.success('Successfully joined the class!');
    } catch (error) {
      console.error('Error joining class:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to join the class');
      }
    } finally {
      const button = document.querySelector(`button[data-course-id="${courseId}"]`);
      if (button) {
        button.textContent = 'Start Learning';
        button.removeAttribute('disabled');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FiLoader className="w-8 h-8 text-ninja-green animate-spin" />
        <span className="ml-2 text-ninja-white">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
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
            <Link
              to="/courses"
              className="text-sm text-ninja-purple hover:text-ninja-green transition-colors"
            >
              Browse More Courses
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <FiLoader className="w-8 h-8 text-ninja-green animate-spin" />
              <span className="ml-2 text-ninja-white">Loading courses...</span>
            </div>
          ) : enrolledCourses.length > 0 ? (
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
                      {course.teacher && (
                        <div className="text-xs text-ninja-white/40">
                          Instructor: {course.teacher.fullName}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    data-course-id={course._id}
                    onClick={() => handleJoinClass(course._id || '', course.meetingLink || '#')}
                    className="px-4 py-2 bg-ninja-green/10 text-ninja-green text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors"
                  >
                    Start Learning
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-ninja-white/60 py-8">
              <p className="mb-4">No courses enrolled yet.</p>
              <Link
                to="/courses"
                className="px-4 py-2 bg-ninja-green/10 text-ninja-green text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors inline-block"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-6">
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
                  <FiBook className="text-ninja-green" />
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
  );
};

export default StudentDashboard; 