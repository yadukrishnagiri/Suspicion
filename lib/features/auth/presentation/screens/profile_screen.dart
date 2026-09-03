import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';
import '../../../../core/motion/spring_button.dart';
import '../../../../core/utils/haptics.dart';
import '../controllers/auth_controller.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final profile = authState.profile;
    final isGuest = profile.uid == 'guest_local';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Profile & Saved Names',
          style: AppTextStyles.titleMedium,
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // User Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.surfaceBorder),
              ),
              child: Column(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.surfaceElevated,
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      profile.displayName.isNotEmpty ? profile.displayName[0].toUpperCase() : 'P',
                      style: AppTextStyles.titleLarge.copyWith(color: AppColors.accent),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    profile.displayName,
                    style: AppTextStyles.titleMedium,
                  ),
                  if (profile.email.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      profile.email,
                      style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textMuted, fontSize: 13),
                    ),
                  ],
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceElevated,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      isGuest ? 'Offline Guest Mode' : 'Connected to Firestore',
                      style: AppTextStyles.labelCaps.copyWith(
                        fontSize: 10,
                        color: isGuest ? AppColors.textMuted : AppColors.emerald,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  if (isGuest)
                    SpringButton(
                      onTap: () {
                        AppHaptics.medium();
                        ref.read(authProvider.notifier).signInWithGoogle();
                      },
                      child: Container(
                        height: 44,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: AppColors.surfaceBorder),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          'Sign in with Google',
                          style: AppTextStyles.titleSmall.copyWith(fontSize: 13),
                        ),
                      ),
                    )
                  else
                    SpringButton(
                      onTap: () {
                        AppHaptics.light();
                        ref.read(authProvider.notifier).signOut();
                      },
                      child: Container(
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceElevated,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          'Sign Out',
                          style: AppTextStyles.bodyMedium.copyWith(color: AppColors.imposter),
                        ),
                      ),
                    ),
                ],
              ),
            ),

            if (authState.errorMessage != null) ...[
              const SizedBox(height: 12),
              Text(
                authState.errorMessage!,
                textAlign: TextAlign.center,
                style: AppTextStyles.bodyMedium.copyWith(color: AppColors.imposter),
              ),
            ],

            const SizedBox(height: 28),

            // Saved Players Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'SAVED PLAYERS (${profile.recentPlayerNames.length})',
                  style: AppTextStyles.labelCaps,
                ),
                if (profile.recentPlayerNames.isNotEmpty)
                  TextButton(
                    onPressed: () {
                      AppHaptics.light();
                      ref.read(authProvider.notifier).clearRecentNames();
                    },
                    child: Text(
                      'Clear All',
                      style: AppTextStyles.labelCaps.copyWith(color: AppColors.imposter),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),

            if (profile.recentPlayerNames.isEmpty)
              Container(
                padding: const EdgeInsets.symmetric(vertical: 24),
                alignment: Alignment.center,
                child: Text(
                  'No saved names yet.\nNames entered during game setup will appear here.',
                  textAlign: TextAlign.center,
                  style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textMuted),
                ),
              )
            else
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: profile.recentPlayerNames.map((name) {
                  return Chip(
                    backgroundColor: AppColors.surface,
                    side: const BorderSide(color: AppColors.surfaceBorder),
                    label: Text(name, style: AppTextStyles.bodyMedium.copyWith(fontSize: 13)),
                    deleteIcon: const Icon(Icons.close_rounded, size: 14),
                    deleteIconColor: AppColors.textMuted,
                    onDeleted: () {
                      AppHaptics.selection();
                      ref.read(authProvider.notifier).removeRecentName(name);
                    },
                  );
                }).toList(),
              ),

            const SizedBox(height: 28),

            // Privacy note
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.surfaceBorderSubtle),
              ),
              child: Text(
                'Only player names are saved locally and in Firestore for fast autocomplete. No game or voting history is ever stored.',
                style: AppTextStyles.bodyMedium.copyWith(fontSize: 12, color: AppColors.textMuted),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
