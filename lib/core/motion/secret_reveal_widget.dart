import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../utils/haptics.dart';
import 'motion_constants.dart';

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
  late Animation<double> _pulseAnimation;
  late Animation<double> _pulseOpacity;
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
      duration: const Duration(milliseconds: 2400),
    )..repeat(reverse: true);

    // 1 & 2. Background softly darkens
    _darkenAnimation = Tween<double>(begin: 0.0, end: 0.75).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: const Interval(0.0, 0.45, curve: Curves.easeOut),
      ),
    );

    // 3. Ambient blur grows
    _blurAnimation = Tween<double>(begin: 0.0, end: 16.0).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: const Interval(0.1, 0.6, curve: Curves.easeOut),
      ),
    );

    // 4. Tiny center light pulse
    _pulseAnimation = Tween<double>(begin: 0.2, end: 2.2).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: const Interval(0.2, 0.65, curve: Curves.easeOutQuad),
      ),
    );

    _pulseOpacity = TweenSequence<double>([
      TweenSequenceItem(tween: Tween(begin: 0.0, end: 0.6), weight: 40),
      TweenSequenceItem(tween: Tween(begin: 0.6, end: 0.15), weight: 60),
    ]).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: const Interval(0.2, 0.75, curve: Curves.easeInOut),
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
    _breathingGlow = Tween<double>(begin: 0.25, end: 0.6).animate(
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
    final roleColor = widget.isImposter ? AppColors.imposter : AppColors.citizen;
    final roleGlow = widget.isImposter ? AppColors.imposterGlow : AppColors.citizenGlow;

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
                  child: Container(color: Colors.transparent),
                ),
              ),

            // Light pulse & breathing glow
            if (_revealController.value > 0.1)
              Positioned(
                child: Transform.scale(
                  scale: _pulseAnimation.value,
                  child: Container(
                    width: 220,
                    height: 220,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: roleColor.withOpacity(
                            isCompleted ? _breathingGlow.value * 0.45 : _pulseOpacity.value,
                          ),
                          blurRadius: 80,
                          spreadRadius: 20,
                        ),
                      ],
                    ),
                  ),
                ),
              ),

            // Content container
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: isCompleted
                  ? _buildRevealedContent(roleColor, roleGlow, revealedSub)
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
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.surfaceElevated,
              border: Border.all(color: AppColors.surfaceBorder, width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.4),
                  blurRadius: 30,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: const Icon(
              Icons.fingerprint_rounded,
              size: 72,
              color: AppColors.accentGlow,
            ),
          ),
          const SizedBox(height: 28),
          Text(
            'TAP TO REVEAL SECRET',
            style: AppTextStyles.labelCaps.copyWith(
              color: AppColors.textPrimary,
              letterSpacing: 3.0,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Make sure no one else is looking',
            style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textMuted),
          ),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: widget.onRevealTap,
            icon: const Icon(Icons.visibility_rounded, size: 20),
            label: const Text('REVEAL SECRET'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.accent,
              minimumSize: const Size(220, 54),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRevealedContent(Color roleColor, Color roleGlow, String partialWord) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        // Category pill
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: AppColors.surfaceElevated.withOpacity(0.8),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.surfaceBorder),
          ),
          child: Text(
            widget.category.toUpperCase(),
            style: AppTextStyles.labelCaps.copyWith(
              color: AppColors.textSecondary,
              fontSize: 11,
            ),
          ),
        ),
        const SizedBox(height: 24),

        // Role badge
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          decoration: BoxDecoration(
            color: roleColor.withOpacity(0.15),
            borderRadius: BorderRadius.circular(30),
            border: Border.all(color: roleColor.withOpacity(0.5)),
          ),
          child: Text(
            widget.roleTitle.toUpperCase(),
            style: AppTextStyles.titleSmall.copyWith(
              color: roleGlow,
              fontWeight: FontWeight.w800,
              letterSpacing: 2.5,
            ),
          ),
        ),
        const SizedBox(height: 28),

        // Secret Word with character emergence
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: AppColors.surface.withOpacity(0.9),
            borderRadius: BorderRadius.circular(28),
            border: Border.all(color: roleColor.withOpacity(0.35)),
            boxShadow: [
              BoxShadow(
                color: roleColor.withOpacity(0.2),
                blurRadius: 40,
                spreadRadius: 2,
              ),
            ],
          ),
          child: Text(
            partialWord.isEmpty ? ' ' : partialWord,
            textAlign: TextAlign.center,
            style: AppTextStyles.secretWord.copyWith(
              color: AppColors.textPrimary,
              shadows: [
                Shadow(
                  color: roleGlow.withOpacity(0.6),
                  blurRadius: 18,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 20),

        // Role Subtitle / Instructions
        Text(
          widget.roleSubtitle,
          textAlign: TextAlign.center,
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSecondary,
            height: 1.4,
          ),
        ),
      ],
    );
  }
}
