# Imposter Game — Master Game Specification

## 1. Game Overview

This is an **in-person social deduction party game**.

The app acts as the **game master / secret information dealer**. It handles setup, private information, randomization, player-card state, elimination reveals, and game-end state.

The real-world players handle the social part:
- discussion
- spoken words
- voting
- tie resolution
- deciding whether to eliminate someone
- deciding whether to continue without an elimination

There is **no scoring, points, leaderboard, or scorekeeping**.

---

## 2. Game Modes

### Mode 1 — Everyone Gets a Word

Normal players receive:
- **Main Word**

Imposters receive:
- **Imposter Word**

The imposter word is related to the main word, but should not always be a synonym or an obvious same-category equivalent.

### Mode 2 — Imposter Gets a Clue

Normal players receive:
- **Main Word**

Imposters receive:
- **Imposter Hint / Clue**

The imposter receives **no word**.

The hint is focused on the Main Word, but should be indirect enough that the answer is not immediately obvious.

Good hint styles:
- situation
- memory
- place
- activity
- emotion
- event
- consequence

Avoid:
- direct definitions
- obvious descriptions
- the Main Word itself
- the Imposter Word itself
- clues that reveal the answer within a few seconds

Examples:

Main Word: `Pizza`

Good:
- `Friday night`
- `Movie marathon`
- `Group decision`

Too obvious:
- `A popular Italian food`
- `A cheesy dish`

### Mode 3 — Blind Imposter

Normal players receive:
- **Main Word**

Imposters receive:
- **Nothing**

---

## 3. Version 1 Categories

1. Concepts & Weather
2. Pop Culture & Media
3. Occupations
4. Sports & Activities
5. Places & Travel
6. Everyday Objects
7. Animals & Nature
8. Food & Drinks

Players choose the categories during setup.

---

## 4. Master Dataset

The master dataset supports the game with:

- Main Word
- Imposter Word
- Imposter Category
- Relationship Type
- Imposter Hint
- Difficulty
- Pair Group
- Pattern Risk
- Vocabulary Level

### Content rules

The Imposter Word should not default to:
- a synonym
- a near-synonym
- an obvious same-category equivalent

Relationships can include:
- shared setting
- associated object
- associated person
- shared experience
- same occasion
- thematic association
- functional connection
- shared activity
- other natural associations

Relationship information and Imposter Category are **internal data** and must not be shown to players.

### Vocabulary

V1 should favor normal, commonly understood vocabulary.

Vocabulary levels:
- Common
- Familiar
- Advanced

Advanced vocabulary should be limited and mainly reserved for harder content.

### Imposter Hint

The Imposter Hint is specifically for **Mode 2**.

It should:
- point toward the Main Word
- be indirect
- use simple language
- feel natural
- give the imposter something to work with
- avoid making the answer immediately obvious
- vary enough that repeated games do not reveal a clue template

---

## 5. Game Setup

### Step 1 — Number of Players

The player selects the total number of participants.

**Maximum players: 15**

The minimum number of players depends on the number of imposters.

### Step 2 — Number of Imposters

Minimum-player rule:

> **Minimum players = (2 × number of imposters) + 1**

Because the app supports a maximum of 15 total players, the maximum number of imposters is **7**.

Examples:
- 1 imposter → minimum 3 players
- 2 imposters → minimum 5 players
- 3 imposters → minimum 7 players
- 4 imposters → minimum 9 players
- 5 imposters → minimum 11 players
- 6 imposters → minimum 13 players
- 7 imposters → minimum 15 players

This is a **minimum floor**, not a restriction on combinations above the minimum.

Examples:
- 6 players → 1 or 2 imposters
- 8 players → 1 or 2 imposters
- 9 players → 1, 2, or 3 imposters
- 15 players → 1 through 7 imposters

The app must prevent selecting an imposter count that violates the minimum-player rule.

### Step 3 — Participant Names

All participants are added.

Their entered order is preserved.

That order determines the visible order of player cards.

### Step 4 — Game Mode

Choose one:
- Everyone Gets a Word
- Imposter Gets a Clue
- Blind Imposter

The selected mode applies to the current game.

**Mode can be changed for a new game without re-entering the participant names.**

The player list/order is retained; only the game mode and new game information need to be generated again.

### Step 5 — Category

Choose **one category per game**.

Only one category is active for a game.

For a new game, the category can be changed without re-entering participant names.

---

## 5A. Setup Persistence Between Games

Participant names and their entered order should be retained after a game ends.

When starting a new game, players do **not** need to enter the names again.

They can change:
- game mode
- category
- number of imposters, subject to the player-count rule

The participant list and card order remain available unless the players explicitly edit the player list.

---

## 6. New Game

A **new game** means a new complete game.

A new game generates:
- new Main Word
- new Imposter Word(s), where applicable
- new Imposter Hint, where applicable
- new imposter assignment(s)
- new discussion starter

The discussion starter is randomly selected once at the beginning of each new game.

The same person may randomly start consecutive games.

An imposter may randomly be selected as the discussion starter.

There is no balancing rule that prevents this.

---

## 7. Private Information Reveal

Player cards appear in the **exact name order entered during setup**.

Players reveal their own cards privately and pass the phone around.

### Reveal order

The private reveal order is **not shuffled**.

Players can simply go through the visible cards in the entered order.

The randomized element is the **discussion starter**, not the private reveal order.

### What each mode shows

#### Mode 1
Normal player → Main Word
Imposter → Imposter Word

