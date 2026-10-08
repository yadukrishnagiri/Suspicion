import React, { useEffect, useRef, useState } from 'react';
import { AppState, BackHandler, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useGameStore, CATEGORIES, getMaxImposters } from '@/store/gameStore';
import { usePlayerHistoryStore } from '@/store/usePlayerHistoryStore';
import { GameMode, Player } from '@/types/game';
import { Action, Body, EASE, Heading, Icon, Label, Navigation, Pressable, Rule, StageArt, TextAction, haptic } from './StageUI';
import { MOTION, STAGE, TYPE } from './masqueradeTheme';

type SetupStep = 'welcome' | 'players' | 'rules';
const MODES: { id: GameMode; title: string; description: string; icon: React.ComponentProps<typeof Icon>['name'] }[] = [
  { id: 'everyone_gets_word', title: 'Word against word', description: 'Two related words. One convincing act.', icon: 'copy-outline' },
  { id: 'imposter_gets_clue', title: 'Word against hint', description: 'Citizens get a word. Imposters get a hint.', icon: 'chatbubble-ellipses-outline' },
  { id: 'blind_imposter', title: 'Blind imposter', description: 'No word. No hint. Just your poker face.', icon: 'eye-off-outline' },
];
const CATEGORY_ICONS: React.ComponentProps<typeof Icon>['name'][] = ['partly-sunny-outline', 'restaurant-outline', 'leaf-outline', 'key-outline', 'airplane-outline', 'football-outline', 'briefcase-outline', 'film-outline'];

function Welcome({ next }: { next: () => void }) {
  const { width, height } = useWindowDimensions();
  return <View style={{ flexGrow: 1, justifyContent: 'space-between', minHeight: Math.min(690, Math.max(570, height - 110)) }}>
    <View style={{ alignItems: 'center', paddingTop: 16 }}>
      <Heading size={width < 350 ? 65 : 76} style={{ textAlign: 'center' }}>Suspicion</Heading>
      <Text style={{ fontFamily: TYPE.italic, color: STAGE.brass, fontSize: 27, lineHeight: 34 }}>Everyone has a part to play.</Text>
      <StageArt />
      <Body size={16} style={{ textAlign: 'center', paddingHorizontal: 20 }}>Pass the phone. Keep your secret.</Body>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 }}><Icon name="people-outline" color={STAGE.brass} size={17} /><Label>3–15 friends · one phone</Label></View>
    </View>
    <View style={{ paddingTop: 28, gap: 8 }}><Action title="Let the show begin" onPress={next} /><Body size={12} style={{ textAlign: 'center' }}>A game of words, bluffs & familiar faces.</Body></View>
  </View>;
}

function Counter({ title, value, min, max, change }: { title: string; value: number; min: number; max: number; change: (count: number) => void }) {
  return <View style={{ flex: 1, minWidth: 0, gap: 10 }}>
    <Label color={STAGE.brass}>{title}</Label>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      {[-1, 0, 1].map((direction) => direction === 0 ? <Text key="value" style={{ color: STAGE.text, fontSize: 34, fontFamily: TYPE.display, fontVariant: ['tabular-nums'] }}>{value}</Text>
        : <Pressable key={direction} accessibilityRole="button" accessibilityLabel={`${direction < 0 ? 'Fewer' : 'More'} ${title.toLowerCase()}`} accessibilityState={{ disabled: direction < 0 ? value <= min : value >= max }} disabled={direction < 0 ? value <= min : value >= max} onPress={() => { haptic(); change(value + direction); }}
          style={({ pressed }) => ({ minWidth: 48, minHeight: 48, borderRadius: 24, borderWidth: 1, borderColor: STAGE.rule, backgroundColor: pressed ? STAGE.selected : 'transparent', opacity: (direction < 0 ? value <= min : value >= max) ? 0.3 : 1, alignItems: 'center', justifyContent: 'center' })}><Icon name={direction < 0 ? 'remove' : 'add'} size={21} /></Pressable>)}
    </View>
  </View>;
}

