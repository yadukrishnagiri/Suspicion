# 🕵️ Suspicion — Master Game & Project Specification

An in-person, pass-and-play social deduction party game companion (The Digital Game Master).

---

## 1. Executive Summary & Core Philosophy

**Suspicion** is an in-person social deduction game designed for a single mobile device passed among players in a room. 

The app acts strictly as the **Game Master and Secret Information Dealer**:
- Deals private roles, secret words, and hints.
- Selects the discussion starter.
- Manages the visual state of active vs. eliminated players.
- Reveals a player's identity (Citizen or Imposter) upon elimination.
- Enforces game-end conditions.

All social gameplay happens face-to-face in the real world:
- Clue-giving and spoken words.
- Accusations, deductions, and bluffing.
- Voting, tie-breaking, and consensus.
- Deciding whether to eliminate or skip a vote.

There are **no automated turn timers, no point tallies, no leaderboards, and no online servers**.

---

## 2. Player Roles & Balancing Formula

### The Roles
* **Citizens (Innocents):** The majority of the group. All Citizens secretly receive the same **Main Word** (e.g., `"Rain"`). Their goal is to identify and eliminate all Imposters without revealing their secret word.
* **Imposters:** The secret infiltrators. They do not know the Main Word. Their goal is to blend in, deduce what the Citizens are talking about, and survive until they reach parity with the Citizens.

### Player Count Formula
To maintain competitive balance, the number of participants strictly respects the minimum-player formula:

$$\text{Minimum Players} = (2 \times \text{Number of Imposters}) + 1$$

* **Total Players Allowed:** 3 to 15 players.
* **Total Imposters Allowed:** 1 to 7 imposters.

#### Player & Imposter Matrix
| Total Players | Permitted Imposters | Minimum Players Rule |
| :---: | :---: | :--- |
| **3 – 4** | **1** | $(2 \times 1) + 1 = 3$ |
| **5 – 6** | **1 or 2** | $(2 \times 2) + 1 = 5$ |
| **7 – 8** | **1, 2, or 3** | $(2 \times 3) + 1 = 7$ |
| **9 – 10** | **1, 2, 3, or 4** | $(2 \times 4) + 1 = 9$ |
| **11 – 12** | **1 through 5** | $(2 \times 5) + 1 = 11$ |
| **13 – 14** | **1 through 6** | $(2 \times 6) + 1 = 13$ |
| **15** | **1 through 7** | $(2 \times 7) + 1 = 15$ |

---

## 3. The Three Game Modes

Hosts select one of three game modes prior to starting each match:

### Mode 1: Everyone Gets a Word
* **Citizens Receive:** The **Main Word** (e.g., `"Rain"`).
* **Imposters Receive:** The **Imposter Word** (e.g., `"Umbrella"`).
* **Dynamics:** Subtle deception. The Imposter does not realize they are giving clues about a slightly different object/concept until inconsistencies emerge.

### Mode 2: Imposter Gets a Clue
* **Citizens Receive:** The **Main Word** (e.g., `"Rain"`).
* **Imposters Receive:** An **Indirect Situational Hint** (e.g., `"Cancelled plans"`).
* **Imposters Receive NO Word.**
* **Dynamics:** High-tension bluffing. The Imposter knows they are the Imposter and must use an ambiguous situational hint to improvise convincing clues.

### Mode 3: Blind Imposter
* **Citizens Receive:** The **Main Word** (e.g., `"Rain"`).
* **Imposters Receive:** **Nothing** (*"You are the Imposter"*).
* **Dynamics:** Pure social deduction and active listening. The Imposter must read the room and mimic the theme without getting caught.

---

## 4. End-to-End Gameplay Workflow

