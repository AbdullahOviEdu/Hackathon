import React, { useState, useEffect } from 'react';
import { FiBook, FiLoader, FiClock, FiCalendar, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getEnrolledCourses } from '../services/studentService';
import { CourseData } from '../services/courseService';

const StudentCourses: React.FC = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [showSlidesModal, setShowSlidesModal] = useState(false);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await getEnrolledCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to load your courses. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = (course: CourseData) => {
    // If the course has a meeting link and the user wants to join the live class
    if (course.meetingLink && course.meetingLink !== '#') {
      const joinLive = window.confirm('Would you like to join the live class? Click Cancel to view course slides instead.');
      if (joinLive) {
        window.open(course.meetingLink, '_blank');
        return;
      }
    }
    
    // Show the slides modal
    setSelectedCourse(course);
    setShowSlidesModal(true);
  };

  const closeModal = () => {
    setShowSlidesModal(false);
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ninja-black">
        <FiLoader className="w-8 h-8 text-ninja-green animate-spin" />
        <span className="ml-2 text-ninja-white">Loading your courses...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ninja-black p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-monument text-ninja-white mb-2">My Courses</h1>
        <p className="text-ninja-white/60">View and manage your enrolled courses</p>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg overflow-hidden hover:border-ninja-green/30 transition-colors"
            >
              {/* Course Image */}
              {course.thumbnail && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Course Info */}
              <div className="p-6">
                <h3 className="text-lg font-monument text-ninja-white mb-2">
                  {course.title}
                </h3>
                <p className="text-ninja-white/60 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Course Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-ninja-white/60 text-sm">
                    <FiClock className="mr-2" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-ninja-white/60 text-sm">
                    <FiCalendar className="mr-2" />
                    <span>{course.day || 'Flexible'}</span>
                  </div>
                </div>

                {/* Teacher Info */}
                {course.teacher && (
                  <div className="pt-4 border-t border-ninja-white/10">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-ninja-purple to-ninja-green flex items-center justify-center text-ninja-black font-bold text-xs">
                        {course.teacher.fullName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-ninja-white text-sm">
                          {course.teacher.fullName}
                        </div>
                        <div className="text-ninja-white/40 text-xs">
                          {course.teacher.institution}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleJoinClass(course)}
                  className="w-full mt-4 px-4 py-2 bg-ninja-green/10 text-ninja-green text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors flex items-center justify-center"
                >
                  <FiBook className="mr-2" />
                  Access Course
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-ninja-black/50 border border-ninja-white/10 rounded-lg">
          <FiBook className="w-12 h-12 text-ninja-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-monument text-ninja-white mb-2">
            No Courses Found
          </h3>
          <p className="text-ninja-white/60 mb-4">
            You haven't enrolled in any courses yet.
          </p>
          <a
            href="/courses"
            className="inline-block px-6 py-2 bg-ninja-green/10 text-ninja-green text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors"
          >
            Browse Available Courses
          </a>
        </div>
      )}

      {/* Course Slides Modal */}
      {showSlidesModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-ninja-black border border-ninja-white/10 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-ninja-white/10">
              <h2 className="text-xl font-monument text-ninja-white">{selectedCourse.title} - Course Content</h2>
              <button 
                onClick={closeModal}
                className="text-ninja-white/60 hover:text-ninja-white p-1"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              {selectedCourse.slides && selectedCourse.slides.length > 0 ? (
                <div className="space-y-8">
                  {selectedCourse.slides.map((slide, index) => (
                    <div key={index} className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg overflow-hidden">
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={slide.image}
                          alt={`Slide ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-monument text-ninja-white mb-4">
                          Part {index + 1}
                        </h3>
                        <div className="prose prose-invert max-w-none">
                          <p className="text-ninja-white/80 whitespace-pre-wrap">
                            {slide.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-ninja-white/60">No slides available for this course.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 sm:p-6 border-t border-ninja-white/10 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-ninja-green/10 text-ninja-green text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourses; 