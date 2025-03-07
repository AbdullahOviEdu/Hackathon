export interface Course {
  id: string;
  name: string;
  title: string;
  class: string;
  grade: string;
  time: string;
  meetingLink: string;
  description?: string;
  instructor?: string;
  thumbnail?: string;
  duration?: string;
  teacher?: {
    _id?: string;
    fullName: string;
    institution?: string;
    subject?: string;
  };
  enrolledStudents?: {
    _id: string;
    fullName: string;
    email: string;
    grade: string;
    school: string;
  }[];
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  performance: number;
}

export interface Activity {
  id: string;
  type: 'class' | 'assignment' | 'message' | 'notification';
  title: string;
  description: string;
  timestamp: Date;
  isNotification?: boolean;
  read?: boolean;
}

export interface DashboardStats {
  totalStudents: string;
  activeCourses: string;
  teachingHours: string;
  courseProgress: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'class' | 'exam' | 'assignment' | 'meeting';
  description?: string;
} 