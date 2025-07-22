import 'package:flutter/material.dart';
import 'package:cosmocalendar_flutter/models/event.dart';
import 'package:cosmocalendar_flutter/widgets/event_card.dart';

class EventGroup extends StatelessWidget {
  final String date;
  final List<AstrologicalEvent> events;

  const EventGroup({Key? key, required this.date, required this.events}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          date,
          style: Theme.of(context).textTheme.headline5,
        ),
        const SizedBox(height: 16.0),
        ...events.map((event) => EventCard(event: event)),
      ],
    );
  }
}
