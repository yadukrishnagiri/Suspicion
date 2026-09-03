import 'package:flutter/material.dart';

/// Dark-first curated color palette for Imposter
class AppColors {
  // Backgrounds
  static const Color background = Color(0xFF090A0F);
  static const Color backgroundAlt = Color(0xFF0F111A);
  static const Color surface = Color(0xFF151824);
  static const Color surfaceElevated = Color(0xFF1F2436);
  static const Color surfaceBorder = Color(0xFF2B324B);
  static const Color surfaceBorderSubtle = Color(0xFF1B2032);

  // Typography
  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);

  // Role identities
  static const Color citizen = Color(0xFF38BDF8); // Calm sky/azure wave
  static const Color citizenDark = Color(0xFF0284C7);
  static const Color citizenGlow = Color(0xFF7DD3FC);

  static const Color imposter = Color(0xFFF43F5E); // Crimson suspense
  static const Color imposterDark = Color(0xFFBE123C);
  static const Color imposterGlow = Color(0xFFFB7185);

  // Highlights & accents
  static const Color accent = Color(0xFF6366F1); // Electric indigo
  static const Color accentGlow = Color(0xFF818CF8);
  static const Color gold = Color(0xFFFBBF24);
  static const Color emerald = Color(0xFF10B981);

  // Gradients
  static const LinearGradient heroGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF1E2438), Color(0xFF0F121E)],
  );

  static const LinearGradient citizenGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF0369A1), Color(0xFF0284C7)],
  );

  static const LinearGradient imposterGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF9F1239), Color(0xFFE11D48)],
  );

  static const RadialGradient ambientPulse = RadialGradient(
    colors: [
      Color(0x336366F1),
      Colors.transparent,
    ],
    radius: 0.8,
  );
}
