import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/navigation/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/spring_button.dart';
import '../../../../core/utils/haptics.dart';
import '../../domain/models/game_mode.dart';
import '../../domain/models/game_state.dart';
import '../controllers/game_controller.dart';

class PrivateRevealScreen extends ConsumerStatefulWidget {
  const PrivateRevealScreen({super.key});

  @override
  ConsumerState<PrivateRevealScreen> createState() => _PrivateRevealScreenState();
}

class _PrivateRevealScreenState extends ConsumerState<PrivateRevealScreen> {
  bool _isSecretRevealed = false;

  void _onReveal() {
    AppHaptics.suspense();
    setState(() {
      _isSecretRevealed = true;
    });
  }

  void _onHideAndPass() {
    AppHaptics.medium();

    // 1. Instantly hide secret so no colors/words can possibly leak
    setState(() {
      _isSecretRevealed = false;
    });

    // 2. Advance player
    ref.read(gameControllerProvider.notifier).passPhoneToNext();

    // 3. Check if all players have reviewed
    final updated = ref.read(gameControllerProvider);
    if (updated.phase == GamePhase.discussionStarter) {
      Navigator.pushReplacementNamed(context, AppRoutes.starter);
    }
  }

  @override
  Widget build(BuildContext context) {
    final gameState = ref.watch(gameControllerProvider);
    final currentPlayer = gameState.currentPlayerToReveal;
    final wordEntry = gameState.wordEntry;

    if (currentPlayer == null || wordEntry == null) {
      return const Scaffold(
        backgroundColor: AppColors.background,
        body: Center(child: CircularProgressIndicator(color: AppColors.accent)),
      );
    }

    final isLastPlayer = gameState.currentRevealIndex + 1 == gameState.players.length;

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
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Top Progress
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'PLAYER ${gameState.currentRevealIndex + 1} OF ${gameState.players.length}',
                                style: AppTextStyles.labelCaps,
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppColors.surface,
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: AppColors.surfaceBorder),
                                ),
                                child: Text(
                                  'CONFIDENTIAL',
                                  style: AppTextStyles.labelCaps.copyWith(
                                    fontSize: 10,
                                    color: AppColors.accent,
                                  ),
                                ),
                              ),
                            ],
                          ),

                          const Spacer(),

                          // Center Content: Strictly conditional to guarantee ZERO color/word leaks!
                          AnimatedSwitcher(
                            duration: const Duration(milliseconds: 200),
                            child: _isSecretRevealed
                                ? _buildRevealedContent(currentPlayer, wordEntry, gameState.config.gameMode)
                                : _buildHandoffPrompt(currentPlayer),
                          ),

                          const Spacer(),

                          // Bottom Action Button
                          if (!_isSecretRevealed)
                            SpringButton(
                              onTap: _onReveal,
                              child: Container(
                                height: 56,
                                decoration: BoxDecoration(
                                  color: AppColors.accent,
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  'Reveal Secret',
                                  style: AppTextStyles.buttonText,
                                ),
                              ),
                            )
                          else
                            SpringButton(
                              onTap: _onHideAndPass,
                              child: Container(
                                height: 56,
                                decoration: BoxDecoration(
                                  color: AppColors.surfaceElevated,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: AppColors.surfaceBorder),
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  isLastPlayer ? 'Done (Start Discussion)' : 'Hide & Pass Phone',
                                  style: AppTextStyles.buttonText.copyWith(color: AppColors.textPrimary),
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

  // 100% Neutral Handoff Screen - Absolutely impossible to leak role or color!
  Widget _buildHandoffPrompt(player) {
    return Column(
      key: ValueKey('handoff_${player.id}'),
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 72,
          height: 72,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: AppColors.surface,
            border: Border.all(color: AppColors.surfaceBorder),
          ),
          child: const Icon(
            Icons.lock_outline_rounded,
            color: AppColors.textSecondary,
            size: 32,
          ),
        ),
        const SizedBox(height: 24),
        Text(
          'PASS PHONE TO',
          style: AppTextStyles.labelCaps.copyWith(letterSpacing: 2.0),
        ),
        const SizedBox(height: 8),
        Text(
          player.name,
          textAlign: TextAlign.center,
          style: AppTextStyles.heroDisplay.copyWith(fontSize: 36),
        ),
        const SizedBox(height: 12),
        Text(
          'Make sure no one else is looking at the screen.',
          textAlign: TextAlign.center,
          style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textMuted),
        ),
      ],
    );
  }

  // Revealed Secret Screen - Mounted only after explicit tap
  Widget _buildRevealedContent(player, wordEntry, GameMode mode) {
    final bool isImposter = player.isImposter;

    String secretWord;
    String roleName;
    String guide;
    Color roleColor;

    if (!isImposter) {
      roleName = 'CITIZEN';
      secretWord = wordEntry.mainWord;
      roleColor = AppColors.citizen;
      guide = 'You are an innocent citizen. Give subtle, indirect clues without being too obvious.';
    } else {
      roleName = 'IMPOSTER';
      roleColor = AppColors.imposter;
      switch (mode) {
        case GameMode.mode1:
          secretWord = wordEntry.imposterWord;
          guide = 'You are the Imposter! Blend in. Citizens have a closely related word.';
          break;
        case GameMode.mode2:
          secretWord = wordEntry.hint.isNotEmpty ? wordEntry.hint : 'Shared Context';
          guide = 'You are the Imposter! You only received this context clue. Bluff and stay adaptable.';
          break;
        case GameMode.mode3:
          secretWord = 'BLIND';
          guide = 'You are the Blind Imposter! You received no word or clue. Listen and fake it!';
          break;
      }
    }

    return Container(
      key: ValueKey('revealed_${player.id}'),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 28),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isImposter ? AppColors.imposter : AppColors.surfaceBorder,
          width: isImposter ? 1.5 : 1.0,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Category
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.surfaceElevated,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              wordEntry.category.toUpperCase(),
              style: AppTextStyles.labelCaps.copyWith(fontSize: 10),
            ),
          ),
          const SizedBox(height: 20),

          // Role Tag
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: isImposter ? AppColors.imposterMuted : AppColors.citizenMuted,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              roleName,
              style: AppTextStyles.labelCaps.copyWith(
                color: roleColor,
                fontWeight: FontWeight.w800,
                letterSpacing: 2.0,
              ),
            ),
          ),
          const SizedBox(height: 24),

          // Secret Word Display
          Text(
            secretWord,
            textAlign: TextAlign.center,
            style: AppTextStyles.secretWord.copyWith(
              fontSize: 34,
              color: isImposter ? AppColors.imposter : AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),

          // Role Guidance
          Text(
            guide,
            textAlign: TextAlign.center,
            style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}
