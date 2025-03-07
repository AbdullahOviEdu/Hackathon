import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiClock } from 'react-icons/fi';
import { dashboardService } from '../../services/dashboardService';
import { Course } from '../../types/dashboard';

const TeacherCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await dashboardService.getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleAddCourse = () => {
    setShowAddModal(true);
  };

  const handleEditCourse = (courseId: string) => {
    console.log('Edit course:', courseId);
  };

  const handleDeleteCourse = (courseId: string) => {
    console.log('Delete course:', courseId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-ninja-green font-monument">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-monument text-ninja-white mb-2">Your Courses</h1>
          <p className="text-ninja-white/60">Manage and organize your teaching courses</p>
        </div>
        <button
          onClick={handleAddCourse}
          className="px-4 py-2 bg-ninja-green text-ninja-black rounded-lg font-monument text-sm hover:bg-ninja-purple hover:text-ninja-white transition-colors flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add New Course
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6 hover:border-ninja-green/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl">{course.thumbnail || '📚'}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCourse(course.id)}
                  className="p-2 hover:bg-ninja-green/10 rounded-full text-ninja-white/80 hover:text-ninja-green transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="p-2 hover:bg-ninja-purple/10 rounded-full text-ninja-white/80 hover:text-ninja-purple transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-monument text-lg text-ninja-white mb-2">{course.name}</h3>
            <p className="text-sm text-ninja-white/60 mb-4">{course.description || 'No description available'}</p>

            <div className="flex items-center gap-4 text-sm text-ninja-white/80">
              <div className="flex items-center gap-1">
                <FiUsers className="w-4 h-4 text-ninja-green" />
                <span>{course.class}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock className="w-4 h-4 text-ninja-purple" />
                <span>{course.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ninja-black/80 flex items-center justify-center p-4">
          <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-monument text-ninja-white mb-4">Add New Course</h2>
            {/* Add course form will go here */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-ninja-white/60 hover:text-ninja-white"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-ninja-green text-ninja-black rounded-lg font-monument text-sm hover:bg-ninja-purple hover:text-ninja-white transition-colors">
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses; 