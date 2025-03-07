import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { CalendarEvent } from '../types/dashboard';

interface CalendarProps {
  events: CalendarEvent[];
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10" />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = 
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      const isSelected = 
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`
            h-10 w-10 rounded-full flex items-center justify-center relative
            ${isToday ? 'bg-ninja-green text-ninja-black' : ''}
            ${isSelected ? 'bg-ninja-purple text-ninja-white' : ''}
            ${!isToday && !isSelected ? 'hover:bg-ninja-green/10 text-ninja-white/80' : ''}
            ${dayEvents.length > 0 ? 'font-bold' : ''}
          `}
        >
          {day}
          {dayEvents.length > 0 && (
            <span className="absolute bottom-1 w-1 h-1 bg-ninja-purple rounded-full" />
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-ninja-green/10 rounded-full text-ninja-white/80 hover:text-ninja-white"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-monument text-ninja-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-ninja-green/10 rounded-full text-ninja-white/80 hover:text-ninja-white"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-xs text-ninja-white/60"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="mt-4">
          <h4 className="font-monument text-sm text-ninja-white mb-2">
            Events for {selectedDate.toLocaleDateString()}
          </h4>
          <div className="space-y-2">
            {getEventsForDate(selectedDate).map((event) => (
              <div
                key={event.id}
                className="p-2 bg-ninja-green/5 rounded text-sm text-ninja-white/80"
              >
                <div className="font-monument text-ninja-white">{event.title}</div>
                {event.description && (
                  <div className="text-xs mt-1">{event.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar; 