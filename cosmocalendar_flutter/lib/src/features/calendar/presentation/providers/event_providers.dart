import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cosmocalendar_flutter/src/features/calendar/data/models/event_model.dart';
import 'package:cosmocalendar_flutter/src/features/calendar/data/services/event_service.dart';

final eventServiceProvider = Provider<EventService>((ref) {
  return EventService();
});

final eventsProvider = FutureProvider<List<Event>>((ref) {
  final eventService = ref.watch(eventServiceProvider);
  return eventService.getEvents();
});
