import React, { useState } from 'react';
import { FiVideo, FiCalendar, FiClock, FiUsers, FiPlus } from 'react-icons/fi';
import Calendar from '../components/Calendar';

interface Meeting {
  id: string;
  title: string;
  type: 'class' | 'one-on-one' | 'group';
  date: Date;
  duration: string;
  participants: {
    name: string;
    role: string;
  }[];
  meetingLink: string;
}

const Meetings: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Mock data
  const meetings: Meeting[] = [
    {
      id: '1',
      title: 'Advanced UI Design Class',
      type: 'class',
      date: new Date(Date.now() + 3600000), // 1 hour from now
      duration: '1 hour',
      participants: [
        { name: 'Nikols Helmet', role: 'Instructor' },
        { name: 'Students (25)', role: 'Participants' },
      ],
      meetingLink: 'https://meet.google.com/abc',
    },
    {
      id: '2',
      title: 'Project Review Session',
      type: 'one-on-one',
      date: new Date(Date.now() + 7200000), // 2 hours from now
      duration: '30 minutes',
      participants: [
        { name: 'Sarah Johnson', role: 'Mentor' },
        { name: 'You', role: 'Student' },
      ],
      meetingLink: 'https://meet.google.com/def',
    },
  ];

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const handleScheduleMeeting = () => {
    setShowScheduleModal(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-ninja-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-monument text-ninja-white mb-2">Meetings</h1>
            <p className="text-ninja-white/60">Schedule and manage your meetings</p>
          </div>
          <button
            onClick={handleScheduleMeeting}
            className="flex items-center space-x-2 px-4 py-2 bg-ninja-green text-ninja-black rounded-lg hover:bg-ninja-purple hover:text-ninja-white transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            <span className="font-monument">Schedule Meeting</span>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Calendar */}
          <div className="col-span-4">
            <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
              <Calendar onDateSelect={setSelectedDate} />
            </div>
          </div>

          {/* Meetings List */}
          <div className="col-span-8 space-y-6">
            <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
              <h2 className="text-xl font-monument text-ninja-white mb-6">Upcoming Meetings</h2>
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-4 bg-ninja-green/5 rounded-lg border border-ninja-green/20"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-ninja-green/10 flex items-center justify-center">
                        <FiVideo className="w-6 h-6 text-ninja-green" />
                      </div>
                      <div>
                        <h3 className="font-monument text-ninja-white">{meeting.title}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-ninja-white/60">
                            <FiCalendar className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              {meeting.date.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center text-ninja-white/60">
                            <FiClock className="w-4 h-4 mr-1" />
                            <span className="text-sm">{formatTime(meeting.date)}</span>
                          </div>
                          <div className="flex items-center text-ninja-white/60">
                            <FiUsers className="w-4 h-4 mr-1" />
                            <span className="text-sm">
                              {meeting.participants.length} participants
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinMeeting(meeting.meetingLink)}
                      className="px-4 py-2 bg-ninja-green text-ninja-black rounded-md font-monument text-sm hover:bg-ninja-purple hover:text-ninja-white transition-colors"
                    >
                      Join Meeting
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Meeting Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
                <h3 className="text-sm text-ninja-white/60 mb-2">Total Meetings</h3>
                <p className="text-3xl font-monument text-ninja-green">24</p>
              </div>
              <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
                <h3 className="text-sm text-ninja-white/60 mb-2">Hours Spent</h3>
                <p className="text-3xl font-monument text-ninja-purple">48</p>
              </div>
              <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
                <h3 className="text-sm text-ninja-white/60 mb-2">Upcoming</h3>
                <p className="text-3xl font-monument text-ninja-green">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-ninja-black/80 flex items-center justify-center">
          <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-monument text-ninja-white mb-4">Schedule Meeting</h2>
            {/* Add your meeting scheduling form here */}
            <button
              onClick={() => setShowScheduleModal(false)}
              className="w-full px-4 py-2 bg-ninja-green text-ninja-black rounded-lg font-monument hover:bg-ninja-purple hover:text-ninja-white transition-colors mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meetings; 