function NameLine({ index, name, names, change, inputRefs }: { index: number; name: string; names: string[]; change: (index: number, name: string) => void; inputRefs: React.MutableRefObject<(TextInput | null)[]> }) {
  const history = usePlayerHistoryStore((state) => state.recentNames);
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (blurTimer.current) clearTimeout(blurTimer.current); }, []);
  const query = name.trim().toLowerCase();
  const suggestions = focused && query && !/^player \d+$/i.test(query) ? history.filter((entry) => entry.toLowerCase().includes(query) && entry.toLowerCase() !== query && !names.some((used, at) => at !== index && used.toLowerCase() === entry.toLowerCase())).slice(0, 3) : [];
  return <View>
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 64, gap: 16, borderBottomWidth: focused ? 2 : 1, borderBottomColor: focused ? STAGE.accent : STAGE.paperRule }}>
      <Text style={{ color: '#796052', fontSize: 12, fontFamily: TYPE.bold, fontVariant: ['tabular-nums'], width: 22 }}>{String(index + 1).padStart(2, '0')}</Text>
      <TextInput ref={(input) => { inputRefs.current[index] = input; }} accessibilityLabel={`Player ${index + 1} name`} value={name} onChangeText={(value) => change(index, value)}
        onFocus={() => { if (blurTimer.current) clearTimeout(blurTimer.current); setFocused(true); }} onBlur={() => { blurTimer.current = setTimeout(() => setFocused(false), 160); }}
        selectTextOnFocus={/^player \d+$/i.test(name)} autoCapitalize="words" maxLength={40} returnKeyType={index === names.length - 1 ? 'done' : 'next'} submitBehavior={index === names.length - 1 ? 'blurAndSubmit' : 'submit'} onSubmitEditing={() => inputRefs.current[index + 1]?.focus()}
        placeholder={`Player ${index + 1}`} placeholderTextColor="#796052" selectionColor={STAGE.accent} style={{ flex: 1, minWidth: 0, color: STAGE.ink, fontSize: 17, fontFamily: TYPE.medium, minHeight: 56, paddingVertical: 12 }} />
      {focused && <Icon name="create-outline" size={17} color="#796052" />}
    </View>
    {suggestions.map((suggestion) => <Pressable key={suggestion} accessibilityRole="button" accessibilityLabel={`Use ${suggestion}`} onPress={() => { change(index, suggestion); setFocused(false); }} style={{ minHeight: 48, justifyContent: 'center', paddingLeft: 38, backgroundColor: STAGE.paperShade }}><Text style={{ color: STAGE.ink, fontFamily: TYPE.medium, fontSize: 14 }}>{suggestion}</Text></Pressable>)}
  </View>;
}

