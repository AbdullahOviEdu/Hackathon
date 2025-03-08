import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getTeacherCourses, deleteCourse, CourseData } from '../../services/courseService';
import AddCourse from './AddCourse';
import { Course } from '../../types/dashboard';

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

interface TeacherCoursesProps {
  courses: ExtendedCourse[];
}

const convertCourseDataToExtended = (courseData: CourseData): ExtendedCourse => ({
  id: courseData._id || '',
  name: courseData.title,
  title: courseData.title,
  class: courseData.class || '',
  grade: courseData.grade,
  time: courseData.time || '',
  meetingLink: courseData.meetingLink || '',
  description: courseData.description,
  thumbnail: courseData.thumbnail,
  duration: courseData.duration,
  teacher: courseData.teacher,
  enrolledStudents: courseData.enrolledStudents,
  day: courseData.day || '',
  students: courseData.students || 0
});

const TeacherCourses: React.FC<TeacherCoursesProps> = ({ courses: initialCourses }) => {
  const [courses, setCourses] = useState<ExtendedCourse[]>(initialCourses);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
    
    // Check if user is logged in
    const studentToken = localStorage.getItem('student_token');
    const teacherToken = localStorage.getItem('teacher_token');
    console.log("Authentication check on TeacherCourses mount:");
    console.log("Student token:", studentToken ? "exists" : "not found");
    console.log("Teacher token:", teacherToken ? "exists" : "not found");
    
    if (!studentToken && !teacherToken) {
      console.log("No token found, setting a test teacher token");
      localStorage.setItem('teacher_token', 'test_teacher_token');
      toast.info("Set test teacher token for development");
    }
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getTeacherCourses();
      setCourses(data.map(convertCourseDataToExtended));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = () => {
    console.log("Opening Add Course modal");
    setShowAddModal(true);
  };

  const handleCourseAdded = (newCourse: CourseData) => {
    console.log("Course added callback received", newCourse);
    setCourses(prev => [convertCourseDataToExtended(newCourse), ...prev]);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        setIsDeleting(courseId);
        await deleteCourse(courseId);
        setCourses(prev => prev.filter(course => course.id !== courseId));
        toast.success('Course deleted successfully');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to delete course');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-ninja-green font-monument text-sm sm:text-base">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-monument text-ninja-white">Your Courses</h1>
        <button
          onClick={handleAddCourse}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black font-monument text-sm rounded-lg hover:from-ninja-green hover:to-ninja-purple transition-all duration-500"
        >
          <FiPlus className="mr-2" />
          Add New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-6 sm:p-8 text-center">
          <div className="text-sm sm:text-base text-ninja-white/60 mb-4">You haven't created any courses yet.</div>
          <button
            onClick={handleAddCourse}
            className="px-4 py-2 bg-ninja-green/10 text-ninja-green text-xs sm:text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg overflow-hidden hover:border-ninja-green/30 transition-colors"
            >
              <div className="h-40 sm:h-48 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-monument text-ninja-white mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-xs sm:text-sm text-ninja-white/60 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-ninja-white/60 mb-4">
                  <div className="flex items-center">
                    <FiUsers className="mr-1" />
                    <span>{course.grade}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-1" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    className="px-3 py-2 bg-ninja-purple/10 text-ninja-purple rounded hover:bg-ninja-purple/20 transition-colors"
                    onClick={() => {/* Edit functionality will be added later */}}
                  >
                    <FiEdit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    className="px-3 py-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition-colors"
                    onClick={() => handleDeleteCourse(course.id)}
                    disabled={isDeleting === course.id}
                  >
                    {isDeleting === course.id ? (
                      <span className="block w-4 h-4 sm:w-5 sm:h-5">...</span>
                    ) : (
                      <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddCourse
          onClose={() => setShowAddModal(false)}
          onCourseAdded={handleCourseAdded}
        />
      )}
    </div>
  );
};

export default TeacherCourses; 