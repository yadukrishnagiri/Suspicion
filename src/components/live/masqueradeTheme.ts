export const STAGE = {
  bg: '#201321', raised: '#2D1C2F', inset: '#170E19',
  paper: '#F5EBDC', paperShade: '#E7DAC8', ink: '#302333',
  text: '#F5EBDC', muted: '#BAAAB8', rule: '#59435A',
  paperRule: '#B8A993', accent: '#BD3D2F', accentPressed: '#A33026',
  brass: '#C9A66E', selected: '#49303E',
} as const;

export const TYPE = {
  display: 'Cormorant', italic: 'CormorantItalic',
  body: 'DMSans', medium: 'DMSansMedium', bold: 'DMSansBold',
} as const;

export const MOTION = { press: 100, page: 220, revealHold: 320, curtain: 220, scene: 700 };