function Players({ back, next }: { back: () => void; next: () => void }) {
  const game = useGameStore();
  const { width, fontScale } = useWindowDimensions();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  return <View>
    <Navigation back={back} backLabel="Welcome" position="Setup · 1 of 2" />
    <Heading>Meet the cast.</Heading>
    <Body style={s.intro}>Names go in the order you’ll pass the phone.</Body>
    <View style={{ flexDirection: width < 350 || fontScale > 1.2 ? 'column' : 'row', gap: 24, paddingVertical: 24, borderTopWidth: 1, borderBottomWidth: 1, borderColor: STAGE.rule }}>
      <Counter title="Players" value={game.playerCount} min={3} max={15} change={game.setPlayerCount} /><Counter title="Imposters" value={game.imposterCount} min={1} max={getMaxImposters(game.playerCount)} change={game.setImposterCount} />
    </View>
    <View style={{ backgroundColor: STAGE.paper, padding: 20, paddingBottom: 26, marginTop: 28, borderRadius: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}><Heading paper size={27} italic>Casting sheet</Heading><Icon name="people-outline" color="#796052" size={20} /></View>
      {game.participantNames.slice(0, game.playerCount).map((name, index) => <NameLine key={index} index={index} name={name} names={game.participantNames} change={game.setParticipantName} inputRefs={inputRefs} />)}
      <Body paper size={12} style={{ marginTop: 16 }}>Your passing order. Your usual crowd.</Body>
    </View>
    <View style={s.footer}><Action title="Choose the game" onPress={next} /></View>
  </View>;
}

function Rules({ back, deal }: { back: () => void; deal: () => void | Promise<void> }) {
  const game = useGameStore();
  const { width, fontScale } = useWindowDimensions();
  const compact = width < 380 || fontScale > 1.15;
  return <View>
    <Navigation back={back} backLabel="Players" position="Setup · 2 of 2" />
    <Heading>Set the scene.</Heading><Body style={s.intro}>Choose what the imposters know.</Body>
    <Label color={STAGE.brass}>Game mode</Label>
    <View style={{ marginTop: 12, marginBottom: 30 }}>
      {MODES.map((mode) => {
        const selected = mode.id === game.selectedMode;
        return <Pressable key={mode.id} accessibilityRole="radio" accessibilityLabel={mode.title} aria-checked={selected} accessibilityState={{ checked: selected }} onPress={() => { haptic(); game.setSelectedMode(mode.id); }} style={({ pressed }) => ({ flexDirection: 'row', gap: 14, padding: 16, minHeight: 92, borderBottomWidth: 1, borderBottomColor: STAGE.rule, backgroundColor: selected ? STAGE.selected : pressed ? STAGE.raised : 'transparent', alignItems: 'center', borderRadius: selected ? 12 : 0 })}>
          <Icon name={mode.icon} size={25} color={selected ? STAGE.brass : STAGE.muted} />
          <View style={{ flex: 1, gap: 5 }}><Text style={{ color: STAGE.text, fontFamily: TYPE.medium, fontSize: 17, lineHeight: 23 }}>{mode.title}</Text><Body size={12}>{mode.description}</Body></View>
          <Icon name={selected ? 'radio-button-on' : 'radio-button-off'} size={21} color={selected ? STAGE.brass : STAGE.muted} />
        </Pressable>;
      })}
    </View>
    <Label color={STAGE.brass}>Category</Label>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, marginBottom: 28 }}>
      {CATEGORIES.map((category, index) => {
        const selected = category === game.selectedCategory;
        return <Pressable key={category} accessibilityRole="radio" accessibilityLabel={category} aria-checked={selected} accessibilityState={{ checked: selected }} onPress={() => { haptic(); game.setSelectedCategory(category); }} style={({ pressed }) => ({ width: compact ? '100%' : '50%', minHeight: 78, padding: 12, borderBottomWidth: 1, borderBottomColor: STAGE.rule, flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: selected ? STAGE.selected : pressed ? STAGE.raised : 'transparent' })}>
          <Icon name={CATEGORY_ICONS[index]} size={22} color={selected ? STAGE.brass : STAGE.muted} /><Text style={{ flex: 1, fontFamily: selected ? TYPE.bold : TYPE.body, color: STAGE.text, fontSize: 13, lineHeight: 19 }}>{category}</Text>{selected && <Icon name="checkmark" size={16} color={STAGE.brass} />}
        </Pressable>;
      })}
    </View>
    <View style={{ flexDirection: 'row', gap: 12, paddingVertical: 18, borderTopWidth: 1, borderColor: STAGE.rule, marginBottom: 8 }}><Icon name="ticket-outline" color={STAGE.brass} /><Body size={13}>{game.playerCount} players · {game.imposterCount} {game.imposterCount === 1 ? 'imposter' : 'imposters'}{`\n`}{game.selectedCategory}</Body></View>
      <Action title={game.isLoadingWords ? 'Opening the playbill…' : 'Deal the roles'} disabled={game.isLoadingWords} onPress={() => { void deal(); }} />
  </View>;
}

