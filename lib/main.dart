import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'core/navigation/app_routes.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/presentation/screens/profile_screen.dart';
import 'features/game/data/repositories/local_word_repository.dart';
import 'features/game/presentation/controllers/game_controller.dart';
import 'features/game/presentation/screens/discussion_starter_screen.dart';
import 'features/game/presentation/screens/home_screen.dart';
import 'features/game/presentation/screens/player_board_screen.dart';
import 'features/game/presentation/screens/private_reveal_screen.dart';
import 'features/game/presentation/screens/result_screen.dart';
import 'features/game/presentation/screens/setup_screen.dart';
import 'features/skills_rules/presentation/screens/skill_guide_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Set immersive dark system UI overlay
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Colors.black,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // Initialize Firebase with graceful offline catch
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint('Firebase not initialized or running offline: $e');
  }

  // Preload bundled 840-entry local dataset
  final wordRepo = LocalWordRepository();
  try {
    await wordRepo.loadDataset();
    debugPrint('Successfully preloaded ${wordRepo.totalCount} local words across ${wordRepo.getCategories().length} categories.');
  } catch (e) {
    debugPrint('Error preloading local word dataset: $e');
  }

  runApp(
    ProviderScope(
      overrides: [
        wordRepositoryProvider.overrideWithValue(wordRepo),
      ],
      child: const ImposterApp(),
    ),
  );
}

class ImposterApp extends StatelessWidget {
  const ImposterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Imposter',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      initialRoute: AppRoutes.home,
      routes: {
        AppRoutes.home: (context) => const HomeScreen(),
        AppRoutes.setup: (context) => const SetupScreen(),
        AppRoutes.profile: (context) => const ProfileScreen(),
        AppRoutes.rules: (context) => const SkillGuideScreen(),
        AppRoutes.reveal: (context) => const PrivateRevealScreen(),
        AppRoutes.starter: (context) => const DiscussionStarterScreen(),
        AppRoutes.board: (context) => const PlayerBoardScreen(),
        AppRoutes.result: (context) => const ResultScreen(),
      },
    );
  }
}