```
┌─────────────────┐     ┌─────────────────────┐     ┌────────────────────────┐
│  1. GAME SETUP  │ ──> │ 2. PASS & REVEAL    │ ──> │ 3. START DISCUSSION    │
│  Names, Mode,   │     │ Each player views   │     │ Random starter chosen; │
│  Category       │     │ card secretly       │     │ 1 spoken word each     │
└─────────────────┘     └─────────────────────┘     └────────────────────────┘
                                                                 │
                                                                 ▼
┌─────────────────┐     ┌─────────────────────┐     ┌────────────────────────┐
│  6. GAME OVER   │ <── │ 5. ELIMINATION      │ <── │ 4. REAL-WORLD DEBATE   │
│  Instant replay │     │ Tap card -> Role is │     │ Accuse & vote in room; │
│  keeps names    │     │ revealed (No Words!)│     │ Option to skip vote    │
└─────────────────┘     └─────────────────────┘     └────────────────────────┘
```

### Phase 1: Setup & Lobby
1. Host enters the total player count and imposter count.
2. Participant names are entered in order (e.g., Alice, Bob, Charlie).
3. Host selects the **Game Mode** and **Category** (e.g., Food & Drinks, Everyday Objects).
4. *Setup Persistence:* Names and seating order remain saved for subsequent games.

### Phase 2: Private Reveal (Pass-the-Phone)
1. Player cards are presented in the **exact entered order** (never shuffled, so physical passing is predictable).
2. Each player taps their card to view their secret information privately.
3. Player taps to conceal their card and hands the device to the next person.

### Phase 3: Start of Discussion
1. Once the last player has confirmed their card, the app presents the discussion screen.
2. The app randomly selects **one Discussion Starter**.
3. **The Starter Rule:** This person remains the designated starter for the **entire duration** of the current game (even across multiple rounds and eliminations).
4. Going in order starting from the starter, **each active player says exactly one word** relating to their information.

### Phase 4: Voting & Accusations (Real World)
1. Players discuss the spoken words, challenge suspicious choices, and defend themselves.
2. The group casts votes in real life.
3. **No-Elimination Option:** If the group is undecided, they can choose to skip eliminating anyone and proceed to another clue-giving round with the same discussion starter.

### Phase 5: Elimination & Role Reveal
1. When the group decides to eliminate a suspect, their card on the screen is tapped.
2. The app plays a reveal animation and displays their role:
   * **Citizen:** Screen shows `"NOT THE IMPOSTOR"`. Card turns grey/inactive.
   * **Imposter:** Screen shows `"IMPOSTOR FOUND"`.
3. ⚠️ **The Golden Rule: Words Are Never Revealed.** Even after elimination, secret words or hints are never exposed on screen to protect the integrity of ongoing rounds.

### Phase 6: Win Conditions & Parity Logic
After an elimination, the app evaluates:
* 🏆 **Citizens Win:** When **all Imposters have been eliminated**.
* 😈 **Imposters Win:** When **Active Imposters $\ge$ Active Citizens** (Parity Rule).
  * *Example 1:* 1 Imposter + 1 Citizen remaining $\rightarrow$ **Imposter Wins**.
  * *Example 2:* 2 Imposters + 2 Citizens remaining $\rightarrow$ **Imposters Win**.
  * *Example 3:* 2 Imposters + 3 Citizens remaining $\rightarrow$ **Game Continues**.

### Phase 7: Rematch / New Game
* Tapping **New Game** resets all player statuses to active, generates a new word pair, and assigns a new random discussion starter.
* Player names and order are preserved without needing re-entry.

---

## 5. Master Excel Dataset Architecture

The game’s content engine is powered by an Excel database (`imposter_master_dataset_v4_indirect_hints.xlsx`), structured into 11 columns per record:

| Column | Header | Visibility | Purpose & Game Function |
| :---: | :--- | :---: | :--- |
| **A** | `ID` | Internal | Unique numeric ID for each word-pair record. |
| **B** | `Category` | Public | The broad theme chosen during setup (8 official categories). |
| **C** | `Main Word` | Secret (Citizens) | The primary word delivered to Citizens in all 3 modes. |
| **D** | `Imposter Word` | Secret (Imposter) | The related word given to the Imposter in **Mode 1**. |
| **E** | `Imposter Category` | Internal | Internal classification ensuring diverse word associations. |
| **F** | `Relationship Type` | Internal | Logic connecting the words (*shared setting, associated object, same occasion, functional connection*). Never shown to players. |
| **G** | `Imposter Hint` | Secret (Imposter) | The indirect contextual clue delivered in **Mode 2**. |
| **H** | `Difficulty` | Internal/Public | *Easy*, *Medium*, or *Hard* rating based on subtlety of connection. |
| **I** | `Pair Group` | Internal | Clustering index to avoid choosing similar themes back-to-back. |
| **J** | `Pattern Risk` | Internal | Metric guarding against predictable clue formulas. |
| **K** | `Vocabulary Level` | Internal | *Common*, *Familiar*, or *Advanced* to guarantee accessible party vocabulary. |

