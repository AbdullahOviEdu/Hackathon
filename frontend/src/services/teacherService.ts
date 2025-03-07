import axios from 'axios';
import { StudentData } from './studentService';

const API_URL = 'http://localhost:5000/api/teachers';

// Interface for Teacher
export interface TeacherData {
  _id?: string;
  fullName: string;
  email: string;
  institution: string;
  subject: string;
  createdAt?: Date;
}

// Get auth token from localStorage
const getToken = () => {
  const token = localStorage.getItem('teacher_token');
  return token ? `Bearer ${token}` : '';
};

// Get teacher profile
export const getTeacherProfile = async (): Promise<TeacherData> => {
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

// Update teacher profile
export const updateTeacherProfile = async (profileData: Partial<TeacherData>): Promise<TeacherData> => {
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

// Get all students
export const getAllStudents = async (): Promise<StudentData[]> => {
  try {
    const response = await axios.get(`${API_URL}/students`, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch students');
    }
    throw new Error('Network error occurred');
  }
}; 