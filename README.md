# Suspicion

Suspicion is a pass-and-play social deduction game for a group sharing one phone. The app deals secret roles and words, then helps the group move through discussion, voting, and the final reveal. The talking and voting happen together in person.

No account or login is required. Player-name suggestions are saved locally on the device; there is no account-based profile or online multiplayer.

## How to play

1. Open a case, choose 3–15 players and a valid number of imposters, then enter names in passing order.
2. Choose a game mode and one of the eight categories.
3. Pass the phone around. Each player touches and holds their own sealed card to see their role and secret; releasing the card conceals it. Pass the phone only after the card has been released.
4. Give clues and discuss in person. The app picks a discussion starter and lets the group record an agreed elimination—or continue for another clue round.
5. An eliminated player's role is revealed, but their secret word is not. The case ends when the citizens find every imposter or the remaining imposters equal or outnumber the citizens.
6. Rematch with the same group, change the game settings, or start a new group.

### Game modes

- **Word against word:** Citizens receive the main word; imposters receive a related word.
- **Word against hint:** Citizens receive the main word; imposters receive an indirect hint.
- **Blind imposter:** Citizens receive the main word; imposters receive no word or hint.

The game supports eight categories: Concepts & Weather, Food & Drinks, Animals & Nature, Everyday Objects, Places & Travel, Sports & Activities, Occupations, and Pop Culture & Media. The bundled word data lives in [`src/data/imposter_words.json`](src/data/imposter_words.json).

## Run the app

### Requirements

- Node.js compatible with Expo SDK 57 (Node.js 22.13 or later)
- npm
- Android Studio and an Android emulator, or a USB-connected Android device, for Android development

### Install and start

```sh
npm install
npx expo start
```

Use the Expo terminal shortcuts to open the app in an Android emulator (`a`) or browser (`w`). You can also start a specific target with:

```sh
npm run android
npm run web
```

## Build an Android APK

The EAS preview profile creates an installable internal-distribution APK:

```sh
npx eas-cli build --platform android --profile preview
```

The production profile is also configured to create an APK:

```sh
npx eas-cli build --platform android --profile production
```

These builds require an Expo account and EAS Build credentials. A locally built Android release also needs a signing keystore configured for the Android project.

## Project structure

- `app/` — Expo Router routes and app layout
- `src/components/live/LedgerFlow.tsx` — the Detective Ledger game flow and screens
- `src/store/gameStore.ts` — local game setup, roles, rounds, eliminations, and win conditions
- `src/store/usePlayerHistoryStore.ts` — on-device player-name suggestions
- `src/data/imposter_words.json` — bundled game word data
- `assets/ledger/` — artwork used by the Detective Ledger theme

## License

See [LICENSE](LICENSE).
