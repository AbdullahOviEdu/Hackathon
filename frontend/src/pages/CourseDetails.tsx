import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUsers, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getCourseById, CourseData } from '../services/courseService';
import { isAuthenticated } from '../services/authService';
import Navbar from '../components/Navbar';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const userAuthenticated = isAuthenticated();

  useEffect(() => {
    if (id) {
      fetchCourse(id);
    }
  }, [id]);

  const fetchCourse = async (courseId: string) => {
    try {
      setLoading(true);
      const data = await getCourseById(courseId);
      setCourse(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ninja-black flex items-center justify-center">
        <Navbar />
        <div className="text-ninja-green font-monument">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-ninja-black">
        <Navbar />
        <div className="pt-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-8 text-center">
            <div className="text-ninja-white/60 mb-4">Course not found.</div>
            <Link
              to="/courses"
              className="px-4 py-2 bg-ninja-green/10 text-ninja-green text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors inline-flex items-center"
            >
              <FiArrowLeft className="mr-2" />
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ninja-black">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <Link
          to="/courses"
          className="inline-flex items-center text-ninja-white/60 hover:text-ninja-white mb-8"
        >
          <FiArrowLeft className="mr-2" />
          Back to Courses
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg overflow-hidden">
              <div className="h-64 md:h-80 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8">
                <h1 className="text-3xl font-monument text-ninja-white mb-4">{course.title}</h1>
                
                <div className="flex flex-wrap gap-4 mb-6 text-sm text-ninja-white/60">
                  <div className="flex items-center">
                    <FiUsers className="mr-2" />
                    <span>{course.grade}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-2" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" />
                    <span>Created {new Date(course.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-monument text-ninja-white mb-4">About this course</h2>
                  <p className="text-ninja-white/80 whitespace-pre-line">{course.description}</p>
                </div>
                
                {course.teacher && (
                  <div className="border-t border-ninja-white/10 pt-6">
                    <h2 className="text-xl font-monument text-ninja-white mb-4">Instructor</h2>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-ninja-purple to-ninja-green flex items-center justify-center text-ninja-black font-bold text-lg mr-4">
                        {course.teacher.fullName ? course.teacher.fullName.charAt(0) : 'T'}
                      </div>
                      <div>
                        <div className="text-ninja-white font-medium">{course.teacher.fullName || 'Teacher'}</div>
                        <div className="text-ninja-white/60">{course.teacher.institution || 'Institution'}</div>
                        <div className="text-ninja-white/60">{course.teacher.subject || 'Subject'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-6 sticky top-28">
              <h2 className="text-xl font-monument text-ninja-white mb-4">Enroll in this course</h2>
              
              {userAuthenticated ? (
                <button className="w-full py-3 px-4 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black font-monument rounded-lg hover:from-ninja-green hover:to-ninja-purple transition-all duration-500">
                  Enroll Now
                </button>
              ) : (
                <div>
                  <div className="text-ninja-white/60 mb-4">Sign in to enroll in this course</div>
                  <Link
                    to="/signin/student"
                    className="w-full py-3 px-4 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black font-monument rounded-lg hover:from-ninja-green hover:to-ninja-purple transition-all duration-500 block text-center mb-4"
                  >
                    Sign In
                  </Link>
                  <div className="text-center text-ninja-white/60">
                    <span>Don't have an account? </span>
                    <Link to="/signup/student" className="text-ninja-purple hover:text-ninja-green transition-colors">
                      Sign up here
                    </Link>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-ninja-white/10">
                <h3 className="font-monument text-ninja-white mb-4">What you'll learn</h3>
                <ul className="space-y-2 text-ninja-white/80">
                  <li className="flex items-start">
                    <span className="text-ninja-green mr-2">✓</span>
                    <span>Comprehensive understanding of the subject</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ninja-green mr-2">✓</span>
                    <span>Practical skills and knowledge</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ninja-green mr-2">✓</span>
                    <span>Expert guidance from experienced teachers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-ninja-green mr-2">✓</span>
                    <span>Interactive learning experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails; 