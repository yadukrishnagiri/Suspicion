import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/spring_button.dart';
import '../../../../core/utils/haptics.dart';
import '../../../auth/presentation/screens/profile_screen.dart';
import '../controllers/setup_controller.dart';
import '../../../skills_rules/presentation/screens/skill_guide_screen.dart';
import 'setup_wizard_screen.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Stack(
        children: [
          // Ambient pulse in the background
          Positioned(
            top: -100,
            left: -50,
            child: Container(
              width: 350,
              height: 350,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    AppColors.accent.withOpacity(0.18),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            bottom: -80,
            right: -60,
            child: Container(
              width: 320,
              height: 320,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    AppColors.imposter.withOpacity(0.12),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // Main content
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Top bar with profile icon
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.surfaceBorder),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              decoration: const BoxDecoration(
                                shape: BoxShape.circle,
                                color: AppColors.emerald,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'OFFLINE READY',
                              style: AppTextStyles.labelCaps.copyWith(
                                fontSize: 10,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      SpringButton(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const ProfileScreen()),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: AppColors.surfaceElevated,
                            border: Border.all(color: AppColors.surfaceBorder),
                          ),
                          child: const Icon(
                            Icons.person_outline_rounded,
                            color: AppColors.textPrimary,
                            size: 20,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const Spacer(),

                  // Hero Statement & Subtitle
                  Center(
                    child: Column(
                      children: [
                        Text(
                          'IMPOSTER',
                          style: AppTextStyles.heroDisplay.copyWith(
                            fontSize: 54,
                            letterSpacing: 6.0,
                            shadows: [
                              Shadow(
                                color: AppColors.accentGlow.withOpacity(0.4),
                                blurRadius: 30,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'One phone. One group. One liar.',
                          textAlign: TextAlign.center,
                          style: AppTextStyles.bodyLarge.copyWith(
                            color: AppColors.textSecondary,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const Spacer(),

                  // Action Buttons
                  SpringButton(
                    onTap: () {
                      AppHaptics.medium();
                      ref.read(setupControllerProvider.notifier).setStep(0);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const SetupWizardScreen()),
                      );
                    },
                    child: Container(
                      height: 60,
                      decoration: BoxDecoration(
                        color: AppColors.accent,
                        borderRadius: BorderRadius.circular(22),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.accent.withOpacity(0.4),
                            blurRadius: 25,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.play_arrow_rounded, color: Colors.white, size: 28),
                          const SizedBox(width: 10),
                          Text(
                            'START NEW GAME',
                            style: AppTextStyles.buttonText.copyWith(fontSize: 17),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Rules & Skill Guide button
                  SpringButton(
                    onTap: () {
                      AppHaptics.light();
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const SkillGuideScreen()),
                      );
                    },
                    child: Container(
                      height: 54,
                      decoration: BoxDecoration(
                        color: AppColors.surfaceElevated,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.surfaceBorder),
                      ),
                      alignment: Alignment.center,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.menu_book_rounded, color: AppColors.textSecondary, size: 20),
                          const SizedBox(width: 10),
                          Text(
                            'RULES & SKILL GUIDE',
                            style: AppTextStyles.titleSmall.copyWith(
                              color: AppColors.textSecondary,
                              fontSize: 14,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
