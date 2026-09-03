import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../utils/haptics.dart';
import 'motion_constants.dart';
import 'spring_button.dart';

class SecretRevealWidget extends StatefulWidget {
  final String secretWord;
  final String roleTitle;
  final String roleSubtitle;
  final bool isImposter;
  final String category;
  final bool isRevealed;
  final VoidCallback onRevealTap;

  const SecretRevealWidget({
    super.key,
    required this.secretWord,
    required this.roleTitle,
    required this.roleSubtitle,
    required this.isImposter,
    required this.category,
    required this.isRevealed,
    required this.onRevealTap,
  });

  @override
  State<SecretRevealWidget> createState() => _SecretRevealWidgetState();
}

class _SecretRevealWidgetState extends State<SecretRevealWidget>
    with TickerProviderStateMixin {
  late AnimationController _revealController;
  late AnimationController _breathingController;

  late Animation<double> _darkenAnimation;
  late Animation<double> _blurAnimation;
  late Animation<double> _pulseScale;
  late Animation<double> _characterProgress;
  late Animation<double> _breathingGlow;

  @override
  void initState() {
    super.initState();

    _revealController = AnimationController(
      vsync: this,
      duration: MotionConstants.secretRevealDuration,
    );

    _breathingController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2600),
    )..repeat(reverse: true);

    // 1 & 2. Background softly darkens
    _darkenAnimation = Tween<double>(begin: 0.0, end: 0.85).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: const Interval(0.0, 0.45, curve: Curves.easeOut),
      ),
    );

    // 3. Ambient blur grows
    _blurAnimation = Tween<double>(begin: 0.0, end: 20.0).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: const Interval(0.1, 0.65, curve: Curves.easeOut),
      ),
    );

    // 4. Center warmth / light pulse
    _pulseScale = Tween<double>(begin: 0.4, end: 1.8).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: const Interval(0.2, 0.8, curve: Curves.easeOutCubic),
      ),
    );

    // 5. Word emerges character-by-character
    _characterProgress = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: const Interval(0.45, 0.95, curve: Curves.easeOut),
      ),
    );

    // 6. Subtle breathing glow behind content
    _breathingGlow = Tween<double>(begin: 0.15, end: 0.45).animate(
      CurvedAnimation(parent: _breathingController, curve: Curves.easeInOut),
    );

    if (widget.isRevealed) {
      _revealController.value = 1.0;
    }
  }

  @override
  void didUpdateWidget(SecretRevealWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isRevealed != oldWidget.isRevealed) {
      if (widget.isRevealed) {
        AppHaptics.suspense();
        _revealController.forward(from: 0.0);
      } else {
        _revealController.reverse();
      }
    }
  }

  @override
  void dispose() {
    _revealController.dispose();
    _breathingController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeColor = widget.isImposter ? AppColors.imposter : AppColors.gold;
    final themeGlow = widget.isImposter ? AppColors.imposterGlow : AppColors.goldLight;

    return AnimatedBuilder(
      animation: Listenable.merge([_revealController, _breathingController]),
      builder: (context, child) {
        final isCompleted = _revealController.value >= 0.5;
        final currentText = widget.secretWord;
        final int charCount = (currentText.length * _characterProgress.value).round();
        final String revealedSub = currentText.substring(0, charCount.clamp(0, currentText.length));

        return Stack(
          alignment: Alignment.center,
          children: [
            // Darkening overlay
            if (_darkenAnimation.value > 0.01)
              Positioned.fill(
                child: Container(
                  color: Colors.black.withOpacity(_darkenAnimation.value),
                ),
              ),

            // Ambient blur
            if (_blurAnimation.value > 0.5)
              Positioned.fill(
                child: BackdropFilter(
                  filter: ImageFilter.blur(
                    sigmaX: _blurAnimation.value,
                    sigmaY: _blurAnimation.value,
                  ),
                  child: const SizedBox.expand(),
                ),
              ),

            // Subtle atmospheric light halo
            if (_revealController.value > 0.1)
              Positioned(
                child: Transform.scale(
                  scale: _pulseScale.value,
                  child: Container(
                    width: 260,
                    height: 260,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: RadialGradient(
                        colors: [
                          themeColor.withOpacity(
                            isCompleted ? _breathingGlow.value * 0.35 : 0.25,
                          ),
                          Colors.transparent,
                        ],
                      ),
                    ),
                  ),
                ),
              ),

            // Content
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: isCompleted
                  ? _buildRevealedContent(themeColor, themeGlow, revealedSub)
                  : _buildUnrevealedPrompt(),
            ),
          ],
        );
      },
    );
  }

  Widget _buildUnrevealedPrompt() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.surfaceElevated,
              border: Border.all(color: AppColors.surfaceBorder, width: 1.5),
            ),
            child: const Icon(
              Icons.lock_outline_rounded,
              size: 56,
              color: AppColors.goldLight,
            ),
          ),
          const SizedBox(height: 32),
          Text(
            'CONFIDENTIAL SECRET',
            style: AppTextStyles.labelCaps.copyWith(
              color: AppColors.textSecondary,
              letterSpacing: 3.5,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'Ensure only you can see this display.',
            style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textMuted),
          ),
          const SizedBox(height: 36),
          SpringButton(
            onTap: widget.onRevealTap,
            child: Container(
              height: 56,
              padding: const EdgeInsets.symmetric(horizontal: 32),
              decoration: BoxDecoration(
                gradient: AppColors.goldGradient,
                borderRadius: BorderRadius.circular(18),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.gold.withOpacity(0.2),
                    blurRadius: 20,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              alignment: Alignment.center,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.remove_red_eye_outlined, size: 20, color: Colors.black),
                  const SizedBox(width: 10),
                  Text(
                    'REVEAL YOUR IDENTITY',
                    style: AppTextStyles.buttonText.copyWith(
                      color: Colors.black,
                      letterSpacing: 2.0,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRevealedContent(Color themeColor, Color themeGlow, String partialWord) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Category
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
          decoration: BoxDecoration(
            color: AppColors.surfaceElevated,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.surfaceBorder),
          ),
          child: Text(
            widget.category.toUpperCase(),
            style: AppTextStyles.labelCaps.copyWith(
              color: AppColors.textSecondary,
              fontSize: 10,
              letterSpacing: 2.0,
            ),
          ),
        ),
        const SizedBox(height: 28),

        // Role title banner
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 8),
          decoration: BoxDecoration(
            color: widget.isImposter
                ? AppColors.imposterVelvet
                : AppColors.surfaceElevated,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: widget.isImposter ? AppColors.imposter : AppColors.goldMuted,
              width: 1.5,
            ),
          ),
          child: Text(
            widget.roleTitle.toUpperCase(),
            style: AppTextStyles.titleSmall.copyWith(
              color: themeGlow,
              fontWeight: FontWeight.w900,
              letterSpacing: 3.5,
            ),
          ),
        ),
        const SizedBox(height: 32),

        // Word Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 32),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: widget.isImposter
                  ? AppColors.imposter.withOpacity(0.5)
                  : AppColors.gold.withOpacity(0.4),
              width: 1.5,
            ),
          ),
          child: Column(
            children: [
              Text(
                'YOUR SECRET WORD',
                style: AppTextStyles.labelCaps.copyWith(
                  fontSize: 10,
                  color: AppColors.textMuted,
                  letterSpacing: 2.5,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                partialWord.isEmpty ? ' ' : partialWord,
                textAlign: TextAlign.center,
                style: AppTextStyles.secretWord.copyWith(
                  color: AppColors.textPrimary,
                  fontSize: 34,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Role Briefing
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Text(
            widget.roleSubtitle,
            textAlign: TextAlign.center,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
              height: 1.5,
            ),
          ),
        ),
      ],
    );
  }
}
