import 'package:flutter/material.dart';

/// Ultra-clean, modern dark aesthetic (Apple / Linear design system)
class AppColors {
  // Canvas & Surfaces
  static const Color background = Color(0xFF000000); // Pure deep black
  static const Color backgroundAlt = Color(0xFF09090B);
  static const Color surface = Color(0xFF121215); // Clean dark card
  static const Color surfaceElevated = Color(0xFF18181B);
  static const Color surfaceBorder = Color(0xFF27272A); // Subtle zinc border
  static const Color surfaceBorderSubtle = Color(0xFF1E1E22);

  // Typography
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFA1A1AA);
  static const Color textMuted = Color(0xFF71717A);

  // Amber / Gold Accent (Clean, warm, premium)
  static const Color accent = Color(0xFFF59E0B);
  static const Color accentLight = Color(0xFFFDE68A);
  static const Color accentMuted = Color(0xFFB45309);

  // Aliases for luxury gold
  static const Color gold = Color(0xFFF59E0B);
  static const Color goldLight = Color(0xFFFDE68A);
  static const Color goldMuted = Color(0xFFB45309);

  // Status & Roles
  static const Color imposter = Color(0xFFEF4444); // Crimson red
  static const Color imposterDark = Color(0xFF7F1D1D);
  static const Color imposterGlow = Color(0xFFF87171);
  static const Color imposterMuted = Color(0xFF2A1215);
  static const Color imposterVelvet = Color(0xFF2A1215);

  static const Color citizen = Color(0xFFE4E4E7); // Clean zinc/silver
  static const Color citizenMuted = Color(0xFF27272A);

  static const Color emerald = Color(0xFF10B981);

  // Gradients
  static const LinearGradient goldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
  );

  static const LinearGradient imposterGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF991B1B), Color(0xFFEF4444)],
  );
}
