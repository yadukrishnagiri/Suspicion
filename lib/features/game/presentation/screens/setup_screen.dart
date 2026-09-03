import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/navigation/app_routes.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/spring_button.dart';
import '../../../../core/utils/haptics.dart';
import '../../../auth/presentation/controllers/auth_controller.dart';
import '../../domain/models/game_config.dart';
import '../../domain/models/game_mode.dart';
import '../controllers/game_controller.dart';
import '../controllers/setup_controller.dart';

class SetupScreen extends ConsumerStatefulWidget {
  const SetupScreen({super.key});

  @override
  ConsumerState<SetupScreen> createState() => _SetupScreenState();
}

class _SetupScreenState extends ConsumerState<SetupScreen> {
  final Map<int, TextEditingController> _controllers = {};
  final List<String> _categories = [
    'All Categories',
    'Food & Drinks',
    'Everyday Objects',
    'Animals & Nature',
    'Places & Travel',
    'Concepts & Weather',
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
      if (!_controllers.containsKey(i)) {
        final initialText = i < setup.playerNames.length ? setup.playerNames[i] : 'Player ${i + 1}';
        _controllers[i] = TextEditingController(text: initialText);
      }
    }
  }

  @override
  void dispose() {
    for (final c in _controllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  void _onStartGame() {
    AppHaptics.medium();
    final setup = ref.read(setupControllerProvider);

    // Collect names
    final names = <String>[];
    for (int i = 0; i < setup.playerCount; i++) {
      final text = _controllers[i]?.text.trim() ?? '';
      names.add(text.isEmpty ? 'Player ${i + 1}' : text);
    }
    ref.read(setupControllerProvider.notifier).setPlayerNames(names);

    final config = setup.toGameConfig().copyWith(playerNames: names);

    // Save recent player names
    ref.read(authProvider.notifier).saveGameParticipants(config.playerNames);

    // Start game
    ref.read(gameControllerProvider.notifier).startGame(config);

    Navigator.pushReplacementNamed(context, AppRoutes.reveal);
  }

  @override
  Widget build(BuildContext context) {
    final setup = ref.watch(setupControllerProvider);
    final recentNames = ref.watch(authProvider).profile.recentPlayerNames;
    final maxImposters = setup.maxImpostersAllowed;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Game Setup',
          style: AppTextStyles.titleMedium,
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                children: [
                  // 1. Players Section
                  _buildSectionHeader('PLAYERS', '${setup.playerCount} participants'),
                  const SizedBox(height: 10),
                  SizedBox(
                    height: 44,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: (GameConfig.maxTotalPlayers - GameConfig.minTotalPlayers) + 1,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (context, i) {
                        final count = GameConfig.minTotalPlayers + i;
                        final isSelected = setup.playerCount == count;
                        return SpringButton(
                          onTap: () {
                            AppHaptics.selection();
                            ref.read(setupControllerProvider.notifier).setPlayerCount(count);
                            _syncControllers();
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 150),
                            width: 50,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: isSelected ? AppColors.accent : AppColors.surface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isSelected ? AppColors.accent : AppColors.surfaceBorder,
                              ),
                            ),
                            child: Text(
                              '$count',
                              style: AppTextStyles.titleSmall.copyWith(
                                color: isSelected ? Colors.black : AppColors.textPrimary,
                                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 24),

                  // 2. Imposters Section
                  _buildSectionHeader('IMPOSTERS', '${setup.imposterCount} hidden in group'),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: List.generate(maxImposters, (index) {
                      final count = index + 1;
                      final isSelected = setup.imposterCount == count;
                      return SpringButton(
                        onTap: () {
                          AppHaptics.selection();
                          ref.read(setupControllerProvider.notifier).setImposterCount(count);
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 150),
                          width: 50,
                          height: 44,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.imposter : AppColors.surface,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected ? AppColors.imposter : AppColors.surfaceBorder,
                            ),
                          ),
                          child: Text(
                            '$count',
                            style: AppTextStyles.titleSmall.copyWith(
                              color: isSelected ? Colors.white : AppColors.textPrimary,
                              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                            ),
                          ),
                        ),
                      );
                    }),
                  ),

                  const SizedBox(height: 24),

                  // 3. Game Mode Section
                  _buildSectionHeader('DECEPTION MODE', setup.gameMode.title),
                  const SizedBox(height: 10),
                  ...GameMode.values.map((mode) {
                    final isSelected = setup.gameMode == mode;
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: SpringButton(
                        onTap: () {
                          AppHaptics.selection();
                          ref.read(setupControllerProvider.notifier).setGameMode(mode);
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 150),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.surfaceElevated : AppColors.surface,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isSelected ? AppColors.accent : AppColors.surfaceBorder,
                              width: isSelected ? 1.5 : 1.0,
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 16,
                                height: 16,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: isSelected ? AppColors.accent : AppColors.textMuted,
                                    width: 2,
                                  ),
                                  color: isSelected ? AppColors.accent : Colors.transparent,
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      mode.title,
                                      style: AppTextStyles.titleSmall.copyWith(
                                        color: isSelected ? AppColors.textPrimary : AppColors.textSecondary,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      mode.subtitle,
                                      style: AppTextStyles.bodyMedium.copyWith(
                                        fontSize: 12,
                                        color: AppColors.textMuted,
                                      ),
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

                  const SizedBox(height: 24),

                  // 4. Category Section
                  _buildSectionHeader('CATEGORY', setup.category),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _categories.map((cat) {
                      final isSelected = setup.category == cat;
                      return SpringButton(
                        onTap: () {
                          AppHaptics.selection();
                          ref.read(setupControllerProvider.notifier).setCategory(cat);
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 150),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.accent : AppColors.surface,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected ? AppColors.accent : AppColors.surfaceBorder,
                            ),
                          ),
                          child: Text(
                            cat,
                            style: AppTextStyles.bodyMedium.copyWith(
                              fontSize: 13,
                              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                              color: isSelected ? Colors.black : AppColors.textSecondary,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 28),

                  // 5. Player Names Section
                  _buildSectionHeader('PLAYER NAMES', 'Seated order'),
                  const SizedBox(height: 8),

                  if (recentNames.isNotEmpty) ...[
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: recentNames.take(8).map((name) {
                        return ActionChip(
                          backgroundColor: AppColors.surfaceElevated,
                          side: const BorderSide(color: AppColors.surfaceBorder),
                          labelPadding: const EdgeInsets.symmetric(horizontal: 6, vertical: -2),
                          label: Text(
                            '+ $name',
                            style: AppTextStyles.bodyMedium.copyWith(fontSize: 12, color: AppColors.textSecondary),
                          ),
                          onPressed: () {
                            AppHaptics.selection();
                            for (int i = 0; i < setup.playerCount; i++) {
                              final c = _controllers[i];
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
                    const SizedBox(height: 14),
                  ],

                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: setup.playerCount,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      _controllers.putIfAbsent(
                        index,
                        () => TextEditingController(text: 'Player ${index + 1}'),
                      );
                      final controller = _controllers[index]!;

                      return Container(
                        height: 50,
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.surfaceBorder),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 38,
                              alignment: Alignment.center,
                              child: Text(
                                '${index + 1}',
                                style: AppTextStyles.labelCaps.copyWith(color: AppColors.textMuted),
                              ),
                            ),
                            Container(width: 1, height: 24, color: AppColors.surfaceBorder),
                            Expanded(
                              child: TextField(
                                controller: controller,
                                style: AppTextStyles.titleSmall.copyWith(fontSize: 14),
                                decoration: const InputDecoration(
                                  hintText: 'Enter name',
                                  border: InputBorder.none,
                                  enabledBorder: InputBorder.none,
                                  focusedBorder: InputBorder.none,
                                  fillColor: Colors.transparent,
                                  contentPadding: EdgeInsets.symmetric(horizontal: 14),
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 32),
                ],
              ),
            ),

            // Bottom Start Button
            Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: AppColors.background,
                border: Border(top: BorderSide(color: AppColors.surfaceBorderSubtle)),
              ),
              child: SpringButton(
                onTap: _onStartGame,
                child: Container(
                  height: 52,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: AppColors.accent,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    'Start Game · ${setup.playerCount} Players',
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

  Widget _buildSectionHeader(String title, String subtitle) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: AppTextStyles.labelCaps),
        Text(
          subtitle,
          style: AppTextStyles.bodyMedium.copyWith(fontSize: 12, color: AppColors.textMuted),
        ),
      ],
    );
  }
}
