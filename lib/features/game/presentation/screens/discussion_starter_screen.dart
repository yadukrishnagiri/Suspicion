import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/motion/discussion_starter_widget.dart';
import '../controllers/game_controller.dart';
import 'player_board_screen.dart';

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
          child: Center(
            child: DiscussionStarterWidget(
              starterName: starter?.name ?? 'Player',
              onProceedToBoard: () {
                ref.read(gameControllerProvider.notifier).proceedToActiveBoard();
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => const PlayerBoardScreen()),
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
