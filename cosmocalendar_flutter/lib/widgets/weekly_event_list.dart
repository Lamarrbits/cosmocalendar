import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cosmocalendar_flutter/providers/event_provider.dart';
import 'package:cosmocalendar_flutter/widgets/event_card.dart';

class WeeklyEventList extends ConsumerWidget {
  const WeeklyEventList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final weeklyEvents = ref.watch(weeklyEventsProvider);

    return ListView.builder(
      itemCount: weeklyEvents.length,
      itemBuilder: (context, index) {
        final event = weeklyEvents[index];
        return EventCard(event: event);
      },
    );
  }
}
