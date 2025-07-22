import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cosmocalendar_flutter/src/features/calendar/presentation/providers/event_providers.dart';
import 'package:cosmocalendar_flutter/src/shared/widgets/custom_card.dart';

class CalendarView extends ConsumerWidget {
  const CalendarView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final events = ref.watch(eventsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('CosmoCalendar'),
      ),
      body: events.when(
        data: (eventList) {
          return ListView.builder(
            itemCount: eventList.length,
            itemBuilder: (context, index) {
              final event = eventList[index];
              return CustomCard(
                child: ListTile(
                  title: Text(event.title),
                  subtitle: Text(event.description),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(child: Text('Error: $error')),
      ),
    );
  }
}
