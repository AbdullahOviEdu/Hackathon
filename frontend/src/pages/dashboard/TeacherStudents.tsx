import React, { useState, useEffect } from 'react';
import { FiSearch, FiMail, FiBarChart, FiUserPlus, FiLoader } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import { getAllStudents } from '../../services/teacherService';
import { StudentData } from '../../services/studentService';

const TeacherStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    student =>
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = () => {
    setShowAddModal(true);
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
  const calculatePerformance = (student: StudentData): number => {
    // This is just a mock calculation - in a real app, this would be based on actual performance data
    const nameLength = student.fullName.length;
    const gradeValue = student.grade.length;
    const interestsCount = student.interests.length;
    
    // Generate a random performance score between 70 and 100
    return Math.floor(70 + (nameLength + gradeValue + interestsCount) % 30);
  };

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
            <p className="text-sm text-ninja-white/60 mb-4">
              Students can register themselves through the signup page. This feature for manually adding students will be implemented soon.
            </p>
            <div className="flex justify-end gap-3 sm:gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-ninja-white/60 hover:text-ninja-white transition-colors"
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

export default TeacherStudents; 