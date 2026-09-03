import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/spring_button.dart';
import '../../../../core/utils/haptics.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../domain/models/game_config.dart';
import '../../domain/models/game_mode.dart';
import '../controllers/game_controller.dart';
import '../controllers/setup_controller.dart';
import 'private_reveal_screen.dart';

class SetupWizardScreen extends ConsumerStatefulWidget {
  const SetupWizardScreen({super.key});

  @override
  ConsumerState<SetupWizardScreen> createState() => _SetupWizardScreenState();
}

class _SetupWizardScreenState extends ConsumerState<SetupWizardScreen> {
  final Map<int, TextEditingController> _nameControllers = {};
  final List<String> _categories = [
    'All Categories',
    'Concepts & Weather',
    'Food & Drinks',
    'Animals & Nature',
    'Everyday Objects',
    'Places & Travel',
    'Sports & Activities',
    'Occupations',
    'Pop Culture & Media',
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = ref.read(authProvider);
      final setup = ref.read(setupControllerProvider);
      if (setup.playerNames.isEmpty) {
        ref.read(setupControllerProvider.notifier).initializeWithDefaults(
          auth.profile.recentPlayerNames,
        );
      }
      _syncControllers();
    });
  }

  void _syncControllers() {
    final setup = ref.read(setupControllerProvider);
    for (int i = 0; i < setup.playerCount; i++) {
      if (!_nameControllers.containsKey(i)) {
        final initialText = i < setup.playerNames.length ? setup.playerNames[i] : 'Player ${i + 1}';
        _nameControllers[i] = TextEditingController(text: initialText);
      }
    }
  }

  @override
  void dispose() {
    for (final c in _nameControllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  void _onNext() {
    AppHaptics.selection();
    final setup = ref.read(setupControllerProvider);

    if (setup.step == 2) {
      // Collect names
      final names = <String>[];
      for (int i = 0; i < setup.playerCount; i++) {
        final text = _nameControllers[i]?.text.trim() ?? '';
        names.add(text.isEmpty ? 'Player ${i + 1}' : text);
      }
      ref.read(setupControllerProvider.notifier).setPlayerNames(names);
    }

    if (setup.step < 4) {
      ref.read(setupControllerProvider.notifier).nextStep();
    } else {
      // Final start game
      _launchGame();
    }
  }

  void _launchGame() async {
    final setup = ref.read(setupControllerProvider);
    final config = setup.toGameConfig();

    // Persist player names to Firestore & local cache
    ref.read(authProvider.notifier).saveGameParticipants(config.playerNames);

    // Initialize game
    ref.read(gameControllerProvider.notifier).startGame(config);

    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const PrivateRevealScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final setup = ref.watch(setupControllerProvider);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () {
            if (setup.step > 0) {
              ref.read(setupControllerProvider.notifier).previousStep();
            } else {
              Navigator.pop(context);
            }
          },
        ),
        title: Text(
          'SETUP (${setup.step + 1}/5)',
          style: AppTextStyles.labelCaps.copyWith(color: AppColors.textSecondary),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Progress Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: (setup.step + 1) / 5,
                  backgroundColor: AppColors.surfaceElevated,
                  valueColor: const AlwaysStoppedAnimation<Color>(AppColors.accent),
                  minHeight: 4,
                ),
              ),
            ),

            // Step Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                child: _buildStepContent(setup),
              ),
            ),

            // Bottom Continue Action
            Padding(
              padding: const EdgeInsets.all(24),
              child: SpringButton(
                onTap: _onNext,
                child: Container(
                  height: 56,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: AppColors.accent,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.accent.withOpacity(0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    setup.step == 4 ? 'START GAME' : 'CONTINUE',
                    style: AppTextStyles.buttonText,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStepContent(SetupState setup) {
    switch (setup.step) {
      case 0:
        return _buildPlayerCountStep(setup);
      case 1:
        return _buildImposterCountStep(setup);
      case 2:
        return _buildNameEntryStep(setup);
      case 3:
        return _buildGameModeStep(setup);
      case 4:
        return _buildCategoryStep(setup);
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildPlayerCountStep(SetupState setup) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('How many players?', style: AppTextStyles.titleLarge),
        const SizedBox(height: 8),
        Text(
          'Select between 3 and 15 participants.',
          style: AppTextStyles.bodyMedium,
        ),
        const SizedBox(height: 48),

        Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SpringButton(
                onTap: setup.playerCount > GameConfig.minTotalPlayers
                    ? () {
                        ref.read(setupControllerProvider.notifier).setPlayerCount(setup.playerCount - 1);
                        _syncControllers();
                      }
                    : null,
                child: Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.surfaceElevated,
                    border: Border.all(color: AppColors.surfaceBorder),
                  ),
                  child: const Icon(Icons.remove, color: AppColors.textPrimary),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 36),
                child: Text(
                  '${setup.playerCount}',
                  style: AppTextStyles.heroDisplay.copyWith(fontSize: 64),
                ),
              ),
              SpringButton(
                onTap: setup.playerCount < GameConfig.maxTotalPlayers
                    ? () {
                        ref.read(setupControllerProvider.notifier).setPlayerCount(setup.playerCount + 1);
                        _syncControllers();
                      }
                    : null,
                child: Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.surfaceElevated,
                    border: Border.all(color: AppColors.surfaceBorder),
                  ),
                  child: const Icon(Icons.add, color: AppColors.textPrimary),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildImposterCountStep(SetupState setup) {
    final maxAllowed = setup.maxImpostersAllowed;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('How many imposters?', style: AppTextStyles.titleLarge),
        const SizedBox(height: 8),
        Text(
          'For ${setup.playerCount} players, rule requires minimum (2 × imposters) + 1. Max: $maxAllowed.',
          style: AppTextStyles.bodyMedium,
        ),
        const SizedBox(height: 48),

        Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SpringButton(
                onTap: setup.imposterCount > 1
                    ? () {
                        ref.read(setupControllerProvider.notifier).setImposterCount(setup.imposterCount - 1);
                      }
                    : null,
                child: Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.surfaceElevated,
                    border: Border.all(color: AppColors.surfaceBorder),
                  ),
                  child: const Icon(Icons.remove, color: AppColors.textPrimary),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 36),
                child: Text(
                  '${setup.imposterCount}',
                  style: AppTextStyles.heroDisplay.copyWith(
                    fontSize: 64,
                    color: AppColors.imposterGlow,
                  ),
                ),
              ),
              SpringButton(
                onTap: setup.imposterCount < maxAllowed
                    ? () {
                        ref.read(setupControllerProvider.notifier).setImposterCount(setup.imposterCount + 1);
                      }
                    : null,
                child: Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.surfaceElevated,
                    border: Border.all(color: AppColors.surfaceBorder),
                  ),
                  child: const Icon(Icons.add, color: AppColors.textPrimary),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 32),
        Center(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.surfaceElevated,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text(
              '${setup.playerCount - setup.imposterCount} Citizens  •  ${setup.imposterCount} Imposters',
              style: AppTextStyles.labelCaps.copyWith(color: AppColors.textSecondary),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildNameEntryStep(SetupState setup) {
    final recentNames = ref.watch(authProvider).profile.recentPlayerNames;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Player Names', style: AppTextStyles.titleLarge),
        const SizedBox(height: 8),
        Text(
          'Enter names in passing order. Order is preserved during reveal.',
          style: AppTextStyles.bodyMedium,
        ),
        const SizedBox(height: 20),

        // Quick suggestions from recent names
        if (recentNames.isNotEmpty) ...[
          Text('RECENT PLAYERS', style: AppTextStyles.labelCaps.copyWith(fontSize: 10)),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: recentNames.take(8).map((name) {
              return ActionChip(
                backgroundColor: AppColors.surfaceElevated,
                label: Text(name, style: AppTextStyles.bodyMedium),
                onPressed: () {
                  // Fill first empty or focused controller
                  for (int i = 0; i < setup.playerCount; i++) {
                    final c = _nameControllers[i];
                    if (c != null && (c.text.isEmpty || c.text.startsWith('Player '))) {
                      c.text = name;
                      break;
                    }
                  }
                  setState(() {});
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
        ],

        // Input Fields
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: setup.playerCount,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            _nameControllers.putIfAbsent(
              index,
              () => TextEditingController(text: 'Player ${index + 1}'),
            );
            final controller = _nameControllers[index]!;

            return Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.surfaceElevated,
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    '${index + 1}',
                    style: AppTextStyles.labelCaps.copyWith(color: AppColors.accentGlow),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: controller,
                    style: AppTextStyles.titleSmall,
                    decoration: InputDecoration(
                      hintText: 'Enter name',
                      suffixIcon: controller.text.isNotEmpty && !controller.text.startsWith('Player ')
                          ? IconButton(
                              icon: const Icon(Icons.clear, size: 18),
                              onPressed: () {
                                controller.clear();
                                setState(() {});
                              },
                            )
                          : null,
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ],
    );
  }

  Widget _buildGameModeStep(SetupState setup) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Choose Game Mode', style: AppTextStyles.titleLarge),
        const SizedBox(height: 8),
        Text('Controls what imposters see during reveal.', style: AppTextStyles.bodyMedium),
        const SizedBox(height: 24),

        ...GameMode.values.map((mode) {
          final isSelected = setup.gameMode == mode;
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: SpringButton(
              onTap: () {
                AppHaptics.selection();
                ref.read(setupControllerProvider.notifier).setGameMode(mode);
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.accent.withOpacity(0.12) : AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(
                    color: isSelected ? AppColors.accent : AppColors.surfaceBorder,
                    width: isSelected ? 2.0 : 1.0,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      isSelected ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
                      color: isSelected ? AppColors.accent : AppColors.textMuted,
                      size: 24,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(mode.title, style: AppTextStyles.titleMedium),
                          const SizedBox(height: 4),
                          Text(
                            mode.subtitle,
                            style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildCategoryStep(SetupState setup) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Select Category', style: AppTextStyles.titleLarge),
        const SizedBox(height: 8),
        Text('One category per game from the master dataset.', style: AppTextStyles.bodyMedium),
        const SizedBox(height: 20),

        ..._categories.map((cat) {
          final isSelected = setup.category == cat;
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: SpringButton(
              onTap: () {
                AppHaptics.selection();
                ref.read(setupControllerProvider.notifier).setCategory(cat);
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.accent.withOpacity(0.12) : AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: isSelected ? AppColors.accent : AppColors.surfaceBorder,
                    width: isSelected ? 2.0 : 1.0,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      _getCategoryIcon(cat),
                      color: isSelected ? AppColors.accentGlow : AppColors.textSecondary,
                      size: 22,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        cat,
                        style: AppTextStyles.titleSmall.copyWith(
                          color: isSelected ? AppColors.textPrimary : AppColors.textSecondary,
                        ),
                      ),
                    ),
                    if (isSelected)
                      const Icon(Icons.check_rounded, color: AppColors.accent, size: 20),
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }

  IconData _getCategoryIcon(String cat) {
    switch (cat) {
      case 'Concepts & Weather':
        return Icons.wb_sunny_outlined;
      case 'Food & Drinks':
        return Icons.restaurant_rounded;
      case 'Animals & Nature':
        return Icons.pets_rounded;
      case 'Everyday Objects':
        return Icons.lightbulb_outline_rounded;
      case 'Places & Travel':
        return Icons.flight_takeoff_rounded;
      case 'Sports & Activities':
        return Icons.sports_basketball_rounded;
      case 'Occupations':
        return Icons.work_outline_rounded;
      case 'Pop Culture & Media':
        return Icons.movie_creation_outlined;
      default:
        return Icons.auto_awesome_rounded;
    }
  }
}
