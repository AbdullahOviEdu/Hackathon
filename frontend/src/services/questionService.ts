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
  // Remove withCredentials as it's not needed for token-based auth
  timeout: 10000
});

// Request interceptor
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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if the response has the expected structure
    if (response.data && response.data.success && response.data.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('student_token');
      localStorage.removeItem('teacher_token');
    }
    return Promise.reject(error);
  }
);

// Get all questions
export const getQuestions = async () => {
  try {
    const response = await axiosInstance.get('/');
    // The response interceptor has already processed the data
    return response.data || [];
  } catch (error) {
    console.error('Error in getQuestions:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to fetch questions');
      } else if (error.request) {
        throw new Error('No response received from server');
      }
    }
    throw new Error('Network error occurred');
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
  description: string;
  category: string;
  tags?: string[];
}) => {
  try {
    const response = await axiosInstance.post('/', questionData);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create question');
    }
    throw new Error('Network error occurred');
  }
};

// Add answer to question
export const addAnswer = async (questionId: string, content: string) => {
  try {
    const response = await axiosInstance.post(`/${questionId}/answers`, { content });
    return response.data.data;
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