#### Mode 2
Normal player → Main Word
Imposter → Imposter Hint

#### Mode 3
Normal player → Main Word
Imposter → Nothing

Only the current player sees their information.

---

## 8. Start of Discussion

After the final player has seen their information:

- Next becomes available.
- The app returns to the player-card view.
- Only player names are shown.
- One discussion starter is randomly selected.

The discussion starter remains the same for the **entire current game**.

The starter does **not** change after eliminations.

The starter changes only when a new game begins.

---

## 9. Real-World Discussion

The selected starter begins.

Players then give **one spoken word related to their information**.

The app does not:
- validate spoken words
- provide words
- moderate discussion
- force a speaking order
- force a timer

A discussion round normally means:

> Every active player has given one spoken word.

After that, the group may decide what to do.

---

## 10. Voting

Voting happens entirely in the real world.

The app does not:
- collect votes
- force a vote
- calculate votes
- resolve ties
- force an elimination

The group may:
- eliminate someone
- resolve a tie however they choose
- continue discussion without eliminating anyone

### No-Elimination Round

If the group chooses not to eliminate anyone, the app does not change player status.

Discussion simply continues into another round.

The same discussion starter remains the starter.

---

## 11. Elimination

When the group decides to eliminate a player:

1. Tap that player's card.
2. Play a simple reveal animation.
3. Reveal only the player's role:
   - **Citizen**
   - **Impostor**

### Critical rule

**Never reveal the word.**

Even after elimination, the player's Main Word, Imposter Word, or Hint remains private.

---

## 12. Citizen Elimination

If the eliminated player is not an imposter:

Display a simple result such as:

> **NOT THE IMPOSTOR**

Their card becomes:
- grey
- inactive
- clearly marked as eliminated

That person sits out in the real world.

The remaining active players continue.

---

## 13. Imposter Elimination

If the eliminated player is an imposter:

Display:

> **IMPOSTOR FOUND**

Then:

> **PLAYERS WIN**

The current game ends immediately **only when that elimination leaves no imposters remaining**.

The imposter's word is still not revealed.

---

## 14. Multiple Imposters

The game supports multiple imposters.

When an imposter is eliminated:
- their role is revealed
- their card becomes inactive/grey
- they sit out
- the game continues if at least one imposter remains and the imposter win condition has not been reached

The app tracks:
- active citizens
- active imposters

---

## 15. Win Conditions

### Players Win

Players win when:

> **All imposters have been eliminated.**

### Imposters Win

Imposters win when:

> **Active imposters >= active citizens**

Examples:

- 1 imposter + 3 citizens → continue
- 1 imposter + 2 citizens → continue
- 1 imposter + 1 citizen → **Imposters win**
- 2 imposters + 4 citizens → continue
- 2 imposters + 3 citizens → continue
- 2 imposters + 2 citizens → **Imposters win**
- 3 imposters + 4 citizens → continue
- 3 imposters + 3 citizens → **Imposters win**

The group still controls when to attempt an elimination. The app only evaluates the game state after an elimination/reveal.

---

## 16. Final-Round Logic

For one imposter:

### Imposter + 1 Citizen
> **Imposter wins**

### 2 Citizens and 0 Imposters
> **Players win**

For multiple imposters, the same parity rule applies:

> If imposters are equal to or greater than citizens, imposters win.

---

## 17. Discussion Round vs Game

These are different levels.

### Discussion Round

One cycle where active players give one word each.

There can be:
- one discussion round
- several discussion rounds
- several discussion rounds with no elimination

No new word assignment occurs between discussion rounds.

### Game

A complete game beginning with:
- new word/pair
- new imposter assignment
- new discussion starter

The game ends when:
- all imposters are eliminated → Players Win
- imposters reach parity with citizens → Imposters Win

---

## 18. New Game Reset

After a game ends, a new game resets:

- all players active
- all greyed-out states cleared
- new Main Word
- new Imposter Word(s), where applicable
- new Imposter Hint, where applicable
- new imposter assignment(s)
- new discussion starter

The same participants remain available unless the setup is changed.

The new discussion starter may be the same person as before by chance.

---

## 19. Randomization

Randomize:
- imposter assignment(s)
- Main Word / word-pair selection
- Imposter Hint selection when multiple hints exist
- discussion starter

Do not randomize:
- participant name order
- visible player-card order
- private reveal order
- discussion starter after each elimination

The discussion starter is randomized **once per new game**.

---

## 20. App Responsibility vs Real-World Responsibility

### App

The app handles:
- setup
- participant list
- category selection
- mode selection
- word selection
- secret role assignment
- private reveal
- discussion-starter randomization
- player card display
- eliminated-card state
- Citizen/Impostor reveal
- win state
- new-game reset

### Players

Players handle:
- spoken words
- discussion
- accusations
- voting
- tie decisions
- whether to eliminate someone
- whether to skip elimination
- how many discussion rounds to have
- all other real-world social decisions

The app should not interfere with the social part of the game.

---

## 21. Core In-Game UX

The central interaction is intentionally simple:

> **Reveal → Pass Phone → Start Discussion → Discuss in Real Life → Tap Eliminated Player → Reveal Role → Continue or Win**

The app should feel like a **simple physical party-game companion / game master**, not an online moderator.

No:
- scoring
- points
- leaderboard
- forced timers
- forced voting
- forced elimination
- word reveal after elimination
- unnecessary intervention in the discussion

