'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Cog, Filter } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button"
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/lib/i18n/client';
import { Separator } from './ui/separator';
import type { EventType } from '@/lib/events';
import EventFilters from './event-filters';

interface HeaderProps {
  filters: Set<EventType>;
  onFilterChange: (filter: EventType, checked: boolean) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}


export default function Header({ filters, onFilterChange, searchTerm, onSearchTermChange }: HeaderProps) {
  const [notificationPermission, setNotificationPermission] = useState('default');
  const { toast } = useToast();
  const t = useI18n();

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleNotificationClick = () => {
    if (!('Notification' in window)) {
      toast({
        title: t('toasts.error'),
        description: t('toasts.notificationsNotSupported'),
        variant: 'destructive',
      });
      return;
    }

    if (notificationPermission === 'granted') {
       toast({
        title: t('toasts.notificationsEnabled.title'),
        description: t('toasts.notificationsEnabled.description'),
      });
    } else if (notificationPermission === 'denied') {
       toast({
        title: t('toasts.notificationsBlocked.title'),
        description: t('toasts.notificationsBlocked.description'),
        variant: 'destructive'
      });
    } else {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === 'granted') {
          toast({
            title: t('toasts.success'),
            description: t('toasts.notificationsEnabled.now'),
          });
        } else {
           toast({
            title: t('toasts.notificationsNotEnabled.title'),
            description: t('toasts.notificationsNotEnabled.description'),
            variant: 'destructive'
          });
        }
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold font-headline tracking-tight">
            {t('header.title')}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Filter className="h-5 w-5" />
                <span className="sr-only">{t('header.filterAndSearch')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-headline">{t('header.filterAndSearch')}</SheetTitle>
                <SheetDescription>
                  {t('header.filterDescription')}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4">
                <EventFilters
                  filters={filters}
                  onFilterChange={onFilterChange}
                  searchTerm={searchTerm}
                  onSearchTermChange={onSearchTermChange}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Cog className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-headline">Settings</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-6">
                <div>
                   <h4 className="font-semibold text-sm font-headline mb-2">Notifications</h4>
                   <Button variant="outline" className="w-full" onClick={handleNotificationClick}>
                     {t('header.enableNotifications')}
                   </Button>
                </div>
                <Separator />
                <div>
                   <h4 className="font-semibold text-sm font-headline mb-2">Theme</h4>
                   <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
