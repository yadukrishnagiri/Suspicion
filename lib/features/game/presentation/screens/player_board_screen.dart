import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/elimination_reveal_widget.dart';
import '../../../../core/utils/haptics.dart';
import '../../domain/models/game_state.dart';
import '../../domain/models/player.dart';
import '../controllers/game_controller.dart';
import '../widgets/player_tile.dart';
import 'result_screen.dart';

class PlayerBoardScreen extends ConsumerWidget {
  const PlayerBoardScreen({super.key});

  void _onEliminate(BuildContext context, WidgetRef ref, Player player) {
    AppHaptics.suspense();
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) {
        return EliminationRevealWidget(
          playerName: player.name,
          isImposter: player.isImposter,
          onDismiss: () {
            Navigator.pop(dialogContext);
            ref.read(gameControllerProvider.notifier).confirmElimination();

            // Check if game ended
            final updatedState = ref.read(gameControllerProvider);
            if (updatedState.phase == GamePhase.gameResult && updatedState.winner != null) {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (_) => const ResultScreen()),
              );
            }
          },
        );
      },
    );
  }

  void _showEndGameDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: AppColors.surfaceBorder),
        ),
        title: Text('End Current Game?', style: AppTextStyles.titleMedium),
        content: Text(
          'Are you sure you want to end this match and return to the main menu?',
          style: AppTextStyles.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('CANCEL', style: AppTextStyles.labelCaps.copyWith(color: AppColors.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.popUntil(context, (route) => route.isFirst);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.imposter,
              minimumSize: const Size(100, 44),
            ),
            child: const Text('END GAME'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final gameState = ref.watch(gameControllerProvider);
    final activeTotal = gameState.totalActiveCount;
    final starterId = gameState.discussionStarter?.id;

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) {
          _showEndGameDialog(context, ref);
        }
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          automaticallyImplyLeading: false,
          title: Text(
            'PEOPLE BOARD',
            style: AppTextStyles.labelCaps.copyWith(
              letterSpacing: 3.0,
              color: AppColors.textPrimary,
            ),
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.close_rounded, color: AppColors.textSecondary),
              onPressed: () => _showEndGameDialog(context, ref),
            ),
          ],
        ),
        body: SafeArea(
          child: Column(
            children: [
              // Top Stats Banner
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceElevated,
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(color: AppColors.surfaceBorder),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildStatItem('ACTIVE', '$activeTotal', AppColors.citizenGlow),
                      Container(width: 1, height: 32, color: AppColors.surfaceBorder),
                      _buildStatItem('ELIMINATED', '${gameState.totalEliminatedCount}', AppColors.textMuted),
                      Container(width: 1, height: 32, color: AppColors.surfaceBorder),
                      _buildStatItem('CATEGORY', gameState.wordEntry?.category.split(' ').first ?? 'Custom', AppColors.gold),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 8),

              // Discussion note
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline_rounded, size: 16, color: AppColors.textMuted),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Discuss in person. Tap Eliminate when a player is voted out.',
                        style: AppTextStyles.bodyMedium.copyWith(
                          fontSize: 12,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // People Grid / List
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                  itemCount: gameState.players.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final player = gameState.players[index];
                    final isStarter = player.id == starterId;

                    return PlayerTile(
                      player: player,
                      index: index,
                      isStarter: isStarter,
                      onEliminateTap: () => _onEliminate(context, ref, player),
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

  Widget _buildStatItem(String label, String value, Color color) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          style: AppTextStyles.titleMedium.copyWith(
            color: color,
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: AppTextStyles.labelCaps.copyWith(
            fontSize: 10,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }
}
