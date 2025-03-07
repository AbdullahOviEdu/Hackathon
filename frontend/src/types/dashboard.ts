export interface Course {
  id: string;
  name: string;
  class: string;
  time: string;
  meetingLink: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  performance: number;
}

export interface Activity {
  id: string;
  type: 'assignment' | 'attendance' | 'message' | 'grade' | 'class';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'submitted' | 'pending' | 'graded';
}

export interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  averagePerformance: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'class' | 'exam' | 'assignment' | 'meeting';
  details: string;
} 