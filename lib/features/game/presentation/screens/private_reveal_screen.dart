import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/secret_reveal_widget.dart';
import '../../../../core/motion/spring_button.dart';
import '../../../../core/utils/haptics.dart';
import '../../domain/models/game_mode.dart';
import '../../domain/models/game_state.dart';
import '../controllers/game_controller.dart';
import 'discussion_starter_screen.dart';

class PrivateRevealScreen extends ConsumerStatefulWidget {
  const PrivateRevealScreen({super.key});

  @override
  ConsumerState<PrivateRevealScreen> createState() => _PrivateRevealScreenState();
}

class _PrivateRevealScreenState extends ConsumerState<PrivateRevealScreen> {
  bool _isSecretRevealed = false;

  void _onReveal() {
    setState(() {
      _isSecretRevealed = true;
    });
    ref.read(gameControllerProvider.notifier).toggleWordReveal(true);
  }

  void _onPassPhone() {
    AppHaptics.medium();
    final gameNotifier = ref.read(gameControllerProvider.notifier);

    setState(() {
      _isSecretRevealed = false;
    });

    gameNotifier.passPhoneToNext();

    // Check if finished all players
    final updated = ref.read(gameControllerProvider);
    if (updated.phase == GamePhase.discussionStarter) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const DiscussionStarterScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final gameState = ref.watch(gameControllerProvider);
    final currentPlayer = gameState.currentPlayerToReveal;
    final wordEntry = gameState.wordEntry;

    if (currentPlayer == null || wordEntry == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final isImposter = currentPlayer.isImposter;
    final mode = gameState.config.gameMode;

    String secretWord;
    String roleTitle;
    String roleSubtitle;

    if (!isImposter) {
      roleTitle = 'Citizen';
      secretWord = wordEntry.mainWord;
      roleSubtitle = 'You are a Citizen. Give subtle, contextual clues without being too obvious.';
    } else {
      roleTitle = 'Imposter';
      switch (mode) {
        case GameMode.mode1:
          secretWord = wordEntry.imposterWord;
          roleSubtitle = 'You are the Imposter! Blend in with your word. Citizens have a closely related word.';
          break;
        case GameMode.mode2:
          secretWord = wordEntry.hint.isNotEmpty ? wordEntry.hint : 'Shared Context';
          roleSubtitle = 'You are the Imposter! You only received this context clue. Bluff and stay adaptable.';
          break;
        case GameMode.mode3:
          secretWord = '???';
          roleSubtitle = 'You are the Blind Imposter! You received no word or clue. Listen closely and fake it!';
          break;
      }
    }

    return PopScope(
      canPop: false,
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: SafeArea(
          child: Column(
            children: [
              // Top Progress Header
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'SECRET REVEAL (${gameState.currentRevealIndex + 1}/${gameState.players.length})',
                      style: AppTextStyles.labelCaps.copyWith(color: AppColors.textMuted),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceElevated,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        'PRIVATE',
                        style: AppTextStyles.labelCaps.copyWith(
                          color: AppColors.imposterGlow,
                          fontSize: 10,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Player Name Banner
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                child: Column(
                  children: [
                    Text(
                      'HAND PHONE TO',
                      style: AppTextStyles.labelCaps.copyWith(
                        color: AppColors.textSecondary,
                        letterSpacing: 2.0,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      currentPlayer.name,
                      textAlign: TextAlign.center,
                      style: AppTextStyles.titleLarge.copyWith(fontSize: 32),
                    ),
                  ],
                ),
              ),

              // Hero Signature Reveal Widget
              Expanded(
                child: Center(
                  child: SecretRevealWidget(
                    secretWord: secretWord,
                    roleTitle: roleTitle,
                    roleSubtitle: roleSubtitle,
                    isImposter: isImposter,
                    category: wordEntry.category,
                    isRevealed: _isSecretRevealed,
                    onRevealTap: _onReveal,
                  ),
                ),
              ),

              // Bottom "Pass Phone" Button (only active after viewing)
              Padding(
                padding: const EdgeInsets.all(24),
                child: AnimatedOpacity(
                  opacity: _isSecretRevealed ? 1.0 : 0.0,
                  duration: const Duration(milliseconds: 300),
                  child: SpringButton(
                    onTap: _isSecretRevealed ? _onPassPhone : null,
                    child: Container(
                      height: 56,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: AppColors.surfaceElevated,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.surfaceBorder),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.3),
                            blurRadius: 15,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            gameState.currentRevealIndex + 1 == gameState.players.length
                                ? 'START DISCUSSION'
                                : 'PASS PHONE',
                            style: AppTextStyles.buttonText.copyWith(
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Icon(Icons.arrow_forward_rounded, size: 20, color: AppColors.textPrimary),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
