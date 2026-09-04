import { create } from 'zustand';
import { GameMode, GameCategory, Player, GamePhase, Winner, WordEntry } from '../types/game';
import wordsData from '../data/imposter_words.json';

export const CATEGORIES: GameCategory[] = [
  'Concepts & Weather',
  'Food & Drinks',
  'Animals & Nature',
  'Everyday Objects',
  'Places & Travel',
  'Sports & Activities',
  'Occupations',
  'Pop Culture & Media',
];

interface GameState {
  // Setup configuration (persisted between games)
  playerCount: number;
  imposterCount: number;
  participantNames: string[];
  selectedMode: GameMode;
  selectedCategory: GameCategory;

  // Active game state
  phase: GamePhase;
  players: Player[];
  discussionStarterId: string | null;
  activeWordEntry: WordEntry | null;
  currentRevealIndex: number;
  winner: Winner;
  roundNumber: number;

  // Elimination modal/status state
  lastEliminatedPlayer: Player | null;

  // Actions
  setPlayerCount: (count: number) => void;
  setImposterCount: (count: number) => void;
  setParticipantNames: (names: string[]) => void;
  setParticipantName: (index: number, name: string) => void;
  setSelectedMode: (mode: GameMode) => void;
  setSelectedCategory: (cat: GameCategory) => void;

  startNewGame: () => void;
  nextReveal: () => void;
  finishRevealAndStartDiscussion: () => void;
  eliminatePlayer: (playerId: string) => void;
  clearLastEliminated: () => void;
  resetGameKeepSetup: () => void;
  backToSetup: () => void;
}

// Helpers
export function getMaxImposters(players: number): number {
  return Math.max(1, Math.floor((players - 1) / 2));
}

export function getMinPlayers(imposters: number): number {
  return 2 * imposters + 1;
}

const DEFAULT_NAMES = [
  'Player 1',
  'Player 2',
  'Player 3',
  'Player 4',
  'Player 5',
  'Player 6',
  'Player 7',
  'Player 8',
];

