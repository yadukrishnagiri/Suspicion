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

    // Stage 2: Spotlight expands from center
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

    // Stage 3: Starter name rises upward
    _nameSlide = Tween<Offset>(
      begin: const Offset(0.0, 0.4),
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

    // Stage 5: "START THE DISCUSSION"
    _bannerOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.75, 1.0, curve: Curves.easeIn),
      ),
    );

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
            // Spotlight glow
            Transform.scale(
              scale: _spotlightScale.value,
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      AppColors.gold.withOpacity(_spotlightOpacity.value * 0.35),
                      AppColors.goldMuted.withOpacity(_spotlightOpacity.value * 0.1),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'THE FIRST SPEAKER',
                    style: AppTextStyles.labelCaps.copyWith(
                      color: AppColors.textSecondary,
                      letterSpacing: 4.0,
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Spotlight circle with initial
                  Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.surfaceElevated,
                      border: Border.all(
                        color: AppColors.gold.withOpacity(_nameOpacity.value),
                        width: 2.0,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.gold.withOpacity(0.25 * _nameOpacity.value),
                          blurRadius: 30,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        widget.starterName.isNotEmpty
                            ? widget.starterName[0].toUpperCase()
                            : '?',
                        style: AppTextStyles.heroDisplay.copyWith(
                          fontSize: 44,
                          color: AppColors.goldLight,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Starter Name
                  SlideTransition(
                    position: _nameSlide,
                    child: Opacity(
                      opacity: _nameOpacity.value,
                      child: Text(
                        widget.starterName,
                        textAlign: TextAlign.center,
                        style: AppTextStyles.heroDisplay.copyWith(
                          fontSize: 36,
                          letterSpacing: 3.0,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Stage 5 Banner
                  Opacity(
                    opacity: _bannerOpacity.value,
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceBorderSubtle,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.surfaceBorder),
                          ),
                          child: Text(
                            'OPENS THE FLOOR',
                            style: AppTextStyles.labelCaps.copyWith(
                              color: AppColors.goldLight,
                              letterSpacing: 2.5,
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          '${widget.starterName} must start by giving the first clue.',
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
                              gradient: AppColors.goldGradient,
                              borderRadius: BorderRadius.circular(18),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.gold.withOpacity(0.25),
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
