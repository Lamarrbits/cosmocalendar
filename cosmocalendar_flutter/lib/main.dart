import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cosmocalendar_flutter/src/core/app.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  await dotenv.load();
  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}
