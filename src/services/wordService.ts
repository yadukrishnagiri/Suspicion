import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { WordEntry, GameCategory } from '@/types/game';
import { CONTENT_DATABASE_INFO, getWordPool, WORD_DATABASE } from '@/data/contentDatabase';

function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

// In-memory cache for word packs fetched from Firestore
const packCache: Record<string, WordEntry[]> = {};

function isWordEntry(value: unknown): value is WordEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<WordEntry>;
  return typeof entry.id === 'number'
    && typeof entry.category === 'string'
    && typeof entry.mainWord === 'string'
    && typeof entry.imposterWord === 'string'
    && typeof entry.imposterHint === 'string';
}

/**
 * Fetch a category pack from Cloud Firestore with offline fallback
 * Cost: Exactly 1 document read per category fetch
 */
export async function getCategoryWords(category: GameCategory): Promise<WordEntry[]> {
  if (category === 'All Categories') {
    return WORD_DATABASE;
  }

  const slug = categoryToSlug(category);

  // 1. Return from memory cache if already fetched during this session
  if (packCache[slug]) {
    return packCache[slug];
  }

  // 2. Try fetching from Cloud Firestore
  try {
    const docRef = doc(db, 'word_packs', slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const matchesWorkbook = data.sourceSha256 === CONTENT_DATABASE_INFO.sourceSha256;
      if (matchesWorkbook && Array.isArray(data.pairs) && data.pairs.length > 0 && data.pairs.every(isWordEntry)) {
        packCache[slug] = data.pairs;
        return packCache[slug];
      }
    }
  } catch (err) {
    console.warn(`[Firestore WordService] Falling back to local dataset for ${category}:`, err);
  }

  // 3. Fallback to local offline dataset
  const filtered = getWordPool(category);
  packCache[slug] = filtered;
  return filtered;
}
