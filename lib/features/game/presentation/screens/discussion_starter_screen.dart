import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/navigation/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/spring_button.dart';
import '../../../../core/utils/haptics.dart';
import '../controllers/game_controller.dart';

class DiscussionStarterScreen extends ConsumerWidget {
  const DiscussionStarterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gameState = ref.watch(gameControllerProvider);
    final starter = gameState.discussionStarter;

    return PopScope(
      canPop: false,
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              return SingleChildScrollView(
                child: ConstrainedBox(
                  constraints: BoxConstraints(minHeight: constraints.maxHeight),
                  child: IntrinsicHeight(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const Spacer(flex: 2),

                          // Icon badge
                          Center(
                            child: Container(
                              width: 72,
                              height: 72,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: AppColors.surface,
                                border: Border.all(color: AppColors.surfaceBorder),
                              ),
                              child: const Icon(
                                Icons.record_voice_over_outlined,
                                color: AppColors.accent,
                                size: 32,
                              ),
                            ),
                          ),
                          const SizedBox(height: 28),

                          // Subtitle
                          Text(
                            'FIRST TO SPEAK',
                            textAlign: TextAlign.center,
                            style: AppTextStyles.labelCaps.copyWith(letterSpacing: 2.5),
                          ),
                          const SizedBox(height: 12),

                          // Player name
                          Text(
                            starter?.name ?? 'Player',
                            textAlign: TextAlign.center,
                            style: AppTextStyles.heroDisplay.copyWith(fontSize: 40),
                          ),
                          const SizedBox(height: 16),

                          // Explanation
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 20),
                            child: Text(
                              '${starter?.name ?? 'This player'} must give the first clue to start the round. Continue clockwise or open discussion.',
                              textAlign: TextAlign.center,
                              style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
                            ),
                          ),

                          const Spacer(flex: 3),

                          // Proceed button
                          SpringButton(
                            onTap: () {
                              AppHaptics.medium();
                              ref.read(gameControllerProvider.notifier).proceedToActiveBoard();
                              Navigator.pushReplacementNamed(context, AppRoutes.board);
                            },
                            child: Container(
                              height: 56,
                              decoration: BoxDecoration(
                                color: AppColors.accent,
                                borderRadius: BorderRadius.circular(16),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                'Go to Players Board',
                                style: AppTextStyles.buttonText,
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
