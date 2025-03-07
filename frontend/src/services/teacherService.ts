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

// Get teacher token from localStorage
const getToken = () => {
  const token = localStorage.getItem('teacher_token');
  return token ? `Bearer ${token}` : '';
};

// Interface for Teacher Notification
export interface TeacherNotification {
  _id: string;
  type: 'enrollment' | 'message' | 'system';
  title: string;
  message: string;
  courseId?: string;
  studentId?: string;
  read: boolean;
  createdAt: Date;
}

// Get teacher notifications
export const getTeacherNotifications = async (): Promise<TeacherNotification[]> => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch notifications');
    }
    throw new Error('Network error occurred');
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
      headers: {
        Authorization: getToken()
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to mark notification as read');
    }
    throw new Error('Network error occurred');
  }
};

// Get teacher profile
export const getTeacherProfile = async (): Promise<TeacherData> => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
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