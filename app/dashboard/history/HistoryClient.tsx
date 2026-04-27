'use client';

import { useState, useMemo } from 'react';
import {
  type WorkoutSessionWithRoutine,
} from '@/lib/domain/workout-sessions';
import {
  EmptyHistoryState,
  HistoryFiltersHeader,
  HistorySidebar,
  SessionHistoryCard,
} from '@/app/dashboard/history/components/HistoryDashboardSections';

interface HistoryClientProps {
  initialSessions: WorkoutSessionWithRoutine[];
}

export default function HistoryClient({ initialSessions }: HistoryClientProps) {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('30_DAYS');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const filteredSessions = useMemo(() => {
    let sessions = initialSessions;

    // Type Filter
    if (typeFilter !== 'ALL') {
      sessions = sessions.filter(s => s.routines?.goal === typeFilter || s.routines?.difficulty === typeFilter);
    }

    // Date Filter
    if (selectedDay) {
      sessions = sessions.filter(s => {
        const sDate = new Date(s.start_time);
        return sDate.getDate() === selectedDay.getDate() && 
               sDate.getMonth() === selectedDay.getMonth() && 
               sDate.getFullYear() === selectedDay.getFullYear();
      });
    } else {
      const now = new Date();
      if (dateFilter === '7_DAYS') {
        const limit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        sessions = sessions.filter(s => new Date(s.start_time) >= limit);
      } else if (dateFilter === '30_DAYS') {
        const limit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        sessions = sessions.filter(s => new Date(s.start_time) >= limit);
      } else if (dateFilter === '90_DAYS') {
        const limit = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        sessions = sessions.filter(s => new Date(s.start_time) >= limit);
      }
    }

    return sessions;
  }, [initialSessions, dateFilter, typeFilter, selectedDay]);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  }, [currentMonth]);

  const hasSessionOnDay = (day: Date) => {
    return initialSessions.some(s => {
      const sDate = new Date(s.start_time);
      return sDate.getDate() === day.getDate() && 
             sDate.getMonth() === day.getMonth() && 
             sDate.getFullYear() === day.getFullYear();
    });
  };

  const getSessionTypeOnDay = (day: Date): 'cardio' | 'strength' | null => {
    const session = initialSessions.find(s => {
      const sDate = new Date(s.start_time);
      return sDate.getDate() === day.getDate() && 
             sDate.getMonth() === day.getMonth() && 
             sDate.getFullYear() === day.getFullYear();
    });
    if (!session) return null;
    return session.routines?.goal?.toLowerCase().includes('cardio') ? 'cardio' : 'strength';
  };

  const toggleExpand = (id: string) => {
    setExpandedSession(expandedSession === id ? null : id);
  };

  const handleDayClick = (day: Date) => {
    if (selectedDay && day.toDateString() === selectedDay.toDateString()) {
      setSelectedDay(null);
    } else {
      setSelectedDay(new Date(day));
    }
  };

  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(date);
  };

  const formatDateLabel = (date: string) => {
    return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(date));
  };

  const formatTimeLabel = (date: string) => {
    return new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(date));
  };

  return (
    <div className="pt-8 pb-32 lg:pb-12">
      <HistoryFiltersHeader
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onTypeFilterChange={setTypeFilter}
        typeFilter={typeFilter}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 px-4 md:px-0">
        <HistorySidebar
          currentMonth={currentMonth}
          daysInMonth={daysInMonth}
          filteredSessionsCount={filteredSessions.length}
          formatMonth={formatMonth}
          getSessionTypeOnDay={getSessionTypeOnDay}
          hasSessionOnDay={hasSessionOnDay}
          onClearSelectedDay={() => setSelectedDay(null)}
          onDayClick={handleDayClick}
          onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          onPreviousMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          selectedDay={selectedDay}
        />

        <div className="xl:col-span-8 space-y-6">
          {filteredSessions.length === 0 ? (
            <EmptyHistoryState />
          ) : (
            filteredSessions.map((session) => (
              <SessionHistoryCard
                key={session.id}
                formatDateLabel={formatDateLabel}
                formatTimeLabel={formatTimeLabel}
                isExpanded={expandedSession === session.id}
                onToggle={() => toggleExpand(session.id)}
                session={session}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
