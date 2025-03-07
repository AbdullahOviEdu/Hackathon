import React, { useState, useEffect } from 'react';
import { FiBook, FiBell, FiSearch, FiLoader, FiAward } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

import { dashboardService } from '../../services/dashboardService';
import { Course, Activity, DashboardStats, CalendarEvent } from '../../types/dashboard';
import { getStudentProfile, getEnrolledCourses } from '../../services/studentService';
import { StudentData } from '../../services/studentService';
import { CourseData } from '../../services/courseService';

interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  subject: string;
}

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
  const [currentTrivia, setCurrentTrivia] = useState<TriviaQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [triviaLoading, setTriviaLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchDailyTrivia();
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

  const fetchDailyTrivia = async () => {
    setTriviaLoading(true);
    try {
      // This would normally come from your backend API
      // For now, we'll use sample questions based on common subjects
      const sampleQuestions: TriviaQuestion[] = [
        {
          id: '1',
          question: 'Which of these is a correct way to declare a variable in JavaScript?',
          options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'var: x = 5;'],
          correctAnswer: 'var x = 5;',
          subject: 'Programming'
        },
        {
          id: '2',
          question: 'What is the primary function of photosynthesis?',
          options: [
            'To produce oxygen only',
            'To convert light energy into chemical energy',
            'To break down glucose',
            'To absorb carbon dioxide only'
          ],
          correctAnswer: 'To convert light energy into chemical energy',
          subject: 'Science'
        },
        {
          id: '3',
          question: 'What is the quadratic formula?',
          options: [
            'x = -b ± √(b² - 4ac) / 2a',
            'x = -b + √(b² - 4ac)',
            'x = -b / 2a',
            'x = b² - 4ac'
          ],
          correctAnswer: 'x = -b ± √(b² - 4ac) / 2a',
          subject: 'Mathematics'
        }
      ];

      // Select a random question
      const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
      setCurrentTrivia(randomQuestion);
    } catch (error) {
      console.error('Error fetching trivia:', error);
      toast.error('Failed to load daily trivia');
    } finally {
      setTriviaLoading(false);
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

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
  };

  const handleNextTrivia = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    fetchDailyTrivia();
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
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-ninja-purple/20 to-ninja-green/20 rounded-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-monument text-ninja-white mb-2">
          Welcome back, {studentProfile?.fullName?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="text-sm sm:text-base text-ninja-white/60">Continue your learning journey today.</p>
        <button
          onClick={handleContinueLearning}
          className="mt-3 sm:mt-4 px-4 sm:px-6 py-2 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black font-monument text-sm rounded-lg hover:from-ninja-green hover:to-ninja-purple transition-all duration-500 w-full sm:w-auto"
        >
          Continue Learning
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="space-y-4 sm:space-y-6">
        {/* Top Row: Courses and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-3 sm:p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-6">
              <div className="flex items-center justify-between w-full sm:w-auto">
                <h2 className="font-monument text-ninja-white text-base sm:text-lg">Your Courses</h2>
                <Link
                  to="/courses"
                  className="text-xs sm:text-sm text-ninja-purple hover:text-ninja-green transition-colors sm:hidden"
                >
                  Browse More
                </Link>
              </div>
              <Link
                to="/courses"
                className="hidden sm:inline-block text-sm text-ninja-purple hover:text-ninja-green transition-colors"
              >
                Browse More Courses
              </Link>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <FiLoader className="w-6 h-6 sm:w-8 sm:h-8 text-ninja-green animate-spin" />
                <span className="ml-2 text-ninja-white text-sm sm:text-base">Loading courses...</span>
              </div>
            ) : enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
                {enrolledCourses.map((course) => (
                  <div
                    key={course._id}
                    className="flex flex-col bg-ninja-black/30 rounded-lg border border-ninja-white/5 hover:border-ninja-green/30 transition-colors overflow-hidden"
                  >
                    {/* Course Header */}
                    <div className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-ninja-purple/20 to-ninja-green/20 flex items-center justify-center flex-shrink-0">
                          <FiBook className="w-6 h-6 sm:w-7 sm:h-7 text-ninja-green" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-monument text-ninja-white text-sm sm:text-base truncate mb-1">
                            {course.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <div className="text-xs text-ninja-white/60">
                              {course.grade}
                            </div>
                            <div className="w-1 h-1 rounded-full bg-ninja-white/30" />
                            <div className="text-xs text-ninja-white/60">
                              {course.duration}
                            </div>
                          </div>
                          {course.teacher && (
                            <div className="text-xs text-ninja-white/40 mt-1 truncate">
                              Instructor: {course.teacher.fullName}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Course Actions */}
                    <div className="mt-auto border-t border-ninja-white/5 p-3 sm:p-4">
                      <button
                        data-course-id={course._id}
                        onClick={() => handleJoinClass(course._id || '', course.meetingLink || '#')}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black text-sm rounded-lg hover:from-ninja-green hover:to-ninja-purple transition-all duration-500 font-medium flex items-center justify-center gap-2"
                      >
                        <FiBook className="w-4 h-4" />
                        Start Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center bg-ninja-black/30 rounded-lg border border-ninja-white/5 p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-ninja-purple/20 to-ninja-green/20 flex items-center justify-center">
                  <FiBook className="w-8 h-8 text-ninja-green" />
                </div>
                <p className="text-sm sm:text-base text-ninja-white/60 mb-4">
                  You haven't enrolled in any courses yet.
                </p>
                <Link
                  to="/courses"
                  className="inline-block w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black text-sm rounded-lg hover:from-ninja-green hover:to-ninja-purple transition-all duration-500 font-medium"
                >
                  Browse Available Courses
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="font-monument text-ninja-white text-lg">Recent Activity</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start p-3 sm:p-4 bg-ninja-black/30 rounded-lg border border-ninja-white/5 hover:border-ninja-green/30 transition-colors"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-ninja-purple/20 to-ninja-green/20 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <FiBook className="w-4 h-4 sm:w-5 sm:h-5 text-ninja-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-monument text-ninja-white text-sm sm:text-base truncate">{activity.title}</div>
                    <div className="text-xs text-ninja-white/60 mb-1 line-clamp-2">{activity.description}</div>
                    <div className="text-xs text-ninja-white/40">
                      {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Trivia Section */}
        <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex items-center">
              <FiAward className="text-ninja-purple mr-2 text-lg sm:text-xl" />
              <h2 className="font-monument text-ninja-white text-base sm:text-lg">Daily Trivia Challenge</h2>
            </div>
            {showAnswer && (
              <button
                onClick={handleNextTrivia}
                className="w-full sm:w-auto px-4 py-2 bg-ninja-purple/10 text-ninja-purple text-sm rounded-lg hover:bg-ninja-purple hover:text-ninja-black transition-colors"
              >
                Next Question
              </button>
            )}
          </div>

          {triviaLoading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <FiLoader className="w-6 h-6 sm:w-8 sm:h-8 text-ninja-green animate-spin" />
              <span className="ml-2 text-ninja-white text-sm sm:text-base">Loading trivia...</span>
            </div>
          ) : currentTrivia ? (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-ninja-black/30 rounded-lg p-4 sm:p-6 border border-ninja-white/5">
                <div className="text-xs sm:text-sm text-ninja-purple mb-2">
                  Subject: {currentTrivia.subject}
                </div>
                <h3 className="text-ninja-white text-base sm:text-lg mb-4">
                  {currentTrivia.question}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {currentTrivia.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showAnswer}
                      className={`p-3 sm:p-4 rounded-lg text-left transition-all duration-300 ${
                        showAnswer
                          ? option === currentTrivia.correctAnswer
                            ? 'bg-ninja-green/20 text-ninja-green border-ninja-green'
                            : option === selectedAnswer
                            ? 'bg-red-500/20 text-red-500 border-red-500'
                            : 'bg-ninja-black/20 text-ninja-white/60 border-ninja-white/5'
                          : 'bg-ninja-black/20 text-ninja-white border border-ninja-white/5 hover:border-ninja-purple/50 hover:bg-ninja-purple/10'
                      } ${
                        selectedAnswer === option ? 'border-2' : 'border'
                      } text-sm sm:text-base`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {showAnswer && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg bg-ninja-black/20 border border-ninja-white/5">
                    <p className="text-sm sm:text-base text-ninja-white">
                      {selectedAnswer === currentTrivia.correctAnswer ? (
                        <span className="text-ninja-green">Correct! Well done!</span>
                      ) : (
                        <span className="text-red-500">
                          Incorrect. The correct answer is {currentTrivia.correctAnswer}.
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-ninja-white/60 py-6 sm:py-8 text-sm sm:text-base">
              No trivia questions available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 