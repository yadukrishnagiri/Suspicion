import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import '../utils/haptics.dart';
import 'motion_constants.dart';
import 'spring_button.dart';

class EliminationRevealWidget extends StatefulWidget {
  final String playerName;
  final bool isImposter;
  final VoidCallback onDismiss;

  const EliminationRevealWidget({
    super.key,
    required this.playerName,
    required this.isImposter,
    required this.onDismiss,
  });

  @override
  State<EliminationRevealWidget> createState() => _EliminationRevealWidgetState();
}

class _EliminationRevealWidgetState extends State<EliminationRevealWidget>
    with TickerProviderStateMixin {
  late AnimationController _tensionController;
  late AnimationController _revealController;

  late Animation<double> _pulseScale;
  late Animation<double> _waveProgress;
  late Animation<double> _resultOpacity;
  bool _revealed = false;

  @override
  void initState() {
    super.initState();

    // 1. Tension pause (800ms)
    _tensionController = AnimationController(
      vsync: this,
      duration: MotionConstants.eliminationPauseDuration,
    );

    _pulseScale = Tween<double>(begin: 1.0, end: 1.12).animate(
      CurvedAnimation(parent: _tensionController, curve: Curves.easeInOut),
    );

    // 2. Reveal wave (600ms)
    _revealController = AnimationController(
      vsync: this,
      duration: MotionConstants.eliminationWaveDuration,
    );

    _waveProgress = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _revealController, curve: Curves.easeOutCubic),
    );

    _resultOpacity = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _revealController,
        curve: const Interval(0.4, 1.0, curve: Curves.easeIn),
      ),
    );

    _startSequence();
  }

  Future<void> _startSequence() async {
    AppHaptics.suspense();
    await _tensionController.forward();
    if (!mounted) return;

    setState(() {
      _revealed = true;
    });

    if (widget.isImposter) {
      AppHaptics.heavy();
    } else {
      AppHaptics.light();
    }

    await _revealController.forward();
  }

  @override
  void dispose() {
    _tensionController.dispose();
    _revealController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final roleColor = widget.isImposter ? AppColors.imposter : AppColors.goldMuted;
    final roleGlow = widget.isImposter ? AppColors.imposterGlow : AppColors.goldLight;
    final roleTitle = widget.isImposter ? 'IMPOSTER UNMASKED' : 'INNOCENT CITIZEN';
    final roleSubtitle = widget.isImposter
        ? '${widget.playerName} was indeed an Imposter!'
        : '${widget.playerName} was a Citizen. The group eliminated an innocent.';

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 28, vertical: 40),
      child: AnimatedBuilder(
        animation: Listenable.merge([_tensionController, _revealController]),
        builder: (context, child) {
          return Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(
                color: _revealed
                    ? (widget.isImposter ? AppColors.imposter : AppColors.surfaceBorder)
                    : AppColors.surfaceBorder,
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: _revealed && widget.isImposter
                      ? AppColors.imposter.withOpacity(0.3)
                      : Colors.black.withOpacity(0.6),
                  blurRadius: 40,
                  spreadRadius: _revealed ? 2 : 0,
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'VERDICT',
                  style: AppTextStyles.labelCaps.copyWith(
                    color: AppColors.textMuted,
                    letterSpacing: 4.0,
                  ),
                ),
                const SizedBox(height: 28),

                // Icon / Status circle
                Transform.scale(
                  scale: _revealed ? 1.0 : _pulseScale.value,
                  child: Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _revealed
                          ? (widget.isImposter ? AppColors.imposterVelvet : AppColors.surfaceElevated)
                          : AppColors.surfaceElevated,
                      border: Border.all(
                        color: _revealed ? roleColor : AppColors.surfaceBorder,
                        width: 2.0,
                      ),
                      boxShadow: _revealed
                          ? [
                              BoxShadow(
                                color: roleColor.withOpacity(_waveProgress.value * 0.35),
                                blurRadius: 30,
                              ),
                            ]
                          : [],
                    ),
                    child: Center(
                      child: _revealed
                          ? Icon(
                              widget.isImposter
                                  ? Icons.theater_comedy_rounded
                                  : Icons.verified_user_outlined,
                              size: 48,
                              color: roleGlow,
                            )
                          : const SizedBox(
                              width: 28,
                              height: 28,
                              child: CircularProgressIndicator(
                                strokeWidth: 2.5,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  AppColors.goldLight,
                                ),
                              ),
                            ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Player name
                Text(
                  widget.playerName,
                  style: AppTextStyles.titleLarge.copyWith(fontSize: 28),
                ),
                const SizedBox(height: 16),

                // Revealed Verdict
                if (_revealed) ...[
                  Opacity(
                    opacity: _resultOpacity.value,
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: widget.isImposter
                                ? AppColors.imposter.withOpacity(0.2)
                                : AppColors.surfaceElevated,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: roleColor.withOpacity(0.5)),
                          ),
                          child: Text(
                            roleTitle,
                            style: AppTextStyles.titleSmall.copyWith(
                              color: roleGlow,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 2.5,
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          roleSubtitle,
                          textAlign: TextAlign.center,
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                            height: 1.5,
                          ),
                        ),
                        const SizedBox(height: 32),
                        SpringButton(
                          onTap: widget.onDismiss,
                          child: Container(
                            height: 52,
                            width: double.infinity,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              gradient: widget.isImposter ? AppColors.imposterGradient : AppColors.goldGradient,
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Text(
                              'CONTINUE',
                              style: AppTextStyles.buttonText.copyWith(
                                color: widget.isImposter ? Colors.white : Colors.black,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ] else ...[
                  Text(
                    'Revealing identity...',
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textMuted,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ],
            ),
          );
        },
      ),
    );
  }
}
