---
version: alpha
name: Suspicion — Backstage Masquerade
description: A theatrical, phone-first visual system for a shared-secret party game.
colors:
  stage-ink: "#201321"
  stage-raised: "#2D1C2F"
  stage-inset: "#170E19"
  invitation-ivory: "#F5EBDC"
  invitation-shade: "#E7DAC8"
  invitation-ink: "#302333"
  supporting-plum: "#BAAAB8"
  stage-rule: "#59435A"
  invitation-rule: "#B8A993"
  action-vermilion: "#BD3D2F"
  action-pressed: "#A33026"
  curtain-brass: "#C9A66E"
  selected-plum: "#49303E"
typography:
  display:
    fontFamily: Cormorant
    fontSize: 44px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.5px
  invitation-italic:
    fontFamily: CormorantItalic
    fontSize: 27px
    fontWeight: 500
    lineHeight: 1.26
  body:
    fontFamily: DMSans
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  action:
    fontFamily: DMSansBold
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.44
  label:
    fontFamily: DMSansBold
    fontSize: 11px
    fontWeight: 700
    lineHeight: 1.55
    letterSpacing: 1.5px
rounded:
  sheet: 12px
  action: 12px
  invitation: 16px
  counter: 24px
spacing:
  compact: 8px
  row: 12px
  section: 24px
  stage-margin: 24px
components:
  primary-action:
    backgroundColor: "{colors.action-vermilion}"
    textColor: "{colors.invitation-ivory}"
    typography: "{typography.action}"
    rounded: "{rounded.action}"
    padding: 15px
    height: 60px
  secondary-action:
    backgroundColor: "{colors.stage-raised}"
    textColor: "{colors.invitation-ivory}"
    typography: "{typography.action}"
    rounded: "{rounded.action}"
    padding: 15px
    height: 60px
  private-invitation:
    backgroundColor: "{colors.invitation-ivory}"
    textColor: "{colors.invitation-ink}"
    rounded: "{rounded.invitation}"
    padding: 24px
---

# Design System: Suspicion — Backstage Masquerade

## Overview

**Creative North Star: "The Backstage Invitation"**

The shared phone is a stage object passed between friends. The screen is dark enough for an evening game, while the light casting sheet and private invitation feel like physical paper. Paired lacquered masks carry the theatrical identity; the game information stays legible around them. The mood is warm, dramatic, and social, never ominous or procedural.

**Key Characteristics:** A single expressive serif voice; structured sans-serif controls; one substantial illustration family; selected rows and physical invitations instead of grids of generic cards; quiet setup and discussion; motion reserved for entering the stage, opening a secret, public elimination, and the verdict.

## Colors

Vermilion signals the primary action. Brass marks stage details, selection, and orientation. Warm ivory is both the readable foreground and the paper material. Ink-plum is the continuous field, with raised plum only for secondary actions and selection.

**The Rare Brass Rule.** Brass should guide attention to the active state or theatrical detail, not coat every control.

## Typography

Bundled Cormorant Garamond Semibold is the display face; its Medium Italic cut supplies short dramatic asides. Bundled DM Sans Regular, Medium, and Bold serve instructions, names, counts, and controls on Android and web. Numerals in counters and the roster use tabular figures. Large display text wraps by line rather than shrinking to fit.

**The Legible Secret Rule.** Role and word remain plain live text on the private paper surface. Never bake game data into an illustration or animate its opacity on release.

## Layout

The product is designed around a 390 px phone. Content has 24 px side margins, reducing to 16 px below 350 px. Browser content is centered within 520 px. Setup uses a casting sheet with numbered rows; categories use a two-column index that becomes one column on narrow screens or enlarged fonts. Player and imposter counters stack when space or font scaling requires it. Long rosters scroll inside the page; the keyboard may shorten the viewport without covering the active name.

## Elevation & Depth

No synthetic shadows. Plum tonal layers, thin rules, and the material contrast of ivory paper against the stage field establish depth. The mask asset contains its own lighting and material detail.

## Shapes

The illustrated brass proscenium and parted curtains frame the paired masks without covering interactive content. Sheets and actions have restrained 12 px corners; the private invitation is 16 px; counter controls are round. Lists rely on rhythm and rules. Avoid nested cards.

## Components

### Stage action

The primary action is a full-width vermilion block with a short verb and arrow, at least 60 px high. Secondary actions use raised plum. Press feedback contracts by 2% over 100 ms; reduced motion removes the contraction. Focus gets a brass outline on web.

### Casting sheet and name field

The ivory sheet holds a numbered name list. Each 64 px row has a restrained rule; focus changes the rule to vermilion. Suggestions are shown only while a person types and match names previously entered on this device.

### Mode row and category index

Mode rows carry an icon, title, one-line explanation, and radio state. Categories carry an icon and short name. Selection uses raised plum plus brass icon/check, never color alone.

### Private invitation

The entire paper invitation is the touch-and-hold target. A 320 ms hold reveals live role text as two curtains open over 220 ms. Releasing, losing focus, or backgrounding unmounts the secret immediately. The next-player action appears only after a viewed card has been released. Screen reader actions on this same card provide reveal and conceal for users unable to sustain a press.

### Public role report and verdict

The elimination report names only the player's role; words stay sealed. The final screen unseals words, gives citizens a brass arch and imposters a displaced red-curtain composition, then lists every player's role and status. Rematch, Change game, and New group retain their defined setup behavior.

## Do's and Don'ts

### Do:

- **Do** keep secret text on the ivory invitation with immediate conditional removal on concealment.
- **Do** keep action labels short and describe exactly what will happen.
- **Do** let quiet rows and typography carry setup and discussion.
- **Do** use native safe areas and honor reduced motion.

### Don't:

- **Don't** replace artwork with gradients, glass, decorative emoji, or generic card grids.
- **Don't** display a permanent history list or reveal a word in an elimination report.
- **Don't** delay concealment for the sake of an animation.
