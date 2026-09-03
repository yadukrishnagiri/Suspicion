import 'game_mode.dart';

class GameConfig {
  static const int minTotalPlayers = 3;
  static const int maxTotalPlayers = 15;
  static const int minTotalImposters = 1;
  static const int maxTotalImposters = 7;

  final int playerCount;
  final int imposterCount;
  final List<String> playerNames;
  final GameMode gameMode;
  final String category;

  const GameConfig({
    this.playerCount = 5,
    this.imposterCount = 1,
    this.playerNames = const [],
    this.gameMode = GameMode.mode1,
    this.category = 'All Categories',
  });

  /// Minimum players required for a given imposter count: (2 * imposters) + 1
  static int minPlayersForImposters(int imposters) {
    return (2 * imposters) + 1;
  }

  /// Maximum imposters allowed for a given player count: (players - 1) ~/ 2, max 7
  static int maxImpostersForPlayers(int players) {
    final maxAllowed = (players - 1) ~/ 2;
    return maxAllowed > maxTotalImposters ? maxTotalImposters : (maxAllowed < 1 ? 1 : maxAllowed);
  }

  /// Validate if configuration adheres to all official rules
  bool isValid() {
    if (playerCount < minTotalPlayers || playerCount > maxTotalPlayers) return false;
    if (imposterCount < minTotalImposters || imposterCount > maxTotalImposters) return false;
    if (playerCount < minPlayersForImposters(imposterCount)) return false;
    if (playerNames.length != playerCount) return false;
    if (playerNames.any((n) => n.trim().isEmpty)) return false;
    return true;
  }

  GameConfig copyWith({
    int? playerCount,
    int? imposterCount,
    List<String>? playerNames,
    GameMode? gameMode,
    String? category,
  }) {
    return GameConfig(
      playerCount: playerCount ?? this.playerCount,
      imposterCount: imposterCount ?? this.imposterCount,
      playerNames: playerNames ?? this.playerNames,
      gameMode: gameMode ?? this.gameMode,
      category: category ?? this.category,
    );
  }
}
