import React, { useState, useEffect, FormEvent, useCallback, useRef } from 'react';
import { FiSearch, FiMail, FiBarChart, FiUserPlus, FiLoader } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import { getAllStudents } from '../../services/teacherService';
import { StudentData } from '../../services/studentService';
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

interface TeacherStudentsProps {
  courses: ExtendedCourse[];
}

const TeacherStudents: React.FC<TeacherStudentsProps> = ({ courses }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    grade: '',
    school: ''
  });
  const [formErrors, setFormErrors] = useState({
    fullName: '',
    email: '',
    grade: '',
    school: ''
  });
  const formRef = useRef<HTMLFormElement>(null);

  // Get all unique students from all courses
  const allStudents = React.useMemo(() => {
    const studentsMap = new Map();
    courses.forEach(course => {
      course.enrolledStudents?.forEach(student => {
        if (!studentsMap.has(student._id)) {
          studentsMap.set(student._id, student);
        }
      });
    });
    return Array.from(studentsMap.values());
  }, [courses]);

  const filteredStudents = React.useMemo(() => 
    allStudents.filter(
      student =>
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.school.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [allStudents, searchQuery]
  );

  const handleAddStudent = () => {
    setShowAddModal(true);
    // Reset form data and errors when opening modal
    setFormData({
      fullName: '',
      email: '',
      grade: '',
      school: ''
    });
    setFormErrors({
      fullName: '',
      email: '',
      grade: '',
      school: ''
    });
  };

  const handleEmailStudent = (studentId: string) => {
    console.log('Email student:', studentId);
    // Implement email functionality here
    toast.info(`Email functionality for student ${studentId} will be implemented soon.`);
  };

  const handleViewPerformance = (studentId: string) => {
    console.log('View performance:', studentId);
    // Implement performance view functionality here
    toast.info(`Performance view for student ${studentId} will be implemented soon.`);
  };

  // Calculate a mock performance score based on student data
  const calculatePerformance = (student: {
    fullName: string;
    grade: string;
    school: string;
    _id?: string;
  }): number => {
    // This is just a mock calculation - in a real app, this would be based on actual performance data
    const nameLength = student.fullName.length;
    const gradeValue = student.grade.length;
    const schoolLength = student.school.length;
    
    // Generate a random performance score between 70 and 100
    return Math.floor(70 + (nameLength + gradeValue + schoolLength) % 30);
  };

  // Add event listeners to prevent form submission
  useEffect(() => {
    const form = formRef.current;
    if (form) {
      const handleFormSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
          e.preventDefault();
        }
      };

      form.addEventListener('submit', handleFormSubmit);
      form.addEventListener('keydown', handleKeyDown);

      return () => {
        form.removeEventListener('submit', handleFormSubmit);
        form.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  const validateForm = useCallback(() => {
    let isValid = true;
    const errors = {
      fullName: '',
      email: '',
      grade: '',
      school: ''
    };

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.grade.trim()) {
      errors.grade = 'Grade is required';
      isValid = false;
    }

    if (!formData.school.trim()) {
      errors.school = 'School is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  }, [formData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [formErrors]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      // Add your API call here to add the student
      // For now, we'll just show a success message
      toast.success('Student added successfully');
      setShowAddModal(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add student');
    } finally {
      setLoading(false);
    }
  }, [validateForm]);

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex items-center justify-center h-64">
        <FiLoader className="w-6 h-6 sm:w-8 sm:h-8 text-ninja-green animate-spin" />
        <span className="ml-2 text-ninja-white text-sm sm:text-base">Loading students...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-monument text-ninja-white mb-2">Students</h1>
          <p className="text-sm text-ninja-white/60">Manage and monitor your students</p>
        </div>
        <button
          onClick={handleAddStudent}
          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black rounded-lg font-monument text-sm hover:from-ninja-green hover:to-ninja-purple transition-all duration-500 flex items-center justify-center sm:justify-start gap-2"
        >
          <FiUserPlus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="relative max-w-md w-full">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ninja-white/40" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white placeholder-ninja-white/40 focus:outline-none focus:border-ninja-purple/50 text-sm"
          />
        </div>
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-4 sm:p-6 text-center">
          <div className="text-sm sm:text-base text-ninja-white/60 mb-3 sm:mb-4">
            {searchQuery ? 'No students found matching your search criteria.' : 'No students found in the database.'}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-ninja-green/10 text-ninja-green text-xs sm:text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ninja-white/10">
                  <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-monument text-ninja-white/60">Name</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-monument text-ninja-white/60">Grade</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-monument text-ninja-white/60">School</th>
                  <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-monument text-ninja-white/60">Performance</th>
                  <th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-monument text-ninja-white/60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const performance = calculatePerformance(student);
                  return (
                    <tr
                      key={student._id}
                      className="border-b border-ninja-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-ninja-purple/20 to-ninja-green/20 flex items-center justify-center font-monument text-ninja-white">
                            {student.fullName.charAt(0)}
                          </div>
                          <span className="text-sm text-ninja-white">{student.fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-ninja-white/60">{student.grade}</td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-ninja-white/60">{student.school}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-ninja-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                performance >= 90 ? 'bg-ninja-green' : 
                                performance >= 80 ? 'bg-green-500' : 
                                performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${performance}%` }}
                            />
                          </div>
                          <span className="text-sm text-ninja-white">{performance}%</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEmailStudent(student._id || '')}
                            className="p-2 hover:bg-ninja-green/10 rounded-lg text-ninja-white/80 hover:text-ninja-green transition-colors"
                            title="Email Student"
                          >
                            <FiMail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewPerformance(student._id || '')}
                            className="p-2 hover:bg-ninja-purple/10 rounded-lg text-ninja-white/80 hover:text-ninja-purple transition-colors"
                            title="View Performance"
                          >
                            <FiBarChart className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5 bg-ninja-white/5">
              {filteredStudents.map((student) => {
                const performance = calculatePerformance(student);
                return (
                  <div key={student._id} className="bg-ninja-black p-4">
                    {/* Student Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-ninja-purple/20 to-ninja-green/20 flex items-center justify-center font-monument text-ninja-white flex-shrink-0">
                          {student.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-ninja-white truncate">
                            {student.fullName}
                          </div>
                          <div className="text-xs text-ninja-white/60 mt-0.5">
                            {student.grade}
                          </div>
                          <div className="text-xs text-ninja-white/40 mt-0.5 truncate">
                            {student.school}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleEmailStudent(student._id || '')}
                          className="p-2 hover:bg-ninja-green/10 rounded-lg text-ninja-white/80 hover:text-ninja-green transition-colors"
                        >
                          <FiMail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewPerformance(student._id || '')}
                          className="p-2 hover:bg-ninja-purple/10 rounded-lg text-ninja-white/80 hover:text-ninja-purple transition-colors"
                        >
                          <FiBarChart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Performance Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-ninja-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            performance >= 90 ? 'bg-ninja-green' : 
                            performance >= 80 ? 'bg-green-500' : 
                            performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${performance}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-ninja-white min-w-[40px] text-right">
                        {performance}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ninja-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-4 sm:p-6 w-full max-w-md mx-3 sm:mx-auto">
            <h2 className="text-lg sm:text-xl font-monument text-ninja-white mb-3 sm:mb-4">Add New Student</h2>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate autoComplete="off">
              <div>
                <label htmlFor="fullName" className="block text-sm text-ninja-white/80 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-ninja-black/50 border ${
                    formErrors.fullName ? 'border-red-500' : 'border-ninja-white/10'
                  } rounded-lg text-ninja-white focus:outline-none focus:border-ninja-purple/50`}
                  placeholder="Enter student's full name"
                />
                {formErrors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-ninja-white/80 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-ninja-black/50 border ${
                    formErrors.email ? 'border-red-500' : 'border-ninja-white/10'
                  } rounded-lg text-ninja-white focus:outline-none focus:border-ninja-purple/50`}
                  placeholder="Enter student's email"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="grade" className="block text-sm text-ninja-white/80 mb-1">
                  Grade
                </label>
                <input
                  type="text"
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-ninja-black/50 border ${
                    formErrors.grade ? 'border-red-500' : 'border-ninja-white/10'
                  } rounded-lg text-ninja-white focus:outline-none focus:border-ninja-purple/50`}
                  placeholder="Enter student's grade"
                />
                {formErrors.grade && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.grade}</p>
                )}
              </div>

              <div>
                <label htmlFor="school" className="block text-sm text-ninja-white/80 mb-1">
                  School
                </label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-ninja-black/50 border ${
                    formErrors.school ? 'border-red-500' : 'border-ninja-white/10'
                  } rounded-lg text-ninja-white focus:outline-none focus:border-ninja-purple/50`}
                  placeholder="Enter student's school"
                />
                {formErrors.school && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.school}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 sm:gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-ninja-white/60 hover:text-ninja-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-ninja-green text-ninja-black rounded-lg font-monument text-sm hover:bg-ninja-purple hover:text-ninja-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudents; 