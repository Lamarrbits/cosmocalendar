import 'dart:convert';

import 'package:cosmocalendar_flutter/src/features/calendar/data/models/event_model.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_generative_ai/google_generative_ai.dart';

class EventService {
  final GenerativeModel _model;

  EventService()
      : _model = GenerativeModel(
          model: 'gemini-pro',
          apiKey: dotenv.env['GOOGLE_API_KEY']!,
        );

  Future<List<Event>> getEvents() async {
    final prompt =
        'Generate a list of 5 calendar events in JSON format. Each event should have a title, date, and description.';
    final content = [Content.text(prompt)];
    final response = await _model.generateContent(content);

    if (response.text == null) {
      return [];
    }

    final jsonResponse = jsonDecode(response.text!) as List;
    return jsonResponse
        .map((eventData) => Event.fromJson(eventData))
        .toList();
  }
}