function Reveal({ leave }: { leave: () => void }) {
  const game = useGameStore();
  const reduced = useReducedMotion();
  const [peek, setPeek] = useState(false);
  const [seen, setSeen] = useState(false);
  const held = useRef(false);
  const keyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progress = useSharedValue(0);
  const curtain = useSharedValue(0);
  const holdStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: progress.value }] }));
  const left = useAnimatedStyle(() => ({ transform: [{ translateX: -curtain.value * 190 }], opacity: 1 - curtain.value }));
  const right = useAnimatedStyle(() => ({ transform: [{ translateX: curtain.value * 190 }], opacity: 1 - curtain.value }));
  const player = game.players[game.currentRevealIndex];
  function hide() {
    held.current = false;
    if (keyTimer.current) clearTimeout(keyTimer.current);
    keyTimer.current = null;
    setPeek(false);
    progress.value = 0;
    curtain.value = 0;
  }
  function begin() {
    held.current = true;
    progress.value = reduced ? 1 : withTiming(1, { duration: MOTION.revealHold, easing: EASE });
  }
  function reveal() {
    if (!held.current || AppState.currentState === 'background' || AppState.currentState === 'inactive') return;
    setPeek(true); setSeen(true); haptic('reveal');
    curtain.value = reduced ? 1 : withTiming(1, { duration: MOTION.curtain, easing: EASE });
  }
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => { if (state !== 'active') hide(); });
    const conceal = () => hide();
    const visibility = () => { if (document.visibilityState !== 'visible') hide(); };
    if (Platform.OS === 'web') { window.addEventListener('blur', conceal); document.addEventListener('visibilitychange', visibility); }
    return () => { subscription.remove(); if (keyTimer.current) clearTimeout(keyTimer.current); if (Platform.OS === 'web') { window.removeEventListener('blur', conceal); document.removeEventListener('visibilitychange', visibility); } };
  }, []);
  if (!player) return null;
  const last = game.currentRevealIndex === game.players.length - 1;
  const keys = Platform.OS === 'web' ? {
    onKeyDown: (event: any) => { if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) { event.preventDefault(); hide(); begin(); keyTimer.current = setTimeout(reveal, MOTION.revealHold); } },
    onKeyUp: (event: any) => { if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); hide(); } },
    onBlur: hide, onPointerLeave: hide, onPointerCancel: hide,
  } : {};
  return <View style={{ flexGrow: 1, justifyContent: 'space-between', minHeight: 610 }}>
    <View>
      <Navigation position={`${game.currentRevealIndex + 1} of ${game.players.length}`} />
      <Body size={14}>Pass the phone to</Body><Heading size={46} style={{ marginTop: 4 }}>{player.name}</Heading>
      <Body style={{ marginTop: 12, marginBottom: 24 }}>For your eyes only. Hold the card, then let go.</Body>
      <Pressable {...keys as any} accessibilityRole="button" accessibilityLabel={peek ? `${player.role === 'imposter' ? 'Imposter' : 'Citizen'}. ${player.assignedWordOrHint || 'No word or hint'}` : `Sealed card for ${player.name}`} accessibilityHint={peek ? 'Release to hide. Screen reader action: Conceal role.' : 'Hold this card to reveal. Release to hide. Screen reader action: Reveal role.'} accessibilityActions={[{ name: 'reveal', label: 'Reveal role' }, { name: 'conceal', label: 'Conceal role' }]} onAccessibilityAction={(event) => { if (event.nativeEvent.actionName === 'reveal') { held.current = true; reveal(); held.current = false; } else if (event.nativeEvent.actionName === 'conceal') hide(); }} delayLongPress={MOTION.revealHold} onPressIn={begin} onLongPress={reveal} onPressOut={hide} onTouchCancel={hide}
        style={({ focused }: any) => ({ backgroundColor: STAGE.paper, borderRadius: 16, overflow: 'hidden', minHeight: 330, borderWidth: 2, borderColor: focused ? STAGE.brass : STAGE.paper })}>
        <View style={{ padding: 24, minHeight: 326, justifyContent: 'space-between', gap: 20 }}>
          {peek ? <>
            <View><Label paper>Your secret role</Label><Heading paper size={43} style={{ marginTop: 8 }}>{player.role === 'imposter' ? 'Imposter' : 'Citizen'}</Heading></View>
            <View style={{ gap: 8, paddingVertical: 18, borderTopWidth: 1, borderBottomWidth: 1, borderColor: STAGE.paperRule }}><Label paper>{player.role === 'imposter' && game.selectedMode === 'blind_imposter' ? 'Your act' : player.role === 'imposter' && game.selectedMode === 'imposter_gets_clue' ? 'Your hint' : 'Your word'}</Label><Heading paper size={32}>{player.assignedWordOrHint || 'No word. Blend in.'}</Heading></View>
            <Body paper size={12}>Memorize it. Release to conceal.</Body>
          </> : <><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Label paper>One private invitation</Label><Icon name="lock-closed-outline" color="#6D5660" size={17} /></View><StageArt small /><View style={{ gap: 6, alignItems: 'center' }}><Text style={{ color: STAGE.ink, fontFamily: TYPE.bold, fontSize: 16, lineHeight: 23 }}>Touch & hold this card</Text><Body paper size={12}>Your secret disappears when you let go.</Body></View></>}
        </View>
        {peek && <View accessible={false} importantForAccessibility="no-hide-descendants" style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}><Animated.View style={[s.curtain, { left: 0 }, left]} /><Animated.View style={[s.curtain, { right: 0 }, right]} /></View>}
        {!peek && <View style={{ height: 3, backgroundColor: STAGE.paperShade, pointerEvents: 'none' }}><Animated.View style={[{ height: 3, backgroundColor: STAGE.accent, transformOrigin: 'left' }, holdStyle]} /></View>}
      </Pressable>
    </View>
    <View style={{ paddingTop: 24, gap: 8 }}>
      {seen && !peek ? <Action title={last ? 'Begin discussion' : 'Pass to next player'} onPress={() => { hide(); game.nextReveal(); }} /> : <View style={{ minHeight: 60, justifyContent: 'center' }}><Body size={12} style={{ textAlign: 'center' }}>{peek ? 'Let go to hide your secret.' : 'Hold the invitation to discover your role.'}</Body></View>}
      <TextAction title="Leave this match" onPress={() => { hide(); leave(); }} />
    </View>
  </View>;
}

