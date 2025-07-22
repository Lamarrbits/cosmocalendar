import 'package:equatable/equatable.dart';

class Event extends Equatable {
  const Event({
    required this.title,
    required this.date,
    required this.description,
  });

  final String title;
  final DateTime date;
  final String description;

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      title: json['title'],
      date: DateTime.parse(json['date']),
      description: json['description'],
    );
  }

  @override
  List<Object> get props => [title, date, description];
}
