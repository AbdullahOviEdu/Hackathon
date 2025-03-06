import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const Resources = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Resources');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sample resources data
  const resources = [
    {
      id: 1,
      title: 'Frontend Development Guide',
      type: 'Guide',
      category: 'Frontend',
      description: 'Comprehensive guide covering HTML, CSS, JavaScript, and modern frontend frameworks.',
      downloads: 2500,
      rating: 4.9,
      icon: '📚'
    },
    {
      id: 2,
      title: 'System Design Templates',
      type: 'Templates',
      category: 'Architecture',
      description: 'Collection of system design templates and best practices for scalable applications.',
      downloads: 1800,
      rating: 4.8,
      icon: '📐'
    },
    {
      id: 3,
      title: 'Data Structures Cheat Sheet',
      type: 'Cheat Sheet',
      category: 'Algorithms',
      description: 'Quick reference for common data structures and their implementations.',
      downloads: 3200,
      rating: 4.7,
      icon: '📝'
    },
    {
      id: 4,
      title: 'DevOps Tools Collection',
      type: 'Tools',
      category: 'DevOps',
      description: 'Curated list of essential DevOps tools and their use cases.',
      downloads: 1500,
      rating: 4.9,
      icon: '🛠️'
    }
  ];

  const categories = [
    { name: 'All Resources', icon: '📚', count: 450 },
    { name: 'Guides', icon: '📖', count: 120 },
    { name: 'Templates', icon: '📐', count: 85 },
    { name: 'Cheat Sheets', icon: '📝', count: 65 },
    { name: 'Tools', icon: '🛠️', count: 180 }
  ];

  const featuredResource = {
    title: 'Full Stack Development Roadmap 2024',
    description: 'A comprehensive roadmap to becoming a full stack developer in 2024. Includes technology recommendations, learning paths, and project ideas.',
    author: 'Tech Ninja Team',
    downloads: 5600,
    rating: 4.9
  };

  // Filter resources based on search query and active category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'All Resources' || 
                          resource.type === activeCategory.slice(0, -1); // Remove 's' from category name

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-ninja-black via-ninja-black/95 to-ninja-black text-ninja-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_65%)] from-ninja-green/5" />
      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-16 md:pt-24">
        {/* Header */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="font-monument text-4xl md:text-5xl mb-4">
            Learning <span className="text-ninja-green">Resources</span>
          </h1>
          <p className="text-ninja-white/60 max-w-2xl">
            Access our collection of curated resources to accelerate your learning journey. From guides to templates, we've got everything you need.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-8">
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white placeholder-white/40"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-ninja-white/40">
              🔍
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
          {/* Left Sidebar - Categories */}
          <div className="space-y-4">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`w-full flex items-center justify-between p-4 backdrop-blur-xl bg-white/5 rounded-xl transition-all duration-300 hover:bg-white/10 ${
                  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                } ${activeCategory === category.name ? 'border border-ninja-green/50 bg-white/10' : ''}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-monument text-sm">{category.name}</span>
                </div>
                <span className="text-sm text-ninja-white/60">{category.count}</span>
              </button>
            ))}
          </div>

          {/* Main Content - Resources */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Resource */}
            <div 
              className={`backdrop-blur-xl bg-white/5 rounded-xl p-8 border border-ninja-green/20 transition-all duration-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="flex items-center gap-2 text-ninja-green text-sm mb-4">
                <span>⭐</span>
                <span className="font-monument">FEATURED RESOURCE</span>
              </div>
              <h2 className="font-monument text-2xl mb-3">{featuredResource.title}</h2>
              <p className="text-ninja-white/60 mb-6">{featuredResource.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-ninja-white/60">
                  <span>By {featuredResource.author}</span>
                  <span>⬇️ {featuredResource.downloads}</span>
                  <span>⭐ {featuredResource.rating}</span>
                </div>
                <button className="px-6 py-2 bg-ninja-green text-ninja-black font-monument text-sm rounded-lg hover:scale-105 transition-all duration-300">
                  Download Now
                </button>
              </div>
            </div>

            {/* Resource Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredResources.map((resource, index) => (
                <div
                  key={resource.id}
                  className={`backdrop-blur-xl bg-white/5 rounded-xl p-6 transition-all duration-500 hover:bg-white/10 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onLoad={() => setIsLoaded(true)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{resource.icon}</div>
                    <div className="px-3 py-1 bg-white/5 rounded-full text-xs text-ninja-green">
                      {resource.type}
                    </div>
                  </div>
                  <h3 className="font-monument text-lg mb-2">{resource.title}</h3>
                  <p className="text-sm text-ninja-white/60 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4 text-sm text-ninja-white/60">
                      <span>⬇️ {resource.downloads}</span>
                      <span>⭐ {resource.rating}</span>
                    </div>
                    <button className="px-4 py-2 bg-ninja-green/20 text-ninja-green text-sm rounded-lg hover:bg-ninja-green/30 transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resources; 