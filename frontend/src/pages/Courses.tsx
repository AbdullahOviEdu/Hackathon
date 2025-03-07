import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiClock, FiUsers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getAllCourses, CourseData } from '../services/courseService';
import Navbar from '../components/Navbar';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, selectedGrade, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getAllCourses();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from server');
      }
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('Error in fetchCourses:', error);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error('An unexpected error occurred while fetching courses');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by grade
    if (selectedGrade) {
      filtered = filtered.filter(course => course.grade === selectedGrade);
    }
    
    setFilteredCourses(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleGradeFilter = (grade: string) => {
    setSelectedGrade(grade === selectedGrade ? '' : grade);
  };

  return (
    <div className="min-h-screen bg-ninja-black">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-monument text-ninja-white mb-4">Explore Courses</h1>
          <p className="text-ninja-white/60 max-w-2xl">
            Discover a wide range of courses taught by expert teachers. Find the perfect course to enhance your learning journey.
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ninja-white/40" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/40"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 text-ninja-white/60 text-sm">
              <FiFilter />
              <span>Filter:</span>
            </div>
            {['Elementary', 'Middle School', 'High School', 'College'].map(grade => (
              <button
                key={grade}
                onClick={() => handleGradeFilter(grade)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  selectedGrade === grade
                    ? 'bg-ninja-purple text-ninja-white'
                    : 'bg-ninja-black/50 border border-ninja-white/10 text-ninja-white/60 hover:text-ninja-white'
                } transition-colors`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
        
        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ninja-green"></div>
            <div className="ml-3 text-ninja-white">Loading courses...</div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-8 text-center">
            <div className="text-ninja-white/60 mb-4">
              {searchQuery || selectedGrade ? 'No courses found matching your criteria.' : 'No courses available at the moment.'}
            </div>
            {(searchQuery || selectedGrade) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGrade('');
                }}
                className="px-4 py-2 bg-ninja-green/10 text-ninja-green text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Link
                key={course._id}
                to={`/course/${course._id}`}
                className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg overflow-hidden hover:border-ninja-green/30 transition-colors group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-monument text-ninja-white mb-2 group-hover:text-ninja-green transition-colors">{course.title}</h3>
                  <p className="text-ninja-white/60 text-sm mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-ninja-white/60">
                    <div className="flex items-center">
                      <FiUsers className="mr-1" />
                      <span>{course.grade}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  
                  {course.teacher && (
                    <div className="mt-4 pt-4 border-t border-ninja-white/5 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-ninja-purple to-ninja-green flex items-center justify-center text-ninja-black font-bold text-xs mr-3">
                        {course.teacher.fullName ? course.teacher.fullName.charAt(0) : 'T'}
                      </div>
                      <div>
                        <div className="text-ninja-white text-sm">{course.teacher.fullName || 'Teacher'}</div>
                        <div className="text-ninja-white/40 text-xs">{course.teacher.institution || 'Institution'}</div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses; 