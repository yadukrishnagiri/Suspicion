import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:imposter/core/theme/app_theme.dart';
import 'package:imposter/features/auth/data/repositories/auth_repository.dart';
import 'package:imposter/features/auth/data/repositories/profile_repository.dart';
import 'package:imposter/features/auth/presentation/controllers/auth_controller.dart';
import 'package:imposter/features/game/presentation/screens/home_screen.dart';

class MockAuthNotifier extends AuthNotifier {
  MockAuthNotifier()
      : super(
          authRepo: AuthRepository(),
          profileRepo: ProfileRepository(),
        );
}

void main() {
  setUpAll(() {
    TestWidgetsFlutterBinding.ensureInitialized();
    GoogleFonts.config.allowRuntimeFetching = false;
  });

  testWidgets('HomeScreen renders IMPOSTER title and START NEW GAME button', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          authProvider.overrideWith((ref) => MockAuthNotifier()),
        ],
        child: MaterialApp(
          theme: AppTheme.darkTheme,
          home: const HomeScreen(),
        ),
      ),
    );

    await tester.pump();

    expect(find.text('IMPOSTER'), findsOneWidget);
    expect(find.text('START NEW GAME'), findsOneWidget);
    expect(find.text('RULES & SKILL GUIDE'), findsOneWidget);
    expect(find.text('One phone. One group. One liar.'), findsOneWidget);
  });
}
