import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/spring_button.dart';
import '../../../../core/utils/haptics.dart';
import '../../domain/models/game_state.dart';
import '../controllers/game_controller.dart';
import 'private_reveal_screen.dart';

class ResultScreen extends ConsumerWidget {
  const ResultScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gameState = ref.watch(gameControllerProvider);
    final winner = gameState.winner ?? GameWinner.citizens;
    final isCitizensWin = winner == GameWinner.citizens;
    final wordEntry = gameState.wordEntry;

    final winColor = isCitizensWin ? AppColors.citizen : AppColors.imposter;
    final winGlow = isCitizensWin ? AppColors.citizenGlow : AppColors.imposterGlow;

    final imposters = gameState.players.where((p) => p.isImposter).toList();

    return PopScope(
      canPop: false,
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: Column(
              children: [
                const Spacer(),

                // Winner icon badge
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: winColor.withOpacity(0.18),
                    border: Border.all(color: winColor, width: 2.5),
                    boxShadow: [
                      BoxShadow(
                        color: winColor.withOpacity(0.35),
                        blurRadius: 35,
                        spreadRadius: 4,
                      ),
                    ],
                  ),
                  child: Icon(
                    isCitizensWin ? Icons.verified_user_rounded : Icons.theater_comedy_rounded,
                    size: 48,
                    color: winGlow,
                  ),
                ),
                const SizedBox(height: 24),

                // Hero Winner Title
                Text(
                  winner.title.toUpperCase(),
                  textAlign: TextAlign.center,
                  style: AppTextStyles.heroDisplay.copyWith(
                    fontSize: 34,
                    color: winGlow,
                    letterSpacing: 2.5,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  winner.subtitle,
                  textAlign: TextAlign.center,
                  style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
                ),

                const SizedBox(height: 36),

                // Secret Words Summary Card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceElevated,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: AppColors.surfaceBorder),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('MAIN WORD', style: AppTextStyles.labelCaps.copyWith(color: AppColors.citizenGlow)),
                          Text(wordEntry?.mainWord ?? '', style: AppTextStyles.titleMedium),
                        ],
                      ),
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 12),
                        child: Divider(color: AppColors.surfaceBorder, height: 1),
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('IMPOSTER WORD', style: AppTextStyles.labelCaps.copyWith(color: AppColors.imposterGlow)),
                          Text(wordEntry?.imposterWord ?? '', style: AppTextStyles.titleMedium),
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
                            Text('HINT / CLUE', style: AppTextStyles.labelCaps.copyWith(color: AppColors.gold)),
                            const SizedBox(width: 12),
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

                const SizedBox(height: 20),

                // Imposters revealed
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceBorderSubtle,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.surfaceBorder),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('THE IMPOSTERS', style: AppTextStyles.labelCaps.copyWith(fontSize: 11)),
                      Text(
                        imposters.map((p) => p.name).join(', '),
                        style: AppTextStyles.titleSmall.copyWith(color: AppColors.imposterGlow),
                      ),
                    ],
                  ),
                ),

                const Spacer(),

                // Action Buttons: Play Again (Keep Names)
                SpringButton(
                  onTap: () {
                    AppHaptics.medium();
                    ref.read(gameControllerProvider.notifier).startNewGameSamePlayers();
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (_) => const PrivateRevealScreen()),
                    );
                  },
                  child: Container(
                    height: 56,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: AppColors.accent,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.accent.withOpacity(0.35),
                          blurRadius: 20,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.refresh_rounded, color: Colors.white, size: 22),
                        const SizedBox(width: 8),
                        Text(
                          'PLAY AGAIN (KEEP NAMES)',
                          style: AppTextStyles.buttonText,
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 12),

                // Return to Setup
                SpringButton(
                  onTap: () {
                    AppHaptics.light();
                    Navigator.popUntil(context, (route) => route.isFirst);
                  },
                  child: Container(
                    height: 50,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: AppColors.surfaceElevated,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: AppColors.surfaceBorder),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      'MAIN MENU',
                      style: AppTextStyles.labelCaps.copyWith(
                        color: AppColors.textSecondary,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
