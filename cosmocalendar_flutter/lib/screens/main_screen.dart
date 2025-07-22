import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cosmocalendar_flutter/providers/event_provider.dart';
import 'package:cosmocalendar_flutter/widgets/calendar_view.dart';
import 'package:cosmocalendar_flutter/widgets/event_group.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class MainScreen extends ConsumerWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final eventsByDate = ref.watch(eventsByDateProvider);
    final filteredEvents = ref.watch(filteredEventsProvider);
    final localizations = AppLocalizations.of(context)!;

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: Text(localizations.headerTitle),
          bottom: TabBar(
            tabs: [
              Tab(text: "Calendar"),
              Tab(text: localizations.tabsComingSoon),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            const CalendarView(),
            ListView.builder(
              itemCount: eventsByDate.keys.length,
              itemBuilder: (context, index) {
                final date = eventsByDate.keys.elementAt(index);
                final events = eventsByDate[date]!;
                return Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: EventGroup(date: date, events: events),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
