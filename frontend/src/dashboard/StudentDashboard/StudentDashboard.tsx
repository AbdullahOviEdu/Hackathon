import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiBook, FiBell, FiSearch, FiMessageCircle, FiSettings, FiLogOut } from 'react-icons/fi';
import Calendar from '../../components/Calendar';
import { dashboardService } from '../../services/dashboardService';
import { Course, Activity, DashboardStats, CalendarEvent } from '../../types/dashboard';
import { useNavigate } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [, setActivities] = useState<Activity[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [notifications, setNotifications] = useState<Activity[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [] = useState<string | null>(null);

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
      });1
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
    navigate('/');
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
            <span className="font-monument text-sm" onClick={handleLogout}>Logout</span>
          </div>
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
                  placeholder="Search in Your Dashboard"
                  className="w-full bg-ninja-black/50 border border-ninja-white/10 rounded-lg pl-10 pr-4 py-2 text-ninja-white placeholder-ninja-white/40 focus:outline-none focus:border-ninja-green/50"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 ml-4">
              <button 
                onClick={handleScheduleMeet}
                className="px-4 py-2 bg-ninja-green/10 text-ninja-green rounded-lg font-monument text-sm hover:bg-ninja-green hover:text-ninja-black transition-colors"
              >
                Join/Schedule Meet
              </button>
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className="p-2 rounded-full hover:bg-ninja-green/10 text-ninja-white/80 hover:text-ninja-white relative"
                >
                  <FiBell className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-ninja-purple rounded-full"></span>
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
                <div className="w-10 h-10 rounded-full bg-ninja-green/20 border border-ninja-green/30"></div>
                <span className="font-monument text-sm text-ninja-white">Nikols Helmet</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 grid grid-cols-12 gap-6">
          {/* Welcome Banner */}
          <div className="col-span-12 bg-gradient-to-r from-ninja-green/20 to-ninja-purple/20 rounded-lg p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-monument text-ninja-white mb-2">Good Morning!</h1>
                <p className="text-ninja-white/60">Sharpen Your Skills With Professional Online Course</p>
              </div>
              <button 
                onClick={handleContinueLearning}
                className="px-4 py-2 bg-ninja-green text-ninja-black rounded-lg font-monument text-sm hover:bg-ninja-purple hover:text-ninja-white transition-colors"
              >
                Continue Learning
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="col-span-8 space-y-6">
            {/* Upcoming Schedules */}
            <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-monument text-ninja-white">Upcoming Schedules</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-ninja-white/60">Before 30 Mins</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={alertEnabled}
                      onChange={(e) => handleAlertToggle(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-ninja-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-ninja-green after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ninja-green/20"></div>
                  </label>
                  <span className="text-sm text-ninja-white/60">Set Alerts</span>
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
                      className="px-4 py-2 bg-ninja-green text-ninja-black rounded-md font-monument text-sm hover:bg-ninja-purple hover:text-ninja-white transition-colors"
                    >
                      Start Learning
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* My Mentors */}
            <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-monument text-ninja-white">My Mentors</h2>
                <button className="text-sm text-ninja-white/60 hover:text-ninja-green">View More</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((mentor) => (
                  <div key={mentor} className="bg-ninja-green/5 rounded-lg p-4 border border-ninja-green/20">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-ninja-green/20 border border-ninja-green/30"></div>
                      <div>
                        <h4 className="font-monument text-ninja-white">Nikols Helmet</h4>
                        <p className="text-sm text-ninja-white/60">UI/UX Designer</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <span className="text-ninja-green">★</span>
                        <span className="text-sm text-ninja-white">4.9</span>
                      </div>
                      <button className="px-4 py-2 bg-ninja-green/10 text-ninja-green rounded-md font-monument text-sm hover:bg-ninja-green hover:text-ninja-black transition-colors">
                        Message
                      </button>
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
              <h2 className="text-xl font-monument mb-4 text-ninja-white">Calendar</h2>
              <Calendar events={events} />
            </div>

            {/* Upcoming Events */}
            <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-monument text-ninja-white">Upcoming Events</h2>
                <button className="text-sm text-ninja-white/60 hover:text-ninja-green">Add Event</button>
              </div>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center space-x-4 p-4 bg-ninja-green/5 rounded-lg border border-ninja-green/20">
                    <div className="w-12 h-12 bg-ninja-green/10 rounded-lg flex items-center justify-center">
                      <FiCalendar className="text-ninja-green" />
                    </div>
                    <div>
                      <h4 className="font-monument text-ninja-white">{event.title}</h4>
                      <p className="text-sm text-ninja-white/60">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Analytics */}
            <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
              <h2 className="text-xl font-monument mb-4 text-ninja-white">Your Daily Analytics</h2>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-ninja-green bg-ninja-green/10">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-ninja-green">
                      50%
                    </span>
                  </div>
                </div>
                <div className="flex h-2 mb-4 overflow-hidden rounded bg-ninja-green/10">
                  <div className="flex flex-col justify-center overflow-hidden bg-ninja-green" role="progressbar" style={{ width: "50%" }}></div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-ninja-green/10 rounded p-2">
                    <div className="text-xs text-ninja-white/60">Practice</div>
                    <div className="text-sm text-ninja-green font-monument">25%</div>
                  </div>
                  <div className="bg-ninja-purple/10 rounded p-2">
                    <div className="text-xs text-ninja-white/60">Questions</div>
                    <div className="text-sm text-ninja-purple font-monument">15%</div>
                  </div>
                  <div className="bg-ninja-green/10 rounded p-2">
                    <div className="text-xs text-ninja-white/60">Assignment</div>
                    <div className="text-sm text-ninja-green font-monument">35%</div>
                  </div>
                  <div className="bg-ninja-purple/10 rounded p-2">
                    <div className="text-xs text-ninja-white/60">Learning</div>
                    <div className="text-sm text-ninja-purple font-monument">25%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 