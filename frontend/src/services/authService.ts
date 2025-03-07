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

// Student registration
export const registerStudent = async (studentData: {
  fullName: string;
  email: string;
  password: string;
  grade: string;
  school: string;
  interests?: string[];
}) => {
  try {
    const response = await axios.post(`${API_URL}/student/register`, studentData);
    
    if (response.data.token) {
      localStorage.setItem('student_token', response.data.token);
      localStorage.setItem('user_type', 'student');
      localStorage.setItem('student_data', JSON.stringify(response.data.data));
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Registration failed');
    }
    throw new Error('Network error occurred');
  }
};

// Student login
export const loginStudent = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/student/login`, { email, password });
    
    if (response.data.token) {
      // Clear any existing tokens first
      localStorage.clear();
      
      // Set new tokens and user data
      localStorage.setItem('student_token', response.data.token);
      localStorage.setItem('user_type', 'student');
      localStorage.setItem('student_data', JSON.stringify(response.data.data));
      
      // Set default Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    } else {
      throw new Error('No token received from server');
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
  localStorage.removeItem('student_token');
  localStorage.removeItem('user_type');
  localStorage.removeItem('teacher_data');
  localStorage.removeItem('student_data');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const teacherToken = localStorage.getItem('teacher_token');
  const studentToken = localStorage.getItem('student_token');
  return !!(teacherToken || studentToken);
};

// Get current user data
export const getCurrentUser = () => {
  const userType = localStorage.getItem('user_type');
  
  if (userType === 'teacher') {
    const teacherData = localStorage.getItem('teacher_data');
    return teacherData ? JSON.parse(teacherData) : null;
  } else if (userType === 'student') {
    const studentData = localStorage.getItem('student_data');
    return studentData ? JSON.parse(studentData) : null;
  }
  
  return null;
};

// Get user type
export const getUserType = () => {
  return localStorage.getItem('user_type');
}; 