### Curation Rules for Word Pairs & Hints
* **Not Synonyms:** The Imposter Word must never be a direct synonym (e.g., avoid `Bicycle` vs `Bike`). It should be a contextual counterpart (e.g., `Rain` ➡️ `Umbrella`, `Doctor` ➡️ `Stethoscope`, `Campfire` ➡️ `Marshmallow`).
* **Indirect Hints (Mode 2):** Hints must point toward situations, emotions, memories, or consequences (e.g., for `Pizza` ➡️ `"Friday night"`, not `"Italian food with cheese"`).

### The 8 Official Categories
1. **Everyday Objects**
2. **Food & Drinks**
3. **Animals & Nature**
4. **Pop Culture & Media**
5. **Sports & Activities**
6. **Places & Travel**
7. **Concepts & Weather**
8. **Occupations**

---

## 6. System Boundary: App vs. Human Players

| App Responsibilities (Digital Game Master) | Real-World Player Responsibilities |
| :--- | :--- |
| Storing participants and turn sequence | Giving spoken word clues out loud |
| Drawing random words from the Excel dataset | Reading body language and facial expressions |
| Secretly assigning and revealing private roles | Debating, accusing, and cross-examining |
| Selecting the discussion starter | Voting and resolving voting ties |
| Showing visual states (Active vs. Greyed-out) | Deciding when to skip an elimination |
| Enforcing win/loss parity conditions | Determining house rules on speaking limits |
| Keeping word secrets safe after elimination | Celebrating victories and laughing over bluffs |

---

## 7. Master Prompt for Project Development

Use the block below as the starting prompt for any development team, AI agent, or designer:

```text
Build an in-person, pass-and-play social deduction mobile game called "Suspicion" (The Imposter Game Master). 
The app acts strictly as an offline game master and secret dealer—no online multiplayer servers, point systems, 
leaderboards, or automated voting timers.

Core Rules & Mechanics:
1. Player Range: 3 to 15 players, with 1 to 7 imposters. Enforce the balancing formula:
   Minimum Players = (2 * Imposters) + 1. Prevent invalid setups.
2. Three Game Modes:
   - Mode 1 (Word vs Word): Citizens get Main Word; Imposter gets related Imposter Word.
   - Mode 2 (Word vs Hint): Citizens get Main Word; Imposter gets an indirect contextual hint.
   - Mode 3 (Blind Imposter): Citizens get Main Word; Imposter receives nothing.
3. Workflow & UX:
   - Setup: Player count, imposter count, ordered player names (persisted across games), mode, and category.
   - Private Reveal: Sequential pass-the-phone cards in exact entered order with tap-to-reveal and tap-to-hide.
   - Discussion: Randomly pick ONE discussion starter who remains the starter for the entire match.
   - Real-World Play: Players give 1 spoken word each; debate and vote happen in person.
   - Elimination: Tap accused player card -> reveals role ("NOT THE IMPOSTOR" or "IMPOSTOR FOUND").
     CRITICAL: Secret words are NEVER revealed on elimination.
   - Win Evaluation: Citizens win when all imposters are eliminated. Imposters win when active imposters >= active citizens.
   - Rematch: 1-tap "New Game" resets active states, draws new words, and keeps player names.
4. Content Engine:
   Powered by an 11-column dataset (ID, Category, Main Word, Imposter Word, Imposter Category, 
   Relationship Type, Imposter Hint, Difficulty, Pair Group, Pattern Risk, Vocabulary Level) 
   across 8 party categories with carefully curated, non-synonym word associations and indirect hints.
```
