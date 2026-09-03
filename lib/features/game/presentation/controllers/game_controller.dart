import 'dart:math';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/models/game_config.dart';
import '../../domain/models/game_state.dart';
import '../../domain/models/player.dart';
import '../../domain/models/word_entry.dart';
import '../../data/repositories/local_word_repository.dart';

final wordRepositoryProvider = Provider<LocalWordRepository>((ref) {
  return LocalWordRepository();
});

class GameController extends StateNotifier<GameState> {
  final LocalWordRepository _wordRepo;
  final Random _random = Random.secure();

  GameController({required LocalWordRepository wordRepo})
      : _wordRepo = wordRepo,
        super(const GameState());

  GameState get currentState => state;

  /// Start a new game with the given configuration
  void startGame(GameConfig config) {
    if (!config.isValid()) {
      throw ArgumentError('Invalid game configuration according to official rules');
    }

    // 1. Pick a random word from category
    final WordEntry wordEntry = _wordRepo.getRandomWord(config.category);

    // 2. Assign imposters randomly while keeping entered player order intact
    final totalPlayers = config.playerNames.length;
    final imposterIndices = <int>{};
    while (imposterIndices.length < config.imposterCount) {
      imposterIndices.add(_random.nextInt(totalPlayers));
    }

    final List<Player> players = [];
    for (int i = 0; i < totalPlayers; i++) {
      players.add(Player(
        id: 'player_$i',
        name: config.playerNames[i].trim(),
        isImposter: imposterIndices.contains(i),
        isEliminated: false,
      ));
    }

    state = GameState(
      config: config,
      wordEntry: wordEntry,
      players: players,
      currentRevealIndex: 0,
      isWordRevealed: false,
      phase: GamePhase.privateReveal,
    );
  }

  /// Toggle reveal state for current private reveal player
  void toggleWordReveal(bool revealed) {
    state = state.copyWith(isWordRevealed: revealed);
  }

  /// Finish current player's turn and pass phone to the next player
  void passPhoneToNext() {
    final nextIndex = state.currentRevealIndex + 1;
    if (nextIndex >= state.players.length) {
      // All players have reviewed their secrets! Pick random discussion starter
      final starter = state.players[_random.nextInt(state.players.length)];
      state = state.copyWith(
        currentRevealIndex: nextIndex,
        isWordRevealed: false,
        discussionStarter: starter,
        phase: GamePhase.discussionStarter,
      );
    } else {
      state = state.copyWith(
        currentRevealIndex: nextIndex,
        isWordRevealed: false,
      );
    }
  }

  /// Transition from Discussion Starter reveal to Active Player Board
  void proceedToActiveBoard() {
    state = state.copyWith(phase: GamePhase.activeBoard);
  }

  /// Select player for elimination review
  void selectForElimination(Player player) {
    if (player.isEliminated) return;
    state = state.copyWith(
      recentlyEliminatedPlayer: player,
      phase: GamePhase.eliminationReveal,
    );
  }

  /// Cancel elimination dialog
  void cancelElimination() {
    state = state.copyWith(
      phase: GamePhase.activeBoard,
      clearRecentlyEliminated: true,
    );
  }

  /// Confirm player elimination and evaluate win condition
  void confirmElimination([Player? playerOverride]) {
    final target = playerOverride ?? state.recentlyEliminatedPlayer;
    if (target == null) return;

    final updatedPlayers = state.players.map((p) {
      if (p.id == target.id) {
        return p.copyWith(isEliminated: true);
      }
      return p;
    }).toList();

    // Check win conditions:
    // 1. Players Win: All imposters eliminated
    // 2. Imposters Win: Active imposters >= active citizens
    final activeImposters = updatedPlayers.where((p) => p.isImposter && !p.isEliminated).length;
    final activeCitizens = updatedPlayers.where((p) => !p.isImposter && !p.isEliminated).length;

    GameWinner? winner;
    GamePhase nextPhase = GamePhase.activeBoard;

    if (activeImposters == 0) {
      winner = GameWinner.citizens;
      nextPhase = GamePhase.gameResult;
    } else if (activeImposters >= activeCitizens) {
      winner = GameWinner.imposters;
      nextPhase = GamePhase.gameResult;
    }

    state = state.copyWith(
      players: updatedPlayers,
      recentlyEliminatedPlayer: target.copyWith(isEliminated: true),
      winner: winner,
      phase: nextPhase,
    );
  }

  /// Start a new game while keeping participant names and player order
  void startNewGameSamePlayers() {
    final config = state.config;
    final WordEntry newWord = _wordRepo.getRandomWord(config.category);

    // Re-assign imposters randomly
    final totalPlayers = state.players.length;
    final imposterIndices = <int>{};
    while (imposterIndices.length < config.imposterCount) {
      imposterIndices.add(_random.nextInt(totalPlayers));
    }

    // Keep names and order
    final List<Player> resetPlayers = [];
    for (int i = 0; i < totalPlayers; i++) {
      resetPlayers.add(Player(
        id: 'player_$i',
        name: state.players[i].name,
        isImposter: imposterIndices.contains(i),
        isEliminated: false,
      ));
    }

    state = GameState(
      config: config,
      wordEntry: newWord,
      players: resetPlayers,
      currentRevealIndex: 0,
      isWordRevealed: false,
      phase: GamePhase.privateReveal,
    );
  }

  /// Reset to setup wizard
  void resetToSetup() {
    state = GameState(
      config: state.config,
      phase: GamePhase.setup,
    );
  }
}

final gameControllerProvider =
    StateNotifierProvider<GameController, GameState>((ref) {
  final wordRepo = ref.watch(wordRepositoryProvider);
  return GameController(wordRepo: wordRepo);
});
