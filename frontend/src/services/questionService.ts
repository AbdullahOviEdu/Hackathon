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

// Get all questions
export const getQuestions = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data.data || [];
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