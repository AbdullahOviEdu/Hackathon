import React, { useState } from 'react';
import { FiSearch, FiMail, FiBarChart, FiUserPlus } from 'react-icons/fi';
import { Student } from '../../types/dashboard';

const TeacherStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock student data
  const students: Student[] = [
    {
      id: '1',
      name: 'John Doe',
      grade: 'Grade 12-A',
      performance: 92,
    },
    {
      id: '2',
      name: 'Sarah Smith',
      grade: 'Grade 12-B',
      performance: 88,
    },
    {
      id: '3',
      name: 'Michael Johnson',
      grade: 'Grade 12-A',
      performance: 95,
    },
    {
      id: '4',
      name: 'Emily Brown',
      grade: 'Grade 12-C',
      performance: 85,
    },
    {
      id: '5',
      name: 'David Wilson',
      grade: 'Grade 12-B',
      performance: 90,
    },
  ];

  const filteredStudents = students.filter(
    student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = () => {
    setShowAddModal(true);
  };

  const handleEmailStudent = (studentId: string) => {
    console.log('Email student:', studentId);
  };

  const handleViewPerformance = (studentId: string) => {
    console.log('View performance:', studentId);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-monument text-ninja-white mb-2">Students</h1>
          <p className="text-ninja-white/60">Manage and monitor your students</p>
        </div>
        <button
          onClick={handleAddStudent}
          className="px-4 py-2 bg-ninja-green text-ninja-black rounded-lg font-monument text-sm hover:bg-ninja-purple hover:text-ninja-white transition-colors flex items-center gap-2"
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
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white placeholder-ninja-white/40 focus:outline-none focus:border-ninja-green/50"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ninja-white/10">
              <th className="px-6 py-4 text-left text-sm font-monument text-ninja-white/60">Name</th>
              <th className="px-6 py-4 text-left text-sm font-monument text-ninja-white/60">Grade</th>
              <th className="px-6 py-4 text-left text-sm font-monument text-ninja-white/60">Performance</th>
              <th className="px-6 py-4 text-right text-sm font-monument text-ninja-white/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="border-b border-ninja-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ninja-green/20 flex items-center justify-center font-monument text-ninja-green">
                      {student.name.charAt(0)}
                    </div>
                    <span className="text-ninja-white">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-ninja-white/60">{student.grade}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-ninja-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ninja-green rounded-full"
                        style={{ width: `${student.performance}%` }}
                      />
                    </div>
                    <span className="text-ninja-white">{student.performance}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEmailStudent(student.id)}
                      className="p-2 hover:bg-ninja-green/10 rounded-lg text-ninja-white/80 hover:text-ninja-green transition-colors"
                    >
                      <FiMail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleViewPerformance(student.id)}
                      className="p-2 hover:bg-ninja-purple/10 rounded-lg text-ninja-white/80 hover:text-ninja-purple transition-colors"
                    >
                      <FiBarChart className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ninja-black/80 flex items-center justify-center p-4">
          <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-monument text-ninja-white mb-4">Add New Student</h2>
            {/* Add student form will go here */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-ninja-white/60 hover:text-ninja-white"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-ninja-green text-ninja-black rounded-lg font-monument text-sm hover:bg-ninja-purple hover:text-ninja-white transition-colors">
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudents; 