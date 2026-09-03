import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTextStyles {
  static TextStyle get heroDisplay => GoogleFonts.outfit(
        fontSize: 42,
        fontWeight: FontWeight.w900,
        letterSpacing: 4.0,
        color: AppColors.textPrimary,
        height: 1.1,
      );

  static TextStyle get titleLarge => GoogleFonts.outfit(
        fontSize: 28,
        fontWeight: FontWeight.w800,
        letterSpacing: 1.2,
        color: AppColors.textPrimary,
      );

  static TextStyle get titleMedium => GoogleFonts.outfit(
        fontSize: 20,
        fontWeight: FontWeight.w700,
        letterSpacing: 0.5,
        color: AppColors.textPrimary,
      );

  static TextStyle get titleSmall => GoogleFonts.outfit(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.5,
        color: AppColors.textPrimary,
      );

  static TextStyle get secretWord => GoogleFonts.outfit(
        fontSize: 38,
        fontWeight: FontWeight.w800,
        letterSpacing: 3.0,
        color: AppColors.textPrimary,
      );

  static TextStyle get bodyLarge => GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        height: 1.5,
        color: AppColors.textSecondary,
      );

  static TextStyle get bodyMedium => GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        height: 1.4,
        color: AppColors.textSecondary,
      );

  static TextStyle get labelCaps => GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w700,
        letterSpacing: 2.0,
        color: AppColors.textMuted,
      );

  static TextStyle get buttonText => GoogleFonts.outfit(
        fontSize: 16,
        fontWeight: FontWeight.w700,
        letterSpacing: 1.2,
        color: Colors.white,
      );
}
