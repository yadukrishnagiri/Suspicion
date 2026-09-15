/* ================================================================
   Suspicion — Magazine Neobrutalist Design Tokens
   Strict adherence to DESIGN (1).md
   ================================================================ */

export const COLORS = {
  bg: '#FAFADF',        // warm cream background
  surface: '#FFFFFF',   // white card surface
  dark: '#111111',      // bold black border & shadow
  border: '#111111',
  text: '#111111',
  textMuted: '#555555',
  coral: '#E8635A',     // primary CTA & buttons
  purple: '#7B6CF6',    // secondary buttons & accents
  teal: '#4ECDC4',      // mint accent
  yellow: '#FFE566',    // badges, tags, formula
  pink: '#F9A8B8',      // soft accent & imposter warning
  lavender: '#C4B5FD',  // lavender cards & seat badges
} as const;

export const BRUTAL = {
  border: {
    borderWidth: 2,
    borderColor: '#111111',
  },
  borderThick: {
    borderWidth: 3,
    borderColor: '#111111',
  },
  shadow: {
    shadowColor: '#111111',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  shadowSm: {
    shadowColor: '#111111',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  shadowLg: {
    shadowColor: '#111111',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  r: 10,
  rLg: 14,
  pill: 999,
} as const;
