import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cosmocalendar_flutter/models/event.dart';
import 'package:intl/intl.dart';

final eventsProvider = FutureProvider<List<AstrologicalEvent>>((ref) async {
  final String response = await rootBundle.loadString('assets/events.json');
  final data = await json.decode(response) as List;
  return data.map((e) => AstrologicalEvent.fromJson(e)).toList();
});

final eventFiltersProvider = StateProvider<Set<EventType>>((ref) => {
      EventType.moonPhase,
      EventType.eclipse,
      EventType.planetRetrograde,
      EventType.planetTransit,
      EventType.solsticeEquinox,
    });

final searchTermProvider = StateProvider<String>((ref) => '');

final filteredEventsProvider = Provider<List<AstrologicalEvent>>((ref) {
  final events = ref.watch(eventsProvider).asData?.value ?? [];
  final filters = ref.watch(eventFiltersProvider);
  final searchTerm = ref.watch(searchTermProvider);
  final today = DateTime.now();

  return events.where((event) {
    final eventDate = event.date;
    return filters.contains(event.type) &&
        (searchTerm.isEmpty ||
            event.title.toLowerCase().contains(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().contains(searchTerm.toLowerCase()) ||
            (event.planet?.toLowerCase().contains(searchTerm.toLowerCase()) ?? false) ||
            (event.sign?.toLowerCase().contains(searchTerm.toLowerCase()) ?? false)) &&
        eventDate.isAfter(today);
  }).toList()
    ..sort((a, b) => a.date.compareTo(b.date));
});

final weeklyEventsProvider = Provider<List<AstrologicalEvent>>((ref) {
  final events = ref.watch(eventsProvider).asData?.value ?? [];
  final today = DateTime.now();
  final weekStart = today.subtract(Duration(days: today.weekday - 1));
  final weekEnd = weekStart.add(const Duration(days: 6));

  return events.where((event) {
    final eventDate = event.date;
    return eventDate.isAfter(weekStart) && eventDate.isBefore(weekEnd);
  }).toList()
    ..sort((a, b) => a.date.compareTo(b.date));
});

final eventsByDateProvider = Provider<Map<String, List<AstrologicalEvent>>>((ref) {
  final events = ref.watch(eventsProvider).asData?.value ?? [];
  final eventsByDate = <String, List<AstrologicalEvent>>{};

  for (var event in events) {
    final dateKey = DateFormat.yMMMd().format(event.date);
    if (eventsByDate.containsKey(dateKey)) {
      eventsByDate[dateKey]!.add(event);
    } else {
      eventsByDate[dateKey] = [event];
    }
  }

  return eventsByDate;
});
