import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../utils/haptics.dart';
import 'motion_constants.dart';
import 'spring_button.dart';

class DiscussionStarterWidget extends StatefulWidget {
  final String starterName;
  final VoidCallback onProceedToBoard;

  const DiscussionStarterWidget({
    super.key,
    required this.starterName,
    required this.onProceedToBoard,
  });

  @override
  State<DiscussionStarterWidget> createState() => _DiscussionStarterWidgetState();
}

class _DiscussionStarterWidgetState extends State<DiscussionStarterWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  late Animation<double> _spotlightScale;
  late Animation<double> _spotlightOpacity;
  late Animation<Offset> _nameSlide;
  late Animation<double> _nameOpacity;
  late Animation<double> _bannerOpacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: MotionConstants.starterStageDuration,
    );

    // Stage 2: Spotlight expands from center (0.1 to 0.5)
    _spotlightScale = Tween<double>(begin: 0.1, end: 1.4).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.1, 0.55, curve: Curves.easeOutBack),
      ),
    );
    _spotlightOpacity = Tween<double>(begin: 0.0, end: 0.7).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.1, 0.45, curve: Curves.easeIn),
      ),
    );

    // Stage 3: Starter name rises upward (0.4 to 0.8)
    _nameSlide = Tween<Offset>(
      begin: const Offset(0.0, 0.5),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.35, 0.8, curve: Curves.easeOutCubic),
      ),
    );
    _nameOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.35, 0.7, curve: Curves.easeIn),
      ),
    );

    // Stage 5: "START THE DISCUSSION" banner (0.75 to 1.0)
    _bannerOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.75, 1.0, curve: Curves.easeIn),
      ),
    );

    // Stage 4: Haptic trigger at peak moment
    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        AppHaptics.medium();
      }
    });

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Stack(
          alignment: Alignment.center,
          children: [
            // Expanding center spotlight
            Transform.scale(
              scale: _spotlightScale.value,
              child: Container(
                width: 280,
                height: 280,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      AppColors.accent.withOpacity(_spotlightOpacity.value * 0.5),
                      AppColors.accentGlow.withOpacity(_spotlightOpacity.value * 0.2),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Pre-title
                  Text(
                    'FIRST SPEAKER CHOSEN',
                    style: AppTextStyles.labelCaps.copyWith(
                      color: AppColors.textMuted,
                      letterSpacing: 3.5,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Avatar / Spotlight circle
                  Container(
                    width: 110,
                    height: 110,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.surfaceElevated,
                      border: Border.all(
                        color: AppColors.accentGlow.withOpacity(_nameOpacity.value),
                        width: 2.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.accent.withOpacity(0.3 * _nameOpacity.value),
                          blurRadius: 30,
                          spreadRadius: 4,
                        ),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        widget.starterName.isNotEmpty
                            ? widget.starterName[0].toUpperCase()
                            : '?',
                        style: AppTextStyles.heroDisplay.copyWith(
                          fontSize: 48,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Stage 3: Starter name rises upward
                  SlideTransition(
                    position: _nameSlide,
                    child: Opacity(
                      opacity: _nameOpacity.value,
                      child: Text(
                        widget.starterName,
                        textAlign: TextAlign.center,
                        style: AppTextStyles.heroDisplay.copyWith(
                          fontSize: 36,
                          letterSpacing: 2.0,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Stage 5: Hero statement
                  Opacity(
                    opacity: _bannerOpacity.value,
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceBorderSubtle,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.surfaceBorder),
                          ),
                          child: Text(
                            'START THE DISCUSSION',
                            style: AppTextStyles.titleSmall.copyWith(
                              color: AppColors.gold,
                              letterSpacing: 2.0,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          '${widget.starterName} begins by giving the first clue.',
                          textAlign: TextAlign.center,
                          style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
                        ),
                        const SizedBox(height: 48),
                        SpringButton(
                          onTap: widget.onProceedToBoard,
                          child: Container(
                            height: 56,
                            width: double.infinity,
                            alignment: Alignment.center,
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
                            child: Text(
                              'OPEN PEOPLE BOARD',
                              style: AppTextStyles.buttonText,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}
