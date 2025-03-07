import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CustomDropdown = ({ options, value, onChange, className = '' }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-ninja-green/50 transition-all hover:bg-white/10 flex items-center justify-between gap-2"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-xs opacity-60`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-ninja-black/95 border border-white/10 rounded-lg shadow-xl backdrop-blur-xl overflow-hidden animate-fadeIn">
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left transition-colors hover:bg-white/10 ${
                  option.value === value 
                    ? 'bg-white/5 text-ninja-green font-medium' 
                    : 'text-white/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  category: string;
  votes: number;
  answers: Answer[];
  createdAt: string;
  isUserVoted: 'up' | 'down' | null;
  tags: string[];
  views: number;
  isSaved: boolean;
}

interface Answer {
  id: number;
  content: string;
  author: string;
  avatar: string;
  votes: number;
  createdAt: string;
  isUserVoted: 'up' | 'down' | null;
  isAccepted: boolean;
}

const Community = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Sample data with more questions and answers
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: 'How to implement authentication in React?',
      content: 'I\'m building a React application and need help implementing user authentication. What\'s the best approach?',
      author: 'Sarah Johnson',
      avatar: 'S',
      category: 'React',
      votes: 42,
      tags: ['react', 'authentication', 'security'],
      views: 156,
      isSaved: false,
      answers: [
        {
          id: 1,
          content: 'I recommend using Firebase Authentication. It\'s easy to set up and provides many features out of the box.',
          author: 'Mike Wilson',
          avatar: 'M',
          votes: 15,
          createdAt: '2h ago',
          isUserVoted: null,
          isAccepted: true
        }
      ],
      createdAt: '4h ago',
      isUserVoted: null
    },
    {
      id: 2,
      title: 'Best practices for Node.js error handling',
      content: 'What are the recommended patterns for handling errors in a Node.js application? Should I use try-catch or error-first callbacks?',
      author: 'David Kim',
      avatar: 'D',
      category: 'Node.js',
      votes: 35,
      tags: ['node.js', 'error-handling', 'backend'],
      views: 203,
      isSaved: false,
      answers: [
        {
          id: 2,
          content: 'For modern Node.js applications, I recommend using async/await with try-catch blocks. It makes the code more readable and maintainable.',
          author: 'Alex Chen',
          avatar: 'A',
          votes: 22,
          createdAt: '1h ago',
          isUserVoted: null,
          isAccepted: true
        },
        {
          id: 3,
          content: 'Consider using a global error handler middleware for Express applications. This helps centralize error handling logic.',
          author: 'Emma Davis',
          avatar: 'E',
          votes: 18,
          createdAt: '30m ago',
          isUserVoted: null,
          isAccepted: false
        }
      ],
      createdAt: '6h ago',
      isUserVoted: null
    },
    {
      id: 3,
      title: 'Python vs JavaScript for Data Science',
      content: 'I\'m starting my journey in data science. Should I focus on Python or JavaScript? What are the pros and cons of each?',
      author: 'Lisa Wang',
      avatar: 'L',
      category: 'Python',
      votes: 28,
      tags: ['python', 'javascript', 'data-science'],
      views: 178,
      isSaved: false,
      answers: [
        {
          id: 4,
          content: 'Python is generally better for data science due to libraries like NumPy, Pandas, and scikit-learn. The ecosystem is more mature for data analysis.',
          author: 'Sarah Johnson',
          avatar: 'S',
          votes: 25,
          createdAt: '45m ago',
          isUserVoted: null,
          isAccepted: true
        }
      ],
      createdAt: '8h ago',
      isUserVoted: null
    },
    {
      id: 4,
      title: 'Understanding DevOps CI/CD Pipeline',
      content: 'Can someone explain the key components of a CI/CD pipeline? Looking for real-world examples and best practices.',
      author: 'Mike Wilson',
      avatar: 'M',
      category: 'DevOps',
      votes: 45,
      tags: ['devops', 'ci-cd', 'automation'],
      views: 245,
      isSaved: false,
      answers: [],
      createdAt: '3h ago',
      isUserVoted: null
    }
  ]);

  const categories = ['All', 'React', 'Node.js', 'Python', 'JavaScript', 'DevOps', 'Career'];

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  // Helper function to convert time string to hours for sorting
  const getHours = (timeStr: string) => {
    const match = timeStr.match(/(\d+)h/);
    return match ? parseInt(match[1]) : 0;
  };

  // Filter and sort posts based on current filters
  const filteredPosts = posts.filter(post => {
    // Search filter - case insensitive search across multiple fields
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchLower || 
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      post.category.toLowerCase().includes(searchLower);

    // Category filter
    const matchesCategory = selectedCategory === 'all' || 
      post.category.toLowerCase() === selectedCategory;

    // Tags filter - post must include all selected tags
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => post.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesTags;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        // Sort by votes first, then by number of answers
        return b.votes !== a.votes ? b.votes - a.votes : b.answers.length - a.answers.length;
      case 'unanswered':
        // Show posts with no answers first, then sort by newest
        if (a.answers.length === 0 && b.answers.length > 0) return -1;
        if (b.answers.length === 0 && a.answers.length > 0) return 1;
        return getHours(a.createdAt) - getHours(b.createdAt);
      case 'newest':
      default:
        // Sort by creation time
        return getHours(a.createdAt) - getHours(b.createdAt);
    }
  });

  const handleVote = (postId: number, voteType: 'up' | 'down', isAnswer = false, answerId?: number) => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (!isAnswer && post.id === postId) {
          const newVotes = post.isUserVoted === voteType 
            ? post.votes - (voteType === 'up' ? 1 : -1)
            : post.votes + (voteType === 'up' ? 1 : -1);
          
          return {
            ...post,
            votes: newVotes,
            isUserVoted: post.isUserVoted === voteType ? null : voteType
          };
        } else if (isAnswer && post.id === postId && answerId) {
          return {
            ...post,
            answers: post.answers.map(answer => {
              if (answer.id === answerId) {
                const newVotes = answer.isUserVoted === voteType 
                  ? answer.votes - (voteType === 'up' ? 1 : -1)
                  : answer.votes + (voteType === 'up' ? 1 : -1);
                
                return {
                  ...answer,
                  votes: newVotes,
                  isUserVoted: answer.isUserVoted === voteType ? null : voteType
                };
              }
              return answer;
            })
          };
        }
        return post;
      })
    );
  };

  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category.toLowerCase());
  };

  const PostForm = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-ninja-black/95 p-6 rounded-xl w-full max-w-2xl mx-4">
        <h2 className="font-monument text-2xl mb-6">Ask a Question</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          // Handle form submission
          setShowPostForm(false);
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg"
                placeholder="What's your question?"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Category</label>
              <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Details</label>
              <textarea
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg h-32"
                placeholder="Provide more details about your question..."
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowPostForm(false)}
                className="px-4 py-2 text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-ninja-green text-ninja-black rounded-lg hover:bg-ninja-green/90"
              >
                Post Question
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const QuestionsList = () => (
    <div className="space-y-6">
      {filteredPosts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-ninja-white/60 text-lg">No questions found matching your criteria</p>
          <p className="text-ninja-white/40 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        filteredPosts.map((post) => (
          <div
            key={post.id}
            className="backdrop-blur-xl bg-white/5 rounded-xl p-6 transition-all duration-500 hover:bg-white/10"
          >
            <div className="flex gap-4">
              {/* Voting */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleVote(post.id, 'up')}
                  className={`p-1 rounded ${post.isUserVoted === 'up' ? 'text-ninja-green' : 'text-white/60 hover:text-white'}`}
                >
                  ▲
                </button>
                <span className={`text-sm font-medium ${post.votes >= 0 ? 'text-ninja-green' : 'text-red-500'}`}>
                  {post.votes}
                </span>
                <button
                  onClick={() => handleVote(post.id, 'down')}
                  className={`p-1 rounded ${post.isUserVoted === 'down' ? 'text-red-500' : 'text-white/60 hover:text-white'}`}
                >
                  ▼
                </button>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ninja-green to-ninja-purple flex items-center justify-center text-xs">
                    {post.avatar}
                  </div>
                  <span className="text-sm text-ninja-white/80">{post.author}</span>
                  <span className="text-ninja-white/40">•</span>
                  <span className="text-sm text-ninja-white/60">{post.createdAt}</span>
                </div>
                
                <h3 className="font-monument text-lg mb-2">{post.title}</h3>
                <p className="text-ninja-white/80 mb-4">{post.content}</p>
                
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <button
                    onClick={() => handleCategoryClick(post.category)}
                    className="px-3 py-1 bg-white/5 rounded-full text-xs text-ninja-green hover:bg-white/10 transition-colors"
                  >
                    {post.category}
                  </button>
                  {post.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-ninja-green text-ninja-black'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-ninja-white/60">
                      {post.answers.length} answers
                    </span>
                    <span className="text-ninja-white/40">•</span>
                    <span className="text-sm text-ninja-white/60">
                      {post.views} views
                    </span>
                  </div>
                </div>

                {/* Answers */}
                <div className="mt-6 space-y-4">
                  {post.answers.map((answer) => (
                    <div key={answer.id} className="pl-8 border-l border-white/10">
                      <div className="flex gap-4">
                        {/* Answer Voting */}
                        <div className="flex flex-col items-center gap-2">
                          <button
                            onClick={() => handleVote(post.id, 'up', true, answer.id)}
                            className={`p-1 rounded ${answer.isUserVoted === 'up' ? 'text-ninja-green' : 'text-white/60 hover:text-white'}`}
                          >
                            ▲
                          </button>
                          <span className={`text-sm font-medium ${answer.votes >= 0 ? 'text-ninja-green' : 'text-red-500'}`}>
                            {answer.votes}
                          </span>
                          <button
                            onClick={() => handleVote(post.id, 'down', true, answer.id)}
                            className={`p-1 rounded ${answer.isUserVoted === 'down' ? 'text-red-500' : 'text-white/60 hover:text-white'}`}
                          >
                            ▼
                          </button>
                        </div>

                        {/* Answer Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-ninja-green to-ninja-purple flex items-center justify-center text-xs">
                              {answer.avatar}
                            </div>
                            <span className="text-sm text-ninja-white/80">{answer.author}</span>
                            <span className="text-ninja-white/40">•</span>
                            <span className="text-sm text-ninja-white/60">{answer.createdAt}</span>
                            {answer.isAccepted && (
                              <span className="text-ninja-green text-sm">✓ Accepted</span>
                            )}
                          </div>
                          <p className="text-ninja-white/80">{answer.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-ninja-black via-ninja-black/95 to-ninja-black text-ninja-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_65%)] from-ninja-green/5" />
      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-16 md:pt-24 pb-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-monument text-4xl mb-2">Community</h1>
            <p className="text-ninja-white/60">Ask questions, share knowledge, help others</p>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => setShowPostForm(true)}
              className="px-6 py-3 bg-ninja-green text-ninja-black font-monument text-sm rounded-lg hover:scale-105 transition-all duration-300"
            >
              Ask a Question
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by title, content, tags, or category..."
              className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg focus:border-ninja-green/50 transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
              >
                ×
              </button>
            )}
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                sortBy === 'newest'
                  ? 'bg-ninja-green text-ninja-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                sortBy === 'popular'
                  ? 'bg-ninja-green text-ninja-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Most Popular
            </button>
            <button
              onClick={() => setSortBy('unanswered')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                sortBy === 'unanswered'
                  ? 'bg-ninja-green text-ninja-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Unanswered ({posts.filter(p => p.answers.length === 0).length})
            </button>
          </div>

          {/* Active Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-white/60">Active filters:</span>
              {selectedTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                  className="px-3 py-1 rounded-full text-xs bg-ninja-green text-ninja-black hover:bg-ninja-green/90 transition-colors"
                >
                  #{tag} ×
                </button>
              ))}
              <button
                onClick={() => setSelectedTags([])}
                className="text-sm text-white/60 hover:text-white ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <QuestionsList />

        {/* Post Form Modal */}
        {showPostForm && <PostForm />}
      </main>
    </div>
  );
};

export default Community; 