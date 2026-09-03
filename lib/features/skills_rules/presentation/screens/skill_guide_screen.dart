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
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'RULES & SKILL GUIDE',
          style: AppTextStyles.labelCaps.copyWith(color: AppColors.textPrimary),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppColors.accent,
          indicatorWeight: 3,
          labelColor: AppColors.textPrimary,
          unselectedLabelColor: AppColors.textMuted,
          labelStyle: AppTextStyles.titleSmall.copyWith(fontSize: 13),
          tabs: const [
            Tab(text: 'CITIZEN'),
            Tab(text: 'IMPOSTER'),
            Tab(text: 'OFFICIAL RULES'),
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
      padding: const EdgeInsets.all(24),
      children: [
        _buildSectionCard(
          title: 'CITIZEN OBJECTIVE',
          accentColor: AppColors.citizenGlow,
          content: 'Eliminate all imposters before they equal or outnumber the innocent citizens.',
        ),
        const SizedBox(height: 16),
        _buildTipsCard(
          title: 'HOW TO PLAY AS CITIZEN',
          tips: [
            'Be indirect — speak about how, when, or where the word is experienced.',
            'Avoid direct definitions or obvious physical descriptions.',
            'Never use synonyms that hand the imposter their clue on a silver platter.',
            'Listen for hesitation or players repeating earlier talking points.',
            'Watch for context mismatches in early rounds.',
          ],
        ),
        const SizedBox(height: 16),
        _buildClueComparison(),
      ],
    );
  }

  Widget _buildImposterTab() {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        _buildSectionCard(
          title: 'IMPOSTER OBJECTIVE',
          accentColor: AppColors.imposterGlow,
          content: 'Survive the votes until active imposters are greater than or equal to active citizens.',
        ),
        const SizedBox(height: 16),
        _buildTipsCard(
          title: 'HOW TO PLAY AS IMPOSTER',
          tips: [
            'Listen before speaking — let citizens anchor the conversation first.',
            'Follow themes and emotional tone, not exact words.',
            'Talk about broad situations, memories, and personal experiences.',
            'Stay adaptable and confident. Hesitation is the first giveaway.',
            'In Blind mode, nod along and mirror the confidence of the room.',
          ],
        ),
        const SizedBox(height: 16),
        _buildGoldenRuleCard(),
      ],
    );
  }

  Widget _buildRulesTab() {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        _buildSectionCard(
          title: 'SETUP LIMITS',
          accentColor: AppColors.gold,
          content: '• Maximum Players: 15\n• Maximum Imposters: 7\n• Minimum Players: (2 × Imposters) + 1\n• Category: One category chosen per game',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: 'DISCUSSION & VOTING',
          accentColor: AppColors.textPrimary,
          content: 'The app does not handle speaking order or count votes.\n\nPlayers talk freely, debate clues, and conduct in-person group votes. When someone is voted out, tap their tile on the People Board.',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: 'ELIMINATION SECRECY',
          accentColor: AppColors.imposterGlow,
          content: 'The app will ONLY reveal whether the eliminated participant was a Citizen or Imposter.\n\nSecret words and hints are NEVER revealed until the game has fully finished.',
        ),
        const SizedBox(height: 16),
        _buildSectionCard(
          title: 'WIN CONDITIONS',
          accentColor: AppColors.emerald,
          content: '• Citizens Win: All imposters have been eliminated.\n• Imposters Win: Active Imposters >= Active Citizens.',
        ),
      ],
    );
  }

  Widget _buildSectionCard({
    required String title,
    required Color accentColor,
    required String content,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.surfaceBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: AppTextStyles.labelCaps.copyWith(
              color: accentColor,
              letterSpacing: 2.0,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: AppTextStyles.bodyLarge.copyWith(color: AppColors.textPrimary, height: 1.5),
          ),
        ],
      ),
    );
  }

  Widget _buildTipsCard({required String title, required List<String> tips}) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.surfaceBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: AppTextStyles.labelCaps.copyWith(
              color: AppColors.textSecondary,
              letterSpacing: 2.0,
            ),
          ),
          const SizedBox(height: 14),
          ...tips.map((tip) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      margin: const EdgeInsets.only(top: 6),
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.accent,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        tip,
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textPrimary,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  Widget _buildClueComparison() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surfaceElevated,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.surfaceBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'STRONG CLUES VS WEAK CLUES',
            style: AppTextStyles.labelCaps.copyWith(color: AppColors.gold),
          ),
          const SizedBox(height: 14),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('STRONG (Contextual)', style: AppTextStyles.titleSmall.copyWith(color: AppColors.emerald, fontSize: 13)),
                    const SizedBox(height: 6),
                    Text('• "Weekend ritual"\n• "Celebration mood"\n• "Travel companion"', style: AppTextStyles.bodyMedium),
                  ],
                ),
              ),
              Container(width: 1, height: 80, color: AppColors.surfaceBorder),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('WEAK (Obvious)', style: AppTextStyles.titleSmall.copyWith(color: AppColors.imposterGlow, fontSize: 13)),
                    const SizedBox(height: 6),
                    Text('• Definitions\n• Exact colors/sizes\n• Synonyms', style: AppTextStyles.bodyMedium),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildGoldenRuleCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.accent.withOpacity(0.12),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.accent.withOpacity(0.4)),
      ),
      child: Column(
        children: [
          Text(
            'THE GOLDEN RULE',
            style: AppTextStyles.labelCaps.copyWith(color: AppColors.accentGlow),
          ),
          const SizedBox(height: 10),
          Text(
            '"Help your side without revealing the answer."',
            textAlign: TextAlign.center,
            style: AppTextStyles.titleMedium.copyWith(fontStyle: FontStyle.italic),
          ),
        ],
      ),
    );
  }
}
