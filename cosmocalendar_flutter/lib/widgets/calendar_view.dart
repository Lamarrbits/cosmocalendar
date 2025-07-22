import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cosmocalendar_flutter/providers/event_provider.dart';
import 'package:cosmocalendar_flutter/models/event.dart';
import 'package:cosmocalendar_flutter/widgets/event_card.dart';

final selectedDayProvider = StateProvider<DateTime?>((ref) => null);

class CalendarView extends ConsumerWidget {
  const CalendarView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final events = ref.watch(eventsProvider).asData?.value ?? [];
    final selectedDay = ref.watch(selectedDayProvider);
    final focusedDay = ref.watch(selectedDayProvider) ?? DateTime.now();

    List<AstrologicalEvent> _getEventsForDay(DateTime day) {
      return events.where((event) => isSameDay(event.date, day)).toList();
    }

    return Column(
      children: [
        TableCalendar(
          firstDay: DateTime.utc(2020, 1, 1),
          lastDay: DateTime.utc(2030, 12, 31),
          focusedDay: focusedDay,
          selectedDayPredicate: (day) {
            return isSameDay(selectedDay, day);
          },
          onDaySelected: (selected, focused) {
            ref.read(selectedDayProvider.notifier).state = selected;
          },
          eventLoader: _getEventsForDay,
        ),
        if (selectedDay != null)
          Expanded(
            child: ListView(
              children: _getEventsForDay(selectedDay)
                  .map((event) => EventCard(event: event))
                  .toList(),
            ),
          ),
      ],
    );
  }
}
