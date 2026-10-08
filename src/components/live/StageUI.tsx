import React, { useEffect } from 'react';
import { Image, Platform, Pressable as NativePressable, StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { MOTION, STAGE, TYPE } from './masqueradeTheme';

export const EASE = Easing.bezier(0.23, 1, 0.32, 1);
export const MASK_ART = require('../../../assets/masquerade/masks.png');
export const STAGE_FRAME_ART = require('../../../assets/masquerade/stage-curtains.png');
// Inline native press-state styles must not pass through NativeWind's CSS
// interop. Its native wrapper drops function-valued styles in this setup.
export const Pressable = React.forwardRef<React.ComponentRef<typeof NativePressable>, React.ComponentProps<typeof NativePressable>>(
  (props, ref) => React.createElement(NativePressable, { ...props, ref, cssInterop: false } as React.ComponentProps<typeof NativePressable>),
);
Pressable.displayName = 'StagePressable';
export function haptic(kind: 'tick' | 'reveal' | 'result' = 'tick') {
  if (Platform.OS === 'web') return;
  const request = kind === 'tick' ? Haptics.selectionAsync() : kind === 'reveal'
    ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  void request.catch(() => undefined);
}

export function Icon({ name, size = 22, color = STAGE.text }: { name: React.ComponentProps<typeof Ionicons>['name']; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} accessible={false} />;
}
export function Label({ children, paper = false, color }: { children: React.ReactNode; paper?: boolean; color?: string }) {
  return <Text style={{ fontFamily: TYPE.bold, color: color ?? (paper ? '#6D5660' : STAGE.muted), fontSize: 11, lineHeight: 17, letterSpacing: 1.5, textTransform: 'uppercase' }}>{children}</Text>;
}
export function Heading({ children, size = 44, paper = false, italic = false, style }: { children: React.ReactNode; size?: number; paper?: boolean; italic?: boolean; style?: StyleProp<TextStyle> }) {
  return <Text style={[{ fontFamily: italic ? TYPE.italic : TYPE.display, color: paper ? STAGE.ink : STAGE.text, fontSize: size, lineHeight: size * 1.08, letterSpacing: -0.5, flexShrink: 1 }, style]}>{children}</Text>;
}
export function Body({ children, paper = false, muted = true, size = 15, style }: { children: React.ReactNode; paper?: boolean; muted?: boolean; size?: number; style?: StyleProp<TextStyle> }) {
  return <Text style={[{ fontFamily: TYPE.body, color: paper ? '#6D5660' : muted ? STAGE.muted : STAGE.text, fontSize: size, lineHeight: size * 1.5 }, style]}>{children}</Text>;
}
export function Rule({ paper = false }: { paper?: boolean }) {
  return <View style={{ height: 1, backgroundColor: paper ? STAGE.paperRule : STAGE.rule }} />;
}
export function Action({ title, detail, onPress, secondary = false, disabled = false }: { title: string; detail?: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const motion = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={motion}><Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityHint={detail} accessibilityState={{ disabled }} disabled={disabled}
    onPressIn={() => { scale.value = reduced ? 1 : withTiming(0.98, { duration: MOTION.press }); }}
    onPressOut={() => { scale.value = withTiming(1, { duration: MOTION.press }); }}
    onPress={() => { haptic(); onPress(); }}
    style={({ pressed, focused }: any) => [styles.action, { backgroundColor: secondary ? (pressed ? STAGE.selected : STAGE.raised) : pressed ? STAGE.accentPressed : STAGE.accent, borderColor: focused ? STAGE.brass : secondary ? STAGE.rule : 'transparent', opacity: disabled ? 0.4 : 1 }]}>
    <View style={{ flex: 1, gap: 3 }}><Text style={styles.actionTitle}>{title}</Text>{detail && <Text style={{ color: STAGE.text, fontFamily: TYPE.body, fontSize: 12, lineHeight: 18 }}>{detail}</Text>}</View>
    <Icon name="arrow-forward" size={23} />
  </Pressable></Animated.View>;
}
export function TextAction({ title, onPress }: { title: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={() => { haptic(); onPress(); }} style={({ pressed }) => ({ minHeight: 48, justifyContent: 'center', alignItems: 'center', opacity: pressed ? 0.6 : 1 })}><Text style={{ color: STAGE.muted, fontFamily: TYPE.medium, fontSize: 13 }}>{title}</Text></Pressable>;
}
export function Navigation({ back, backLabel, position }: { back?: () => void; backLabel?: string; position: string }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 48, marginBottom: 18 }}>
    {back ? <Pressable accessibilityRole="button" accessibilityLabel={`Back to ${backLabel}`} onPress={() => { haptic(); back(); }} style={({ pressed }) => ({ flexDirection: 'row', gap: 8, alignItems: 'center', minHeight: 48, paddingRight: 12, opacity: pressed ? 0.6 : 1 })}><Icon name="arrow-back" size={20} color={STAGE.brass} /><Text style={{ color: STAGE.text, fontFamily: TYPE.medium, fontSize: 13 }}>{backLabel}</Text></Pressable>
      : <Text style={{ fontFamily: TYPE.italic, fontSize: 25, color: STAGE.brass }}>Suspicion</Text>}
    <Label>{position}</Label>
  </View>;
}

export function StageArt({ small = false, outcome = false, victory }: { small?: boolean; outcome?: boolean; victory?: 'citizens' | 'imposters' }) {
  const reduced = useReducedMotion();
  const reveal = useSharedValue(reduced ? 1 : 0);
  useEffect(() => { reveal.value = reduced ? 1 : withTiming(1, { duration: MOTION.scene, easing: EASE }); }, [reduced, reveal]);
  const artStyle = useAnimatedStyle(() => ({ opacity: 0.5 + reveal.value * 0.5, transform: [{ translateY: (1 - reveal.value) * 24 }, { rotate: `${(1 - reveal.value) * -5}deg` }, { scale: 0.9 + reveal.value * 0.1 }] }));
  const height = small ? 168 : 292;
  return <View accessible={false} importantForAccessibility="no-hide-descendants" style={{ alignItems: 'center', height, width: '100%', marginVertical: small ? 8 : 20 }}>
    {victory === 'citizens' && <View style={{ position: 'absolute', top: 5, width: 194, height: 150, borderTopLeftRadius: 110, borderTopRightRadius: 110, borderWidth: 1, borderBottomWidth: 0, borderColor: STAGE.brass, opacity: 0.7 }} />}
    {victory === 'imposters' && <><View style={{ position: 'absolute', top: 18, left: '16%', width: 34, height: 128, borderRadius: 17, backgroundColor: '#582536', transform: [{ rotate: '-16deg' }] }} /><View style={{ position: 'absolute', top: 18, right: '16%', width: 34, height: 128, borderRadius: 17, backgroundColor: '#582536', transform: [{ rotate: '16deg' }] }} /></>}
    {!small && <Image source={STAGE_FRAME_ART} resizeMode="contain" style={{ position: 'absolute', width: '100%', maxWidth: 380, height: '100%' }} />}
    <Animated.View style={[{ width: small ? victory === 'imposters' ? 218 : 184 : '100%', maxWidth: small ? 360 : 330, height }, artStyle]}><Image source={MASK_ART} resizeMode="contain" style={{ width: '100%', height: '100%', transform: small ? [{ rotate: victory === 'imposters' ? '12deg' : outcome ? '7deg' : '0deg' }] : [{ scale: 0.85 }, { translateY: 26 }] }} /></Animated.View>
  </View>;
}

const styles = StyleSheet.create({
  action: { minHeight: 60, borderRadius: 12, borderCurve: 'continuous', paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 2 },
  actionTitle: { fontFamily: TYPE.bold, color: STAGE.text, fontSize: 16, lineHeight: 23 },
});
