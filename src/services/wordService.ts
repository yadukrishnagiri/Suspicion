import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { WordEntry, GameCategory } from '@/types/game';
import localWords from '@/data/imposter_words.json';

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

/**
 * Fetch a category pack from Cloud Firestore with offline fallback
 * Cost: Exactly 1 document read per category fetch
 */
export async function getCategoryWords(category: GameCategory): Promise<WordEntry[]> {
  if (category === 'All Categories') {
    return localWords as WordEntry[];
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
      if (Array.isArray(data.pairs) && data.pairs.length > 0) {
        packCache[slug] = data.pairs as WordEntry[];
        return packCache[slug];
      }
    }
  } catch (err) {
    console.warn(`[Firestore WordService] Falling back to local dataset for ${category}:`, err);
  }

  // 3. Fallback to local offline dataset
  const filtered = (localWords as WordEntry[]).filter((w) => w.category === category);
  packCache[slug] = filtered;
  return filtered;
}
