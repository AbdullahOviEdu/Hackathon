import { Course, Student, Activity, DashboardStats, CalendarEvent } from '../types/dashboard';

// Mock data
const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Advanced Mathematics',
    class: 'Class X-A',
    time: '9:00 AM',
    meetingLink: 'https://meet.google.com/abc',
  },
  {
    id: '2',
    name: 'Physics',
    class: 'Class X-B',
    time: '10:30 AM',
    meetingLink: 'https://meet.google.com/def',
  },
  {
    id: '3',
    name: 'Chemistry',
    class: 'Class X-C',
    time: '2:00 PM',
    meetingLink: 'https://meet.google.com/ghi',
  },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'assignment',
    title: 'Mathematics Assignment #3',
    description: 'John Doe submitted Mathematics Assignment #3',
    timestamp: new Date(),
    status: 'submitted',
  },
  {
    id: '2',
    type: 'attendance',
    title: 'Class Attendance',
    description: 'Sarah marked attendance for Physics class',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    type: 'grade',
    title: 'Assignment Graded',
    description: 'Chemistry Assignment #2 has been graded',
    timestamp: new Date(Date.now() - 7200000),
    status: 'graded',
  },
];

const mockStats: DashboardStats = {
  totalStudents: 256,
  activeCourses: 8,
  averagePerformance: 85,
};

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Mathematics Class',
    date: new Date(),
    type: 'class',
    details: 'Class X-A Advanced Mathematics',
  },
  {
    id: '2',
    title: 'Physics Exam',
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    type: 'exam',
    details: 'Class X-B Physics Mid-term',
  },
  {
    id: '3',
    title: 'Chemistry Assignment Due',
    date: new Date(Date.now() + 86400000 * 3), // 3 days from now
    type: 'assignment',
    details: 'Submit Chemistry Lab Report',
  },
];

export const dashboardService = {
  getCourses: async (): Promise<Course[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCourses), 500);
    });
  },

  getActivities: async (): Promise<Activity[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockActivities), 500);
    });
  },

  getStats: async (): Promise<DashboardStats> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStats), 500);
    });
  },

  getEvents: async (): Promise<CalendarEvent[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockEvents), 500);
    });
  },

  joinClass: async (courseId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  },
}; 