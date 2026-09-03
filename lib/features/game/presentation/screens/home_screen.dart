import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/navigation/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/spring_button.dart';
import '../../../../core/utils/haptics.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: IntrinsicHeight(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Top Bar
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: AppColors.accent,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  'LOCAL PARTY GAME',
                                  style: AppTextStyles.labelCaps.copyWith(fontSize: 11),
                                ),
                              ],
                            ),
                            SpringButton(
                              onTap: () {
                                AppHaptics.selection();
                                Navigator.pushNamed(context, AppRoutes.profile);
                              },
                              child: Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: AppColors.surface,
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

                        const Spacer(flex: 2),

                        // Title Area
                        Center(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'IMPOSTER',
                                textAlign: TextAlign.center,
                                style: AppTextStyles.heroDisplay.copyWith(
                                  fontSize: 44,
                                  letterSpacing: -1.0,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                              const SizedBox(height: 12),
                              Text(
                                'One phone. One group. One liar.',
                                textAlign: TextAlign.center,
                                style: AppTextStyles.bodyLarge.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),

                        const Spacer(flex: 3),

                        // Start Game Button
                        SpringButton(
                          onTap: () {
                            AppHaptics.medium();
                            Navigator.pushNamed(context, AppRoutes.setup);
                          },
                          child: Container(
                            height: 56,
                            decoration: BoxDecoration(
                              color: AppColors.accent,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              'Start Game',
                              style: AppTextStyles.buttonText.copyWith(fontSize: 16),
                            ),
                          ),
                        ),

                        const SizedBox(height: 12),

                        // How to Play
                        SpringButton(
                          onTap: () {
                            AppHaptics.light();
                            Navigator.pushNamed(context, AppRoutes.rules);
                          },
                          child: Container(
                            height: 52,
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.surfaceBorder),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              'How to Play & Rules',
                              style: AppTextStyles.titleSmall.copyWith(
                                color: AppColors.textSecondary,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 8),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
