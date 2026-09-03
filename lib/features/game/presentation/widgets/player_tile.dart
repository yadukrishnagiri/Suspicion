import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/motion_constants.dart';
import '../../../../core/motion/spring_button.dart';
import '../../domain/models/player.dart';

class PlayerTile extends StatelessWidget {
  final Player player;
  final int index;
  final VoidCallback? onEliminateTap;
  final bool isStarter;

  const PlayerTile({
    super.key,
    required this.player,
    required this.index,
    this.onEliminateTap,
    this.isStarter = false,
  });

  @override
  Widget build(BuildContext context) {
    final isEliminated = player.isEliminated;

    final tileContent = AnimatedContainer(
      duration: MotionConstants.boardStateDuration,
      curve: Curves.easeInOut,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: isEliminated
            ? const Color(0xFF0F1014)
            : AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isEliminated
              ? const Color(0xFF1C1F28)
              : (isStarter ? AppColors.gold.withOpacity(0.5) : AppColors.surfaceBorder),
          width: isStarter && !isEliminated ? 1.5 : 1.0,
        ),
      ),
      child: Row(
        children: [
          // Avatar Initial Circle
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isEliminated
                  ? const Color(0xFF171A22)
                  : (isStarter ? AppColors.gold.withOpacity(0.15) : AppColors.surfaceBorderSubtle),
              border: Border.all(
                color: isEliminated
                    ? Colors.transparent
                    : (isStarter ? AppColors.gold : AppColors.surfaceBorder),
              ),
            ),
            child: Center(
              child: Text(
                player.name.isNotEmpty ? player.name[0].toUpperCase() : '?',
                style: AppTextStyles.titleMedium.copyWith(
                  color: isEliminated
                      ? AppColors.textMuted.withOpacity(0.5)
                      : (isStarter ? AppColors.goldLight : AppColors.textPrimary),
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),

          // Player Name & Status
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  player.name,
                  style: AppTextStyles.titleSmall.copyWith(
                    fontSize: 16,
                    color: isEliminated ? AppColors.textMuted : AppColors.textPrimary,
                    decoration: isEliminated ? TextDecoration.lineThrough : null,
                  ),
                ),
                if (isStarter && !isEliminated) ...[
                  const SizedBox(height: 3),
                  Text(
                    'FIRST TO SPEAK',
                    style: AppTextStyles.labelCaps.copyWith(
                      color: AppColors.gold,
                      fontSize: 10,
                      letterSpacing: 1.5,
                    ),
                  ),
                ],
              ],
            ),
          ),

          // Action: Either "ELIMINATED" badge OR "ELIMINATE" button
          if (isEliminated)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: const Color(0xFF171922),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFF222634)),
              ),
              child: Text(
                'ELIMINATED',
                style: AppTextStyles.labelCaps.copyWith(
                  color: AppColors.textMuted.withOpacity(0.7),
                  fontSize: 10,
                  letterSpacing: 1.0,
                ),
              ),
            )
          else
            SpringButton(
              onTap: onEliminateTap,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                decoration: BoxDecoration(
                  color: AppColors.imposterVelvet,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppColors.imposter.withOpacity(0.6),
                    width: 1.0,
                  ),
                ),
                child: Text(
                  'ELIMINATE',
                  style: AppTextStyles.labelCaps.copyWith(
                    color: AppColors.imposterGlow,
                    fontSize: 11,
                    letterSpacing: 1.5,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ),
        ],
      ),
    );

    // If eliminated: desaturate completely, set to 30% opacity, scale to 0.97
    return AnimatedScale(
      scale: isEliminated ? 0.97 : 1.0,
      duration: MotionConstants.boardStateDuration,
      curve: Curves.easeInOut,
      child: AnimatedOpacity(
        opacity: isEliminated ? 0.30 : 1.0,
        duration: MotionConstants.boardStateDuration,
        child: isEliminated
            ? ColorFiltered(
                colorFilter: const ColorFilter.mode(
                  Colors.grey,
                  BlendMode.saturation,
                ),
                child: tileContent,
              )
            : tileContent,
      ),
    );
  }
}
