import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import * as questionService from '../services/questionService';

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
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

interface QuestionFormData {
  title: string;
  content: string;
  tags: string[];
}

interface QuestionFormProps {
  onSubmit: (data: QuestionFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const QuestionForm = ({ onSubmit, onCancel, isSubmitting }: QuestionFormProps) => {
  const [formState, setFormState] = useState<QuestionFormData>({
    title: '',
    content: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormState(prev => ({
      ...prev,
      tags
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-ninja-black/95 p-4 sm:p-6 rounded-xl w-full max-w-2xl mx-auto overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <h2 className="font-monument text-xl sm:text-2xl mb-4 sm:mb-6">Ask a Question</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          await onSubmit(formState);
        }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm mb-2">Title</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formState.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50"
                placeholder="What's your question?"
                required
                minLength={5}
                maxLength={200}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm mb-2">Details</label>
              <textarea
                id="content"
                name="content"
                value={formState.content}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 h-32 resize-none"
                placeholder="Provide more details about your question..."
                required
                minLength={20}
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm mb-2">Tags (optional)</label>
              <input
                id="tags"
                type="text"
                name="tags"
                value={tagInput}
                onChange={handleTagChange}
                placeholder="Add tags separated by commas (e.g., react, hooks, state)"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50"
              />
              <p className="text-xs text-white/40 mt-1">Separate tags with commas</p>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-white/60 hover:text-white"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-ninja-green text-ninja-black rounded-lg hover:bg-ninja-green/90 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Question'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Community = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [] as string[]
  });

  // Add refs for input fields
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'React', 'Node.js', 'Python', 'JavaScript', 'DevOps', 'Career'];
  const timeFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('student_token') || localStorage.getItem('teacher_token');
      setIsAuthenticated(!!token);
    };
    checkAuth();

    // Fetch questions
    const loadQuestions = async () => {
      try {
        setIsLoaded(false);
        const questions = await questionService.getQuestions();
        
        // Ensure questions is an array before mapping
        if (!Array.isArray(questions)) {
          console.error('Questions data is not an array:', questions);
          toast.error('Invalid data format received from server');
          setPosts([]);
          return;
        }

        const formattedQuestions = questions
          .map((q: any) => {
            try {
              if (!q || typeof q !== 'object') {
                console.error('Invalid question data:', q);
                return null;
              }

              const formatted: Post = {
                id: q._id || q.id || Math.random(), // Fallback for missing ID
                title: q.title || 'Untitled Question',
                content: q.description || q.content || '',
                author: q.author?.fullName || q.author?.name || 'Anonymous',
                avatar: (q.author?.fullName || q.author?.name || 'A').charAt(0),
                category: q.category || 'Other',
                votes: typeof q.votes === 'number' ? q.votes : 0,
                answers: Array.isArray(q.answers) ? q.answers.map((a: any) => ({
                  id: a._id || a.id || Math.random(),
                  content: a.content || '',
                  author: a.author?.fullName || a.author?.name || 'Anonymous',
                  avatar: (a.author?.fullName || a.author?.name || 'A').charAt(0),
                  votes: typeof a.votes === 'number' ? a.votes : 0,
                  createdAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
                  isUserVoted: null,
                  isAccepted: !!a.isAccepted
                })) : [],
                createdAt: q.createdAt ? new Date(q.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
                isUserVoted: null,
                tags: Array.isArray(q.tags) ? q.tags : [],
                views: typeof q.views === 'number' ? q.views : 0,
                isSaved: false
              };
              return formatted;
            } catch (err) {
              console.error('Error formatting question:', err);
              return null;
            }
          })
          .filter((q): q is Post => q !== null);

        setPosts(formattedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to fetch questions');
        setPosts([]); // Reset posts on error
      } finally {
        setIsLoaded(true);
      }
    };

    loadQuestions();
  }, [sortBy, selectedCategory, timeFilter]);

  const handleVote = async (postId: number, voteType: 'up' | 'down', isAnswer = false, answerId?: number) => {
    if (!isAuthenticated) {
      navigate('/signin/student');
      return;
    }

    try {
      await questionService.voteQuestion(postId.toString(), voteType);
      setSortBy(current => current);
    } catch (error) {
      toast.error('Failed to vote');
      console.error('Error voting:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setTagInput(value);
      const tags = value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      setFormData(currentData => ({
        ...currentData,
        tags
      }));
    } else {
      setFormData(currentData => ({
        ...currentData,
        [name]: value
      }));
    }
  };

  const handleFormSubmit = async (formData: QuestionFormData) => {
    if (!isAuthenticated) {
      navigate('/signin/student');
      return;
    }

    try {
      setIsSubmitting(true);
      await questionService.createQuestion(formData);
      toast.success('Question posted successfully!');
      setShowPostForm(false);
      setSortBy(current => current);
    } catch (error) {
      toast.error('Failed to post question');
      console.error('Error posting question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowPostForm(false);
  };

  const topMembers = [
    { name: 'Alex Chen', avatar: 'A', role: 'Full Stack Ninja', contributions: 156 },
    { name: 'Lisa Wang', avatar: 'L', role: 'Frontend Master', contributions: 142 },
    { name: 'David Kim', avatar: 'D', role: 'DevOps Expert', contributions: 128 }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'React Advanced Workshop',
      date: 'Mar 15, 2024',
      time: '10:00 AM PST',
      attendees: 128,
      speaker: 'Sarah Johnson',
      category: 'Workshop'
    },
    {
      id: 2,
      title: 'Tech Career AMA Session',
      date: 'Mar 18, 2024',
      time: '2:00 PM PST',
      attendees: 256,
      speaker: 'Mike Wilson',
      category: 'AMA'
    }
  ];

  const QuestionsList = () => {
    return (
      <div className="space-y-6">
        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-ninja-green/50 transition-all"
            />
          </div>
          <CustomDropdown
            options={timeFilters}
            value={timeFilter}
            onChange={setTimeFilter}
            className="w-full"
          />
          <CustomDropdown
            options={categories.map(cat => ({ value: cat.toLowerCase(), label: cat }))}
            value={selectedCategory}
            onChange={setSelectedCategory}
            className="w-full"
          />
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white/5 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-all cursor-pointer border border-white/10"
              onClick={() => navigate(`/question/${post.id}`)}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Vote and Stats Column */}
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-6 sm:w-20">
                  <div className="flex sm:flex-col items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(post.id, 'up');
                      }}
                      className={`p-1 rounded transition-colors ${
                        post.isUserVoted === 'up' ? 'text-ninja-green' : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      ▲
                    </button>
                    <span className="font-medium">{post.votes}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(post.id, 'down');
                      }}
                      className={`p-1 rounded transition-colors ${
                        post.isUserVoted === 'down' ? 'text-ninja-orange' : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      ▼
                    </button>
                  </div>
                  <div className="flex sm:flex-col items-center text-sm text-white/60">
                    <span className="hidden sm:block">{post.answers.length} answers</span>
                    <span className="hidden sm:block">{post.views} views</span>
                  </div>
                </div>

                {/* Content Column */}
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">{post.content}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/5 rounded text-xs text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{post.author}</span>
                    </div>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-ninja-black text-ninja-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-monument text-3xl sm:text-4xl mb-2">Community</h1>
            <p className="text-white/60">Ask questions, share knowledge, grow together</p>
          </div>
          <button
            onClick={() => setShowPostForm(true)}
            className="px-6 py-3 bg-ninja-green text-ninja-black font-monument text-sm rounded-lg hover:bg-ninja-green/90 transition-colors whitespace-nowrap"
          >
            Ask Question
          </button>
        </div>

        {/* Main Content */}
        <QuestionsList />
      </div>

      {/* Question Form Modal */}
      {showPostForm && (
        <QuestionForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default Community; 