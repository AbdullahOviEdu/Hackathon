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
}

// Get auth token from localStorage
const getToken = () => {
  const token = localStorage.getItem('teacher_token');
  return token ? `Bearer ${token}` : '';
};

// Get all courses (public)
export const getAllCourses = async (): Promise<CourseData[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch courses');
    }
    throw new Error('Network error occurred');
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