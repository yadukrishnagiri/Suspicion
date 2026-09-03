class Player {
  final String id;
  final String name;
  final bool isImposter;
  final bool isEliminated;

  const Player({
    required this.id,
    required this.name,
    this.isImposter = false,
    this.isEliminated = false,
  });

  Player copyWith({
    String? id,
    String? name,
    bool? isImposter,
    bool? isEliminated,
  }) {
    return Player(
      id: id ?? this.id,
      name: name ?? this.name,
      isImposter: isImposter ?? this.isImposter,
      isEliminated: isEliminated ?? this.isEliminated,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Player &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          isImposter == other.isImposter &&
          isEliminated == other.isEliminated;

  @override
  int get hashCode =>
      id.hashCode ^ name.hashCode ^ isImposter.hashCode ^ isEliminated.hashCode;
}
