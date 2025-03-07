import axios from 'axios';
import { CourseData } from './courseService';

const API_URL = 'http://localhost:5000/api/students';

// Interface for Student
export interface StudentData {
  _id?: string;
  fullName: string;
  email: string;
  grade: string;
  school: string;
  interests: string[];
  enrolledCourses?: CourseData[];
  createdAt?: Date;
}

// Get auth token from localStorage
const getToken = () => {
  const token = localStorage.getItem('student_token');
  return token ? `Bearer ${token}` : '';
};

// Get student profile
export const getStudentProfile = async (): Promise<StudentData> => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch profile');
    }
    throw new Error('Network error occurred');
  }
};

// Update student profile
export const updateStudentProfile = async (profileData: Partial<StudentData>): Promise<StudentData> => {
  try {
    const response = await axios.put(`${API_URL}/me`, profileData, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to update profile');
    }
    throw new Error('Network error occurred');
  }
};

// Get enrolled courses
export const getEnrolledCourses = async (): Promise<CourseData[]> => {
  try {
    const response = await axios.get(`${API_URL}/courses`, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch enrolled courses');
    }
    throw new Error('Network error occurred');
  }
};

// Enroll in a course
export const enrollCourse = async (courseId: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/courses/${courseId}/enroll`, {}, {
      headers: {
        Authorization: getToken()
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to enroll in course');
    }
    throw new Error('Network error occurred');
  }
};

// Unenroll from a course
export const unenrollCourse = async (courseId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/courses/${courseId}/enroll`, {
      headers: {
        Authorization: getToken()
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to unenroll from course');
    }
    throw new Error('Network error occurred');
  }
}; 