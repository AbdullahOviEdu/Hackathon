import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile'];

const Courses = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  // Sample courses data
  const courses = [
    {
      id: 1,
      title: 'Complete Full Stack Development',
      category: 'Full Stack',
      level: 'Intermediate',
      duration: '12 weeks',
      rating: 4.9,
      students: '2.5k',
      image: '🚀',
      tags: ['React', 'Node.js', 'MongoDB'],
      instructor: 'Alex Chen'
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      category: 'Frontend',
      level: 'Advanced',
      duration: '6 weeks',
      rating: 4.8,
      students: '1.8k',
      image: '⚛️',
      tags: ['React', 'TypeScript', 'Redux'],
      instructor: 'Sarah Johnson'
    },
    {
      id: 3,
      title: 'Node.js Microservices',
      category: 'Backend',
      level: 'Advanced',
      duration: '8 weeks',
      rating: 4.7,
      students: '1.2k',
      image: '🔧',
      tags: ['Node.js', 'Docker', 'Kubernetes'],
      instructor: 'Mike Wilson'
    },
    {
      id: 4,
      title: 'DevOps Engineering',
      category: 'DevOps',
      level: 'Intermediate',
      duration: '10 weeks',
      rating: 4.9,
      students: '950',
      image: '🛠️',
      tags: ['AWS', 'CI/CD', 'Docker'],
      instructor: 'Emma Davis'
    },
    {
      id: 5,
      title: 'React Native Mobile Apps',
      category: 'Mobile',
      level: 'Intermediate',
      duration: '8 weeks',
      rating: 4.8,
      students: '1.5k',
      image: '📱',
      tags: ['React Native', 'Mobile', 'APIs'],
      instructor: 'David Kim'
    },
    {
      id: 6,
      title: 'Frontend Development Mastery',
      category: 'Frontend',
      level: 'Beginner',
      duration: '10 weeks',
      rating: 4.9,
      students: '3.2k',
      image: '🎨',
      tags: ['HTML', 'CSS', 'JavaScript'],
      instructor: 'Lisa Chen'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-ninja-black via-ninja-black/95 to-ninja-black text-ninja-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_65%)] from-ninja-green/5" />
      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-16 md:pt-24">
        {/* Header */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="font-monument text-4xl md:text-5xl mb-4">
            Explore Our <span className="text-ninja-green">Courses</span>
          </h1>
          <p className="text-ninja-white/60 max-w-2xl">
            Level up your skills with our comprehensive courses. From frontend to backend, beginner to advanced, we've got you covered.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mt-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-monument text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-ninja-green text-ninja-black'
                  : 'bg-white/5 text-ninja-white/60 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {courses
            .filter(course => activeCategory === 'All' || course.category === activeCategory)
            .map((course, index) => (
              <Link
                to={`/course/${course.id}`}
                key={course.id}
                className={`group backdrop-blur-xl bg-white/5 rounded-xl p-6 transition-all duration-500 hover:bg-white/10 transform hover:scale-[1.02] ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onLoad={() => setIsLoaded(true)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{course.image}</div>
                  <div className="flex items-center gap-1 text-ninja-green">
                    <span>⭐</span>
                    <span className="font-monument">{course.rating}</span>
                  </div>
                </div>

                <h3 className="font-monument text-xl mb-2 group-hover:text-ninja-green transition-colors">
                  {course.title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-ninja-white/60 mb-4">
                  <span>{course.level}</span>
                  <span>•</span>
                  <span>{course.duration}</span>
                  <span>•</span>
                  <span>{course.students} students</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/5 rounded-md text-xs text-ninja-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ninja-green to-ninja-purple flex items-center justify-center text-sm">
                    {course.instructor[0]}
                  </div>
                  <span className="text-sm text-ninja-white/80">{course.instructor}</span>
                </div>
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
};

export default Courses; 