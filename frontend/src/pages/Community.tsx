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
  description: string;
  category: string;
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
    description: '',
    category: 'React',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formState);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-ninja-black/95 p-6 rounded-xl w-full max-w-2xl mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="font-monument text-2xl mb-6">Ask a Question</h2>
        <form onSubmit={handleSubmit}>
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
              <label htmlFor="category" className="block text-sm mb-2">Category</label>
              <select
                id="category"
                name="category"
                value={formState.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50"
                required
              >
                {['React', 'Node.js', 'Python', 'JavaScript', 'DevOps', 'Career', 'Other'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm mb-2">Details</label>
              <textarea
                id="description"
                name="description"
                value={formState.description}
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
    description: '',
    category: 'React',
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
    if (!isLoaded) {
      return (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="backdrop-blur-xl bg-white/5 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-ninja-white/60">No questions found</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {posts.map((post) => (
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
                
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-ninja-green">
                    {post.category}
                  </span>
                  <span className="text-sm text-ninja-white/60">
                    {post.answers.length} answers
                  </span>
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
        ))}
      </div>
    );
  };

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
              placeholder="Search questions..."
              className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg focus:border-ninja-green/50 transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              🔍
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            <CustomDropdown
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'popular', label: 'Most Popular' },
                { value: 'unanswered', label: 'Unanswered' }
              ]}
              value={sortBy}
              onChange={setSortBy}
              className="w-40"
            />

            <CustomDropdown
              options={categories.map(cat => ({
                value: cat.toLowerCase(),
                label: cat
              }))}
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="w-40"
            />

            <CustomDropdown
              options={timeFilters}
              value={timeFilter}
              onChange={setTimeFilter}
              className="w-40"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTags(prev =>
                  prev.filter(t => t !== tag)
                )}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-ninja-green text-ninja-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <QuestionsList />

        {/* Post Form Modal */}
        {showPostForm && (
          <QuestionForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={isSubmitting}
          />
        )}
      </main>
    </div>
  );
};

export default Community; 