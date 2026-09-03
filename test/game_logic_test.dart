import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:imposter/features/game/data/repositories/local_word_repository.dart';
import 'package:imposter/features/game/domain/models/game_config.dart';
import 'package:imposter/features/game/domain/models/game_mode.dart';
import 'package:imposter/features/game/domain/models/game_state.dart';
import 'package:imposter/features/game/presentation/controllers/game_controller.dart';

void main() {
  group('Official Rules & Mathematical Validations', () {
    test('Minimum players formula: (2 * imposters) + 1', () {
      expect(GameConfig.minPlayersForImposters(1), equals(3));
      expect(GameConfig.minPlayersForImposters(2), equals(5));
      expect(GameConfig.minPlayersForImposters(3), equals(7));
      expect(GameConfig.minPlayersForImposters(7), equals(15));
    });

    test('Max imposters for player count', () {
      expect(GameConfig.maxImpostersForPlayers(3), equals(1));
      expect(GameConfig.maxImpostersForPlayers(4), equals(1));
      expect(GameConfig.maxImpostersForPlayers(5), equals(2));
      expect(GameConfig.maxImpostersForPlayers(15), equals(7));
    });

    test('GameConfig validity check', () {
      // Valid 5 players, 1 imposter
      const validConfig = GameConfig(
        playerCount: 5,
        imposterCount: 1,
        playerNames: ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve'],
        gameMode: GameMode.mode1,
      );
      expect(validConfig.isValid(), isTrue);

      // Invalid: 4 players, 2 imposters requires at least 5 players
      const invalidConfig = GameConfig(
        playerCount: 4,
        imposterCount: 2,
        playerNames: ['Alice', 'Bob', 'Charlie', 'Dave'],
        gameMode: GameMode.mode1,
      );
      expect(invalidConfig.isValid(), isFalse);
    });
  });

  group('Local Dataset Verification', () {
    late LocalWordRepository wordRepo;

    setUp(() async {
      wordRepo = LocalWordRepository();
      final file = File('assets/data/imposter_dataset.json');
      final jsonString = await file.readAsString();
      await wordRepo.loadDataset(jsonString);
    });

    test('Loads all 840 master dataset entries', () {
      expect(wordRepo.totalCount, equals(840));
    });

    test('Contains all 8 distinct categories', () {
      final categories = wordRepo.getCategories();
      expect(categories.length, equals(8));
      expect(categories, contains('Concepts & Weather'));
      expect(categories, contains('Food & Drinks'));
      expect(categories, contains('Animals & Nature'));
      expect(categories, contains('Everyday Objects'));
      expect(categories, contains('Places & Travel'));
      expect(categories, contains('Sports & Activities'));
      expect(categories, contains('Occupations'));
      expect(categories, contains('Pop Culture & Media'));
    });

    test('Word selection returns valid entry from chosen category', () {
      final word = wordRepo.getRandomWord('Food & Drinks');
      expect(word.category, equals('Food & Drinks'));
      expect(word.mainWord.isNotEmpty, isTrue);
      expect(word.imposterWord.isNotEmpty, isTrue);
    });
  });

  group('Game State & Win Logic Tests', () {
    late LocalWordRepository wordRepo;

    setUp(() async {
      wordRepo = LocalWordRepository();
      final file = File('assets/data/imposter_dataset.json');
      final jsonString = await file.readAsString();
      await wordRepo.loadDataset(jsonString);
    });

    test('Starting game creates players in exact entered order with correct imposter count', () {
      final controller = GameController(wordRepo: wordRepo);
      final names = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve'];
      final config = GameConfig(
        playerCount: 5,
        imposterCount: 2,
        playerNames: names,
        category: 'Food & Drinks',
      );

      controller.startGame(config);

      final state = controller.currentState;
      expect(state.players.length, equals(5));
      for (int i = 0; i < 5; i++) {
        expect(state.players[i].name, equals(names[i]));
      }
      expect(state.players.where((p) => p.isImposter).length, equals(2));
      expect(state.players.where((p) => !p.isImposter).length, equals(3));
      expect(state.phase, equals(GamePhase.privateReveal));
    });

    test('Citizens Win condition triggers when all imposters eliminated', () {
      final controller = GameController(wordRepo: wordRepo);
      const config = GameConfig(
        playerCount: 3,
        imposterCount: 1,
        playerNames: ['Alice', 'Bob', 'Charlie'],
      );

      controller.startGame(config);

      // Find the imposter
      final imposter = controller.currentState.players.firstWhere((p) => p.isImposter);
      controller.selectForElimination(imposter);
      controller.confirmElimination();

      expect(controller.currentState.winner, equals(GameWinner.citizens));
      expect(controller.currentState.phase, equals(GamePhase.gameResult));
    });

    test('Imposters Win condition triggers when active imposters >= active citizens', () {
      final controller = GameController(wordRepo: wordRepo);
      const config = GameConfig(
        playerCount: 5,
        imposterCount: 2,
        playerNames: ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve'],
      );

      controller.startGame(config);

      // 3 citizens, 2 imposters.
      // Eliminate 2 citizens: active citizens becomes 1, active imposters = 2.
      // 2 >= 1 => Imposters win!
      final citizen1 = controller.currentState.players.firstWhere((p) => !p.isImposter);
      controller.selectForElimination(citizen1);
      controller.confirmElimination();

      final citizen2 = controller.currentState.players.where((p) => !p.isImposter && !p.isEliminated).first;
      controller.selectForElimination(citizen2);
      controller.confirmElimination();

      expect(controller.currentState.winner, equals(GameWinner.imposters));
      expect(controller.currentState.phase, equals(GamePhase.gameResult));
    });

    test('Play again maintains player names and order while resetting state', () {
      final controller = GameController(wordRepo: wordRepo);
      final names = ['Alex', 'Brian', 'Chloe', 'Dan', 'Emma'];
      controller.startGame(GameConfig(
        playerCount: 5,
        imposterCount: 1,
        playerNames: names,
      ));

      // Eliminate someone
      controller.selectForElimination(controller.currentState.players.first);
      controller.confirmElimination();
      expect(controller.currentState.players.first.isEliminated, isTrue);

      // Play again
      controller.startNewGameSamePlayers();

      expect(controller.currentState.players.length, equals(5));
      expect(controller.currentState.players.every((p) => !p.isEliminated), isTrue);
      for (int i = 0; i < 5; i++) {
        expect(controller.currentState.players[i].name, equals(names[i]));
      }
      expect(controller.currentState.phase, equals(GamePhase.privateReveal));
    });
  });
}
