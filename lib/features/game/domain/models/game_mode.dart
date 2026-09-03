enum GameMode {
  mode1(
    title: 'Word vs Word',
    subtitle: 'Citizens get Main Word. Imposters get Imposter Word.',
    imposterPrompt: 'Imposter Word',
  ),
  mode2(
    title: 'Word vs Hint',
    subtitle: 'Citizens get Main Word. Imposters get a shared context hint.',
    imposterPrompt: 'Shared Context Hint',
  ),
  mode3(
    title: 'Blind Imposter',
    subtitle: 'Citizens get Main Word. Imposters receive nothing.',
    imposterPrompt: 'No Word (Blind)',
  );

  final String title;
  final String subtitle;
  final String imposterPrompt;

  const GameMode({
    required this.title,
    required this.subtitle,
    required this.imposterPrompt,
  });
}
