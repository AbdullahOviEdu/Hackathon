import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  BookOpenIcon, 
  DocumentTextIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';

interface Resource {
  title: string;
  url: string;
  description?: string;
  type: 'documentation' | 'tutorial' | 'book' | 'video' | 'other';
}

interface ResourceCategory {
  name: string;
  resources: Resource[];
}

const resourcesData: ResourceCategory[] = [
  {
    name: "JavaScript",
    resources: [
      {
        title: "MDN Documentation",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        type: "documentation"
      },
      {
        title: "jQuery Documentation",
        url: "https://api.jquery.com/",
        type: "documentation"
      },
      {
        title: "NodeJS Documentation",
        url: "https://nodejs.org/en/docs/",
        type: "documentation"
      },
      {
        title: "Eloquent JavaScript",
        url: "http://eloquentjavascript.net/",
        type: "book"
      },
      {
        title: "You Don't Know JS",
        url: "https://github.com/getify/You-Dont-Know-JS",
        type: "book"
      }
    ]
  },
  {
    name: "Python",
    resources: [
      {
        title: "Python Official Tutorial",
        url: "https://docs.python.org/3/tutorial/",
        type: "documentation"
      },
      {
        title: "Automate the Boring Stuff with Python",
        url: "https://automatetheboringstuff.com/",
        type: "book"
      },
      {
        title: "Python for Non-Programmers",
        url: "https://wiki.python.org/moin/BeginnersGuide/NonProgrammers",
        type: "tutorial"
      },
      {
        title: "Socratica Python Tutorial",
        url: "https://www.youtube.com/playlist?list=PLi01XoE8jYohWFPpC17Z-wWhPOSuh8Er-",
        type: "video"
      }
    ]
  },
  {
    name: "Web Development",
    resources: [
      {
        title: "The Odin Project",
        url: "https://www.theodinproject.com/",
        type: "tutorial"
      },
      {
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org/",
        type: "documentation"
      }
    ]
  },
  {
    name: "Computer Science",
    resources: [
      {
        title: "CS Course from OSS University",
        url: "https://github.com/ossu/computer-science",
        type: "other"
      },
      {
        title: "Computer Science Resources",
        url: "https://github.com/the-akira/Computer-Science-Resources",
        type: "other"
      }
    ]
  }
];

const Resources: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userType = localStorage.getItem('user_type');
    const token = localStorage.getItem('student_token');

    if (!token || userType !== 'student') {
      toast.error('Please sign in as a student to access the resources section');
      navigate('/signin/student');
      return;
    }

    // Simulate data loading
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // In the future, you can replace this with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        setError('Failed to load resources');
        toast.error('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'documentation':
        return <DocumentTextIcon className="w-6 h-6" />;
      case 'tutorial':
        return <AcademicCapIcon className="w-6 h-6" />;
      case 'book':
        return <BookOpenIcon className="w-6 h-6" />;
      case 'video':
        return <CodeBracketIcon className="w-6 h-6" />;
      default:
        return <CommandLineIcon className="w-6 h-6" />;
    }
  };

  const filteredResources = resourcesData.filter(category => {
    if (selectedCategory && category.name !== selectedCategory) {
      return false;
    }
    
    if (searchTerm) {
      return (
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.resources.some(resource => 
          resource.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return true;
  });

  const handleDownload = (resource: Resource) => {
    window.open(resource.url, '_blank');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-ninja-black to-ninja-black/95 pt-24">
          <div className="flex flex-col justify-center items-center min-h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-ninja-green border-t-transparent mb-4"></div>
            <p className="text-white text-lg">Loading resources...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-ninja-black to-ninja-black/95 pt-24">
          <div className="flex flex-col justify-center items-center min-h-[80vh]">
            <p className="text-white text-xl mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-ninja-green text-white rounded-lg hover:bg-ninja-green/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-ninja-black to-ninja-black/95 pt-24 px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white font-monument mb-4">
              Programming Learning Resources
          </h1>
            <p className="text-lg text-white/60">
              Curated collection of the best programming resources
          </p>
        </div>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ninja-green"
            />
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-ninja-green"
            >
              <option value="">All Categories</option>
              {resourcesData.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(category => (
              <div key={category.name} className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">{category.name}</h2>
                {category.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-ninja-green/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="text-ninja-green mt-1">
                          {getIconForType(resource.type)}
              </div>
                        <div>
                          <h3 className="text-white font-medium">{resource.title}</h3>
                          <p className="text-white/60 text-sm mt-1">
                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          </p>
              </div>
            </div>
                      <button
                        onClick={() => handleDownload(resource)}
                        className="text-ninja-green hover:text-ninja-green/80 transition-colors"
                        title="Download/View Resource"
                      >
                        <ArrowDownTrayIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
                </div>
              ))}
            </div>

          {filteredResources.length === 0 && (
            <div className="text-center text-white/60 py-12">
              No resources found matching your search criteria.
          </div>
          )}
        </div>
    </div>
    </>
  );
};

export default Resources; 