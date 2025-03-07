import axios from 'axios';
import { TeacherData } from './teacherService';
import { StudentData } from './studentService';

const API_URL = 'http://localhost:5000/api/connections';

// Get auth token from localStorage
const getToken = () => {
  const userType = localStorage.getItem('user_type');
  const token = localStorage.getItem(`${userType}_token`);
  return token ? `Bearer ${token}` : '';
};

// Get all teachers with connection status
export const getAllTeachers = async (): Promise<(TeacherData & { connectionStatus: string | null })[]> => {
  try {
    const response = await axios.get(`${API_URL}/teachers`, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch teachers');
    }
    throw new Error('Network error occurred');
  }
};

// Send connection request to a teacher
export const connectWithTeacher = async (teacherId: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/connect/${teacherId}`, {}, {
      headers: {
        Authorization: getToken()
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to send connection request');
    }
    throw new Error('Network error occurred');
  }
};

// Get connected teachers (accepted connections)
export const getConnectedTeachers = async (): Promise<TeacherData[]> => {
  try {
    const response = await axios.get(`${API_URL}/connected`, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch connected teachers');
    }
    throw new Error('Network error occurred');
  }
};

// Get pending connection requests (for teachers)
export interface ConnectionRequest {
  _id: string;
  student: StudentData;
  createdAt: string;
}

export const getPendingRequests = async (): Promise<ConnectionRequest[]> => {
  try {
    const response = await axios.get(`${API_URL}/requests`, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch connection requests');
    }
    throw new Error('Network error occurred');
  }
};

// Handle connection request (accept/reject)
export const handleConnectionRequest = async (connectionId: string, status: 'accepted' | 'rejected'): Promise<void> => {
  try {
    await axios.put(`${API_URL}/requests/${connectionId}`, { status }, {
      headers: {
        Authorization: getToken()
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to handle connection request');
    }
    throw new Error('Network error occurred');
  }
}; 