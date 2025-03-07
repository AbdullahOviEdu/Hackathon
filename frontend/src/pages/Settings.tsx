import React, { useState } from 'react';
import { FiUser, FiBell, FiLock, FiGlobe, FiMoon, FiSave } from 'react-icons/fi';
import Navbar from '../components/Navbar';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const Settings: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'class_reminder',
      title: 'Class Reminders',
      description: 'Get notified 30 minutes before class starts',
      enabled: true,
    },
    {
      id: 'messages',
      title: 'New Messages',
      description: 'Get notified when you receive new messages',
      enabled: true,
    },
    {
      id: 'assignments',
      title: 'Assignment Updates',
      description: 'Get notified about new assignments and deadlines',
      enabled: false,
    },
  ]);

  // Sample user data - replace with actual data from your backend
  const userData = {
    name: 'Alex Chen',
    username: 'ninja_coder',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    preferences: {
      darkMode: true,
      language: 'English',
      timezone: 'UTC-8'
    }
  };

  const handleNotificationToggle = (id: string) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const tabs = [
    { id: 'profile', icon: FiUser, label: 'Profile' },
    { id: 'notifications', icon: FiBell, label: 'Notifications' },
    { id: 'security', icon: FiLock, label: 'Security' },
    { id: 'appearance', icon: FiGlobe, label: 'Appearance' },
  ];

  // Tab content components
  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm text-ninja-white/80">Name</label>
          <input 
            type="text"
            defaultValue={userData.name}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-ninja-white/80">Username</label>
          <input 
            type="text"
            defaultValue={userData.username}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-ninja-white/80">Email</label>
          <input 
            type="email"
            defaultValue={userData.email}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-ninja-white/80">Phone</label>
          <input 
            type="tel"
            defaultValue={userData.phone}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white"
          />
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div>
            <h3 className="font-monument text-sm">Email Notifications</h3>
            <p className="text-sm text-ninja-white/60">Receive updates via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={userData.notifications.email} className="sr-only peer" />
            <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-ninja-green after:border-ninja-green after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ninja-green/20"></div>
          </label>
        </div>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div>
            <h3 className="font-monument text-sm">Push Notifications</h3>
            <p className="text-sm text-ninja-white/60">Receive push notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={userData.notifications.push} className="sr-only peer" />
            <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-ninja-green after:border-ninja-green after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ninja-green/20"></div>
          </label>
        </div>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div>
            <h3 className="font-monument text-sm">SMS Notifications</h3>
            <p className="text-sm text-ninja-white/60">Receive SMS alerts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={userData.notifications.sms} className="sr-only peer" />
            <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-ninja-green after:border-ninja-green after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ninja-green/20"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const PreferencesTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div>
            <h3 className="font-monument text-sm">Dark Mode</h3>
            <p className="text-sm text-ninja-white/60">Toggle dark mode theme</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={userData.preferences.darkMode} className="sr-only peer" />
            <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-ninja-green after:border-ninja-green after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ninja-green/20"></div>
          </label>
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-ninja-white/80">Language</label>
          <select 
            defaultValue={userData.preferences.language}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-ninja-white/80">Timezone</label>
          <select 
            defaultValue={userData.preferences.timezone}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white"
          >
            <option value="UTC-8">Pacific Time (UTC-8)</option>
            <option value="UTC-5">Eastern Time (UTC-5)</option>
            <option value="UTC+0">UTC</option>
            <option value="UTC+1">Central European Time (UTC+1)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-white/5 rounded-lg">
          <h3 className="font-monument text-sm mb-2">Change Password</h3>
          <div className="space-y-4">
            <input 
              type="password"
              placeholder="Current Password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white"
            />
            <input 
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white"
            />
            <input 
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-ninja-green/50 transition-colors text-ninja-white"
            />
          </div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg">
          <h3 className="font-monument text-sm mb-2">Two-Factor Authentication</h3>
          <p className="text-sm text-ninja-white/60 mb-4">Add an extra layer of security to your account</p>
          <button className="px-4 py-2 bg-ninja-green/20 text-ninja-green rounded-lg hover:bg-ninja-green/30 transition-colors">
            Enable 2FA
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-ninja-black via-ninja-black/95 to-ninja-black text-ninja-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_65%)] from-ninja-green/5" />
      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-16 md:pt-24">
        {/* Settings Header */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="font-monument text-4xl md:text-5xl mb-4">Settings</h1>
          <p className="text-ninja-white/60">Manage your account settings and preferences</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mt-12 mb-8 border-b border-white/10">
          {tabs.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2 font-monument text-sm transition-all ${
                activeTab === id
                  ? 'text-ninja-green border-b-2 border-ninja-green'
                  : 'text-ninja-white/60 hover:text-ninja-white'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className={`backdrop-blur-xl bg-white/5 rounded-xl p-6 transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'notifications' && <NotificationsTab />}
              {activeTab === 'security' && <SecurityTab />}
              {activeTab === 'appearance' && <PreferencesTab />}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <section className={`backdrop-blur-xl bg-white/5 rounded-xl p-6 transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <h2 className="font-monument text-xl mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-ninja-green/10 text-ninja-green rounded-lg hover:bg-ninja-green/20 transition-colors text-left">
                  🔒 Change Password
                </button>
                <button className="w-full py-2 px-4 bg-white/5 text-ninja-white/80 rounded-lg hover:bg-white/10 transition-colors text-left">
                  🔔 Manage Notifications
                </button>
                <button className="w-full py-2 px-4 bg-white/5 text-ninja-white/80 rounded-lg hover:bg-white/10 transition-colors text-left">
                  🌐 Language & Region
                </button>
                <button className="w-full py-2 px-4 bg-white/5 text-ninja-white/80 rounded-lg hover:bg-white/10 transition-colors text-left">
                  🎨 Appearance
                </button>
              </div>
            </section>

            {/* Danger Zone */}
            <section className={`backdrop-blur-xl bg-white/5 rounded-xl p-6 transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <h2 className="font-monument text-xl mb-4 text-ninja-orange">Danger Zone</h2>
              <div className="space-y-3">
                <button className="w-full py-2 px-4 border border-ninja-orange/30 text-ninja-orange rounded-lg hover:bg-ninja-orange/10 transition-colors text-left">
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button 
            className="px-8 py-3 bg-ninja-green text-ninja-black font-monument text-sm rounded-lg hover:scale-105 transition-all duration-300"
            onClick={() => setIsLoaded(true)}
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
};

export default Settings; 