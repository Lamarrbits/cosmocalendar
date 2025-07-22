'use client';

import React, { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import EventCard from './event-card';
import type { AstrologicalEvent } from '@/lib/events';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { useI18n } from '@/lib/i18n/client';

interface ListViewProps {
  events: AstrologicalEvent[];
}

export default function ListView({ events }: ListViewProps) {
  const t = useI18n();
  const eventsByMonth = useMemo(() => {
    return events.reduce<Record<string, AstrologicalEvent[]>>((acc, event) => {
      const monthKey = format(parseISO(event.date), 'MMMM yyyy');
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(event);
      return acc;
    }, {});
  }, [events]);

  const sortedMonths = useMemo(() => {
    return Object.keys(eventsByMonth).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  }, [eventsByMonth]);

  return (
    <Card>
        <ScrollArea className="h-[70vh] lg:h-[60vh] p-4">
          <div className="space-y-8">
            {sortedMonths.length > 0 ? (
              sortedMonths.map(month => (
                <section key={month}>
                  <h2 className="font-body font-semibold text-lg text-foreground mb-4 sticky top-0 bg-background py-3 border-b">
                    {month}
                  </h2>
                  <div className="space-y-4">
                    {eventsByMonth[month].map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>
              ))
            ) : (
                <div className="flex items-center justify-center h-full pt-16">
                    <p className="text-muted-foreground italic">{t('listView.noEvents')}</p>
                </div>
            )}
          </div>
        </ScrollArea>
    </Card>
  );
}
