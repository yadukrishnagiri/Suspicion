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

    // 1. Tension pause controller (800ms)
    _tensionController = AnimationController(
      vsync: this,
      duration: MotionConstants.eliminationPauseDuration,
    );

    _pulseScale = Tween<double>(begin: 1.0, end: 1.15).animate(
      CurvedAnimation(parent: _tensionController, curve: Curves.easeInOut),
    );

    // 2. Reveal wave controller (600ms)
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
    final roleColor = widget.isImposter ? AppColors.imposter : AppColors.citizen;
    final roleGlow = widget.isImposter ? AppColors.imposterGlow : AppColors.citizenGlow;
    final roleTitle = widget.isImposter ? 'IMPOSTER FOUND' : 'INNOCENT CITIZEN';
    final roleSubtitle = widget.isImposter
        ? '${widget.playerName} was indeed an Imposter!'
        : '${widget.playerName} was a Citizen.';

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
      child: AnimatedBuilder(
        animation: Listenable.merge([_tensionController, _revealController]),
        builder: (context, child) {
          return Container(
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(32),
              border: Border.all(
                color: _revealed
                    ? roleColor.withOpacity(0.6)
                    : AppColors.surfaceBorder,
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: _revealed
                      ? roleColor.withOpacity(0.35)
                      : Colors.black.withOpacity(0.5),
                  blurRadius: 40,
                  spreadRadius: _revealed ? 5 : 0,
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Text(
                  'ELIMINATION REVEAL',
                  style: AppTextStyles.labelCaps.copyWith(
                    color: AppColors.textMuted,
                    letterSpacing: 3.0,
                  ),
                ),
                const SizedBox(height: 28),

                // Tension Pulse / Role Wave Circle
                Transform.scale(
                  scale: _revealed ? 1.0 : _pulseScale.value,
                  child: Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _revealed
                          ? roleColor.withOpacity(0.18)
                          : AppColors.surfaceElevated,
                      border: Border.all(
                        color: _revealed ? roleColor : AppColors.surfaceBorder,
                        width: 2.5,
                      ),
                      boxShadow: _revealed
                          ? [
                              BoxShadow(
                                color: roleColor.withOpacity(_waveProgress.value * 0.4),
                                blurRadius: 35,
                                spreadRadius: 6,
                              ),
                            ]
                          : [],
                    ),
                    child: Center(
                      child: _revealed
                          ? Icon(
                              widget.isImposter
                                  ? Icons.warning_amber_rounded
                                  : Icons.shield_outlined,
                              size: 56,
                              color: roleGlow,
                            )
                          : const SizedBox(
                              width: 32,
                              height: 32,
                              child: CircularProgressIndicator(
                                strokeWidth: 3,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  AppColors.textSecondary,
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
                  style: AppTextStyles.titleLarge,
                ),
                const SizedBox(height: 16),

                // Role Reveal (Appears with wave)
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
                            color: roleColor.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: roleColor.withOpacity(0.4)),
                          ),
                          child: Text(
                            roleTitle,
                            style: AppTextStyles.titleSmall.copyWith(
                              color: roleGlow,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 2.0,
                            ),
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          roleSubtitle,
                          textAlign: TextAlign.center,
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 28),
                        SpringButton(
                          onTap: widget.onDismiss,
                          child: Container(
                            height: 52,
                            width: double.infinity,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: AppColors.surfaceElevated,
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(color: AppColors.surfaceBorder),
                            ),
                            child: Text(
                              'CONTINUE',
                              style: AppTextStyles.buttonText,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ] else ...[
                  Text(
                    'Determining identity...',
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
