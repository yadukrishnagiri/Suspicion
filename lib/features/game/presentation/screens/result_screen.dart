import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/navigation/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/spring_button.dart';
import '../../../../core/utils/haptics.dart';
import '../../domain/models/game_state.dart';
import '../controllers/game_controller.dart';

class ResultScreen extends ConsumerWidget {
  const ResultScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gameState = ref.watch(gameControllerProvider);
    final winner = gameState.winner ?? GameWinner.citizens;
    final isCitizensWin = winner == GameWinner.citizens;
    final wordEntry = gameState.wordEntry;
    final imposters = gameState.players.where((p) => p.isImposter).toList();

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
                          const Spacer(),

                          // Outcome Icon
                          Center(
                            child: Container(
                              width: 72,
                              height: 72,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isCitizensWin ? const Color(0xFF10281E) : AppColors.imposterMuted,
                                border: Border.all(
                                  color: isCitizensWin ? AppColors.emerald : AppColors.imposter,
                                  width: 1.5,
                                ),
                              ),
                              child: Icon(
                                isCitizensWin ? Icons.check_circle_outline_rounded : Icons.warning_amber_rounded,
                                color: isCitizensWin ? AppColors.emerald : AppColors.imposter,
                                size: 36,
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Outcome Title
                          Text(
                            isCitizensWin ? 'Citizens Win!' : 'Imposters Win!',
                            textAlign: TextAlign.center,
                            style: AppTextStyles.heroDisplay.copyWith(fontSize: 32),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            winner.subtitle,
                            textAlign: TextAlign.center,
                            style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
                          ),

                          const SizedBox(height: 36),

                          // Imposter Reveal Card
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.surfaceBorder),
                            ),
                            child: Column(
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('IMPOSTER', style: AppTextStyles.labelCaps.copyWith(color: AppColors.imposter)),
                                    Text(
                                      imposters.map((p) => p.name).join(', '),
                                      style: AppTextStyles.titleSmall.copyWith(color: AppColors.imposter),
                                    ),
                                  ],
                                ),
                                const Padding(
                                  padding: EdgeInsets.symmetric(vertical: 12),
                                  child: Divider(color: AppColors.surfaceBorder, height: 1),
                                ),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('CITIZEN WORD', style: AppTextStyles.labelCaps),
                                    Text(wordEntry?.mainWord ?? '', style: AppTextStyles.titleSmall),
                                  ],
                                ),
                                const Padding(
                                  padding: EdgeInsets.symmetric(vertical: 12),
                                  child: Divider(color: AppColors.surfaceBorder, height: 1),
                                ),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text('IMPOSTER WORD', style: AppTextStyles.labelCaps),
                                    Text(wordEntry?.imposterWord ?? '', style: AppTextStyles.titleSmall),
                                  ],
                                ),
                                if (wordEntry?.hint.isNotEmpty ?? false) ...[
                                  const Padding(
                                    padding: EdgeInsets.symmetric(vertical: 12),
                                    child: Divider(color: AppColors.surfaceBorder, height: 1),
                                  ),
                                  Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text('HINT / CLUE', style: AppTextStyles.labelCaps),
                                      const SizedBox(width: 16),
                                      Expanded(
                                        child: Text(
                                          wordEntry!.hint,
                                          textAlign: TextAlign.end,
                                          style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textPrimary),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ],
                            ),
                          ),

                          const Spacer(),

                          // Play Again Button
                          SpringButton(
                            onTap: () {
                              AppHaptics.medium();
                              ref.read(gameControllerProvider.notifier).startNewGameSamePlayers();
                              Navigator.pushReplacementNamed(context, AppRoutes.reveal);
                            },
                            child: Container(
                              height: 56,
                              decoration: BoxDecoration(
                                color: AppColors.accent,
                                borderRadius: BorderRadius.circular(16),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                'Play Again (Same Players)',
                                style: AppTextStyles.buttonText,
                              ),
                            ),
                          ),

                          const SizedBox(height: 12),

                          // Main Menu Button
                          SpringButton(
                            onTap: () {
                              AppHaptics.light();
                              Navigator.popUntil(context, (route) => route.isFirst);
                            },
                            child: Container(
                              height: 50,
                              decoration: BoxDecoration(
                                color: AppColors.surface,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: AppColors.surfaceBorder),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                'Main Menu',
                                style: AppTextStyles.titleSmall.copyWith(
                                  color: AppColors.textSecondary,
                                  fontSize: 14,
                                ),
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
