import { Course, Activity, DashboardStats, CalendarEvent } from '../types/dashboard';

// Mock data for development
const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Advanced Mathematics',
    class: 'Grade 12-A',
    time: '09:00',
    meetingLink: 'https://meet.google.com/abc-123',
    description: 'Advanced calculus and linear algebra',
    instructor: 'Dr. Smith',
    thumbnail: '/math-thumbnail.jpg',
  },
  {
    id: '2',
    name: 'Physics',
    class: 'Grade 12-B',
    time: '11:00',
    meetingLink: 'https://meet.google.com/def-456',
    description: 'Quantum mechanics and relativity',
    instructor: 'Dr. Johnson',
    thumbnail: '/physics-thumbnail.jpg',
  },
  {
    id: '3',
    name: 'Computer Science',
    class: 'Grade 12-C',
    time: '14:00',
    meetingLink: 'https://meet.google.com/ghi-789',
    description: 'Data structures and algorithms',
    instructor: 'Prof. Williams',
    thumbnail: '/cs-thumbnail.jpg',
  },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'class',
    title: 'Class Started',
    description: 'Advanced Mathematics class started',
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'assignment',
    title: 'Assignment Submitted',
    description: 'Physics homework submitted by John Doe',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    description: 'Question about today\'s lesson from Sarah',
    timestamp: new Date(Date.now() - 7200000),
  },
];

const mockStats: DashboardStats = {
  totalStudents: '150',
  activeCourses: '5',
  teachingHours: '120',
  courseProgress: '75%',
};

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Math Quiz',
    date: new Date(Date.now() + 86400000).toISOString(),
    type: 'exam',
    description: 'Chapter 5 Assessment',
  },
  {
    id: '2',
    title: 'Parent-Teacher Meeting',
    date: new Date(Date.now() + 172800000).toISOString(),
    type: 'meeting',
    description: 'Semester Progress Discussion',
  },
  {
    id: '3',
    title: 'Physics Lab',
    date: new Date(Date.now() + 259200000).toISOString(),
    type: 'class',
    description: 'Practical Experiment Session',
  },
];

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStats;
  }

  async getCourses(): Promise<Course[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCourses;
  }

  async getActivities(): Promise<Activity[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockActivities;
  }

  async getEvents(): Promise<CalendarEvent[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockEvents;
  }

  async joinClass(courseId: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Joined class: ${courseId}`);
  }
}

export const dashboardService = new DashboardService(); 