export const useGameStore = create<GameState>((set, get) => ({
  playerCount: 8,
  imposterCount: 1,
  participantNames: [...DEFAULT_NAMES],
  selectedMode: 'everyone_gets_word',
  selectedCategory: 'Food & Drinks',

  phase: 'setup',
  players: [],
  discussionStarterId: null,
  activeWordEntry: null,
  currentRevealIndex: 0,
  winner: null,
  roundNumber: 1,
  lastEliminatedPlayer: null,

  setPlayerCount: (count: number) => {
    const clamped = Math.max(3, Math.min(15, count));
    const maxImposters = getMaxImposters(clamped);
    const currImposters = get().imposterCount;
    const newImposters = Math.min(currImposters, maxImposters);

    // Adjust names array length
    const currentNames = [...get().participantNames];
    let newNames = [...currentNames];
    if (newNames.length < clamped) {
      for (let i = newNames.length; i < clamped; i++) {
        newNames.push(`Player ${i + 1}`);
      }
    } else if (newNames.length > clamped) {
      newNames = newNames.slice(0, clamped);
    }

    set({
      playerCount: clamped,
      imposterCount: newImposters,
      participantNames: newNames,
    });
  },

  setImposterCount: (count: number) => {
    const maxAllowed = getMaxImposters(get().playerCount);
    const clamped = Math.max(1, Math.min(maxAllowed, count));
    set({ imposterCount: clamped });
  },

  setParticipantNames: (names: string[]) => {
    set({ participantNames: names });
  },

  setParticipantName: (index: number, name: string) => {
    const names = [...get().participantNames];
    names[index] = name;
    set({ participantNames: names });
  },

  setSelectedMode: (mode: GameMode) => {
    set({ selectedMode: mode });
  },

  setSelectedCategory: (category: GameCategory) => {
    set({ selectedCategory: category });
  },

  startNewGame: () => {
    const {
      playerCount,
      imposterCount,
      participantNames,
      selectedCategory,
      selectedMode,
    } = get();

    // 1. Pick a random word from category
    const categoryWords = (wordsData as WordEntry[]).filter(
      (w) => w.category.toLowerCase() === selectedCategory.toLowerCase()
    );
    const wordPool = categoryWords.length > 0 ? categoryWords : (wordsData as WordEntry[]);
    const randomIndex = Math.floor(Math.random() * wordPool.length);
    const chosenWordEntry = wordPool[randomIndex];

    // 2. Select imposters randomly
    const playerIndices = Array.from({ length: playerCount }, (_, i) => i);
    // Shuffle indices to pick imposters
    const shuffled = [...playerIndices].sort(() => Math.random() - 0.5);
    const imposterIndicesSet = new Set(shuffled.slice(0, imposterCount));

    // 3. Build player list in entered order
    const builtPlayers: Player[] = participantNames.slice(0, playerCount).map((name, idx) => {
      const isImposter = imposterIndicesSet.has(idx);
      const role = isImposter ? 'imposter' : 'citizen';

      let assigned = '';
      if (!isImposter) {
        assigned = chosenWordEntry.mainWord;
      } else {
        if (selectedMode === 'everyone_gets_word') {
          assigned = chosenWordEntry.imposterWord;
        } else if (selectedMode === 'imposter_gets_clue') {
          assigned = chosenWordEntry.imposterHint || 'Look around carefully';
        } else {
          // Blind Imposter
          assigned = '';
        }
      }

      return {
        id: `player_${idx}`,
        name: name.trim() || `Player ${idx + 1}`,
        role,
        isEliminated: false,
        assignedWordOrHint: assigned,
      };
    });

    // 4. Randomly pick a discussion starter from ALL players
    const starterIndex = Math.floor(Math.random() * playerCount);
    const starterId = builtPlayers[starterIndex].id;

    set({
      phase: 'reveal',
      players: builtPlayers,
      activeWordEntry: chosenWordEntry,
      discussionStarterId: starterId,
      currentRevealIndex: 0,
      winner: null,
      roundNumber: 1,
      lastEliminatedPlayer: null,
    });
  },

  nextReveal: () => {
    const { currentRevealIndex, players } = get();
    if (currentRevealIndex + 1 < players.length) {
      set({ currentRevealIndex: currentRevealIndex + 1 });
    } else {
      // Finished all cards, move to discussion
      set({ phase: 'discussion' });
    }
  },

  finishRevealAndStartDiscussion: () => {
    set({ phase: 'discussion' });
  },

  eliminatePlayer: (playerId: string) => {
    const { players, winner } = get();
    if (winner) return; // Game already concluded

    const updated = players.map((p) =>
      p.id === playerId ? { ...p, isEliminated: true } : p
    );

    const eliminated = updated.find((p) => p.id === playerId) || null;

    // Check win conditions
    const activeCitizens = updated.filter((p) => !p.isEliminated && p.role === 'citizen').length;
    const activeImposters = updated.filter((p) => !p.isEliminated && p.role === 'imposter').length;

    let newWinner: Winner = null;
    let newPhase = get().phase;

    if (activeImposters === 0) {
      newWinner = 'citizens';
      newPhase = 'game_over';
    } else if (activeImposters >= activeCitizens) {
      newWinner = 'imposters';
      newPhase = 'game_over';
    }

    set({
      players: updated,
      winner: newWinner,
      phase: newPhase,
      lastEliminatedPlayer: eliminated,
    });
  },

  clearLastEliminated: () => {
    set({ lastEliminatedPlayer: null });
  },

  resetGameKeepSetup: () => {
    // Retains participantNames, playerCount, imposterCount, selectedMode, selectedCategory
    // Generates a new game
    get().startNewGame();
  },

  backToSetup: () => {
    set({
      phase: 'setup',
      players: [],
      winner: null,
      discussionStarterId: null,
      activeWordEntry: null,
      lastEliminatedPlayer: null,
    });
  },
}));
