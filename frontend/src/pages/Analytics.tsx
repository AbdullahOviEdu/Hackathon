import React, { useState } from 'react';
import { FiUsers, FiClock, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');

  const stats: StatCard[] = [
    {
      title: 'Total Students',
      value: '1,234',
      change: 12.5,
      icon: FiUsers,
    },
    {
      title: 'Teaching Hours',
      value: '256',
      change: 8.2,
      icon: FiClock,
    },
    {
      title: 'Course Progress',
      value: '85%',
      change: 5.1,
      icon: FiTrendingUp,
    },
    {
      title: 'Classes This Month',
      value: '48',
      change: -2.4,
      icon: FiCalendar,
    },
  ];

  const studentActivityData = [
    { name: 'Mon', value: 45 },
    { name: 'Tue', value: 52 },
    { name: 'Wed', value: 48 },
    { name: 'Thu', value: 61 },
    { name: 'Fri', value: 55 },
    { name: 'Sat', value: 32 },
    { name: 'Sun', value: 28 },
  ];

  const courseCompletionData = [
    { name: 'UI/UX Design', students: 85 },
    { name: 'Web Development', students: 65 },
    { name: 'Mobile Development', students: 45 },
    { name: 'Data Science', students: 55 },
    { name: 'Machine Learning', students: 35 },
  ];

  const studentEngagementData = [
    { name: 'High', value: 45 },
    { name: 'Medium', value: 35 },
    { name: 'Low', value: 20 },
  ];

  const COLORS = ['#10B981', '#6366F1', '#F59E0B'];

  return (
    <div className="min-h-screen bg-ninja-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-monument text-ninja-white mb-2">Analytics Dashboard</h1>
            <p className="text-ninja-white/60">Track your teaching performance and student engagement</p>
          </div>
          <div className="flex space-x-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-monument text-sm transition-colors ${
                  timeRange === range
                    ? 'bg-ninja-green text-ninja-black'
                    : 'bg-ninja-green/10 text-ninja-white hover:bg-ninja-green/20'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-6 h-6 text-ninja-green" />
                  <span
                    className={`text-sm font-monument ${
                      stat.change >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change >= 0 ? '+' : ''}
                    {stat.change}%
                  </span>
                </div>
                <h3 className="text-ninja-white/60 text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-monument text-ninja-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student Activity Chart */}
          <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
            <h3 className="text-lg font-monument text-ninja-white mb-6">Student Activity</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={studentActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff60" />
                  <YAxis stroke="#ffffff60" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #ffffff20',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Course Completion Chart */}
          <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
            <h3 className="text-lg font-monument text-ninja-white mb-6">Course Completion</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff60" />
                  <YAxis stroke="#ffffff60" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #ffffff20',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="students" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Engagement Chart */}
          <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
            <h3 className="text-lg font-monument text-ninja-white mb-6">Student Engagement</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentEngagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: { name: string; percent: number }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {studentEngagementData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #ffffff20',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
            <h3 className="text-lg font-monument text-ninja-white mb-6">Performance Metrics</h3>
            <div className="space-y-4">
              {[
                { label: 'Average Class Rating', value: '4.8/5.0' },
                { label: 'Student Satisfaction', value: '92%' },
                { label: 'Assignment Completion Rate', value: '88%' },
                { label: 'Average Response Time', value: '2.5 hours' },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center justify-between p-4 bg-ninja-green/5 rounded-lg"
                >
                  <span className="text-ninja-white/60">{metric.label}</span>
                  <span className="font-monument text-ninja-white">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 