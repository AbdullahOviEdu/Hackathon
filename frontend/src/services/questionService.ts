import axios from 'axios';

const API_URL = 'http://localhost:5000/api/questions';

// Get auth token from localStorage
const getAuthToken = () => {
  const studentToken = localStorage.getItem('student_token');
  const teacherToken = localStorage.getItem('teacher_token');
  return studentToken || teacherToken;
};

// Configure axios with auth token
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the request');
    }
  }
);

// Get all questions with their answers
export const getQuestions = async () => {
  try {
    const response = await axiosInstance.get('/?include=answers');
    const questions = response.data.data || [];
    
    // Format the response to ensure answers are properly structured
    return questions.map((q: any) => ({
      ...q,
      answers: Array.isArray(q.answers) ? q.answers.map((a: any) => ({
        id: a._id || a.id,
        content: a.content,
        author: a.author?.fullName || a.author?.name || 'Anonymous',
        avatar: (a.author?.fullName || a.author?.name || 'A').charAt(0),
        votes: a.votes || 0,
        createdAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        isUserVoted: a.isUserVoted || null,
        isAccepted: !!a.isAccepted
      })) : []
    }));
  } catch (error) {
    console.error('Error in getQuestions:', error);
    throw error;
  }
};

// Get single question
export const getQuestion = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch question');
    }
    throw new Error('Network error occurred');
  }
};

// Create question
export const createQuestion = async (questionData: {
  title: string;
  content: string;
  tags?: string[];
}) => {
  try {
    // Validate required fields
    if (!questionData.title || !questionData.title.trim()) {
      throw new Error('Title is required');
    }
    if (!questionData.content || !questionData.content.trim()) {
      throw new Error('Content is required');
    }

    const response = await axiosInstance.post('/', {
      ...questionData,
      title: questionData.title.trim(),
      content: questionData.content.trim(),
      tags: questionData.tags || []
    });
    return response.data.data;
  } catch (error) {
    console.error('Error in createQuestion:', error);
    throw error;
  }
};

// Add answer to question
export const addAnswer = async (questionId: string, content: string) => {
  try {
    if (!content || !content.trim()) {
      throw new Error('Answer content is required');
    }

    const response = await axiosInstance.post(`/${questionId}/answers`, {
      content: content.trim()
    });

    // Return the formatted answer
    const answer = response.data.data;
    return {
      id: answer._id || answer.id,
      content: answer.content,
      author: answer.author?.fullName || answer.author?.name || 'Anonymous',
      avatar: (answer.author?.fullName || answer.author?.name || 'A').charAt(0),
      votes: answer.votes || 0,
      createdAt: answer.createdAt ? new Date(answer.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      isUserVoted: null,
      isAccepted: false
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to add answer');
    }
    throw new Error('Network error occurred');
  }
};

// Vote on question
export const voteQuestion = async (questionId: string, voteType: 'up' | 'down') => {
  try {
    const response = await axiosInstance.post(`/${questionId}/vote`, { voteType });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to vote on question');
    }
    throw new Error('Network error occurred');
  }
};

// Vote on answer
export const voteAnswer = async (questionId: string, answerId: string, voteType: 'up' | 'down') => {
  try {
    // Log the current vote attempt
    console.log('Attempting to vote:', {
      questionId,
      answerId,
      voteType
    });

    const response = await axiosInstance.post(`/${questionId}/answers/${answerId}/vote`, {
      voteType,
      timestamp: new Date().toISOString() // Add timestamp for vote tracking
    });
    
    // Log the server response
    console.log('Vote response from server:', response.data);

    const data = response.data.data || response.data;
    
    // Ensure we have valid vote data
    if (!data) {
      throw new Error('Invalid vote response from server');
    }

    // Return standardized vote response
    return {
      votes: typeof data.votes === 'number' ? data.votes : 0,
      isUserVoted: data.isUserVoted || voteType,
      message: data.message || 'Vote recorded successfully'
    };
  } catch (error) {
    // Log detailed error information
    if (axios.isAxiosError(error)) {
      console.error('Vote error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.response?.data?.message || error.message
      });

      // Handle specific error cases
      if (error.response?.status === 400) {
        throw new Error('You have already voted on this answer');
      } else if (error.response?.status === 401) {
        throw new Error('Please sign in to vote');
      } else if (error.response?.status === 404) {
        throw new Error('Answer not found');
      }
    }

    throw new Error('Failed to process vote. Please try again.');
  }
};

export const deleteAnswer = async (questionId: string, answerId: string) => {
  try {
    const response = await axiosInstance.delete(`/${questionId}/answers/${answerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 