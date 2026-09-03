# Imposter

A premium social deduction party game for in-person groups ("One phone. One group. One liar.").

## Overview
Imposter is an Android party game crafted with modern Kotlin and Jetpack Compose. Players pass a single mobile device around the group to privately reveal secret words or contextual clues, then take turns offering subtle hints before voting to catch the imposters.

## Features
- **Pass & Play Architecture**: Seamless local single-device multiplayer for 3 to 15 players.
- **3 Game Modes**:
  - *Word vs Word*: Citizens receive the main secret word; Imposters receive a closely related counterpart word.
  - *Word vs Hint*: Citizens receive the main secret word; Imposters receive a contextual clue.
  - *Blind Imposter*: Citizens receive the main secret word; Imposters receive no clue at all and must bluff purely on social cues.
- **840-Word Dataset**: Full offline library across 8 curated categories (*Food & Drinks, Animals & Nature, Everyday Objects, Places & Travel, Concepts & Weather, Occupations, Pop Culture & Media, Sports & Activities*).
- **Room Local Persistence**: Automatically persists recent player names for quick selection during setup and records party game history statistics.
- **Discussion Starter & Truth Reveal**: Randomly assigns who must speak first and reveals suspect identities upon elimination without leaking words.

## Architecture
- **Language**: 100% Kotlin
- **UI Toolkit**: Jetpack Compose with Material 3 Design System
- **Database**: Android Jetpack Room with Kotlin Coroutines and Flow
- **Design Aesthetic**: Premium Dark Luxury with Gold and Crimson accents
