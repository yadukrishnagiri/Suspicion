import 'package:flutter/services.dart';

class AppHaptics {
  static void light() {
    HapticFeedback.lightImpact();
  }

  static void medium() {
    HapticFeedback.mediumImpact();
  }

  static void heavy() {
    HapticFeedback.heavyImpact();
  }

  static void selection() {
    HapticFeedback.selectionClick();
  }

  static void suspense() async {
    HapticFeedback.lightImpact();
    await Future.delayed(const Duration(milliseconds: 150));
    HapticFeedback.mediumImpact();
  }
}
