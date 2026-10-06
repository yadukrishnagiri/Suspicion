import React, { useEffect, useState } from 'react';
import {
  AppState, BackHandler, Image, KeyboardAvoidingView, Modal, Platform,
  Pressable, ScrollView, Text, TextInput, View, useWindowDimensions,
} from 'react-native';
import Animated, { Easing, FadeIn, FadeInDown, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useGameStore, CATEGORIES, getMaxImposters } from '@/store/gameStore';
import { usePlayerHistoryStore } from '@/store/usePlayerHistoryStore';
import { GameMode, Player } from '@/types/game';

export const LEDGER = {
  bg: '#12191B', bgRaised: '#1B2425', paper: '#E8DEC9', paperShade: '#D7C9AF',
  ink: '#202725', text: '#F3EEE3', muted: '#AEB8B0', rule: '#43504D',
  paperRule: '#AA9F8B', red: '#C65A43', redDeep: '#A74735',
} as const;

const ART = require('../../../assets/ledger/dossier.png');
const EASE = Easing.bezier(0.23, 1, 0.32, 1);
type SetupStep = 'welcome' | 'players' | 'rules';

const MODES: { id: GameMode; title: string; description: string; number: string }[] = [
  { id: 'everyone_gets_word', title: 'Word against word', description: 'Imposters receive a related word.', number: '01' },
  { id: 'imposter_gets_clue', title: 'Word against hint', description: 'Imposters receive an indirect clue.', number: '02' },
  { id: 'blind_imposter', title: 'Blind imposter', description: 'Imposters have nothing to go on.', number: '03' },
];

