import axios from 'axios';
import { Course, Activity, DashboardStats, CalendarEvent } from '../types/dashboard';

const API_URL = 'http://localhost:5000/api';

class DashboardService {
  private getAuthToken() {
    const userType = localStorage.getItem('user_type');
    const token = userType === 'student' 
      ? localStorage.getItem('student_token')
      : localStorage.getItem('teacher_token');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    return `Bearer ${token}`;
  }

  private getBaseUrl() {
    const userType = localStorage.getItem('user_type');
    return userType === 'student' ? `${API_URL}/students` : `${API_URL}/teachers`;
  }

  async getStats(): Promise<DashboardStats> {
    try {
      const response = await axios.get(`${this.getBaseUrl()}/stats`, {
        headers: {
          Authorization: this.getAuthToken()
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  async getCourses(): Promise<Course[]> {
    try {
      const userType = localStorage.getItem('user_type');
      const endpoint = userType === 'student' 
        ? `${API_URL}/courses/enrolled` 
        : `${API_URL}/courses/teacher/courses`;
      
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: this.getAuthToken()
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Could not find courses. Please check if you are logged in correctly.');
        }
        throw new Error(error.response?.data?.message || 'Failed to fetch courses');
      }
      throw new Error('Network error occurred');
    }
  }

  async getActivities(): Promise<Activity[]> {
    try {
      const response = await axios.get(`${this.getBaseUrl()}/activities`, {
        headers: {
          Authorization: this.getAuthToken()
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  }

  async getEvents(): Promise<CalendarEvent[]> {
    try {
      const response = await axios.get(`${this.getBaseUrl()}/events`, {
        headers: {
          Authorization: this.getAuthToken()
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async joinClass(courseId: string): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/courses/${courseId}/join`,
        {},
        {
          headers: {
            Authorization: this.getAuthToken()
          }
        }
      );
    } catch (error) {
      console.error('Error joining class:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService(); 