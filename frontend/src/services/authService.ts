import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Teacher registration
export const registerTeacher = async (teacherData: {
  fullName: string;
  email: string;
  password: string;
  institution: string;
  subject: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/teacher/register`, teacherData);
    
    if (response.data.token) {
      localStorage.setItem('teacher_token', response.data.token);
      localStorage.setItem('user_type', 'teacher');
      localStorage.setItem('teacher_data', JSON.stringify(response.data.data));
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Network error occurred');
  }
};

// Teacher login
export const loginTeacher = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/teacher/login`, { email, password });
    
    if (response.data.token) {
      localStorage.setItem('teacher_token', response.data.token);
      localStorage.setItem('user_type', 'teacher');
      localStorage.setItem('teacher_data', JSON.stringify(response.data.data));
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error occurred');
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('teacher_token');
  localStorage.removeItem('user_type');
  localStorage.removeItem('teacher_data');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('teacher_token');
  return !!token;
};

// Get current user data
export const getCurrentUser = () => {
  const teacherData = localStorage.getItem('teacher_data');
  return teacherData ? JSON.parse(teacherData) : null;
}; 