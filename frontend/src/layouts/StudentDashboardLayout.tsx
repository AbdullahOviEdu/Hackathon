import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { FiGrid, FiUsers, FiBook, FiMessageCircle, FiCalendar, FiSettings, FiLogOut } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const StudentDashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    {
      icon: FiGrid,
      label: 'Dashboard',
      path: '/student-dashboard'
    },
    {
      icon: FiBook,
      label: 'My Courses',
      path: '/student-dashboard/courses'
    },
    {
      icon: FiUsers,
      label: 'Connections',
      path: '/student-dashboard/connections'
    },
    {
      icon: FiCalendar,
      label: 'Meetings',
      path: '/student-dashboard/meetings'
    },
    {
      icon: FiSettings,
      label: 'Settings',
      path: '/student-dashboard/settings'
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-ninja-black">
      <Navbar />
      
      <div className="flex flex-1 pt-20">
        {/* Sidebar */}
        <div className="w-64 bg-ninja-black/95 border-r border-ninja-white/10 fixed h-full pt-20">
          <nav className="flex flex-col h-full">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`px-6 py-4 flex items-center text-white/80 hover:bg-ninja-green/10 hover:text-white transition-colors ${
                    location.pathname === item.path ? 'bg-ninja-green/10 text-white' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-monument text-sm">{item.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="px-6 py-4 flex items-center text-white/80 hover:bg-ninja-green/10 hover:text-white transition-colors mt-auto mb-8"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              <span className="font-monument text-sm">Logout</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardLayout; 