import 'package:flutter/material.dart';
import 'package:cosmocalendar_flutter/src/features/calendar/presentation/views/calendar_view.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CosmoCalendar',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const CalendarView(),
    );
  }
}
