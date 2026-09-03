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
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'PROFILE & STORAGE',
          style: AppTextStyles.labelCaps.copyWith(color: AppColors.textPrimary),
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            // User Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.surfaceElevated,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.surfaceBorder),
              ),
              child: Column(
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.surfaceBorder,
                      border: Border.all(color: AppColors.accent, width: 2),
                    ),
                    child: Center(
                      child: Text(
                        profile.displayName.isNotEmpty ? profile.displayName[0].toUpperCase() : 'P',
                        style: AppTextStyles.heroDisplay.copyWith(fontSize: 32),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    profile.displayName,
                    style: AppTextStyles.titleMedium,
                  ),
                  if (profile.email.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      profile.email,
                      style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textMuted),
                    ),
                  ],
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: isGuest
                          ? AppColors.surfaceBorderSubtle
                          : AppColors.emerald.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isGuest ? AppColors.surfaceBorder : AppColors.emerald.withOpacity(0.4),
                      ),
                    ),
                    child: Text(
                      isGuest ? 'LOCAL GUEST (OFFLINE)' : 'SYNCED WITH CLOUD FIRESTORE',
                      style: AppTextStyles.labelCaps.copyWith(
                        fontSize: 9,
                        color: isGuest ? AppColors.textMuted : AppColors.emerald,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  if (isGuest)
                    SpringButton(
                      onTap: () {
                        AppHaptics.medium();
                        ref.read(authProvider.notifier).signInWithGoogle();
                      },
                      child: Container(
                        height: 50,
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.surfaceBorder),
                        ),
                        alignment: Alignment.center,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.login_rounded, size: 18, color: AppColors.textPrimary),
                            const SizedBox(width: 8),
                            Text(
                              'SIGN IN WITH GOOGLE',
                              style: AppTextStyles.labelCaps.copyWith(
                                color: AppColors.textPrimary,
                                fontSize: 12,
                              ),
                            ),
                          ],
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
                        height: 46,
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.surfaceBorder),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          'SIGN OUT',
                          style: AppTextStyles.labelCaps.copyWith(
                            color: AppColors.imposterGlow,
                            fontSize: 11,
                          ),
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
                style: AppTextStyles.bodyMedium.copyWith(color: AppColors.imposterGlow),
              ),
            ],

            const SizedBox(height: 32),

            // Privacy & Architecture disclosure
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surfaceBorderSubtle,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppColors.surfaceBorder),
              ),
              child: Row(
                children: [
                  const Icon(Icons.shield_outlined, color: AppColors.accentGlow, size: 22),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Text(
                      'Zero gameplay data or voting history is stored. Only your profile and recent names for auto-complete are saved.',
                      style: AppTextStyles.bodyMedium.copyWith(fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Recent Player Names Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'RECENT PLAYER NAMES (${profile.recentPlayerNames.length})',
                  style: AppTextStyles.labelCaps.copyWith(color: AppColors.textSecondary),
                ),
                if (profile.recentPlayerNames.isNotEmpty)
                  TextButton(
                    onPressed: () {
                      AppHaptics.light();
                      ref.read(authProvider.notifier).clearRecentNames();
                    },
                    child: Text(
                      'CLEAR ALL',
                      style: AppTextStyles.labelCaps.copyWith(
                        color: AppColors.imposterGlow,
                        fontSize: 11,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 12),

            if (profile.recentPlayerNames.isEmpty)
              Container(
                padding: const EdgeInsets.symmetric(vertical: 32),
                alignment: Alignment.center,
                child: Text(
                  'No recent names saved yet.\nNames entered during setup will automatically appear here.',
                  textAlign: TextAlign.center,
                  style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textMuted),
                ),
              )
            else
              Wrap(
                spacing: 8,
                runSpacing: 10,
                children: profile.recentPlayerNames.map((name) {
                  return Chip(
                    backgroundColor: AppColors.surfaceElevated,
                    side: const BorderSide(color: AppColors.surfaceBorder),
                    label: Text(name, style: AppTextStyles.bodyMedium),
                    deleteIcon: const Icon(Icons.close_rounded, size: 16),
                    deleteIconColor: AppColors.textMuted,
                    onDeleted: () {
                      AppHaptics.selection();
                      ref.read(authProvider.notifier).removeRecentName(name);
                    },
                  );
                }).toList(),
              ),
          ],
        ),
      ),
    );
  }
}
