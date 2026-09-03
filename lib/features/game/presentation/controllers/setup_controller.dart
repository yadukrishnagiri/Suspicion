import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/models/game_config.dart';
import '../../domain/models/game_mode.dart';

class SetupState {
  final int step; // 0: Players, 1: Imposters, 2: Names, 3: Mode, 4: Category, 5: Review
  final int playerCount;
  final int imposterCount;
  final List<String> playerNames;
  final GameMode gameMode;
  final String category;

  const SetupState({
    this.step = 0,
    this.playerCount = 5,
    this.imposterCount = 1,
    this.playerNames = const [],
    this.gameMode = GameMode.mode1,
    this.category = 'All Categories',
  });

  int get maxImpostersAllowed => GameConfig.maxImpostersForPlayers(playerCount);
  int get minPlayersRequired => GameConfig.minPlayersForImposters(imposterCount);

  bool get isNamesStepValid =>
      playerNames.length == playerCount &&
      playerNames.every((n) => n.trim().isNotEmpty);

  GameConfig toGameConfig() {
    return GameConfig(
      playerCount: playerCount,
      imposterCount: imposterCount,
      playerNames: playerNames.map((e) => e.trim()).toList(),
      gameMode: gameMode,
      category: category,
    );
  }

  SetupState copyWith({
    int? step,
    int? playerCount,
    int? imposterCount,
    List<String>? playerNames,
    GameMode? gameMode,
    String? category,
  }) {
    return SetupState(
      step: step ?? this.step,
      playerCount: playerCount ?? this.playerCount,
      imposterCount: imposterCount ?? this.imposterCount,
      playerNames: playerNames ?? this.playerNames,
      gameMode: gameMode ?? this.gameMode,
      category: category ?? this.category,
    );
  }
}

class SetupController extends StateNotifier<SetupState> {
  SetupController() : super(const SetupState());

  void setStep(int step) {
    state = state.copyWith(step: step);
  }

  void nextStep() {
    if (state.step < 4) {
      state = state.copyWith(step: state.step + 1);
    }
  }

  void previousStep() {
    if (state.step > 0) {
      state = state.copyWith(step: state.step - 1);
    }
  }

  void setPlayerCount(int count) {
    final clamped = count.clamp(GameConfig.minTotalPlayers, GameConfig.maxTotalPlayers);
    final maxImp = GameConfig.maxImpostersForPlayers(clamped);
    final adjustedImposters = state.imposterCount > maxImp ? maxImp : state.imposterCount;

    // Adjust player names list length if needed
    List<String> names = List.from(state.playerNames);
    if (names.length > clamped) {
      names = names.sublist(0, clamped);
    }

    state = state.copyWith(
      playerCount: clamped,
      imposterCount: adjustedImposters,
      playerNames: names,
    );
  }

  void setImposterCount(int count) {
    final maxAllowed = state.maxImpostersAllowed;
    final clamped = count.clamp(1, maxAllowed);
    state = state.copyWith(imposterCount: clamped);
  }

  void setPlayerNames(List<String> names) {
    state = state.copyWith(playerNames: names);
  }

  void setPlayerNameAt(int index, String name) {
    final names = List<String>.from(state.playerNames);
    while (names.length <= index) {
      names.add('');
    }
    names[index] = name;
    state = state.copyWith(playerNames: names);
  }

  void setGameMode(GameMode mode) {
    state = state.copyWith(gameMode: mode);
  }

  void setCategory(String category) {
    state = state.copyWith(category: category);
  }

  void initializeWithDefaults(List<String> recentNames) {
    final count = state.playerCount;
    final names = <String>[];
    for (int i = 0; i < count; i++) {
      if (i < recentNames.length) {
        names.add(recentNames[i]);
      } else {
        names.add('Player ${i + 1}');
      }
    }
    state = state.copyWith(playerNames: names);
  }
}

final setupControllerProvider =
    StateNotifierProvider<SetupController, SetupState>((ref) {
  return SetupController();
});
