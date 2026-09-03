import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/navigation/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/spring_button.dart';
import '../../../../core/utils/haptics.dart';
import '../../domain/models/game_state.dart';
import '../../domain/models/player.dart';
import '../controllers/game_controller.dart';

class PlayerBoardScreen extends ConsumerWidget {
  const PlayerBoardScreen({super.key});

  void _onEliminateTap(BuildContext context, WidgetRef ref, Player player) {
    if (player.isEliminated) return;
    AppHaptics.medium();

    // 1. Confirm dialog
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: AppColors.surfaceBorder),
        ),
        title: Text('Eliminate ${player.name}?', style: AppTextStyles.titleMedium),
        content: Text(
          'Did the group vote out this player?',
          style: AppTextStyles.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textMuted)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              _executeElimination(context, ref, player);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.imposter,
              minimumSize: const Size(100, 42),
            ),
            child: const Text('Eliminate', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }

  void _executeElimination(BuildContext context, WidgetRef ref, Player player) {
    // 2. Perform elimination in state immediately
    ref.read(gameControllerProvider.notifier).confirmElimination(player);

    final updatedState = ref.read(gameControllerProvider);
    final isGameOver = updatedState.phase == GamePhase.gameResult && updatedState.winner != null;

    if (player.isImposter) {
      AppHaptics.heavy();
    } else {
      AppHaptics.light();
    }

    // 3. Show dramatic truth dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (revealCtx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: player.isImposter ? AppColors.imposter : AppColors.surfaceBorder,
            width: player.isImposter ? 1.5 : 1.0,
          ),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: player.isImposter ? AppColors.imposterMuted : AppColors.surfaceElevated,
                border: Border.all(
                  color: player.isImposter ? AppColors.imposter : AppColors.surfaceBorder,
                ),
              ),
              child: Icon(
                player.isImposter ? Icons.warning_amber_rounded : Icons.shield_outlined,
                color: player.isImposter ? AppColors.imposter : AppColors.textPrimary,
                size: 32,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              player.isImposter ? 'IMPOSTER CAUGHT!' : 'CITIZEN ELIMINATED',
              style: AppTextStyles.labelCaps.copyWith(
                color: player.isImposter ? AppColors.imposter : AppColors.textMuted,
                fontWeight: FontWeight.w800,
                letterSpacing: 2.0,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              player.name,
              style: AppTextStyles.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              player.isImposter
                  ? '${player.name} was indeed an Imposter!'
                  : '${player.name} was an innocent Citizen.',
              textAlign: TextAlign.center,
              style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
            ),
            const SizedBox(height: 24),
            SpringButton(
              onTap: () {
                Navigator.pop(revealCtx);
                if (isGameOver) {
                  Navigator.pushReplacementNamed(context, AppRoutes.result);
                }
              },
              child: Container(
                height: 48,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: player.isImposter ? AppColors.imposter : AppColors.accent,
                  borderRadius: BorderRadius.circular(12),
                ),
                alignment: Alignment.center,
                child: Text(
                  isGameOver ? 'View Results' : 'Continue Game',
                  style: AppTextStyles.buttonText.copyWith(
                    color: player.isImposter ? Colors.white : Colors.black,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showExitDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: AppColors.surfaceBorder),
        ),
        title: Text('Exit Game?', style: AppTextStyles.titleMedium),
        content: Text(
          'Are you sure you want to end the current game and return to the main menu?',
          style: AppTextStyles.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textMuted)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.popUntil(context, (route) => route.isFirst);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.surfaceElevated,
              minimumSize: const Size(100, 42),
            ),
            child: const Text('Exit', style: TextStyle(color: AppColors.imposter)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gameState = ref.watch(gameControllerProvider);
    final activeCount = gameState.totalActiveCount;
    final eliminatedCount = gameState.totalEliminatedCount;
    final starterId = gameState.discussionStarter?.id;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) {
          _showExitDialog(context);
        }
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: Text(
            'Players Board',
            style: AppTextStyles.titleMedium,
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.close_rounded, size: 20, color: AppColors.textSecondary),
              onPressed: () => _showExitDialog(context),
            ),
          ],
        ),
        body: SafeArea(
          child: Column(
            children: [
              // Top Stats Bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.surfaceBorder),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '$activeCount Active  ·  $eliminatedCount Eliminated',
                        style: AppTextStyles.titleSmall.copyWith(fontSize: 14),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          gameState.wordEntry?.category ?? 'General',
                          style: AppTextStyles.labelCaps.copyWith(fontSize: 10, color: AppColors.textSecondary),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 6),

              // Player Roster List
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  itemCount: gameState.players.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final player = gameState.players[index];
                    final isEliminated = player.isEliminated;
                    final isStarter = player.id == starterId;

                    return AnimatedOpacity(
                      duration: const Duration(milliseconds: 200),
                      opacity: isEliminated ? 0.35 : 1.0,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: isEliminated ? const Color(0xFF0C0C0E) : AppColors.surface,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isStarter && !isEliminated
                                ? AppColors.accent
                                : AppColors.surfaceBorder,
                            width: isStarter && !isEliminated ? 1.5 : 1.0,
                          ),
                        ),
                        child: Row(
                          children: [
                            // Avatar
                            Container(
                              width: 38,
                              height: 38,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: isEliminated ? const Color(0xFF18181B) : AppColors.surfaceElevated,
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                player.name.isNotEmpty ? player.name[0].toUpperCase() : '?',
                                style: AppTextStyles.titleSmall.copyWith(
                                  color: isEliminated ? AppColors.textMuted : AppColors.textPrimary,
                                ),
                              ),
                            ),
                            const SizedBox(width: 14),

                            // Name & Starter tag
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    player.name,
                                    style: AppTextStyles.titleSmall.copyWith(
                                      color: isEliminated ? AppColors.textMuted : AppColors.textPrimary,
                                      decoration: isEliminated ? TextDecoration.lineThrough : null,
                                    ),
                                  ),
                                  if (isStarter && !isEliminated)
                                    Text(
                                      'First Speaker',
                                      style: AppTextStyles.bodyMedium.copyWith(
                                        fontSize: 11,
                                        color: AppColors.accent,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                ],
                              ),
                            ),

                            // Action button / Tag
                            if (isEliminated)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF18181B),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  'ELIMINATED',
                                  style: AppTextStyles.labelCaps.copyWith(
                                    fontSize: 10,
                                    color: AppColors.textMuted,
                                  ),
                                ),
                              )
                            else
                              SpringButton(
                                onTap: () => _onEliminateTap(context, ref, player),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: AppColors.imposterMuted,
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: AppColors.imposter.withOpacity(0.5)),
                                  ),
                                  child: Text(
                                    'Eliminate',
                                    style: AppTextStyles.labelCaps.copyWith(
                                      color: AppColors.imposter,
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
