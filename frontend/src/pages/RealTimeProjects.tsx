import React, { useState, useEffect } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  status: 'Available' | 'In Progress' | 'Completed';
  roadmap: {
    phase: string;
    tasks: string[];
    resources?: string[];
  }[];
}

const RealTimeProjects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [showLearningGuide, setShowLearningGuide] = useState(false);
  const [showStarterOptions, setShowStarterOptions] = useState(false);

  const [projects] = useState<Project[]>([
    {
      id: 1,
      title: "E-commerce Dashboard",
      description: "Build a real-time dashboard for an e-commerce platform with sales analytics and inventory management.",
      techStack: ["React", "Node.js", "MongoDB", "WebSocket"],
      difficulty: "Intermediate",
      estimatedTime: "4-6 weeks",
      status: "Available",
      roadmap: [
        {
          phase: "Phase 1: Setup & Planning (Week 1)",
          tasks: [
            "Set up React project with TypeScript and necessary dependencies",
            "Create project structure and component hierarchy",
            "Design database schema for MongoDB",
            "Set up Node.js backend with Express"
          ],
          resources: [
            "React Documentation: https://reactjs.org",
            "MongoDB University: https://university.mongodb.com",
            "WebSocket Guide: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API"
          ]
        },
        {
          phase: "Phase 2: Backend Development (Week 2)",
          tasks: [
            "Implement user authentication",
            "Create RESTful APIs for product management",
            "Set up WebSocket server for real-time updates",
            "Implement database operations"
          ]
        },
        {
          phase: "Phase 3: Frontend Development (Weeks 3-4)",
          tasks: [
            "Build dashboard layout and navigation",
            "Implement real-time sales charts and graphs",
            "Create inventory management interface",
            "Add user management features"
          ]
        },
        {
          phase: "Phase 4: Testing & Deployment (Weeks 5-6)",
          tasks: [
            "Write unit tests for components",
            "Perform integration testing",
            "Optimize performance",
            "Deploy to production"
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Chat Application",
      description: "Create a real-time chat application with features like group chat, file sharing, and message history.",
      techStack: ["React", "Socket.io", "Express", "MongoDB"],
      difficulty: "Intermediate",
      estimatedTime: "3-4 weeks",
      status: "Available",
      roadmap: [
        {
          phase: "Phase 1: Project Setup & Planning (Week 1)",
          tasks: [
            "Set up React project with necessary dependencies",
            "Design the application architecture",
            "Plan database schema for messages and users",
            "Set up Express server with Socket.io"
          ],
          resources: [
            "Socket.io Documentation: https://socket.io/docs/v4/",
            "React Chat Tutorial: https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-socket-io-node",
            "MongoDB Schema Design: https://www.mongodb.com/docs/manual/core/data-modeling-introduction/"
          ]
        },
        {
          phase: "Phase 2: Backend Implementation (Week 1-2)",
          tasks: [
            "Implement user authentication system",
            "Create WebSocket event handlers",
            "Set up message storage and retrieval",
            "Implement file upload functionality",
            "Create group chat management system"
          ],
          resources: [
            "Express.js Security Practices: https://expressjs.com/en/advanced/best-practice-security.html",
            "File Upload with Multer: https://www.npmjs.com/package/multer"
          ]
        },
        {
          phase: "Phase 3: Frontend Development (Week 2-3)",
          tasks: [
            "Design and implement chat UI components",
            "Create real-time message handling",
            "Build user presence indicators",
            "Implement file sharing interface",
            "Add message history and search functionality"
          ],
          resources: [
            "React Components Best Practices: https://reactjs.org/docs/thinking-in-react.html",
            "CSS Flexbox Guide: https://css-tricks.com/snippets/css/a-guide-to-flexbox/"
          ]
        },
        {
          phase: "Phase 4: Testing & Deployment (Week 4)",
          tasks: [
            "Write unit tests for components",
            "Perform end-to-end testing",
            "Optimize performance",
            "Deploy application",
            "Monitor and fix issues"
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Task Management System",
      description: "Develop a collaborative task management system with real-time updates and team features.",
      techStack: ["React", "Redux", "Node.js", "PostgreSQL"],
      difficulty: "Advanced",
      estimatedTime: "5-7 weeks",
      status: "Available",
      roadmap: [
        {
          phase: "Phase 1: Project Setup & Architecture (Week 1)",
          tasks: [
            "Set up React project with Redux toolkit",
            "Design database schema for tasks and teams",
            "Plan API architecture",
            "Set up PostgreSQL database"
          ],
          resources: [
            "Redux Toolkit Guide: https://redux-toolkit.js.org/introduction/getting-started",
            "PostgreSQL Best Practices: https://www.postgresql.org/docs/current/performance-tips.html",
            "API Design Guidelines: https://github.com/microsoft/api-guidelines"
          ]
        },
        {
          phase: "Phase 2: Backend Development (Week 2-3)",
          tasks: [
            "Implement user authentication and authorization",
            "Create RESTful APIs for task management",
            "Set up real-time notification system",
            "Implement team management features",
            "Create task assignment and tracking system"
          ],
          resources: [
            "Node.js Security Checklist: https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html",
            "PostgreSQL Query Optimization: https://www.postgresql.org/docs/current/performance-tips.html"
          ]
        },
        {
          phase: "Phase 3: Frontend Implementation (Week 3-5)",
          tasks: [
            "Set up Redux store and slices",
            "Create task board and list views",
            "Implement drag-and-drop functionality",
            "Build team collaboration features",
            "Add task filtering and search",
            "Implement real-time updates"
          ],
          resources: [
            "React DnD Tutorial: https://react-dnd.github.io/react-dnd/about",
            "Redux Data Flow: https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow"
          ]
        },
        {
          phase: "Phase 4: Advanced Features (Week 5-6)",
          tasks: [
            "Implement task dependencies",
            "Add time tracking functionality",
            "Create reporting and analytics",
            "Build task templates system",
            "Implement data export features"
          ]
        },
        {
          phase: "Phase 5: Testing & Deployment (Week 6-7)",
          tasks: [
            "Write unit tests for Redux reducers",
            "Perform integration testing",
            "Conduct performance optimization",
            "Set up CI/CD pipeline",
            "Deploy and monitor application"
          ],
          resources: [
            "Redux Testing: https://redux.js.org/usage/writing-tests",
            "CI/CD Best Practices: https://docs.github.com/en/actions/automating-builds-and-tests"
          ]
        }
      ]
    },
    {
      id: 4,
      title: "Social Media Dashboard",
      description: "Build a comprehensive social media analytics dashboard with real-time data tracking and visualization.",
      techStack: ["React", "D3.js", "Node.js", "Firebase"],
      difficulty: "Intermediate",
      estimatedTime: "4-5 weeks",
      status: "Available",
      roadmap: [
        {
          phase: "Phase 1: Project Setup & Planning (Week 1)",
          tasks: [
            "Set up React project with Firebase integration",
            "Plan dashboard layout and features",
            "Design data visualization components",
            "Configure Firebase real-time database"
          ],
          resources: [
            "Firebase Docs: https://firebase.google.com/docs",
            "D3.js Tutorial: https://d3js.org/getting-started",
            "React Firebase Hooks: https://github.com/CSFrequency/react-firebase-hooks"
          ]
        },
        {
          phase: "Phase 2: Data Integration (Week 2)",
          tasks: [
            "Implement social media APIs integration",
            "Set up real-time data listeners",
            "Create data processing utilities",
            "Build data caching system"
          ],
          resources: [
            "Twitter API Docs: https://developer.twitter.com/en/docs",
            "Facebook Graph API: https://developers.facebook.com/docs/graph-api/"
          ]
        },
        {
          phase: "Phase 3: Visualization Development (Week 3)",
          tasks: [
            "Create interactive charts and graphs",
            "Implement real-time updates",
            "Build custom visualization components",
            "Add user interaction features"
          ]
        },
        {
          phase: "Phase 4: Features & Polish (Week 4-5)",
          tasks: [
            "Add export functionality",
            "Implement data filtering",
            "Create custom reports",
            "Add responsive design",
            "Optimize performance"
          ]
        }
      ]
    },
    {
      id: 5,
      title: "Real-time Collaboration Editor",
      description: "Create a collaborative code editor with real-time editing, syntax highlighting, and version control.",
      techStack: ["React", "Socket.io", "Monaco Editor", "Express"],
      difficulty: "Advanced",
      estimatedTime: "6-8 weeks",
      status: "Available",
      roadmap: [
        {
          phase: "Phase 1: Foundation Setup (Week 1-2)",
          tasks: [
            "Set up React with Monaco Editor",
            "Configure WebSocket server",
            "Implement basic editor functions",
            "Design collaboration protocol"
          ],
          resources: [
            "Monaco Editor Docs: https://microsoft.github.io/monaco-editor/",
            "Operational Transform Guide: https://operational-transformation.github.io/",
            "WebSocket Best Practices: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers"
          ]
        },
        {
          phase: "Phase 2: Real-time Features (Week 3-4)",
          tasks: [
            "Implement operational transformation",
            "Add cursor sharing",
            "Create presence indicators",
            "Build conflict resolution system"
          ]
        },
        {
          phase: "Phase 3: Advanced Features (Week 5-6)",
          tasks: [
            "Add version control integration",
            "Implement file system",
            "Create project management features",
            "Add code execution environment"
          ],
          resources: [
            "Git Implementation: https://git-scm.com/book/en/v2",
            "Docker SDK: https://docs.docker.com/engine/api/sdk/"
          ]
        },
        {
          phase: "Phase 4: Polish & Deploy (Week 7-8)",
          tasks: [
            "Optimize performance",
            "Add offline support",
            "Implement authentication",
            "Deploy and monitor"
          ]
        }
      ]
    },
    {
      id: 6,
      title: "AI-Powered Learning Platform",
      description: "Develop an intelligent learning platform with personalized content recommendations and progress tracking.",
      techStack: ["React", "TensorFlow.js", "Node.js", "MongoDB"],
      difficulty: "Advanced",
      estimatedTime: "8-10 weeks",
      status: "Available",
      roadmap: [
        {
          phase: "Phase 1: Platform Foundation (Week 1-2)",
          tasks: [
            "Set up React application structure",
            "Design learning content schema",
            "Implement user authentication",
            "Create content management system"
          ],
          resources: [
            "TensorFlow.js Docs: https://www.tensorflow.org/js",
            "Learning Analytics: https://www.learninganalytics.net/",
            "MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
          ]
        },
        {
          phase: "Phase 2: AI Integration (Week 3-4)",
          tasks: [
            "Implement recommendation system",
            "Create learning path generator",
            "Build progress prediction model",
            "Develop content analyzer"
          ],
          resources: [
            "ML Recommendation Systems: https://developers.google.com/machine-learning/recommendation",
            "Neural Networks Guide: https://www.deeplearning.ai/"
          ]
        },
        {
          phase: "Phase 3: Learning Features (Week 5-6)",
          tasks: [
            "Build interactive exercises",
            "Create assessment system",
            "Implement progress tracking",
            "Add gamification elements"
          ]
        },
        {
          phase: "Phase 4: Advanced Features (Week 7-8)",
          tasks: [
            "Add peer learning features",
            "Implement virtual tutoring",
            "Create adaptive learning paths",
            "Build analytics dashboard"
          ]
        },
        {
          phase: "Phase 5: Optimization (Week 9-10)",
          tasks: [
            "Optimize AI models",
            "Improve response times",
            "Add caching system",
            "Implement scalability features"
          ],
          resources: [
            "Performance Optimization: https://web.dev/performance-optimizing-content-efficiency/",
            "Scalability Patterns: https://www.patterns.dev/posts/architectural-patterns/"
          ]
        }
      ]
    }
  ]);

  const filteredProjects = projects.filter(project => 
    selectedDifficulty === 'All' || project.difficulty === selectedDifficulty
  );

  const handleStartProject = (project: Project) => {
    setSelectedProject(project);
    setShowRoadmap(true);
  };

  const handleStartLearning = () => {
    setShowRoadmap(false);
    setShowLearningGuide(true);
  };

  const getTechLearningPoints = (tech: string) => {
    const points = {
      'React': [
        'Component lifecycle and hooks',
        'State management patterns',
        'React Router for navigation',
        'Performance optimization'
      ],
      'Node.js': [
        'Express.js framework basics',
        'RESTful API design',
        'Middleware implementation',
        'Error handling patterns'
      ],
      'MongoDB': [
        'Schema design',
        'CRUD operations',
        'Indexing and optimization',
        'Aggregation pipeline'
      ],
      'Socket.io': [
        'Real-time event handling',
        'Room management',
        'Error handling',
        'Connection management'
      ],
      // Add more technologies as needed
    };
    return points[tech as keyof typeof points] || [
      'Core concepts and fundamentals',
      'Best practices and patterns',
      'Integration techniques',
      'Performance optimization'
    ];
  };

  const getTechResource = (tech: string) => {
    const resources = {
      'React': 'https://react.dev/learn',
      'Node.js': 'https://nodejs.org/en/learn',
      'MongoDB': 'https://university.mongodb.com/',
      'Socket.io': 'https://socket.io/get-started/',
      // Add more resource links
    };
    return resources[tech as keyof typeof resources] || '#';
  };

  const getProjectStarterRepo = (projectTitle: string) => {
    // Replace with actual starter repo URLs
    return `https://github.com/yourusername/${projectTitle.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const handleStarterCodeOption = (option: string, projectTitle: string) => {
    switch(option) {
      case 'download':
        window.open(getProjectStarterRepo(projectTitle), '_blank');
        break;
      case 'github':
        window.open(`https://github.com/new/import?url=${getProjectStarterRepo(projectTitle)}`, '_blank');
        break;
      case 'codespace':
        window.open(`https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=${projectTitle.toLowerCase().replace(/\s+/g, '-')}`, '_blank');
        break;
      case 'sandbox':
        window.open(`https://codesandbox.io/s/github/yourusername/${projectTitle.toLowerCase().replace(/\s+/g, '-')}`, '_blank');
        break;
    }
    setShowStarterOptions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showStarterOptions && !(event.target as Element).closest('.starter-options-container')) {
        setShowStarterOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStarterOptions]);

  console.log('RealTimeProjects component rendered', projects);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced Hero Section */}
      <div className="relative mb-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-ninja-green/10 via-transparent to-ninja-green/10 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-monument text-white mb-6">
            Real-time Projects
            <span className="block text-lg md:text-xl font-normal text-ninja-green mt-4">
              Build. Learn. Master.
            </span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Level up your development skills with hands-on experience building production-ready applications. 
            Choose your challenge and start coding today.
          </p>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                label: 'Available Projects',
                value: projects.length,
                icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
              },
              {
                label: 'Beginner Friendly',
                value: projects.filter(p => p.difficulty === 'Beginner').length,
                icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              },
              {
                label: 'Technologies',
                value: '15+',
                icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
              },
              {
                label: 'Success Rate',
                value: '92%',
                icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-ninja-black/80 to-ninja-black/60 rounded-2xl p-6 border border-ninja-white/10 hover:border-ninja-green/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-ninja-green/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-ninja-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2 group-hover:text-ninja-green transition-colors">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Filter Section */}
      <div className="mb-16">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-monument text-white mb-6">Choose Your Challenge Level</h2>
          <div className="flex flex-wrap gap-4 justify-center p-2 bg-ninja-black/50 rounded-full border border-ninja-white/10">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-8 py-3 rounded-full transition-all duration-300 ${
                  selectedDifficulty === difficulty
                    ? 'bg-ninja-green text-black font-semibold shadow-lg shadow-ninja-green/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div 
            key={project.id} 
            className="group relative bg-gradient-to-br from-ninja-black/95 to-ninja-black/80 border border-ninja-white/10 rounded-xl p-6 hover:border-ninja-green/50 transition-all duration-500 hover:shadow-xl hover:shadow-ninja-green/10 hover:-translate-y-1"
          >
            {/* Project Header */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                project.difficulty === 'Beginner' ? 'bg-green-400/20 text-green-400' :
                project.difficulty === 'Intermediate' ? 'bg-yellow-400/20 text-yellow-400' :
                'bg-red-400/20 text-red-400'
              }`}>
                {project.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full bg-ninja-green/20 text-ninja-green text-xs font-semibold">
                {project.status}
              </span>
            </div>

            {/* Project Title & Description */}
            <div className="mb-6">
              <h3 className="text-2xl font-monument text-white mb-3 group-hover:text-ninja-green transition-colors">
                {project.title}
              </h3>
              <p className="text-white/70 line-clamp-3 min-h-[4.5rem] group-hover:text-white/90 transition-colors">
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-ninja-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-ninja-green/10 text-ninja-green rounded-full text-sm border border-ninja-green/20 group-hover:bg-ninja-green/20 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Info */}
            <div className="flex items-center justify-between text-sm text-white/70 mb-6 bg-white/5 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-ninja-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{project.estimatedTime}</span>
              </div>
              <div className="h-4 w-px bg-white/20"></div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-ninja-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{project.roadmap.length} Phases</span>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={() => handleStartProject(project)}
              className="w-full py-4 px-6 bg-gradient-to-r from-ninja-green/20 to-ninja-green/30 text-ninja-green rounded-lg hover:from-ninja-green/30 hover:to-ninja-green/40 transition-all duration-300 flex items-center justify-center group/btn"
            >
              <span className="group-hover/btn:mr-4 transition-all">Start Project</span>
              <svg 
                className="w-5 h-5 opacity-0 group-hover/btn:opacity-100 transform translate-x-[-20px] group-hover/btn:translate-x-0 transition-all" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Enhanced Roadmap Modal */}
      {showRoadmap && selectedProject && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-ninja-black/95 to-ninja-black/90 border border-ninja-white/10 rounded-xl p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-monument text-white mb-2">{selectedProject.title}</h2>
                <p className="text-white/70">Project Roadmap & Resources</p>
              </div>
              <button 
                onClick={() => setShowRoadmap(false)}
                className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Roadmap Content */}
            <div className="space-y-8">
              {selectedProject.roadmap.map((phase, index) => (
                <div key={index} className="relative">
                  <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-ninja-green via-ninja-green/50 to-transparent"></div>
                  <div className="pl-8">
                    <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-ninja-green/20 border-2 border-ninja-green"></div>
                    <h3 className="text-xl font-monument text-white mb-4">{phase.phase}</h3>
                    <ul className="space-y-4">
                      {phase.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="text-white/70 flex items-start group">
                          <span className="w-2 h-2 bg-ninja-green rounded-full mt-2 mr-3 group-hover:scale-125 transition-transform"></span>
                          <span className="group-hover:text-white transition-colors">{task}</span>
                        </li>
                      ))}
                    </ul>
                    {phase.resources && (
                      <div className="mt-6 bg-white/5 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-white/90 mb-3">📚 Learning Resources</h4>
                        <ul className="space-y-2">
                          {phase.resources.map((resource, resourceIndex) => (
                            <li key={resourceIndex} className="text-ninja-green hover:text-ninja-green/80">
                              <a 
                                href={resource.split(': ')[1]} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center hover:underline"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                {resource.split(': ')[0]}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="mt-8 flex justify-end space-x-4 border-t border-white/10 pt-6">
              <button
                onClick={() => setShowRoadmap(false)}
                className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleStartLearning}
                className="px-8 py-3 bg-gradient-to-r from-ninja-green/20 to-ninja-green/30 text-ninja-green rounded-lg hover:from-ninja-green/30 hover:to-ninja-green/40 transition-all flex items-center"
              >
                <span>Start Learning</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {showLearningGuide && selectedProject && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-ninja-black/95 to-ninja-black/90 border border-ninja-white/10 rounded-xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Guide Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-monument text-white mb-2">Learning Guide: {selectedProject.title}</h2>
                <p className="text-white/70">Step-by-step guide to build your project</p>
              </div>
              <button 
                onClick={() => setShowLearningGuide(false)}
                className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Learning Content */}
            <div className="space-y-8">
              {/* Getting Started Section */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-monument text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-ninja-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Getting Started
                </h3>
                <div className="space-y-4 text-white/70">
                  <p>Before you begin working on {selectedProject.title}, make sure you have:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Node.js and npm installed on your computer</li>
                    <li>A code editor (VS Code recommended)</li>
                    <li>Basic understanding of React and JavaScript</li>
                    <li>Git installed for version control</li>
                  </ul>
                </div>
              </div>

              {/* Learning Path */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-monument text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-ninja-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Recommended Learning Path
                </h3>
                <div className="space-y-6">
                  {selectedProject.techStack.map((tech, index) => (
                    <div key={index} className="border-l-2 border-ninja-green/30 pl-4">
                      <h4 className="text-lg text-white mb-2">{tech}</h4>
                      <div className="space-y-2 text-white/70">
                        <p>Key concepts to master:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          {getTechLearningPoints(tech).map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                        <div className="mt-3">
                          <a 
                            href={getTechResource(tech)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-ninja-green hover:text-ninja-green/80 flex items-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Learn {tech}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Practices */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-monument text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-ninja-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Best Practices
                </h3>
                <ul className="space-y-3 text-white/70">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-ninja-green rounded-full mt-2 mr-3"></span>
                    Follow a modular architecture for better code organization
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-ninja-green rounded-full mt-2 mr-3"></span>
                    Write clean, documented code with proper comments
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-ninja-green rounded-full mt-2 mr-3"></span>
                    Implement error handling and input validation
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-ninja-green rounded-full mt-2 mr-3"></span>
                    Write tests for critical functionality
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-ninja-green rounded-full mt-2 mr-3"></span>
                    Use version control and make regular commits
                  </li>
                </ul>
              </div>

              {/* Support & Help */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-monument text-white mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-ninja-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Support & Resources
                </h3>
                <div className="space-y-4 text-white/70">
                  <p>If you need help during development:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-ninja-green rounded-full mr-3"></span>
                      Join our Discord community for real-time support
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-ninja-green rounded-full mr-3"></span>
                      Check the documentation for each technology
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-ninja-green rounded-full mr-3"></span>
                      Post questions on Stack Overflow with proper tags
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4 border-t border-white/10 pt-6">
              <button
                onClick={() => setShowLearningGuide(false)}
                className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Close Guide
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowStarterOptions(!showStarterOptions)}
                  className="px-8 py-3 bg-gradient-to-r from-ninja-green/20 to-ninja-green/30 text-ninja-green rounded-lg hover:from-ninja-green/30 hover:to-ninja-green/40 transition-all flex items-center"
                >
                  <span>Get Starter Code</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showStarterOptions && (
                  <div className="absolute right-0 mt-2 w-64 bg-ninja-black/95 border border-ninja-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                    {[
                      {
                        label: 'Download ZIP',
                        icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
                        option: 'download',
                        description: 'Download the starter code as a ZIP file'
                      },
                      {
                        label: 'Fork on GitHub',
                        icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
                        option: 'github',
                        description: 'Create a fork in your GitHub account'
                      },
                      {
                        label: 'Open in CodeSpaces',
                        icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
                        option: 'codespace',
                        description: 'Start coding in GitHub CodeSpaces'
                      },
                      {
                        label: 'Open in CodeSandbox',
                        icon: 'M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5',
                        option: 'sandbox',
                        description: 'Open project in CodeSandbox IDE'
                      }
                    ].map((item) => (
                      <button
                        key={item.option}
                        onClick={() => handleStarterCodeOption(item.option, selectedProject.title)}
                        className="w-full px-4 py-3 flex items-start hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-ninja-green/10 group-hover:bg-ninja-green/20 transition-colors">
                          <svg className="w-4 h-4 text-ninja-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                          </svg>
                        </div>
                        <div className="ml-3 text-left">
                          <p className="text-white font-medium">{item.label}</p>
                          <p className="text-white/50 text-sm">{item.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeProjects; 