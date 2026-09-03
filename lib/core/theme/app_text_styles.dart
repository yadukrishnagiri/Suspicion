import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTextStyles {
  static TextStyle get heroDisplay => GoogleFonts.plusJakartaSans(
        fontSize: 38,
        fontWeight: FontWeight.w800,
        letterSpacing: -1.0,
        color: AppColors.textPrimary,
        height: 1.1,
      );

  static TextStyle get titleLarge => GoogleFonts.plusJakartaSans(
        fontSize: 24,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.5,
        color: AppColors.textPrimary,
      );

  static TextStyle get titleMedium => GoogleFonts.plusJakartaSans(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        letterSpacing: -0.2,
        color: AppColors.textPrimary,
      );

  static TextStyle get titleSmall => GoogleFonts.plusJakartaSans(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      );

  static TextStyle get secretWord => GoogleFonts.plusJakartaSans(
        fontSize: 34,
        fontWeight: FontWeight.w800,
        letterSpacing: -0.5,
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
        fontWeight: FontWeight.w600,
        letterSpacing: 1.0,
        color: AppColors.textMuted,
      );

  static TextStyle get buttonText => GoogleFonts.plusJakartaSans(
        fontSize: 15,
        fontWeight: FontWeight.w700,
        color: Colors.black,
      );
}