function PlayerLine({ player, index, starter, selected, choose }: { player: Player; index: number; starter: boolean; selected: boolean; choose: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`${player.name}${player.isEliminated ? ', eliminated' : ', select for elimination'}`} accessibilityState={{ disabled: player.isEliminated, selected }} disabled={player.isEliminated} onPress={() => { haptic(); choose(); }} style={({ pressed }) => ({ minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: STAGE.rule, backgroundColor: selected ? STAGE.selected : pressed ? STAGE.raised : 'transparent', opacity: player.isEliminated ? 0.5 : 1 })}>
    <Text style={{ color: STAGE.brass, fontFamily: TYPE.medium, fontSize: 12, width: 24 }}>{String(index + 1).padStart(2, '0')}</Text>
    <View style={{ flex: 1, gap: 4 }}><Text style={{ color: STAGE.text, fontFamily: TYPE.medium, fontSize: 17, lineHeight: 23 }}>{player.name}</Text>{(starter || player.isEliminated || selected) && <Body size={11}>{player.isEliminated ? 'Eliminated' : selected ? 'Chosen by the room' : 'Discussion starter'}</Body>}</View>
    <Icon name={player.isEliminated ? 'remove-circle-outline' : selected ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={selected ? STAGE.brass : STAGE.muted} />
  </Pressable>;
}

function SceneModal({ visible, close, children }: { visible: boolean; close: () => void; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return <Modal visible={visible} animationType={reduced ? 'none' : 'fade'} onRequestClose={close} statusBarTranslucent><SafeAreaView style={{ flex: 1, backgroundColor: STAGE.bg }}><ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, alignItems: 'center' }}><View style={{ width: '100%', maxWidth: 520, flexGrow: 1 }}>{children}</View></ScrollView></SafeAreaView></Modal>;
}

function Elimination() {
  const game = useGameStore();
  const reduced = useReducedMotion();
  return <SceneModal visible={!!game.lastEliminatedPlayer} close={game.clearLastEliminated}>
    <View style={{ flex: 1, justifyContent: 'space-between', minHeight: 540 }}>
      <View><Navigation position="Role revealed" /><Animated.View entering={reduced ? undefined : FadeInDown.duration(280).easing(EASE)}><StageArt small outcome /><Heading size={49}>{game.lastEliminatedPlayer?.role === 'imposter' ? 'The mask slips.' : 'An innocent exit.'}</Heading><Body muted={false} size={19} style={{ marginTop: 20 }}>{game.lastEliminatedPlayer?.name} was {game.lastEliminatedPlayer?.role === 'imposter' ? 'an imposter' : 'a citizen'}.</Body></Animated.View><View style={{ marginTop: 28, paddingTop: 20, borderTopWidth: 1, borderColor: STAGE.rule }}><Body size={14}>Their role is public. The secret word stays hidden until the game ends.</Body></View></View>
      <View style={s.footer}><Action title={game.winner ? 'See the result' : 'Continue the game'} onPress={game.clearLastEliminated} /></View>
    </View>
  </SceneModal>;
}

