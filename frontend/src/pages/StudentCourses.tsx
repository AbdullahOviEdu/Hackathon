import React, { useState, useEffect } from 'react';
import { FiBook, FiLoader, FiClock, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getEnrolledCourses } from '../services/studentService';
import { CourseData } from '../services/courseService';

const StudentCourses: React.FC = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleJoinClass = (meetingLink: string) => {
    if (!meetingLink || meetingLink === '#') {
      toast.error('Meeting link not available. Please contact your teacher.');
      return;
    }
    window.open(meetingLink, '_blank');
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
                  onClick={() => handleJoinClass(course.meetingLink || '#')}
                  className="w-full mt-4 px-4 py-2 bg-ninja-green/10 text-ninja-green text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors flex items-center justify-center"
                >
                  <FiBook className="mr-2" />
                  Join Class
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
    </div>
  );
};

export default StudentCourses; 