function haptic(kind: 'tick' | 'reveal' | 'result' = 'tick') {
  if (Platform.OS === 'web') return;
  if (kind === 'tick') void Haptics.selectionAsync();
  else if (kind === 'reveal') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  else void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

function Label({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <Text style={{ color: dark ? LEDGER.ink : LEDGER.muted, fontSize: 11, fontWeight: '800', letterSpacing: 2.1, textTransform: 'uppercase' }}>{children}</Text>;
}

function Title({ children, size = 44, dark = false }: { children: React.ReactNode; size?: number; dark?: boolean }) {
  return <Text style={{ color: dark ? LEDGER.ink : LEDGER.text, fontFamily: 'Georgia', fontSize: size, fontWeight: '700', letterSpacing: -1.4, lineHeight: size * 1.08 }}>{children}</Text>;
}

function Body({ children, dark = false, muted = false, size = 15, style }: { children: React.ReactNode; dark?: boolean; muted?: boolean; size?: number; style?: object }) {
  return <Text style={{ color: dark ? LEDGER.ink : muted ? LEDGER.muted : LEDGER.text, fontSize: size, lineHeight: size * 1.48, ...style }}>{children}</Text>;
}

function Rule({ paper = false }: { paper?: boolean }) {
  return <View style={{ height: 1, backgroundColor: paper ? LEDGER.paperRule : LEDGER.rule }} />;
}

function Action({ title, onPress, secondary = false, disabled = false }: { title: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled }} disabled={disabled} onPress={() => { haptic(); onPress(); }}
    android_ripple={{ color: secondary ? '#34403E' : '#A74735' }}
    style={{ minHeight: 58, backgroundColor: secondary ? LEDGER.bgRaised : LEDGER.red, borderWidth: 1, borderColor: secondary ? LEDGER.rule : LEDGER.red, opacity: disabled ? 0.38 : 1, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
    <Text numberOfLines={2} style={{ flex: 1, flexShrink: 1, color: LEDGER.text, fontSize: 14, fontWeight: '900', letterSpacing: 1.4, textTransform: 'uppercase' }}>{title}</Text>
    <Text accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ color: LEDGER.text, fontSize: 22, fontWeight: '400' }}>→</Text>
  </Pressable>;
}

function Back({ title, onPress }: { title: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Back to ${title}`} onPress={() => { haptic(); onPress(); }} style={{ minHeight: 48, alignSelf: 'flex-start', justifyContent: 'center' }}>
    <Text style={{ color: LEDGER.muted, fontSize: 13, fontWeight: '700' }}>← {title}</Text>
  </Pressable>;
}

function PageHead({ folio, eyebrow }: { folio: string; eyebrow: string }) {
  return <View style={{ gap: 12, marginBottom: 24 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Label>{eyebrow}</Label><Label>{folio}</Label></View>
    <Rule />
  </View>;
}

function Counter({ title, value, min, max, change }: { title: string; value: number; min: number; max: number; change: (count: number) => void }) {
  return <View style={{ flex: 1, minWidth: 0, gap: 9 }}>
    <Label>{title}</Label>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 56 }}>
      <Pressable accessibilityRole="button" accessibilityLabel={`Fewer ${title.toLowerCase()}`} accessibilityState={{ disabled: value <= min }} disabled={value <= min} onPress={() => { haptic(); change(value - 1); }} android_ripple={{ color: LEDGER.rule }} style={{ width: 48, height: 48, borderWidth: 1, borderColor: LEDGER.rule, alignItems: 'center', justifyContent: 'center', opacity: value <= min ? 0.3 : 1 }}><Text style={{ color: LEDGER.text, fontSize: 23 }}>−</Text></Pressable>
      <Text style={{ color: LEDGER.text, fontSize: 30, fontWeight: '800', fontVariant: ['tabular-nums'] }}>{value}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`More ${title.toLowerCase()}`} accessibilityState={{ disabled: value >= max }} disabled={value >= max} onPress={() => { haptic(); change(value + 1); }} android_ripple={{ color: LEDGER.rule }} style={{ width: 48, height: 48, borderWidth: 1, borderColor: LEDGER.rule, alignItems: 'center', justifyContent: 'center', opacity: value >= max ? 0.3 : 1 }}><Text style={{ color: LEDGER.text, fontSize: 23 }}>+</Text></Pressable>
    </View>
  </View>;
}

function NameLine({ index, name, names, change }: { index: number; name: string; names: string[]; change: (index: number, name: string) => void }) {
  const history = usePlayerHistoryStore((state) => state.recentNames);
  const [focused, setFocused] = useState(false);
  const query = name.trim().toLowerCase();
  const suggestions = focused && query && !/^player \d+$/i.test(query) ? history.filter((entry) => entry.toLowerCase().includes(query) && entry.toLowerCase() !== query && !names.some((used, at) => at !== index && used.toLowerCase() === entry.toLowerCase())).slice(0, 3) : [];
  return <View>
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 58, gap: 14 }}>
      <Text style={{ color: LEDGER.redDeep, fontSize: 12, fontWeight: '900', fontVariant: ['tabular-nums'], width: 26 }}>{String(index + 1).padStart(2, '0')}</Text>
      <TextInput accessibilityLabel={`Player ${index + 1} name`} value={name} onChangeText={(value) => change(index, value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 160)} selectTextOnFocus={/^player \d+$/i.test(name)} autoCapitalize="words" maxLength={40} placeholder={`Player ${index + 1}`} placeholderTextColor="#776F62" style={{ flex: 1, color: LEDGER.ink, fontSize: 17, fontWeight: '700', minHeight: 52, outlineStyle: 'none' } as any} />
    </View>
    {suggestions.map((suggestion) => <Pressable key={suggestion} accessibilityRole="button" accessibilityLabel={`Use ${suggestion}`} onPress={() => { change(index, suggestion); setFocused(false); }} style={{ minHeight: 48, justifyContent: 'center', paddingLeft: 40, backgroundColor: LEDGER.paperShade }}><Text style={{ color: LEDGER.ink, fontSize: 14, fontWeight: '700' }}>Use {suggestion}</Text></Pressable>)}
    <Rule paper />
  </View>;
}

function Welcome({ next }: { next: () => void }) {
  return <View style={{ flex: 1, justifyContent: 'space-between', minHeight: 570 }}>
    <View>
      <PageHead eyebrow="SUSPICION / ONE DEVICE" folio="01" />
      <View style={{ marginTop: 12 }}><Title size={49}>Suspicion is{`\n`}in the room.</Title></View>
      <View style={{ alignItems: 'center', marginVertical: 0 }}><Image source={ART} resizeMode="contain" style={{ width: 300, height: 258 }} accessibilityLabel="A sealed detective dossier with a magnifying glass" /></View>
      <Body muted size={16}>Pass the phone. Keep your role secret.</Body>
      <View style={{ marginTop: 22, paddingTop: 12, borderTopWidth: 1, borderTopColor: LEDGER.rule }}><Label>03–15 PLAYERS</Label></View>
    </View>
    <View style={{ paddingTop: 24 }}><Action title="Open the case" onPress={next} /></View>
  </View>;
}

function Players({ back, next }: { back: () => void; next: () => void }) {
  const game = useGameStore();
  return <View>
    <Back title="welcome" onPress={back} />
    <PageHead eyebrow="FILE 01 / THE CAST" folio="SETUP" />
    <Title>Assemble{`\n`}the cast.</Title>
    <Body muted style={{ marginTop: 12, marginBottom: 28 }}>Set the group size, then enter names in the order the phone will be passed.</Body>
    <View style={{ flexDirection: 'row', gap: 18, paddingVertical: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: LEDGER.rule }}>
      <Counter title="Players" value={game.playerCount} min={3} max={15} change={game.setPlayerCount} />
      <View style={{ width: 1, backgroundColor: LEDGER.rule }} />
      <Counter title="Imposters" value={game.imposterCount} min={1} max={getMaxImposters(game.playerCount)} change={game.setImposterCount} />
    </View>
    <View style={{ marginTop: 28, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' }}><Label>THE ROSTER</Label><Label>PASSING ORDER</Label></View>
    <View style={{ backgroundColor: LEDGER.paper, paddingHorizontal: 18, paddingTop: 8, paddingBottom: 18, borderLeftWidth: 4, borderLeftColor: LEDGER.red }}>
      {game.participantNames.slice(0, game.playerCount).map((name, index) => <NameLine key={index} index={index} name={name} names={game.participantNames} change={game.setParticipantName} />)}
      <Text style={{ color: '#665F53', fontSize: 12, marginTop: 16 }}>Returning names appear only while typing.</Text>
    </View>
    <View style={{ marginTop: 24 }}><Action title="Choose the game" onPress={next} /></View>
  </View>;
}

function Rules({ back, deal, compact }: { back: () => void; deal: () => void; compact: boolean }) {
  const game = useGameStore();
  return <View>
    <Back title="players" onPress={back} />
    <PageHead eyebrow="FILE 02 / TERMS OF PLAY" folio="SETUP" />
    <Title>Set the rules.</Title>
    <Body muted style={{ marginTop: 12, marginBottom: 30 }}>Choose what the imposters know, then choose the subject of the case.</Body>
    <Label>01 / GAME MODE</Label>
    <View style={{ marginTop: 10, marginBottom: 30, borderTopWidth: 1, borderTopColor: LEDGER.rule }}>
      {MODES.map((mode) => {
        const selected = mode.id === game.selectedMode;
        return <Pressable key={mode.id} accessibilityRole="radio" accessibilityState={{ selected }} onPress={() => { haptic(); game.setSelectedMode(mode.id); }} android_ripple={{ color: LEDGER.bgRaised }} style={{ flexDirection: 'row', gap: 15, minHeight: 78, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: LEDGER.rule, alignItems: 'center' }}>
          <Text style={{ color: selected ? LEDGER.red : LEDGER.muted, fontSize: 14, fontWeight: '800', width: 28 }}>{mode.number}</Text>
          <View style={{ flex: 1 }}><Text style={{ color: LEDGER.text, fontFamily: 'Georgia', fontSize: 20, fontWeight: '700' }}>{mode.title}</Text><Body muted size={12}>{mode.description}</Body></View>
          <View style={{ width: 20, height: 20, borderWidth: 1, borderColor: selected ? LEDGER.red : LEDGER.rule, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>{selected && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: LEDGER.red }} />}</View>
        </Pressable>;
      })}
    </View>
    <Label>02 / CATEGORY</Label>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginBottom: 28, borderTopWidth: 1, borderTopColor: LEDGER.rule }}>
      {CATEGORIES.map((category, index) => {
        const selected = category === game.selectedCategory;
        return <Pressable key={category} accessibilityRole="radio" accessibilityState={{ selected }} onPress={() => { haptic(); game.setSelectedCategory(category); }} android_ripple={{ color: LEDGER.bgRaised }} style={{ width: compact ? '100%' : '50%', minHeight: 70, borderBottomWidth: 1, borderBottomColor: LEDGER.rule, borderRightWidth: compact || index % 2 === 1 ? 0 : 1, borderRightColor: LEDGER.rule, paddingHorizontal: compact || index % 2 === 1 ? 12 : 0, paddingVertical: 12, justifyContent: 'center', backgroundColor: selected ? LEDGER.bgRaised : 'transparent' }}>
          <Text style={{ color: selected ? LEDGER.red : LEDGER.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>{String(index + 1).padStart(2, '0')} {selected ? ' / SELECTED' : ''}</Text>
          <Text style={{ color: LEDGER.text, fontSize: 14, fontWeight: selected ? '800' : '600', marginTop: 4, lineHeight: 19 }}>{category}</Text>
        </Pressable>;
      })}
    </View>
    <View style={{ backgroundColor: LEDGER.paper, paddingHorizontal: 18, paddingVertical: 16, borderLeftWidth: 4, borderLeftColor: LEDGER.red, marginBottom: 22 }}><Label dark>CASE BRIEF</Label><Body dark size={14} style={{ marginTop: 7 }}>{game.playerCount} players · {game.imposterCount} {game.imposterCount === 1 ? 'imposter' : 'imposters'} · {game.selectedCategory}</Body></View>
    <Action title="Deal the roles" onPress={deal} />
  </View>;
}

function Reveal({ leave }: { leave: () => void }) {
  const game = useGameStore();
  const reduceMotion = useReducedMotion();
  const holdProgress = useSharedValue(0);
  const sealMotion = useAnimatedStyle(() => ({ opacity: 0.3 + holdProgress.value * 0.7, transform: [{ scale: 0.94 + holdProgress.value * 0.06 }] }));
  const player = game.players[game.currentRevealIndex];
  const [peek, setPeek] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => { setPeek(false); setSeen(false); }, [game.currentRevealIndex]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => { if (state !== 'active') setPeek(false); });
    if (Platform.OS !== 'web') return () => subscription.remove();
    const hide = () => setPeek(false);
    window.addEventListener('blur', hide);
    return () => { subscription.remove(); window.removeEventListener('blur', hide); };
  }, []);
  if (!player) return null;
  const last = game.currentRevealIndex === game.players.length - 1;
  const reveal = () => { setPeek(true); setSeen(true); haptic('reveal'); };
  const beginHold = () => { holdProgress.value = reduceMotion ? 1 : withTiming(1, { duration: 320, easing: EASE }); };
  const endHold = () => { holdProgress.value = reduceMotion ? 0 : withTiming(0, { duration: 100 }); setPeek(false); };
  const webKeys = Platform.OS === 'web' ? {
    onKeyDown: (event: any) => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); if (!event.repeat) { beginHold(); reveal(); } } },
    onKeyUp: (event: any) => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); endHold(); } },
    onBlur: endHold,
  } : {};
  return <View style={{ flex: 1, minHeight: 640, justifyContent: 'space-between' }}>
    <View>
      <PageHead eyebrow="CONFIDENTIAL / ONE VIEWER" folio={`${String(game.currentRevealIndex + 1).padStart(2, '0')} / ${String(game.players.length).padStart(2, '0')}`} />
      <Label>PASS THE PHONE TO</Label>
      <View style={{ marginTop: 8 }}><Title size={46}>{player.name}</Title></View>
      <Body muted style={{ marginTop: 11, marginBottom: 25 }}>Only {player.name} should see the screen. The secret disappears the moment they let go.</Body>
      <View style={{ height: 3, backgroundColor: LEDGER.rule, marginBottom: 26 }}><View style={{ height: 3, width: `${((game.currentRevealIndex + 1) / game.players.length) * 100}%`, backgroundColor: LEDGER.red }} /></View>
      <Pressable {...webKeys as any} accessibilityRole="button" accessibilityLabel={`Sealed card for ${player.name}`} accessibilityHint="Touch and hold this card to reveal the role and word. Release to hide them." delayLongPress={320} onPressIn={beginHold} onLongPress={reveal} onPressOut={endHold} android_ripple={{ color: LEDGER.paperShade }} style={{ backgroundColor: LEDGER.paper, minHeight: 272, padding: 22, borderLeftWidth: 5, borderLeftColor: LEDGER.red, justifyContent: 'space-between' }}>
        {!peek ? <>
          <View><Label dark>SEALED EVIDENCE / {String(game.currentRevealIndex + 1).padStart(2, '0')}</Label><View style={{ marginTop: 17 }}><Rule paper /></View></View>
          <View style={{ alignItems: 'center', gap: 14 }}><Animated.View style={[{ width: 82, height: 82, borderRadius: 41, backgroundColor: LEDGER.redDeep, borderWidth: 4, borderColor: LEDGER.red, alignItems: 'center', justifyContent: 'center' }, sealMotion]}><Text style={{ color: LEDGER.paper, fontFamily: 'Georgia', fontSize: 39, fontWeight: '700' }}>S</Text></Animated.View><Text style={{ color: '#625D52', fontSize: 12, letterSpacing: 1.2, textAlign: 'center', fontWeight: '800' }}>TOUCH & HOLD CARD TO REVEAL</Text></View>
          <View style={{ height: 1, backgroundColor: LEDGER.paperRule }} />
        </> : <Animated.View entering={reduceMotion ? undefined : FadeIn.duration(110)} style={{ flex: 1, justifyContent: 'space-between' }}>
          <View><Label dark>FOR {player.name.toUpperCase()} ONLY</Label><View style={{ marginTop: 14 }}><Title dark size={35}>{player.role === 'imposter' ? 'Imposter' : 'Citizen'}</Title></View></View>
          <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: LEDGER.paperRule, paddingVertical: 15 }}><Label dark>{player.role === 'imposter' && game.selectedMode === 'blind_imposter' ? 'YOUR ASSIGNMENT' : player.role === 'imposter' && game.selectedMode === 'imposter_gets_clue' ? 'YOUR HINT' : 'YOUR WORD'}</Label><Text selectable style={{ color: LEDGER.ink, fontFamily: 'Georgia', fontWeight: '700', fontSize: 31, marginTop: 8 }}>{player.assignedWordOrHint || 'No word. Blend in.'}</Text></View>
          <Text style={{ color: '#625D52', fontSize: 12, fontWeight: '700' }}>Memorize it. Release to conceal.</Text>
        </Animated.View>}
      </Pressable>
    </View>
    <View style={{ gap: 10, paddingTop: 26 }}>
      {seen && !peek && <Action title={last ? 'Begin discussion' : 'Pass to next player'} onPress={game.nextReveal} />}
      {!seen && <Body muted size={12} style={{ textAlign: 'center' }}>Touch and hold the card above. Release to conceal it.</Body>}
      <Pressable accessibilityRole="button" onPress={leave} style={{ minHeight: 48, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: LEDGER.muted, fontSize: 12, fontWeight: '700' }}>Leave this match</Text></Pressable>
    </View>
  </View>;
}

function SuspectLine({ player, index, starter, selected, choose }: { player: Player; index: number; starter: boolean; selected: boolean; choose: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`${player.name}${player.isEliminated ? ', eliminated' : ', select for elimination'}`} accessibilityState={{ disabled: player.isEliminated, selected }} disabled={player.isEliminated} onPress={() => { haptic(); choose(); }} android_ripple={{ color: LEDGER.bgRaised }} style={{ minHeight: 64, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: LEDGER.rule, paddingHorizontal: 8, backgroundColor: selected ? LEDGER.redDeep : 'transparent', opacity: player.isEliminated ? 0.42 : 1 }}>
    <Text style={{ color: selected ? LEDGER.text : LEDGER.red, fontSize: 12, fontWeight: '900', width: 31 }}>{String(index + 1).padStart(2, '0')}</Text>
    <Text numberOfLines={2} style={{ color: LEDGER.text, flex: 1, fontSize: 17, fontWeight: '700', lineHeight: 22, paddingRight: 8 }}>{player.name}</Text>
    <Text style={{ color: selected ? LEDGER.text : LEDGER.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>{player.isEliminated ? 'OUT' : starter ? 'STARTER' : selected ? 'CHOSEN' : 'ACTIVE'}</Text>
  </Pressable>;
}

function Discussion({ leave }: { leave: () => void }) {
  const game = useGameStore();
  const reducedMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = game.players.find((player) => player.id === selectedId && !player.isEliminated);
  useEffect(() => { setSelectedId(null); }, [game.lastEliminatedPlayer]);
  return <View>
    <PageHead eyebrow="OPEN CASE / DISCUSSION" folio={`ROUND ${String(game.roundNumber).padStart(2, '0')}`} />
    <Title>Read the room.</Title>
    <Body muted style={{ marginTop: 12, marginBottom: 27 }}>Give one clue each, in person. Listen for the story that does not fit.</Body>
    <View style={{ paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: LEDGER.red, marginBottom: 26 }}>
      <Label>THE FIRST VOICE / EVERY ROUND</Label>
      <View style={{ marginTop: 5 }}><Title size={32}>{game.players.find((player) => player.id === game.discussionStarterId)?.name ?? 'First player'}</Title></View>
      <Body muted size={12} style={{ marginTop: 5 }}>{game.players.find((player) => player.id === game.discussionStarterId)?.isEliminated ? 'This player is out. Continue with the next active player in order.' : 'Start here, then continue in entered name order.'}</Body>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}><Label>THE REMAINING CAST</Label><Label>{game.players.filter((player) => !player.isEliminated).length} ACTIVE</Label></View>
    <View style={{ borderTopWidth: 1, borderTopColor: LEDGER.rule }}>{game.players.map((player, index) => <SuspectLine key={player.id} player={player} index={index} starter={player.id === game.discussionStarterId} selected={player.id === selectedId} choose={() => setSelectedId(selectedId === player.id ? null : player.id)} />)}</View>
    {selected ? <View style={{ marginTop: 24, paddingVertical: 18, borderTopWidth: 2, borderTopColor: LEDGER.red, gap: 11 }}><Label>THE ROOM HAS CHOSEN</Label><Title size={29}>{selected.name}</Title><Body muted size={13}>Confirm only after the group has voted in person.</Body><Action title="Confirm elimination" onPress={() => game.eliminatePlayer(selected.id)} /><Pressable accessibilityRole="button" onPress={() => setSelectedId(null)} style={{ minHeight: 48, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: LEDGER.muted, fontSize: 13 }}>Choose someone else</Text></Pressable></View> : <View style={{ marginTop: 22, gap: 9 }}><Action title="Another clue round" secondary onPress={game.skipRound} /><Body muted size={12} style={{ textAlign: 'center' }}>Vote together. Select a name only when the room agrees.</Body></View>}
    <Pressable accessibilityRole="button" onPress={leave} style={{ marginTop: 16, minHeight: 48, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: LEDGER.muted, fontSize: 12, fontWeight: '700' }}>Leave this match</Text></Pressable>
    <Modal visible={!!game.lastEliminatedPlayer} animationType={reducedMotion ? 'none' : 'fade'} onRequestClose={game.clearLastEliminated}>
      <View style={{ flex: 1, backgroundColor: LEDGER.bg, paddingHorizontal: 24, paddingTop: 70, paddingBottom: 40, justifyContent: 'space-between' }}>
        <View><PageHead eyebrow="ELIMINATION REPORT" folio="ROLE ONLY" /><Title size={44}>{game.lastEliminatedPlayer?.role === 'imposter' ? 'Imposter found.' : 'A citizen is out.'}</Title><Body style={{ marginTop: 15 }} size={18}>{game.lastEliminatedPlayer?.name} was {game.lastEliminatedPlayer?.role === 'imposter' ? 'an imposter' : 'a citizen'}.</Body><View style={{ marginTop: 30, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: LEDGER.rule }}><Body muted size={13}>The role is public now. The secret word stays sealed until the case closes.</Body></View></View>
        <Action title={game.winner ? 'Read the verdict' : 'Continue the case'} onPress={game.clearLastEliminated} />
      </View>
    </Modal>
  </View>;
}

function Ended({ rematch, changeGame, newGroup }: { rematch: () => void; changeGame: () => void; newGroup: () => void }) {
  const game = useGameStore();
  const citizensWin = game.winner === 'citizens';
  return <View>
    <PageHead eyebrow="CASE CLOSED / FINAL REPORT" folio={`${game.roundNumber} ${game.roundNumber === 1 ? 'ROUND' : 'ROUNDS'}`} />
    <Label>THE VERDICT</Label>
    <View style={{ marginTop: 11 }}><Title size={50}>{citizensWin ? 'Citizens win.' : 'Imposters win.'}</Title></View>
    <Body muted style={{ marginTop: 13 }}>{citizensWin ? 'Every imposter has been uncovered.' : 'The imposters now equal or outnumber the citizens.'}</Body>
    <View style={{ alignItems: 'center', marginVertical: 8 }}><Image source={ART} resizeMode="contain" style={{ width: 216, height: 185 }} accessibilityLabel="The closed case dossier" /></View>
    <View style={{ backgroundColor: LEDGER.paper, padding: 20, borderTopWidth: 5, borderTopColor: LEDGER.red, marginBottom: 28 }}>
      <Label dark>THE WORDS / UNSEALED</Label>
      <View style={{ marginTop: 15 }}><Rule paper /></View>
      <View style={{ paddingVertical: 14 }}><Text style={{ color: LEDGER.redDeep, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 }}>CITIZENS</Text><Title dark size={27}>{game.activeWordEntry?.mainWord}</Title></View>
      <Rule paper />
      <View style={{ paddingTop: 14 }}><Text style={{ color: LEDGER.redDeep, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 }}>IMPOSTERS</Text><Title dark size={24}>{game.selectedMode === 'everyone_gets_word' ? game.activeWordEntry?.imposterWord : game.selectedMode === 'imposter_gets_clue' ? game.activeWordEntry?.imposterHint : 'No clue'}</Title></View>
    </View>
    <Label>FINAL ROSTER</Label>
    <View style={{ marginTop: 9, marginBottom: 25, borderTopWidth: 1, borderTopColor: LEDGER.rule }}>{game.players.map((player, index) => <View key={player.id} style={{ flexDirection: 'row', minHeight: 56, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: LEDGER.rule, gap: 10 }}><Text style={{ color: LEDGER.red, fontSize: 11, fontWeight: '900', width: 28 }}>{String(index + 1).padStart(2, '0')}</Text><Text numberOfLines={2} style={{ color: LEDGER.text, fontSize: 15, fontWeight: '700', flex: 1, paddingVertical: 8 }}>{player.name}</Text><Text style={{ color: LEDGER.muted, fontSize: 10, fontWeight: '800', textAlign: 'right' }}>{player.role.toUpperCase()}{`\n`}{player.isEliminated ? 'OUT' : 'IN'}</Text></View>)}</View>
    <View style={{ gap: 9 }}><Action title="Rematch · same setup" onPress={rematch} /><Action title="Change game · same group" secondary onPress={changeGame} /><Action title="New group" secondary onPress={newGroup} /></View>
  </View>;
}

export function LedgerFlow() {
  const game = useGameStore();
  const [step, setStep] = useState<SetupStep>('welcome');
  const [confirmLeave, setConfirmLeave] = useState(false);
  const { width } = useWindowDimensions();
  const reducedMotion = useReducedMotion();
  const screen = game.phase === 'setup' ? step : game.phase;
  const leave = () => setConfirmLeave(true);
  const finishLeave = () => { setConfirmLeave(false); game.backToSetup(); setStep('rules'); };
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (game.phase === 'setup' && step === 'rules') { setStep('players'); return true; }
      if (game.phase === 'setup' && step === 'players') { setStep('welcome'); return true; }
      if (game.phase === 'reveal' || game.phase === 'discussion') { leave(); return true; }
      return false;
    });
    return () => listener.remove();
  }, [game.phase, step]);
  const motion = reducedMotion ? FadeIn.duration(120) : FadeInDown.duration(260).easing(EASE);
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: LEDGER.bg }}>
    <StatusBar style="light" />
    <ScrollView key={`${screen}-${game.phase === 'reveal' ? game.currentRevealIndex : ''}`} keyboardShouldPersistTaps="handled" contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingHorizontal: width >= 600 ? 28 : 19, paddingTop: 16, paddingBottom: 42 }}>
      <Animated.View entering={motion} style={{ width: '100%', maxWidth: 540, flexGrow: 1 }}>
        {screen === 'welcome' && <Welcome next={() => setStep('players')} />}
        {screen === 'players' && <Players back={() => setStep('welcome')} next={() => setStep('rules')} />}
        {screen === 'rules' && <Rules back={() => setStep('players')} deal={game.startNewGame} compact={width < 420} />}
        {screen === 'reveal' && <Reveal leave={leave} />}
        {screen === 'discussion' && <Discussion leave={leave} />}
        {screen === 'game_over' && <Ended rematch={game.resetGameKeepSetup} changeGame={() => { game.backToSetup(); setStep('rules'); }} newGroup={() => { game.resetForNewGroup(); setStep('players'); }} />}
      </Animated.View>
    </ScrollView>
    <Modal visible={confirmLeave} animationType={reducedMotion ? 'none' : 'fade'} onRequestClose={() => setConfirmLeave(false)}>
      <View style={{ flex: 1, backgroundColor: LEDGER.bg, paddingHorizontal: 24, paddingTop: 70, paddingBottom: 40, justifyContent: 'space-between' }}>
        <View><PageHead eyebrow="CASE INTERRUPTED" folio="CONFIRM" /><Title size={44}>Leave this match?</Title><Body muted style={{ marginTop: 16 }}>Private roles and progress will be lost. The group and game settings will stay ready.</Body><View style={{ marginTop: 28 }}><Rule /></View></View>
        <View style={{ gap: 10 }}><Action title="Keep playing" onPress={() => setConfirmLeave(false)} /><Action title="Leave match" secondary onPress={finishLeave} /></View>
      </View>
    </Modal>
  </KeyboardAvoidingView>;
}
