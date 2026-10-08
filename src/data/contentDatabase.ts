import generatedWords from './imposter_words.json';
import contentManifest from './content_manifest.json';
import type { GameCategory, WordEntry } from '../types/game';

export const WORD_DATABASE = generatedWords as WordEntry[];
export const CONTENT_DATABASE_INFO = contentManifest;

export function getWordPool(category: GameCategory): WordEntry[] {
  if (category === 'All Categories') return WORD_DATABASE;
  const matching = WORD_DATABASE.filter((entry) => entry.category === category);
  return matching.length > 0 ? matching : WORD_DATABASE;
}
