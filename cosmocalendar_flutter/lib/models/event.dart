import 'package:flutter/foundation.dart';

enum EventType {
  moonPhase,
  eclipse,
  planetRetrograde,
  planetTransit,
  solsticeEquinox,
}

class AstrologicalEvent {
  final String id;
  final DateTime date;
  final DateTime? endDate;
  final String title;
  final EventType type;
  final String description;
  final String? planet;
  final String? sign;

  AstrologicalEvent({
    required this.id,
    required this.date,
    this.endDate,
    required this.title,
    required this.type,
    required this.description,
    this.planet,
    this.sign,
  });

  factory AstrologicalEvent.fromJson(Map<String, dynamic> json) {
    return AstrologicalEvent(
      id: json['id'],
      date: DateTime.parse(json['date']),
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
      title: json['title'],
      type: EventType.values.firstWhere(
        (e) => describeEnum(e).toLowerCase() == json['type'].replaceAll('_', '').toLowerCase(),
        orElse: () => EventType.moonPhase, // Default value
      ),
      description: json['description'],
      planet: json['planet'],
      sign: json['sign'],
    );
  }
}
