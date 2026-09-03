import 'package:flutter/material.dart';

class MotionConstants {
  // Reveal sequence
  static const Duration secretRevealDuration = Duration(milliseconds: 850);
  
  // Discussion starter reveal
  static const Duration starterStageDuration = Duration(milliseconds: 900);
  
  // Elimination reveal
  static const Duration eliminationPauseDuration = Duration(milliseconds: 800);
  static const Duration eliminationWaveDuration = Duration(milliseconds: 600);
  
  // Board state change
  static const Duration boardStateDuration = Duration(milliseconds: 400);
  
  // Microinteractions
  static const Duration microSpringDuration = Duration(milliseconds: 160);
  static const Duration buttonPressDuration = Duration(milliseconds: 120);

  // Custom curves
  static const Curve springCurve = Curves.easeOutCubic;
  static const Curve dramaticCurve = Curves.easeInOutCubicEmphasized;
  static const Curve tensionCurve = Curves.easeInOutSine;
}
