'use client';

import React from 'react';
import { isSameDay, parseISO } from 'date-fns';
import EventCard from './event-card';
import type { AstrologicalEvent } from '@/lib/events';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from './ui/scroll-area';
import { useI18n } from '@/lib/i18n/client';

interface WeeklyViewProps {
  events: AstrologicalEvent[];
  selectedDate: Date | undefined;
}

export default function WeeklyView({ events, selectedDate }: WeeklyViewProps) {
  const t = useI18n();
  return (
    <Card>
      <CardContent className="pt-6">
        <ScrollArea className="h-[70vh] lg:h-[50vh]">
          <div className="space-y-4 pr-4">
            {events.length > 0 ? (
              events.map(event => {
                const isSelectedDay = selectedDate && isSameDay(parseISO(event.date), selectedDate);
                return (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    className={isSelectedDay ? 'border-primary border-2' : ''}
                  />
                )
              })
            ) : (
              <div className="flex items-center justify-center h-full pt-16">
                <p className="text-muted-foreground italic">{t('weeklyView.noEvents')}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
