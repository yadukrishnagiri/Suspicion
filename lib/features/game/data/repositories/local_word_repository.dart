import 'dart:convert';
import 'dart:math';
import 'package:flutter/services.dart';
import '../../domain/models/word_entry.dart';

class LocalWordRepository {
  List<WordEntry> _allEntries = [];
  final Set<dynamic> _usedIds = {};
  final Random _random = Random();

  bool get isLoaded => _allEntries.isNotEmpty;

  /// Load the 840-item master dataset from local assets
  Future<void> loadDataset([String? jsonString]) async {
    if (_allEntries.isNotEmpty) return;

    final dataStr = jsonString ?? await rootBundle.loadString('assets/data/imposter_dataset.json');
    final List<dynamic> jsonList = jsonDecode(dataStr);
    _allEntries = jsonList.map((j) => WordEntry.fromJson(j)).toList();
  }

  /// Get list of all unique categories in dataset
  List<String> getCategories() {
    final categories = _allEntries.map((e) => e.category).toSet().toList();
    categories.sort();
    return categories;
  }

  /// Total words available
  int get totalCount => _allEntries.length;

  /// Pick a word for the game, filtering by category and avoiding immediate repeats
  WordEntry getRandomWord(String category) {
    if (_allEntries.isEmpty) {
      throw StateError('Word repository has not been initialized. Call loadDataset first.');
    }

    List<WordEntry> candidates;
    if (category == 'All Categories' || category.trim().isEmpty) {
      candidates = _allEntries;
    } else {
      candidates = _allEntries.where((e) => e.category == category).toList();
      if (candidates.isEmpty) {
        candidates = _allEntries;
      }
    }

    // Filter out already used IDs if possible
    final unused = candidates.where((e) => !_usedIds.contains(e.id)).toList();
    final pool = unused.isNotEmpty ? unused : candidates;

    final selected = pool[_random.nextInt(pool.length)];
    _usedIds.add(selected.id);

    // If used IDs grow too large, retain only the recent 30
    if (_usedIds.length > 50) {
      _usedIds.remove(_usedIds.first);
    }

    return selected;
  }

  /// Reset used history
  void clearHistory() {
    _usedIds.clear();
  }
}
