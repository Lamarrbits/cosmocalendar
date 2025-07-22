'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import EventCard from './event-card';
import type { AstrologicalEvent } from '@/lib/events';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';

interface CalendarViewProps {
  eventsByDate: Record<string, AstrologicalEvent[]>;
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

export default function CalendarView({
  eventsByDate,
  selectedDate,
  onDateSelect,
}: CalendarViewProps) {

  const eventDays = Object.keys(eventsByDate).map(dateStr => new Date(dateStr));

  return (
    <Card className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md w-full"
          modifiers={{ hasEvent: eventDays }}
          modifiersClassNames={{
            hasEvent: 'has-event',
            selected: 'day-selected'
          }}
          weekStartsOn={1}
        />
    </Card>
  );
}
