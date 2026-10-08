# Suspicion

Suspicion is a pass-and-play social deduction game for a group sharing one phone. The Backstage Masquerade design takes the group from casting through private invitations, discussion, elimination, and the final unmasking. Talking and voting happen together in person.

No account or login is required. Player-name suggestions are saved locally on the device; there is no account-based profile or online multiplayer.

## How to play

1. Start a game, choose 3–15 players and a valid number of imposters, then enter names in passing order.
2. Choose a game mode and one of the eight categories.
3. Pass the phone around. Each player touches and holds their own sealed card to see their role and secret; releasing the card conceals it. Pass the phone only after the card has been released.
4. Give clues and discuss in person. The app picks a discussion starter and lets the group record an agreed elimination—or continue for another clue round.
5. An eliminated player's role is revealed, but their secret word is not. The game ends when the citizens find every imposter or the remaining imposters equal or outnumber the citizens.
6. Rematch with the same group, change the game settings, or start a new group.

### Game modes

- **Word against word:** Citizens receive the main word; imposters receive a related word.
- **Word against hint:** Citizens receive the main word; imposters receive an indirect hint.
- **Blind imposter:** Citizens receive the main word; imposters receive no word or hint.

The game supports eight categories: Concepts & Weather, Food & Drinks, Animals & Nature, Everyday Objects, Places & Travel, Sports & Activities, Occupations, and Pop Culture & Media. The maintained source database is [`outputs/suspicion-content-rewrite/imposter_game_master_dataset_v5_relatable.xlsx`](outputs/suspicion-content-rewrite/imposter_game_master_dataset_v5_relatable.xlsx). Its `MASTER DATASET` sheet is compiled into the offline app database in [`src/data/imposter_words.json`](src/data/imposter_words.json) and can be published to Cloud Firestore. At game start, the app reads the selected category from Firestore and falls back to the exact generated dataset when the device is offline or the remote pack is unavailable.

After editing the workbook, regenerate and validate the app database with Python 3:

```sh
npm run sync:content
npm run check:content
```

The sync rejects missing fields, duplicate IDs, duplicate word pairs, unexpected columns, or unknown categories. It also writes `src/data/content_manifest.json` with the workbook checksum and category counts, making stale generated data detectable in development or CI.

To publish the validated packs to the configured Firestore project:

```sh
npm run seed:content
```

The seeder writes one `word_packs` document per category and a `catalog_metadata/version` document containing the v5 source checksum. Firestore credentials and rules must permit these writes; use an authenticated deployment identity rather than weakening production rules. The app accepts a remote pack only when its checksum matches the bundled workbook manifest, so stale cloud data can never replace the v5 offline database.

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

These builds require an Expo account and EAS Build credentials. The checked-in Android project can also produce a local testing APK with `cd android && ./gradlew assembleRelease` (PowerShell: `.\gradlew.bat assembleRelease`). That release variant currently uses the debug keystore for local installation; configure a dedicated release signing key before distributing through an app store. Use JDK 17 for the local native build.

## Project structure

- `app/` — Expo Router routes and app layout
- `src/components/live/MasqueradeFlow.tsx` — the live welcome, setup, reveal, discussion, and results flow
- `src/components/live/StageUI.tsx` and `masqueradeTheme.ts` — shared stage components, typography, color, and motion tokens
- `src/store/gameStore.ts` — local game setup, roles, rounds, eliminations, and win conditions
- `src/store/usePlayerHistoryStore.ts` — on-device player-name suggestions
- `outputs/suspicion-content-rewrite/imposter_game_master_dataset_v5_relatable.xlsx` — maintained content database
- `scripts/sync-content.py` — validates and compiles the workbook for the app
- `scripts/seedFirestore.mjs` — publishes validated category packs to Firestore
- `src/data/imposter_words.json` and `content_manifest.json` — generated offline database and source checksum
- `assets/masquerade/` — original paired-mask and curtain artwork
- `DESIGN.md` and `docs/design-handoff.md` — design system and screen/motion handoff

## License

See [LICENSE](LICENSE).
