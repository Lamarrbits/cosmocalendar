import 'package:flutter/material.dart';
import 'package:cosmocalendar_flutter/models/event.dart';
import 'package:intl/intl.dart';

class EventCard extends StatelessWidget {
  final AstrologicalEvent event;

  const EventCard({Key? key, required this.event}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              event.title,
              style: Theme.of(context).textTheme.headline6,
            ),
            const SizedBox(height: 8.0),
            Text(
              DateFormat.yMMMd().add_jm().format(event.date),
              style: Theme.of(context).textTheme.subtitle2,
            ),
            const SizedBox(height: 8.0),
            Text(event.description),
          ],
        ),
      ),
    );
  }
}
