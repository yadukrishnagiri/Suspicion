class WordEntry {
  final dynamic id;
  final String category;
  final String mainWord;
  final String imposterWord;
  final String imposterCategory;
  final String relationshipType;
  final String hint;
  final String difficulty;
  final String pairGroup;
  final String patternRisk;

  const WordEntry({
    required this.id,
    required this.category,
    required this.mainWord,
    required this.imposterWord,
    this.imposterCategory = '',
    this.relationshipType = '',
    this.hint = '',
    this.difficulty = 'Medium',
    this.pairGroup = '',
    this.patternRisk = '',
  });

  factory WordEntry.fromJson(Map<String, dynamic> json) {
    return WordEntry(
      id: json['id'],
      category: json['category'] ?? '',
      mainWord: json['mainWord'] ?? '',
      imposterWord: json['imposterWord'] ?? '',
      imposterCategory: json['imposterCategory'] ?? '',
      relationshipType: json['relationshipType'] ?? '',
      hint: json['hint'] ?? '',
      difficulty: json['difficulty'] ?? 'Medium',
      pairGroup: json['pairGroup'] ?? '',
      patternRisk: json['patternRisk'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'category': category,
      'mainWord': mainWord,
      'imposterWord': imposterWord,
      'imposterCategory': imposterCategory,
      'relationshipType': relationshipType,
      'hint': hint,
      'difficulty': difficulty,
      'pairGroup': pairGroup,
      'patternRisk': patternRisk,
    };
  }
}
