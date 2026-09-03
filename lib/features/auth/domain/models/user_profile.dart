class UserProfile {
  final String uid;
  final String displayName;
  final String email;
  final List<String> recentPlayerNames;

  const UserProfile({
    required this.uid,
    required this.displayName,
    this.email = '',
    this.recentPlayerNames = const [],
  });

  factory UserProfile.guest([List<String>? recentNames]) {
    return UserProfile(
      uid: 'guest_local',
      displayName: 'Guest Player',
      email: '',
      recentPlayerNames: recentNames ?? const [],
    );
  }

  factory UserProfile.fromFirestore(Map<String, dynamic> data, String uid) {
    final rawNames = data['recentPlayerNames'];
    final List<String> names = rawNames is List
        ? rawNames.map((e) => e.toString().trim()).where((s) => s.isNotEmpty).toList()
        : [];

    return UserProfile(
      uid: uid,
      displayName: data['displayName'] ?? 'Player',
      email: data['email'] ?? '',
      recentPlayerNames: names,
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'displayName': displayName,
      'email': email,
      'recentPlayerNames': recentPlayerNames,
      'updatedAt': DateTime.now().toIso8601String(),
    };
  }

  UserProfile copyWith({
    String? uid,
    String? displayName,
    String? email,
    List<String>? recentPlayerNames,
  }) {
    return UserProfile(
      uid: uid ?? this.uid,
      displayName: displayName ?? this.displayName,
      email: email ?? this.email,
      recentPlayerNames: recentPlayerNames ?? this.recentPlayerNames,
    );
  }
}
