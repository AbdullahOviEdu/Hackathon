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
      <div className="p-8 flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 text-ninja-green animate-spin" />
        <span className="ml-2 text-ninja-white">Loading students...</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-monument text-ninja-white mb-2">Students</h1>
          <p className="text-ninja-white/60">Manage and monitor your students</p>
        </div>
        <button
          onClick={handleAddStudent}
          className="px-4 py-2 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black rounded-lg font-monument text-sm hover:from-ninja-green hover:to-ninja-purple transition-all duration-500 flex items-center gap-2"
        >
          <FiUserPlus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ninja-white/40" />
          <input
            type="text"
            placeholder="Search students by name, grade, or school..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white placeholder-ninja-white/40 focus:outline-none focus:border-ninja-purple/50"
          />
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-8 text-center">
          <div className="text-ninja-white/60 mb-4">
            {searchQuery ? 'No students found matching your search criteria.' : 'No students found in the database.'}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-ninja-green/10 text-ninja-green text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ninja-white/10">
                <th className="px-6 py-4 text-left text-sm font-monument text-ninja-white/60">Name</th>
                <th className="px-6 py-4 text-left text-sm font-monument text-ninja-white/60">Grade</th>
                <th className="px-6 py-4 text-left text-sm font-monument text-ninja-white/60">School</th>
                <th className="px-6 py-4 text-left text-sm font-monument text-ninja-white/60">Performance</th>
                <th className="px-6 py-4 text-right text-sm font-monument text-ninja-white/60">Actions</th>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-ninja-purple/20 to-ninja-green/20 flex items-center justify-center font-monument text-ninja-white">
                          {student.fullName.charAt(0)}
                        </div>
                        <span className="text-ninja-white">{student.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ninja-white/60">{student.grade}</td>
                    <td className="px-6 py-4 text-ninja-white/60">{student.school}</td>
                    <td className="px-6 py-4">
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
                        <span className="text-ninja-white">{performance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
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
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ninja-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-monument text-ninja-white mb-4">Add New Student</h2>
            <p className="text-ninja-white/60 mb-4">
              Students can register themselves through the signup page. This feature for manually adding students will be implemented soon.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-ninja-white/60 hover:text-ninja-white"
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