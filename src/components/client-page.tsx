'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/header';
import CalendarView from '@/components/calendar-view';
import ListView from '@/components/list-view';
import WeeklyView from '@/components/weekly-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/lib/i18n/client';
import { useEventData } from '@/hooks/use-event-data';
import EventCard from './event-card';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardHeader, CardTitle } from './ui/card';

export default function ClientPage() {
  const {
    filters,
    handleFilterChange,
    searchTerm,
    setSearchTerm,
    filteredEvents,
    weeklyEvents,
    eventsByDate,
  } = useEventData();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const t = useI18n();

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = selectedDate.toDateString();
    return eventsByDate[dateKey] || [];
  }, [selectedDate, eventsByDate]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header 
        filters={filters}
        onFilterChange={handleFilterChange}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 flex flex-col gap-8">
              <CalendarView
                eventsByDate={eventsByDate}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
              {selectedDayEvents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline text-lg">
                      Events for Selected Day
                    </CardTitle>
                  </CardHeader>
                  <ScrollArea className="h-64 px-4 pb-4">
                     <div className="space-y-4">
                        {selectedDayEvents.map(event => (
                          <EventCard key={event.id} event={event} />
                        ))}
                      </div>
                  </ScrollArea>
                </Card>
              )}
            </div>
            <div className="lg:col-span-2">
              <Tabs defaultValue="this-week" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-4">
                  <TabsTrigger value="this-week">{t('tabs.this-week')}</TabsTrigger>
                  <TabsTrigger value="coming-soon">{t('tabs.coming-soon')}</TabsTrigger>
                </TabsList>
                <TabsContent value="this-week">
                  <WeeklyView events={weeklyEvents} selectedDate={selectedDate} />
                </TabsContent>
                <TabsContent value="coming-soon">
                  <ListView events={filteredEvents} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
