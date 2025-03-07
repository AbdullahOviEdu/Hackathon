import axios from 'axios';

const API_URL = 'http://localhost:5000/api/courses';

// Interface for Course
export interface CourseData {
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  grade: string;
  duration: string;
  teacher?: any;
  createdAt?: Date;
  meetingLink?: string;
  time?: string;
  day?: string;
  students?: number;
  class?: string;
}

// Get auth token from localStorage
const getToken = () => {
  const token = localStorage.getItem('teacher_token');
  return token ? `Bearer ${token}` : '';
};

// Get student token from localStorage
const getStudentToken = () => {
  const token = localStorage.getItem('student_token');
  if (!token) {
    throw new Error('No authentication token found. Please sign in.');
  }
  return `Bearer ${token}`;
};

// Get all courses (public)
export const getAllCourses = async (): Promise<CourseData[]> => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format from server');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(error.response.data?.message || `Failed to fetch courses: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from server. Please check if the server is running.');
      }
    }
    // Something happened in setting up the request that triggered an Error
    throw new Error('Network error occurred while fetching courses');
  }
};

// Get a single course by ID (public)
export const getCourseById = async (id: string): Promise<CourseData> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch course');
    }
    throw new Error('Network error occurred');
  }
};

// Get teacher's courses (private)
export const getTeacherCourses = async (): Promise<CourseData[]> => {
  try {
    const response = await axios.get(`${API_URL}/teacher/courses`, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch your courses');
    }
    throw new Error('Network error occurred');
  }
};

// Create a new course (private - teacher only)
export const createCourse = async (courseData: CourseData): Promise<CourseData> => {
  try {
    const response = await axios.post(API_URL, courseData, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to create course');
    }
    throw new Error('Network error occurred');
  }
};

// Update a course (private - teacher only)
export const updateCourse = async (id: string, courseData: Partial<CourseData>): Promise<CourseData> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, courseData, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update course');
    }
    throw new Error('Network error occurred');
  }
};

// Delete a course (private - teacher only)
export const deleteCourse = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: getToken()
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to delete course');
    }
    throw new Error('Network error occurred');
  }
};

// Enroll in a course (private - student only)
export const enrollCourse = async (courseId: string): Promise<void> => {
  try {
    const token = getStudentToken();
    await axios.post(`${API_URL}/enroll`, { courseId }, {
      headers: {
        Authorization: token
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Please sign in to enroll in this course');
      }
      throw new Error(error.response?.data?.message || 'Failed to enroll in course');
    }
    throw new Error('Network error occurred');
  }
};

// Check if student is enrolled in a course
export const isEnrolled = async (courseId: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/enrollment/${courseId}`, {
      headers: {
        Authorization: getStudentToken()
      }
    });
    return response.data.isEnrolled;
  } catch (error) {
    return false;
  }
}; 