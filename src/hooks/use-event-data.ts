'use client';

import { useState, useMemo, useEffect } from 'react';
import { startOfWeek, endOfWeek, parseISO, isWithinInterval, isAfter, startOfToday } from 'date-fns';
import { events as allEvents, type AstrologicalEvent } from '@/lib/events';

export function useEventData() {
  const [filters, setFilters] = useState<Set<string>>(
    new Set(['moon_phase', 'eclipse', 'planet_retrograde', 'planet_transit', 'solstice_equinox'])
  );
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (filter: string, isChecked: boolean) => {
    setFilters(prev => {
      const newFilters = new Set(prev);
      if (isChecked) {
        newFilters.add(filter);
      } else {
        newFilters.delete(filter);
      }
      return newFilters;
    });
  };

  const today = useMemo(() => startOfToday(), []);

  const filteredEvents = useMemo(() => {
    return allEvents
      .filter(event => filters.has(event.type))
      .filter(event => {
        if (!searchTerm) return true;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return (
          event.title.toLowerCase().includes(lowerCaseSearch) ||
          event.description.toLowerCase().includes(lowerCaseSearch) ||
          event.planet?.toLowerCase().includes(lowerCaseSearch) ||
          event.sign?.toLowerCase().includes(lowerCaseSearch)
        );
      })
      .filter(event => {
        const eventDate = parseISO(event.date);
        return isAfter(eventDate, today);
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filters, searchTerm, today]);

  const weeklyEvents = useMemo(() => {
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    return allEvents
      .filter(event => {
        const eventDate = parseISO(event.date);
        return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [today]);

  const eventsByDate = useMemo(() => {
    return allEvents.reduce<Record<string, AstrologicalEvent[]>>((acc, event) => {
      const dateKey = parseISO(event.date).toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {});
  }, []);

  return {
    filters,
    handleFilterChange,
    searchTerm,
    setSearchTerm,
    filteredEvents,
    weeklyEvents,
    eventsByDate,
    today
  };
}
