import 'game_config.dart';
import 'player.dart';
import 'word_entry.dart';

enum GamePhase {
  setup,
  privateReveal,
  discussionStarter,
  activeBoard,
  eliminationReveal,
  gameResult,
}

enum GameWinner {
  citizens(title: 'Citizens Win', subtitle: 'All imposters have been identified and eliminated.'),
  imposters(title: 'Imposters Win', subtitle: 'The imposters have taken control of the group.');

  final String title;
  final String subtitle;
  const GameWinner({required this.title, required this.subtitle});
}

class GameState {
  final GameConfig config;
  final WordEntry? wordEntry;
  final List<Player> players;
  final int currentRevealIndex;
  final bool isWordRevealed;
  final Player? discussionStarter;
  final GamePhase phase;
  final GameWinner? winner;
  final Player? recentlyEliminatedPlayer;

  const GameState({
    this.config = const GameConfig(),
    this.wordEntry,
    this.players = const [],
    this.currentRevealIndex = 0,
    this.isWordRevealed = false,
    this.discussionStarter,
    this.phase = GamePhase.setup,
    this.winner,
    this.recentlyEliminatedPlayer,
  });

  int get activeCitizensCount =>
      players.where((p) => !p.isImposter && !p.isEliminated).length;

  int get activeImpostersCount =>
      players.where((p) => p.isImposter && !p.isEliminated).length;

  int get totalActiveCount =>
      players.where((p) => !p.isEliminated).length;

  int get totalEliminatedCount =>
      players.where((p) => p.isEliminated).length;

  bool get isAllRevealed =>
      players.isNotEmpty && currentRevealIndex >= players.length;

  Player? get currentPlayerToReveal =>
      (currentRevealIndex >= 0 && currentRevealIndex < players.length)
          ? players[currentRevealIndex]
          : null;

  GameState copyWith({
    GameConfig? config,
    WordEntry? wordEntry,
    List<Player>? players,
    int? currentRevealIndex,
    bool? isWordRevealed,
    Player? discussionStarter,
    GamePhase? phase,
    GameWinner? winner,
    Player? recentlyEliminatedPlayer,
    bool clearRecentlyEliminated = false,
  }) {
    return GameState(
      config: config ?? this.config,
      wordEntry: wordEntry ?? this.wordEntry,
      players: players ?? this.players,
      currentRevealIndex: currentRevealIndex ?? this.currentRevealIndex,
      isWordRevealed: isWordRevealed ?? this.isWordRevealed,
      discussionStarter: discussionStarter ?? this.discussionStarter,
      phase: phase ?? this.phase,
      winner: winner ?? this.winner,
      recentlyEliminatedPlayer: clearRecentlyEliminated
          ? null
          : (recentlyEliminatedPlayer ?? this.recentlyEliminatedPlayer),
    );
  }
}
