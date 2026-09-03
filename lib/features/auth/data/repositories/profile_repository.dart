import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../domain/models/user_profile.dart';

class ProfileRepository {
  static const String _prefRecentNamesKey = 'imposter_recent_player_names';
  final FirebaseFirestore? _firestore;

  ProfileRepository({FirebaseFirestore? firestore}) : _firestore = firestore;

  /// Load recent names cached locally
  Future<List<String>> getLocalRecentNames() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_prefRecentNamesKey) ?? [];
  }

  /// Save recent names locally
  Future<void> saveLocalRecentNames(List<String> names) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_prefRecentNamesKey, names);
  }

  /// Add new player names to recent list (deduplicated, order preserved)
  Future<List<String>> addRecentPlayerNames(List<String> newNames, {String? uid}) async {
    final existing = await getLocalRecentNames();
    final updated = <String>[];

    // Put new names at the front
    for (final name in newNames) {
      final clean = name.trim();
      if (clean.isNotEmpty && !updated.contains(clean)) {
        updated.add(clean);
      }
    }

    // Append existing names
    for (final name in existing) {
      if (!updated.contains(name)) {
        updated.add(name);
      }
    }

    // Cap to 50 names
    final trimmed = updated.take(50).toList();
    await saveLocalRecentNames(trimmed);

    // Sync to Firestore if signed in
    if (uid != null && uid != 'guest_local' && _firestore != null) {
      try {
        await _firestore.collection('users').doc(uid).set({
          'recentPlayerNames': trimmed,
          'updatedAt': DateTime.now().toIso8601String(),
        }, SetOptions(merge: true));
      } catch (_) {
        // Silent catch for offline or unconfigured Firebase
      }
    }

    return trimmed;
  }

  /// Fetch user profile from Firestore, with local fallback
  Future<UserProfile> fetchUserProfile(String uid, String defaultDisplayName, String email) async {
    final localNames = await getLocalRecentNames();

    if (_firestore == null || uid == 'guest_local') {
      return UserProfile(
        uid: uid,
        displayName: defaultDisplayName,
        email: email,
        recentPlayerNames: localNames,
      );
    }

    try {
      final doc = await _firestore.collection('users').doc(uid).get();
      if (doc.exists && doc.data() != null) {
        final profile = UserProfile.fromFirestore(doc.data()!, uid);
        // Merge with local names
        final mergedNames = <String>[...profile.recentPlayerNames];
        for (final ln in localNames) {
          if (!mergedNames.contains(ln)) {
            mergedNames.add(ln);
          }
        }
        await saveLocalRecentNames(mergedNames);
        return profile.copyWith(
          recentPlayerNames: mergedNames,
          email: email.isNotEmpty ? email : profile.email,
        );
      } else {
        // Document does not exist, initialize it
        final profile = UserProfile(
          uid: uid,
          displayName: defaultDisplayName,
          email: email,
          recentPlayerNames: localNames,
        );
        await _firestore.collection('users').doc(uid).set(profile.toFirestore());
        return profile;
      }
    } catch (_) {
      // Fallback on network failure
      return UserProfile(
        uid: uid,
        displayName: defaultDisplayName,
        email: email,
        recentPlayerNames: localNames,
      );
    }
  }

  /// Filter names matching query prefix for autocomplete suggestions
  List<String> filterSuggestions(String query, List<String> allRecentNames) {
    if (query.trim().isEmpty) return allRecentNames.take(8).toList();
    final lower = query.trim().toLowerCase();
    return allRecentNames
        .where((name) => name.toLowerCase().startsWith(lower))
        .take(8)
        .toList();
  }

  /// Remove a name from recent list
  Future<List<String>> removeRecentPlayerName(String name, {String? uid}) async {
    final existing = await getLocalRecentNames();
    existing.removeWhere((item) => item.toLowerCase() == name.toLowerCase());
    await saveLocalRecentNames(existing);

    if (uid != null && uid != 'guest_local' && _firestore != null) {
      try {
        await _firestore.collection('users').doc(uid).update({
          'recentPlayerNames': existing,
        });
      } catch (_) {}
    }

    return existing;
  }

  /// Clear all recent names
  Future<void> clearAllRecentNames({String? uid}) async {
    await saveLocalRecentNames([]);
    if (uid != null && uid != 'guest_local' && _firestore != null) {
      try {
        await _firestore.collection('users').doc(uid).update({
          'recentPlayerNames': [],
        });
      } catch (_) {}
    }
  }
}
