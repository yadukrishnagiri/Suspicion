# Imposter — Technical Architecture

## V1 Architecture

Mobile App
│
├── Local Dataset
│     ├── Main Words
│     ├── Imposter Words
│     └── Hints
│
├── Firebase Authentication
│     └── Google Login
│
└── Cloud Firestore
      └── User Profile

## Stored Data

User:
- uid
- displayName
- recentPlayerNames

No game history.
No voting history.
No analytics-heavy storage.

## Name Suggestions

Recently used names are saved.

Example:
A → Alex, Akhil

## Why Local Dataset?

Benefits:
- offline support
- zero dataset reads
- faster startup
- lower cloud costs

## Cloud Usage

Firestore is only for lightweight profile data.

Ideal for early launch and free-tier growth.
