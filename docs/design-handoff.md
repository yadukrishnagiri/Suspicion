# Suspicion — Backstage Masquerade handoff

This is the local design source for the implemented Expo app. The connected Figma file was created at [Suspicion — Backstage Masquerade](https://www.figma.com/design/L0RGujcq4FJr0R4xEoTh0L), but Figma Starter MCP quota stopped screen creation. The user approved completing the design directly in the app. The Figma file is not a finished design specification.

## Experience map

| Stage | Main job | Visual signature |
| --- | --- | --- |
| Welcome | Invite 3–15 friends into one-phone play | Paired masks inside a stage arch; one instruction and start action |
| Players | Set player/imposter counts and passing order | Numbered ivory casting sheet, in-place name suggestions |
| Rules | Choose one of three modes and eight categories | Quiet mode rows and an illustrated category index |
| Private reveal | Show one secret to one player | Entire ivory invitation opens on hold; release conceals |
| Discussion | Find the odd clue and agree on a vote | Prominent fixed starter, clear voting roster, another round |
| Elimination | Announce public role | Single role report, no word |
| Results | Unseal words and start again | Brass-arched citizen victory or red-curtain imposter victory; final roster |

The game logic remains in `src/store/gameStore.ts`; names previously entered on this device remain in `src/store/usePlayerHistoryStore.ts`. All screens use `MasqueradeFlow.tsx`, `StageUI.tsx`, and `masqueradeTheme.ts`.

## Foundations

The normative tokens are in [DESIGN.md](../DESIGN.md) and `src/components/live/masqueradeTheme.ts`. The stage field is `#201321`, invitation paper `#F5EBDC`, primary vermilion `#BD3D2F`, and detail brass `#C9A66E`. Bundled Cormorant Garamond Semibold/Medium Italic and DM Sans Regular/Medium/Bold render on both Android and web. The stage uses 24 px side spacing at normal phone widths, 16 px under 350 px, and a centered 520 px browser content limit.

Paired mask artwork: [`assets/masquerade/masks.png`](../assets/masquerade/masks.png). It was generated specifically for this app as an alpha cutout; the exact prompt is [`docs/masks-prompt.txt`](masks-prompt.txt), embedded in the PNG metadata. The matching brass proscenium and parted velvet curtains are [`assets/masquerade/stage-curtains.png`](../assets/masquerade/stage-curtains.png); its source prompt is [`docs/stage-curtains-prompt.txt`](stage-curtains-prompt.txt). Both have transparent centers/edges for composition. Artwork stays around controls and secret text. There is no external runtime image request.

## Motion and privacy

| Event | Duration | Behavior |
| --- | --- | --- |
| Stage/art entrance | 700 ms | Paired masks settle within the fixed curtain and arch frame |
| Page transition | 220 ms | Brief fade; setup remains responsive |
| Action press | 100 ms | Small contraction and return |
| Private hold threshold | 320 ms | Short taps never reveal |
| Curtain opening | 220 ms | Two panels uncover live text while the card stays held |
| Release, focus loss, background | Immediate | Secret text unmounts without exit animation |
| Public role | 280 ms | Report enters; only role is present |

Reduced-motion preference removes spatial entrances and replaces them with immediate state changes or a short fade. A screen-reader user can reveal and conceal through custom actions on the same card; there is no separate reveal control. The next-player action appears only after a reveal has been seen and hidden.

## Captures and verification

The local review captures are in `.impeccable/review/`. Key screens: [`phone-final.png`](../.impeccable/review/phone-final.png), [`android-players.png`](../.impeccable/review/android-players.png), [`android-rules.png`](../.impeccable/review/android-rules.png), [`android-reveal-held.png`](../.impeccable/review/android-reveal-held.png), [`android-reveal-released.png`](../.impeccable/review/android-reveal-released.png), [`android-final-discussion.png`](../.impeccable/review/android-final-discussion.png), [`android-final-elimination.png`](../.impeccable/review/android-final-elimination.png), [`android-citizens-win.png`](../.impeccable/review/android-citizens-win.png), and [`android-final-imposters-win.png`](../.impeccable/review/android-final-imposters-win.png). Web phone and wide-browser captures are also in that folder.

Verified on an Android Pixel 8 emulator: a short tap remains sealed; a sustained card hold reveals; release conceals; each player can pass; both win conditions, Rematch, Change game, New group, role-only elimination, leave confirmation, 3 and 15 player setup, a 40-character name with keyboard visible, and 1.3× system text. The web build was checked at 320 px width without overflow or console errors. TypeScript validation and the Android release build passed. The signed testing APK is in `outputs/android/`. No physical Android phone or tablet was connected for this pass.

## Extension guidance

Keep game rules in the existing store, select data from its current types, and carry control states through shared stage components. Treat the physical phone as the primary scene: word readability, safe areas, and privacy outrank the theatrical animation. For new art, retain the paper/lacquer/brass material vocabulary and transparent edges. Avoid generic cards, gradients, glass, emoji, and detective wording.
