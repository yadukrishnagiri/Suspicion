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

    final child = AnimatedContainer(
      duration: MotionConstants.boardStateDuration,
      curve: Curves.easeInOut,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: isEliminated
            ? AppColors.surface.withOpacity(0.4)
            : AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: isEliminated
              ? AppColors.surfaceBorderSubtle
              : (isStarter ? AppColors.gold.withOpacity(0.5) : AppColors.surfaceBorder),
          width: isStarter && !isEliminated ? 1.5 : 1.0,
        ),
        boxShadow: isEliminated
            ? []
            : [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
      ),
      child: Row(
        children: [
          // Avatar circle with person initial
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isEliminated
                  ? AppColors.surfaceBorderSubtle
                  : (isStarter ? AppColors.gold.withOpacity(0.15) : AppColors.surfaceBorder),
              border: Border.all(
                color: isEliminated
                    ? AppColors.textMuted.withOpacity(0.2)
                    : (isStarter ? AppColors.gold : AppColors.accentGlow.withOpacity(0.4)),
              ),
            ),
            child: Center(
              child: Text(
                player.name.isNotEmpty ? player.name[0].toUpperCase() : '?',
                style: AppTextStyles.titleMedium.copyWith(
                  color: isEliminated
                      ? AppColors.textMuted
                      : (isStarter ? AppColors.gold : AppColors.textPrimary),
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),

          // Player name and starter badge
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
                if (isStarter && !isEliminated) ...[
                  const SizedBox(height: 2),
                  Text(
                    'FIRST SPEAKER',
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

          // Action: Eliminate or Eliminated tag
          if (isEliminated)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.surfaceBorderSubtle,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                'OUT',
                style: AppTextStyles.labelCaps.copyWith(
                  color: AppColors.textMuted,
                  fontSize: 10,
                ),
              ),
            )
          else
            SpringButton(
              onTap: onEliminateTap,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.imposter.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: AppColors.imposter.withOpacity(0.35),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.cancel_outlined,
                      size: 16,
                      color: AppColors.imposterGlow,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'ELIMINATE',
                      style: AppTextStyles.labelCaps.copyWith(
                        color: AppColors.imposterGlow,
                        fontSize: 11,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );

    // People-board specs:
    // Eliminated: 100% opacity -> 35%, 100% saturation -> 0%, Scale 1.0 -> 0.97
    return AnimatedScale(
      scale: isEliminated ? 0.97 : 1.0,
      duration: MotionConstants.boardStateDuration,
      curve: Curves.easeInOut,
      child: AnimatedOpacity(
        opacity: isEliminated ? 0.35 : 1.0,
        duration: MotionConstants.boardStateDuration,
        child: isEliminated
            ? ColorFiltered(
                colorFilter: const ColorFilter.mode(
                  Colors.grey,
                  BlendMode.saturation,
                ),
                child: child,
              )
            : child,
      ),
    );
  }
}
