'use client';

import { format, parseISO, subMinutes, subHours, subDays } from 'date-fns';
import { Moon, Sun, Orbit, History, Target, type LucideIcon, Bell, Calendar as CalendarIcon } from 'lucide-react';
import type { AstrologicalEvent } from '@/lib/events';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from './ui/calendar';
import { Input } from './ui/input';
import { useI18n } from '@/lib/i18n/client';

const getEventIcon = (event: AstrologicalEvent): LucideIcon => {
  switch (event.type) {
    case 'moon_phase':
      return Moon;
    case 'eclipse':
      return Target;
    case 'planet_retrograde':
      return History;
    case 'planet_transit':
      return Orbit;
    case 'solstice_equinox':
      return Sun;
    default:
      return Sun;
  }
};

interface EventCardProps {
  event: AstrologicalEvent;
  className?: string;
  isOngoing?: boolean;
}

const scheduleNotification = (id: string, title: string, body: string, date: Date) => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    const timeUntilEvent = date.getTime() - new Date().getTime();
    if (timeUntilEvent > 0) {
      setTimeout(() => {
        new Notification(title, { body, icon: '/icon.png' });
        localStorage.removeItem(`notification_${id}`);
      }, timeUntilEvent);
      localStorage.setItem(`notification_${id}`, JSON.stringify({ title, body, date }));
      return true;
    }
  }
  return false;
};

export default function EventCard({ event, className, isOngoing = false }: EventCardProps) {
  const Icon = getEventIcon(event);
  const [formattedDate, setFormattedDate] = useState('');
  const { toast } = useToast();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [reminderOption, setReminderOption] = useState('none');
  const [isClient, setIsClient] = useState(false);
  const [customDate, setCustomDate] = useState<Date | undefined>();
  const [customTime, setCustomTime] = useState('09:00');
  const t = useI18n();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const eventDate = parseISO(event.date);
      if (isOngoing && event.endDate) {
        const endDate = parseISO(event.endDate);
        setFormattedDate(`${t('eventCard.from')} ${format(eventDate, 'PPP')} ${t('eventCard.to')} ${format(endDate, 'PPP')}`);
      } else {
        setFormattedDate(format(eventDate, 'PPP p'));
      }
    }
  }, [event.date, event.endDate, isOngoing, t, isClient]);
  

  const handleSetReminder = () => {
    const eventDate = parseISO(event.date);
    let notificationDate: Date | null = null;
    let reminderText = '';

    switch (reminderOption) {
      case '15m':
        notificationDate = subMinutes(eventDate, 15);
        reminderText = `15 ${t('reminders.minutes')}`;
        break;
      case '1h':
        notificationDate = subHours(eventDate, 1);
        reminderText = `1 ${t('reminders.hour')}`;
        break;
      case '1d':
        notificationDate = subDays(eventDate, 1);
        reminderText = `1 ${t('reminders.day')}`;
        break;
      case 'custom':
        if (customDate) {
          const [hours, minutes] = customTime.split(':').map(Number);
          const fullDate = new Date(customDate);
          fullDate.setHours(hours);
          fullDate.setMinutes(minutes);
          notificationDate = fullDate;
          reminderText = `${t('reminders.on')} ${format(fullDate, "PPP")} ${t('reminders.at')} ${format(fullDate, "p")}`;
        } else {
          toast({
            title: t('toasts.dateNotSelected.title'),
            description: t('toasts.dateNotSelected.description'),
            variant: 'destructive',
          });
          return;
        }
        break;
      default:
        localStorage.removeItem(`notification_${event.id}`);
        toast({ title: t('toasts.reminderRemoved') });
        setPopoverOpen(false);
        return;
    }

    if (notificationDate && new Date() < notificationDate) {
      if (scheduleNotification(event.id, event.title, event.description, notificationDate)) {
        toast({
          title: t('toasts.reminderSet.title'),
          description: `${t('toasts.reminderSet.description')} ${reminderText} ${t('reminders.before')}.`,
        });
      } else if (isClient && Notification.permission !== 'granted') {
        toast({
          title: t('toasts.permissionRequired.title'),
          description: t('toasts.permissionRequired.description'),
          variant: 'destructive',
        });
      } else {
         toast({
          title: t('toasts.reminderInPast.title'),
          description: t('toasts.reminderInPast.description'),
          variant: 'destructive',
        });
      }
    } else {
       toast({
          title: t('toasts.eventPassed.title'),
          description: t('toasts.eventPassed.description'),
          variant: 'destructive',
        });
    }
    setPopoverOpen(false);
  };
  
  if (!isClient) {
    return (
      <Card className={cn('flex items-start gap-4 p-4 transition-all hover:shadow-md', className)}>
        <div className="mt-1">
          <div className="h-6 w-6 bg-muted rounded-full" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-full mt-2" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('flex items-start gap-4 p-4 transition-all hover:shadow-md', className)}>
      <div className="mt-1">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <p className="font-semibold font-headline text-base">{event.title}</p>
        <p className="text-sm text-muted-foreground">
          {formattedDate || t('eventCard.loadingDate')}
        </p>
        <p className="mt-2 text-sm text-foreground/80">{event.description}</p>
      </div>
       <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">{t('reminders.title')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('reminders.description')}
              </p>
            </div>
            <RadioGroup value={reminderOption} onValueChange={setReminderOption}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="r-none" />
                <Label htmlFor="r-none">{t('reminders.none')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="15m" id="r-15m" />
                <Label htmlFor="r-15m">15 {t('reminders.minutes')} {t('reminders.before')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1h" id="r-1h" />
                <Label htmlFor="r-1h">1 {t('reminders.hour')} {t('reminders.before')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1d" id="r-1d" />
                <Label htmlFor="r-1d">1 {t('reminders.day')} {t('reminders.before')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                 <RadioGroupItem value="custom" id="r-custom" />
                 <Label htmlFor="r-custom">{t('reminders.custom')}</Label>
              </div>
            </RadioGroup>

            {reminderOption === 'custom' && (
              <div className="grid gap-2 pl-6 pt-2">
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !customDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customDate ? format(customDate, "PPP") : <span>{t('reminders.pickDate')}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={customDate}
                        onSelect={setCustomDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input 
                    type="time" 
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                  />
              </div>
            )}
            
            <Button onClick={handleSetReminder}>{t('reminders.save')}</Button>
          </div>
        </PopoverContent>
      </Popover>
    </Card>
  );
}
