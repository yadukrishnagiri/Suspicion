export type GameMode =
  | 'everyone_gets_word' // Mode 1: Everyone Gets a Word
  | 'imposter_gets_clue' // Mode 2: Imposter Gets a Clue
  | 'blind_imposter';    // Mode 3: Blind Imposter

export type GameCategory =
  | 'All Categories'
  | 'Concepts & Weather'
  | 'Pop Culture & Media'
  | 'Occupations'
  | 'Sports & Activities'
  | 'Places & Travel'
  | 'Everyday Objects'
  | 'Animals & Nature'
  | 'Food & Drinks';

export interface WordEntry {
  id: number;
  category: string;
  mainWord: string;
  imposterWord: string;
  imposterCategory: string;
  relationshipType: string;
  imposterHint: string;
  difficulty: string;
  pairGroup: number;
  patternRisk: string;
  vocabularyLevel: string;
}

export type PlayerRole = 'citizen' | 'imposter';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  isEliminated: boolean;
  // Private information given to this player
  assignedWordOrHint: string; // Empty for blind imposter
}

export type GamePhase =
  | 'setup'       // Steps 1-5: player count, imposters, names, mode, category
  | 'reveal'      // Step 7: Pass phone, each reveals card in entered name order
  | 'discussion'  // Step 8-10: Starter shown, real-world discussion, tap player to eliminate or continue
  | 'game_over';  // Step 15: All imposters eliminated (Citizens win) or imposters >= citizens (Imposters win)

export type Winner = 'citizens' | 'imposters' | null;

export interface EliminationEvent {
  player: Player;
  eliminatedRole: PlayerRole;
  citizensRemaining: number;
  impostersRemaining: number;
  isGameOver: boolean;
  winner: Winner;
}
