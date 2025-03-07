import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { CalendarEvent } from '../types/dashboard';

interface CalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events = [], onDateSelect }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get days in current month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (day: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };

  const handleDateClick = (day: number) => {
    if (day && onDateSelect) {
      const selectedDate = new Date(currentYear, currentMonth, day);
      onDateSelect(selectedDate);
    }
  };

  const renderCalendarDays = () => {
    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const allDays = [...blanks, ...days];

    return allDays.map((day, index) => {
      const dayEvents = day ? getEventsForDate(day) : [];
      const isToday = day === new Date().getDate() && 
                      currentMonth === new Date().getMonth() && 
                      currentYear === new Date().getFullYear();

      return (
        <div
          key={index}
          onClick={() => handleDateClick(day)}
          className={`relative h-8 w-8 flex items-center justify-center rounded-full font-monument text-sm 
            ${isToday
              ? 'bg-ninja-green text-ninja-black'
              : day
              ? 'text-ninja-white/80 hover:bg-ninja-green/10 cursor-pointer'
              : ''
            }
          `}
        >
          {day}
          {dayEvents.length > 0 && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
              {dayEvents.map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-ninja-purple"
                />
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-ninja-green/10 rounded-full text-ninja-white/80 hover:text-ninja-white"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-monument text-ninja-white">
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>
        <button 
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-ninja-green/10 rounded-full text-ninja-white/80 hover:text-ninja-white"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-sm text-ninja-white/40 font-monument">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
    </div>
  );
};

export default Calendar; 