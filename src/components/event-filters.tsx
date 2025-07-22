'use client';

import React from 'react';
import type { EventType } from '@/lib/events';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { useI18n } from '@/lib/i18n/client';

interface EventFiltersProps {
  filters: Set<EventType>;
  onFilterChange: (filter: EventType, checked: boolean) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export default function EventFilters({
  filters,
  onFilterChange,
  searchTerm,
  onSearchTermChange,
}: EventFiltersProps) {
  const t = useI18n();

  const eventTypeLabels: Record<EventType, string> = {
    moon_phase: t('filters.moon_phase'),
    eclipse: t('filters.eclipse'),
    planet_retrograde: t('filters.planet_retrograde'),
    planet_transit: t('filters.planet_transit'),
    solstice_equinox: t('filters.solstice_equinox'),
  };
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('filters.searchPlaceholder')}
          value={searchTerm}
          onChange={e => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="space-y-4">
        <h4 className="font-semibold text-sm font-headline">{t('filters.eventTypes')}</h4>
        <div className="grid grid-cols-2 gap-4">
          {Object.keys(eventTypeLabels).map(key => {
            const eventType = key as EventType;
            return (
              <div key={eventType} className="flex items-center space-x-2">
                <Checkbox
                  id={eventType}
                  checked={filters.has(eventType)}
                  onCheckedChange={checked => onFilterChange(eventType, !!checked)}
                />
                <Label htmlFor={eventType} className="font-normal cursor-pointer">
                  {eventTypeLabels[eventType]}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
