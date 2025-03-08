import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import Calendar from '../../components/Calendar';
import { dashboardService } from '../../services/dashboardService';
import { CalendarEvent } from '../../types/dashboard';

interface TeacherCalendarProps {
  events: CalendarEvent[];
}

const TeacherCalendar: React.FC<TeacherCalendarProps> = ({ events: initialEvents }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await dashboardService.getEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = () => {
    setShowAddModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-ninja-green font-monument">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-monument text-ninja-white mb-2">Calendar</h1>
          <p className="text-ninja-white/60">Manage your schedule and events</p>
        </div>
        <button
          onClick={handleAddEvent}
          className="px-4 py-2 bg-ninja-green text-ninja-black rounded-lg font-monument text-sm hover:bg-ninja-purple hover:text-ninja-white transition-colors flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
            <Calendar events={events} />
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6">
            <h2 className="text-xl font-monument text-ninja-white mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {events
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-ninja-green/5 rounded-lg border border-ninja-green/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-monument text-ninja-white">{event.title}</h3>
                      <span className="text-xs text-ninja-white/60">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-ninja-white/60">{event.description}</p>
                    )}
                    <div className="mt-2">
                      <span className="text-xs font-monument text-ninja-green px-2 py-1 bg-ninja-green/10 rounded-full">
                        {event.type}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ninja-black/80 flex items-center justify-center p-4">
          <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-monument text-ninja-white mb-4">Add New Event</h2>
            {/* Add event form will go here */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-ninja-white/60 hover:text-ninja-white"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-ninja-green text-ninja-black rounded-lg font-monument text-sm hover:bg-ninja-purple hover:text-ninja-white transition-colors">
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCalendar; 