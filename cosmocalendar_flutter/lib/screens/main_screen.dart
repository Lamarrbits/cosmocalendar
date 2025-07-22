import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cosmocalendar_flutter/providers/event_provider.dart';
import 'package:cosmocalendar_flutter/widgets/calendar_view.dart';
import 'package:cosmocalendar_flutter/widgets/event_group.dart';

class MainScreen extends ConsumerWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final events = ref.watch(eventsProvider);

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text("CosmoCalendar"),
          bottom: const TabBar(
            tabs: [
              Tab(text: "Calendar"),
              Tab(text: "Coming Soon"),
            ],
          ),
        ),
        body: events.when(
          data: (events) {
            return TabBarView(
              children: [
                const CalendarView(),
                ListView.builder(
                  itemCount: ref.watch(eventsByDateProvider).keys.length,
                  itemBuilder: (context, index) {
                    final date = ref.watch(eventsByDateProvider).keys.elementAt(index);
                    final events = ref.watch(eventsByDateProvider)[date]!;
                    return Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: EventGroup(date: date, events: events),
                    );
                  },
                ),
              ],
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, stackTrace) => Center(child: Text('Error: $error')),
        ),
      ),
    );
  }
}