function Discussion({ leave }: { leave: () => void }) {
  const game = useGameStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = game.players.find((player) => player.id === selectedId && !player.isEliminated);
  const starter = game.players.find((player) => player.id === game.discussionStarterId);
  useEffect(() => { setSelectedId(null); }, [game.lastEliminatedPlayer]);
  return <View>
    <Navigation position={`Round ${game.roundNumber}`} /><Heading>Read the room.</Heading><Body style={s.intro}>One clue each. Listen for the act that doesn’t fit.</Body>
    <View style={{ paddingVertical: 20, marginBottom: 28, borderTopWidth: 1, borderBottomWidth: 1, borderColor: STAGE.brass, gap: 6 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Icon name="mic-outline" color={STAGE.brass} size={18} /><Label color={STAGE.brass}>Starts every round</Label></View><Heading size={34}>{starter?.name}</Heading><Body size={12}>{starter?.isEliminated ? 'They’re out. Start with the next active player in order.' : 'Then continue in entered name order.'}</Body></View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}><Label>Vote together</Label><Label>{game.players.filter((player) => !player.isEliminated).length} active</Label></View>
    <Body size={12} style={{ marginBottom: 12 }}>After everyone votes in person, tap the player the room chose.</Body>
    <Rule />{game.players.map((player, index) => <PlayerLine key={player.id} player={player} index={index} starter={player.id === game.discussionStarterId} selected={player.id === selectedId} choose={() => setSelectedId(selectedId === player.id ? null : player.id)} />)}
    {selected ? <View style={{ marginTop: 24, gap: 12 }}><Heading size={30}>Eliminate {selected.name}?</Heading><Body size={13}>Confirm after everyone has voted in person.</Body><Action title="Confirm elimination" onPress={() => game.eliminatePlayer(selected.id)} /><TextAction title="Choose someone else" onPress={() => setSelectedId(null)} /></View> : <View style={s.footer}><Action title="Another clue round" secondary onPress={game.skipRound} /><Body size={12} style={{ textAlign: 'center', marginTop: 12 }}>Vote in person, then select a name together.</Body></View>}
    <TextAction title="Leave this match" onPress={leave} /><Elimination />
  </View>;
}

function Ended({ rematch, changeGame, newGroup }: { rematch: () => void; changeGame: () => void; newGroup: () => void }) {
  const game = useGameStore();
  const citizens = game.winner === 'citizens';
  useEffect(() => { haptic('result'); }, []);
  return <View>
    <Navigation position={`${game.roundNumber} ${game.roundNumber === 1 ? 'round' : 'rounds'}`} />
    <StageArt small outcome victory={citizens ? 'citizens' : 'imposters'} /><Heading size={52}>{citizens ? 'Truth takes\nthe spotlight.' : 'A brilliant\ndeception.'}</Heading>
    <Text style={{ fontFamily: TYPE.italic, color: STAGE.brass, fontSize: 29, lineHeight: 35, marginTop: 14 }}>{citizens ? 'Citizens win.' : 'Imposters win.'}</Text>
    <Body style={{ marginTop: 10, marginBottom: 28 }}>{citizens ? 'Every imposter has been uncovered.' : 'Imposters now equal or outnumber the citizens.'}</Body>
    <View style={{ backgroundColor: STAGE.paper, borderRadius: 12, padding: 22, gap: 15, marginBottom: 28 }}><Heading paper italic size={28}>Secrets, unmasked.</Heading><Rule paper /><View style={{ gap: 5 }}><Label paper>Citizens’ word</Label><Heading paper size={31}>{game.activeWordEntry?.mainWord}</Heading></View><Rule paper /><View style={{ gap: 5 }}><Label paper>{game.selectedMode === 'imposter_gets_clue' ? 'Imposters’ hint' : 'Imposters’ word'}</Label><Heading paper size={28}>{game.selectedMode === 'everyone_gets_word' ? game.activeWordEntry?.imposterWord : game.selectedMode === 'imposter_gets_clue' ? game.activeWordEntry?.imposterHint : 'No word or hint'}</Heading></View></View>
    <Label>Behind the masks</Label><View style={{ marginTop: 12, marginBottom: 28 }}><Rule />{game.players.map((player, index) => <View key={player.id} style={{ minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: STAGE.rule }}><Text style={{ fontFamily: TYPE.medium, color: STAGE.brass, fontSize: 12, width: 24 }}>{String(index + 1).padStart(2, '0')}</Text><Text style={{ flex: 1, fontFamily: TYPE.medium, color: STAGE.text, fontSize: 16, lineHeight: 23 }}>{player.name}</Text><View style={{ maxWidth: '35%' }}><Text style={{ fontFamily: TYPE.medium, color: player.role === 'imposter' ? STAGE.brass : STAGE.text, fontSize: 12, lineHeight: 18, textAlign: 'right' }}>{player.role === 'imposter' ? 'Imposter' : 'Citizen'}</Text><Body size={11} style={{ textAlign: 'right' }}>{player.isEliminated ? 'Eliminated' : 'Still in'}</Body></View></View>)}</View>
    <View style={{ gap: 12 }}><Action title="Rematch" detail="Same group & settings" onPress={rematch} /><Action title="Change game" detail="Same names, a new scene" secondary onPress={changeGame} /><TextAction title="New group" onPress={newGroup} /></View>
  </View>;
}

export function MasqueradeFlow() {
  const game = useGameStore();
  const [step, setStep] = useState<SetupStep>('welcome');
  const [confirmLeave, setConfirmLeave] = useState(false);
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
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
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: STAGE.bg }}>
    <ScrollView key={`${screen}-${game.phase === 'reveal' ? game.currentRevealIndex : ''}`} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingHorizontal: width < 350 ? 16 : 24, paddingTop: 12, paddingBottom: 28 }}>
      <Animated.View entering={reduced ? undefined : FadeIn.duration(MOTION.page)} style={{ width: '100%', maxWidth: 520, flexGrow: Platform.OS === 'web' && width > 600 && screen === 'welcome' ? 0 : 1, justifyContent: Platform.OS === 'web' && width > 600 && screen === 'welcome' ? 'center' : undefined }}>
        {screen === 'welcome' && <Welcome next={() => setStep('players')} />}
        {screen === 'players' && <Players back={() => setStep('welcome')} next={() => setStep('rules')} />}
        {screen === 'rules' && <Rules back={() => setStep('players')} deal={game.startNewGame} />}
        {screen === 'reveal' && <Reveal key={game.currentRevealIndex} leave={leave} />}
        {screen === 'discussion' && <Discussion leave={leave} />}
        {screen === 'game_over' && <Ended rematch={game.resetGameKeepSetup} changeGame={() => { game.backToSetup(); setStep('rules'); }} newGroup={() => { game.resetForNewGroup(); setStep('players'); }} />}
      </Animated.View>
    </ScrollView>
    <SceneModal visible={confirmLeave} close={() => setConfirmLeave(false)}><View style={{ flex: 1, minHeight: 510, justifyContent: 'space-between' }}><View><Navigation position="Leave match" /><StageArt small /><Heading>{'The show’s\nnot over.'}</Heading><Body style={{ marginTop: 20 }}>Leave this match? Roles and progress will be lost. Your group and settings will stay ready.</Body></View><View style={{ gap: 12, paddingTop: 24 }}><Action title="Keep playing" onPress={() => setConfirmLeave(false)} /><Action title="Leave match" secondary onPress={finishLeave} /></View></View></SceneModal>
  </KeyboardAvoidingView>;
}

const s = StyleSheet.create({
  intro: { marginTop: 12, marginBottom: 28 }, footer: { paddingTop: 24 },
  curtain: { position: 'absolute', top: 0, bottom: 0, width: '50%', backgroundColor: STAGE.selected },
});
