'use client';

import React from 'react';
import EventCard from './event-card';
import type { AstrologicalEvent } from '@/lib/events';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from './ui/scroll-area';
import { useI18n } from '@/lib/i18n/client';

interface NowadaysViewProps {
  events: AstrologicalEvent[];
}

export default function NowadaysView({ events }: NowadaysViewProps) {
  const t = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">
          {t('tabs.nowadays')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] md:h-[50vh]">
          <div className="space-y-4 pr-4">
            {events.length > 0 ? (
              events.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event}
                  isOngoing={true}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-full pt-16">
                <p className="text-muted-foreground italic">{t('nowadaysView.noEvents')}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
