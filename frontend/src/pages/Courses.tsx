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
      
      <div className="pt-16 sm:pt-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-monument text-ninja-white mb-2 sm:mb-4">
            Explore Courses
          </h1>
          <p className="text-sm sm:text-base text-ninja-white/60 max-w-2xl">
            Discover a wide range of courses taught by expert teachers. Find the perfect course to enhance your learning journey.
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-12">
          {/* Search Bar */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ninja-white/40 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-sm sm:text-base text-ninja-white placeholder-ninja-white/40"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex items-center gap-2 text-ninja-white/60 text-sm">
              <FiFilter className="w-4 h-4" />
              <span>Filter by Grade:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Elementary', 'Middle School', 'High School', 'College'].map(grade => (
                <button
                  key={grade}
                  onClick={() => handleGradeFilter(grade)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                    selectedGrade === grade
                      ? 'bg-ninja-purple text-ninja-white'
                      : 'bg-ninja-black/50 border border-ninja-white/10 text-ninja-white/60 hover:text-ninja-white hover:border-ninja-purple/50'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-ninja-green"></div>
            <span className="ml-3 text-sm sm:text-base text-ninja-white">Loading courses...</span>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-ninja-black/50 border border-ninja-white/10 rounded-lg p-4 sm:p-6 lg:p-8 text-center">
            <div className="text-sm sm:text-base text-ninja-white/60 mb-3 sm:mb-4">
              {searchQuery || selectedGrade ? 'No courses found matching your criteria.' : 'No courses available at the moment.'}
            </div>
            {(searchQuery || selectedGrade) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGrade('');
                }}
                className="w-full sm:w-auto px-4 py-2 bg-ninja-green/10 text-ninja-green text-xs sm:text-sm rounded-lg hover:bg-ninja-green hover:text-ninja-black transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {filteredCourses.map((course) => (
              <Link
                key={course._id}
                to={`/course/${course._id}`}
                className="group flex flex-col bg-ninja-black/50 border border-ninja-white/10 rounded-lg overflow-hidden hover:border-ninja-green/30 transition-colors"
              >
                {/* Course Image */}
                <div className="relative h-36 sm:h-40 lg:h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ninja-black/60 to-transparent" />
                </div>

                {/* Course Content */}
                <div className="flex flex-col flex-1 p-3 sm:p-4 lg:p-6">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base lg:text-lg font-monument text-ninja-white group-hover:text-ninja-green transition-colors line-clamp-2 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ninja-white/60 line-clamp-2 mb-3">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-ninja-white/60 mb-3">
                      <div className="flex items-center gap-1.5">
                        <FiUsers className="w-3.5 h-3.5" />
                        <span>{course.grade}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  {course.teacher && (
                    <div className="pt-3 border-t border-ninja-white/5">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-ninja-purple to-ninja-green flex items-center justify-center text-ninja-black font-bold text-xs">
                          {course.teacher.fullName ? course.teacher.fullName.charAt(0) : 'T'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs sm:text-sm text-ninja-white truncate">
                            {course.teacher.fullName || 'Teacher'}
                          </div>
                          <div className="text-xs text-ninja-white/40 truncate">
                            {course.teacher.institution || 'Institution'}
                          </div>
                        </div>
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