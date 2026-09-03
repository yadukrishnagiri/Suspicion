import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_text_styles.dart';

class SkillGuideScreen extends StatefulWidget {
  const SkillGuideScreen({super.key});

  @override
  State<SkillGuideScreen> createState() => _SkillGuideScreenState();
}

class _SkillGuideScreenState extends State<SkillGuideScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'How to Play',
          style: AppTextStyles.titleMedium,
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.accent,
          indicatorWeight: 2,
          labelColor: AppColors.textPrimary,
          unselectedLabelColor: AppColors.textMuted,
          labelStyle: AppTextStyles.titleSmall.copyWith(fontSize: 13),
          tabs: const [
            Tab(text: 'Citizens'),
            Tab(text: 'Imposters'),
            Tab(text: 'Rules'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildCitizenTab(),
          _buildImposterTab(),
          _buildRulesTab(),
        ],
      ),
    );
  }

  Widget _buildCitizenTab() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        _buildCard(
          title: 'Goal',
          content: 'Figure out who doesn\'t know the secret word and eliminate them before they outnumber you.',
        ),
        const SizedBox(height: 12),
        _buildCard(
          title: 'Tips for Citizens',
          content: '• Give subtle clues about how or when the word is experienced.\n'
              '• Avoid direct definitions or obvious physical descriptions.\n'
              '• Listen for players who repeat someone else\'s idea or hesitate before speaking.\n'
              '• Never use synonyms that give away the word.',
        ),
        const SizedBox(height: 12),
        _buildCard(
          title: 'Example Clues (e.g. Word: Rain)',
          content: 'Good: "I dislike walking my dog when this happens."\n'
              'Bad: "Water falling from the sky."',
        ),
      ],
    );
  }

  Widget _buildImposterTab() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        _buildCard(
          title: 'Goal',
          content: 'Blend in with the citizens and survive votes until active imposters equal or outnumber active citizens.',
        ),
        const SizedBox(height: 12),
        _buildCard(
          title: 'Tips for Imposters',
          content: '• Listen carefully to the first few players before giving your clue.\n'
              '• Follow general themes, moods, and relatable situations.\n'
              '• Stay calm and confident. Hesitation is the easiest giveaway.\n'
              '• In Blind mode, agree with broad sentiments and mirror the room.',
        ),
        const SizedBox(height: 12),
        _buildCard(
          title: 'Golden Rule',
          content: 'Help your side without revealing your identity.',
        ),
      ],
    );
  }

  Widget _buildRulesTab() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        _buildCard(
          title: 'Player Limits',
          content: '• 3 to 15 Players allowed\n'
              '• 1 to 7 Imposters allowed\n'
              '• Minimum players formula: (2 × Imposters) + 1',
        ),
        const SizedBox(height: 12),
        _buildCard(
          title: 'Discussion & Voting',
          content: '• The app does not manage voting or speaking order.\n'
              '• Players talk openly in real life and vote by pointing or agreement.\n'
              '• Tap "Eliminate" on the player who was voted out.',
        ),
        const SizedBox(height: 12),
        _buildCard(
          title: 'Win Conditions',
          content: '• Citizens Win: All imposters are eliminated.\n'
              '• Imposters Win: Active Imposters >= Active Citizens.',
        ),
      ],
    );
  }

  Widget _buildCard({required String title, required String content}) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.surfaceBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppTextStyles.titleSmall.copyWith(color: AppColors.accent)),
          const SizedBox(height: 8),
          Text(
            content,
            style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textPrimary, height: 1.5),
          ),
        ],
      ),
    );
  }
}
