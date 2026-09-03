import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/models/user_profile.dart';
import '../../data/repositories/auth_repository.dart';
import '../../data/repositories/profile_repository.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository();
});

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  return ProfileRepository();
});

class AuthState {
  final UserProfile profile;
  final bool isLoading;
  final String? errorMessage;

  const AuthState({
    required this.profile,
    this.isLoading = false,
    this.errorMessage,
  });

  AuthState copyWith({
    UserProfile? profile,
    bool? isLoading,
    String? errorMessage,
  }) {
    return AuthState(
      profile: profile ?? this.profile,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _authRepo;
  final ProfileRepository _profileRepo;

  AuthNotifier({
    required AuthRepository authRepo,
    required ProfileRepository profileRepo,
  })  : _authRepo = authRepo,
        _profileRepo = profileRepo,
        super(AuthState(profile: UserProfile.guest())) {
    _init();
  }

  Future<void> _init() async {
    final localNames = await _profileRepo.getLocalRecentNames();
    final currentUser = _authRepo.currentUser;

    if (currentUser != null) {
      final profile = await _profileRepo.fetchUserProfile(
        currentUser.uid,
        currentUser.displayName ?? 'Player',
        currentUser.email ?? '',
      );
      state = state.copyWith(profile: profile);
    } else {
      state = state.copyWith(profile: UserProfile.guest(localNames));
    }
  }

  Future<void> signInWithGoogle() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final credential = await _authRepo.signInWithGoogle();
      if (credential != null && credential.user != null) {
        final u = credential.user!;
        final profile = await _profileRepo.fetchUserProfile(
          u.uid,
          u.displayName ?? 'Player',
          u.email ?? '',
        );
        state = state.copyWith(profile: profile, isLoading: false);
      } else {
        state = state.copyWith(isLoading: false);
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Sign-in failed. Please try again or continue offline.',
      );
    }
  }

  Future<void> signOut() async {
    state = state.copyWith(isLoading: true);
    await _authRepo.signOut();
    final localNames = await _profileRepo.getLocalRecentNames();
    state = state.copyWith(
      profile: UserProfile.guest(localNames),
      isLoading: false,
    );
  }

  Future<void> saveGameParticipants(List<String> names) async {
    final updated = await _profileRepo.addRecentPlayerNames(
      names,
      uid: state.profile.uid,
    );
    state = state.copyWith(
      profile: state.profile.copyWith(recentPlayerNames: updated),
    );
  }

  Future<void> removeRecentName(String name) async {
    final updated = await _profileRepo.removeRecentPlayerName(
      name,
      uid: state.profile.uid,
    );
    state = state.copyWith(
      profile: state.profile.copyWith(recentPlayerNames: updated),
    );
  }

  Future<void> clearRecentNames() async {
    await _profileRepo.clearAllRecentNames(uid: state.profile.uid);
    state = state.copyWith(
      profile: state.profile.copyWith(recentPlayerNames: []),
    );
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authRepo = ref.watch(authRepositoryProvider);
  final profileRepo = ref.watch(profileRepositoryProvider);
  return AuthNotifier(authRepo: authRepo, profileRepo: profileRepo);
});
