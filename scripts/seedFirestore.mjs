import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase configuration for Suspicion
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDu6aw3hd4gixWk2raESuuShqkS4Y4kwLM",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "suspicion-a4a3a.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "suspicion-a4a3a",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "suspicion-a4a3a.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "505307234648",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:505307234648:web:5d8795392418b395e9652d",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-E5E379SPC7"
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

async function seed() {
  console.log('--- SUSPICION FIRESTORE SEEDER ---');
  console.log(`Connecting to Project: ${firebaseConfig.projectId}...`);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const jsonPath = path.resolve(__dirname, '../src/data/imposter_words.json');
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: Dataset not found at ${jsonPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, 'utf8');
  const words = JSON.parse(raw);

  console.log(`Loaded ${words.length} master word pairs from dataset.`);

  // Group by category
  const grouped = {};
  for (const item of words) {
    const cat = item.category || 'Uncategorized';
    if (!grouped[cat]) {
      grouped[cat] = [];
    }
    grouped[cat].push(item);
  }

  const categories = Object.keys(grouped);
  console.log(`Found ${categories.length} categories.`);

  // Seed each category as a single bundle document
  for (const category of categories) {
    const pairs = grouped[category];
    const slug = slugify(category);
    const docRef = doc(db, 'word_packs', slug);

    console.log(`Uploading [word_packs/${slug}] (${pairs.length} word pairs)...`);

    await setDoc(docRef, {
      categoryId: slug,
      categoryName: category,
      version: 4,
      totalPairs: pairs.length,
      pairs: pairs,
      updatedAt: new Date().toISOString()
    });
  }

  // Seed catalog metadata version
  console.log('Writing catalog metadata version...');
  const metaRef = doc(db, 'catalog_metadata', 'version');
  await setDoc(metaRef, {
    version: '4.0.0',
    dataset: 'imposter_master_dataset_v4_indirect_hints',
    totalCategories: categories.length,
    totalPairs: words.length,
    categories: categories,
    lastSyncedAt: new Date().toISOString()
  });

  console.log('==================================================');
  console.log('SUCCESS! All 840 word pairs uploaded to Firestore.');
  console.log('Documents created:');
  for (const cat of categories) {
    console.log(`  ✓ word_packs/${slugify(cat)} (${grouped[cat].length} pairs)`);
  }
  console.log('  ✓ catalog_metadata/version');
  console.log('==================================================');
  process.exit(0);
}

seed().catch((err) => {
  console.error('\nSeed Failed with Error:');
  console.error(err);
  console.log('\nNOTE: If you see "PERMISSION_DENIED", ensure your Firestore Database is created and in Test Mode in Firebase Console.');
  process.exit(1);
});
