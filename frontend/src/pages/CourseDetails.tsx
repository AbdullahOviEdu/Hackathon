import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiClock, FiUsers, FiStar, FiBook, FiAward } from 'react-icons/fi';

interface Module {
  id: number;
  title: string;
  duration: string;
  lessons: {
    id: number;
    title: string;
    duration: string;
    isCompleted: boolean;
  }[];
}

const CourseDetails: React.FC = () => {
  const { id } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeModule, setActiveModule] = useState<number | null>(null);

  // Dummy course data
  const course = {
    id: parseInt(id || '1'),
    title: 'Complete Full Stack Development',
    description: 'Master full-stack development with this comprehensive course covering frontend, backend, and deployment.',
    category: 'Full Stack',
    level: 'Intermediate',
    duration: '12 weeks',
    rating: 4.9,
    students: '2.5k',
    image: '🚀',
    tags: ['React', 'Node.js', 'MongoDB'],
    instructor: {
      name: 'Alex Chen',
      role: 'Senior Full Stack Developer',
      experience: '10+ years',
      rating: 4.9,
      students: '15k+',
      courses: 12,
    },
    modules: [
      {
        id: 1,
        title: 'Introduction to Full Stack Development',
        duration: '2 weeks',
        lessons: [
          {
            id: 1,
            title: 'Understanding Full Stack Architecture',
            duration: '45 min',
            isCompleted: true,
          },
          {
            id: 2,
            title: 'Setting Up Your Development Environment',
            duration: '30 min',
            isCompleted: true,
          },
          {
            id: 3,
            title: 'Version Control with Git',
            duration: '60 min',
            isCompleted: false,
          },
        ],
      },
      {
        id: 2,
        title: 'Frontend Development with React',
        duration: '4 weeks',
        lessons: [
          {
            id: 4,
            title: 'React Fundamentals',
            duration: '90 min',
            isCompleted: false,
          },
          {
            id: 5,
            title: 'State Management with Redux',
            duration: '60 min',
            isCompleted: false,
          },
          {
            id: 6,
            title: 'Building Responsive UIs',
            duration: '75 min',
            isCompleted: false,
          },
        ],
      },
      {
        id: 3,
        title: 'Backend Development with Node.js',
        duration: '4 weeks',
        lessons: [
          {
            id: 7,
            title: 'Node.js Basics',
            duration: '60 min',
            isCompleted: false,
          },
          {
            id: 8,
            title: 'RESTful API Design',
            duration: '75 min',
            isCompleted: false,
          },
          {
            id: 9,
            title: 'Database Integration with MongoDB',
            duration: '90 min',
            isCompleted: false,
          },
        ],
      },
    ],
  };

  const toggleModule = (moduleId: number) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ninja-black via-ninja-black/95 to-ninja-black text-ninja-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_65%)] from-ninja-green/5" />
      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-16 md:pt-24">
        {/* Course Header */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-start gap-8">
            <div className="text-6xl">{course.image}</div>
            <div className="flex-1">
              <h1 className="font-monument text-4xl mb-4">{course.title}</h1>
              <p className="text-ninja-white/60 mb-6">{course.description}</p>
              <div className="flex flex-wrap gap-6 text-sm text-ninja-white/80">
                <div className="flex items-center gap-2">
                  <FiClock />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiStar className="text-ninja-green" />
                  <span>{course.rating} rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiBook />
                  <span>{course.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-3 gap-8 mt-12">
          {/* Left Column - Course Content */}
          <div className="col-span-2 space-y-6">
            <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-xl p-6">
              <h2 className="font-monument text-xl mb-6">Course Content</h2>
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.id} className="border border-ninja-white/10 rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-4 bg-ninja-green/5 hover:bg-ninja-green/10 transition-colors"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xl">📚</span>
                        <div className="text-left">
                          <h3 className="font-monument text-ninja-white">{module.title}</h3>
                          <p className="text-sm text-ninja-white/60">{module.duration}</p>
                        </div>
                      </div>
                      <span className="text-ninja-green">{activeModule === module.id ? '−' : '+'}</span>
                    </button>
                    {activeModule === module.id && (
                      <div className="border-t border-ninja-white/10">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-4 hover:bg-ninja-green/5 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                lesson.isCompleted
                                  ? 'bg-ninja-green border-ninja-green'
                                  : 'border-ninja-white/20'
                              }`}>
                                {lesson.isCompleted && '✓'}
                              </div>
                              <span className="text-ninja-white/80">{lesson.title}</span>
                            </div>
                            <span className="text-sm text-ninja-white/60">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Instructor & Actions */}
          <div className="space-y-6">
            {/* Course Actions */}
            <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-xl p-6">
              <button className="w-full py-3 bg-ninja-green text-ninja-black rounded-lg font-monument hover:bg-ninja-purple hover:text-ninja-white transition-colors mb-4">
                Start Learning
              </button>
              <div className="text-center text-sm text-ninja-white/60">
                30-Day Money-Back Guarantee
              </div>
            </div>

            {/* Instructor Info */}
            <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-xl p-6">
              <h2 className="font-monument text-xl mb-4">Instructor</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-ninja-green/20 border border-ninja-green/30 flex items-center justify-center text-2xl">
                  {course.instructor.name[0]}
                </div>
                <div>
                  <h3 className="font-monument text-ninja-white">{course.instructor.name}</h3>
                  <p className="text-sm text-ninja-white/60">{course.instructor.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-ninja-green/5 rounded-lg">
                  <div className="text-xl font-monument text-ninja-green">{course.instructor.rating}</div>
                  <div className="text-sm text-ninja-white/60">Instructor Rating</div>
                </div>
                <div className="p-3 bg-ninja-green/5 rounded-lg">
                  <div className="text-xl font-monument text-ninja-green">{course.instructor.students}</div>
                  <div className="text-sm text-ninja-white/60">Students</div>
                </div>
                <div className="p-3 bg-ninja-green/5 rounded-lg">
                  <div className="text-xl font-monument text-ninja-green">{course.instructor.courses}</div>
                  <div className="text-sm text-ninja-white/60">Courses</div>
                </div>
                <div className="p-3 bg-ninja-green/5 rounded-lg">
                  <div className="text-xl font-monument text-ninja-green">{course.instructor.experience}</div>
                  <div className="text-sm text-ninja-white/60">Experience</div>
                </div>
              </div>
            </div>

            {/* Course Certificate */}
            <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <FiAward className="w-8 h-8 text-ninja-green" />
                <div>
                  <h3 className="font-monument text-ninja-white">Course Certificate</h3>
                  <p className="text-sm text-ninja-white/60">Complete the course to earn a certificate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetails; 