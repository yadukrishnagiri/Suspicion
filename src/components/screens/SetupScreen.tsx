import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import Animated, {
  FadeIn,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore, CATEGORIES, getMaxImposters, getMinPlayers } from '@/store/gameStore';
import { GameMode, GameCategory } from '@/types/game';
import { COLORS, BRUTAL } from '@/constants/theme';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

const MODES: { id: GameMode; title: string; subtitle: string; tag: string }[] = [
  {
    id: 'everyone_gets_word',
    title: 'mode 1: word vs word',
    subtitle: 'imposters get a counterpart word. subtle conversational clashes.',
    tag: 'subtle',
  },
  {
    id: 'imposter_gets_clue',
    title: 'mode 2: word vs hint',
    subtitle: 'imposters get an indirect contextual clue without the exact word.',
    tag: 'bluffing',
  },
  {
    id: 'blind_imposter',
    title: 'mode 3: blind imposter',
    subtitle: 'imposters receive nothing ("???"). pure listening and deduction.',
    tag: 'hardcore',
  },
];

export const SetupScreen: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const insets = useSafeAreaInsets();

  const {
    playerCount,
    imposterCount,
    participantNames,
    selectedMode,
    selectedCategory,
    setPlayerCount,
    setImposterCount,
    setParticipantName,
    setSelectedMode,
    setSelectedCategory,
    startNewGame,
  } = useGameStore();

  const maxImposters = getMaxImposters(playerCount);
  const minRequired = getMinPlayers(imposterCount);
  const isAtMaxImposters = imposterCount >= maxImposters;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: COLORS.bg }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 40,
          paddingTop: 12,
          paddingHorizontal: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Magazine App Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 12,
            borderBottomWidth: 2,
            borderColor: COLORS.border,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: COLORS.coral,
                ...BRUTAL.border,
              }}
            />
            <Text style={{ fontSize: 18, fontWeight: '800', letterSpacing: -0.5, color: COLORS.text }}>
              suspicion.
            </Text>
          </View>
          <View
            style={{
              backgroundColor: COLORS.yellow,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: BRUTAL.pill,
              ...BRUTAL.border,
              ...BRUTAL.shadowSm,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.dark }}>pass & play</Text>
          </View>
        </View>

        {/* Magazine Tilted Hero Card */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: BRUTAL.r,
            padding: 20,
            ...BRUTAL.border,
            ...BRUTAL.shadowLg,
            transform: [{ rotate: '-1.5deg' }],
            marginBottom: 20,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: COLORS.lavender,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: BRUTAL.pill,
                ...BRUTAL.border,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '800' }}>digital game master</Text>
            </View>
            <Text style={{ fontSize: 14, fontStyle: 'italic', fontWeight: '700', color: COLORS.coral }}>
              it's game night! ✨
            </Text>
          </View>

          <Text style={{ fontSize: 36, fontWeight: '900', lineHeight: 38, letterSpacing: -1, marginTop: 8, color: COLORS.dark }}>
            room setup.
          </Text>
          <Text style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4, lineHeight: 18 }}>
            balance players, choose your game mode, and pass the phone around.
          </Text>
        </View>

        {/* Split Metric Counter Card */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: BRUTAL.r,
            padding: 16,
            ...BRUTAL.border,
            ...BRUTAL.shadow,
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Players Counter */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 11, fontWeight: '800', textTransform: 'lowercase', color: COLORS.dark }}>
                total players
              </Text>
              <Text style={{ fontSize: 48, fontWeight: '900', lineHeight: 52, marginVertical: 4, color: COLORS.dark }}>
                {playerCount}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, width: '100%', justifyContent: 'center' }}>
                <Pressable
                  onPress={() => setPlayerCount(playerCount - 1)}
                  disabled={playerCount <= 3}
                  style={({ pressed }) => ({
                    flex: 1,
                    height: 40,
                    backgroundColor: COLORS.surface,
                    borderRadius: BRUTAL.r,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...BRUTAL.border,
                    ...BRUTAL.shadowSm,
                    opacity: playerCount <= 3 ? 0.3 : 1,
                    transform: pressed ? [{ scale: 0.95 }] : [],
                  })}
                >
                  <Text style={{ fontSize: 22, fontWeight: '900', color: COLORS.dark }}>−</Text>
                </Pressable>
                <Pressable
                  onPress={() => setPlayerCount(playerCount + 1)}
                  disabled={playerCount >= 15}
                  style={({ pressed }) => ({
                    flex: 1,
                    height: 40,
                    backgroundColor: COLORS.surface,
                    borderRadius: BRUTAL.r,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...BRUTAL.border,
                    ...BRUTAL.shadowSm,
                    opacity: playerCount >= 15 ? 0.3 : 1,
                    transform: pressed ? [{ scale: 0.95 }] : [],
                  })}
                >
                  <Text style={{ fontSize: 22, fontWeight: '900', color: COLORS.dark }}>+</Text>
                </Pressable>
              </View>
            </View>

            {/* Vertical Divider */}
            <View style={{ width: 2, backgroundColor: COLORS.border }} />

            {/* Imposters Counter */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 11, fontWeight: '800', textTransform: 'lowercase', color: COLORS.coral }}>
                imposters
              </Text>
              <Text style={{ fontSize: 48, fontWeight: '900', lineHeight: 52, marginVertical: 4, color: COLORS.coral }}>
                {imposterCount}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, width: '100%', justifyContent: 'center' }}>
                <Pressable
                  onPress={() => setImposterCount(imposterCount - 1)}
                  disabled={imposterCount <= 1}
                  style={({ pressed }) => ({
                    flex: 1,
                    height: 40,
                    backgroundColor: COLORS.pink,
                    borderRadius: BRUTAL.r,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...BRUTAL.border,
                    ...BRUTAL.shadowSm,
                    opacity: imposterCount <= 1 ? 0.3 : 1,
                    transform: pressed ? [{ scale: 0.95 }] : [],
                  })}
                >
                  <Text style={{ fontSize: 22, fontWeight: '900', color: COLORS.dark }}>−</Text>
                </Pressable>
                <Pressable
                  onPress={() => setImposterCount(imposterCount + 1)}
                  disabled={isAtMaxImposters}
                  style={({ pressed }) => ({
                    flex: 1,
                    height: 40,
                    backgroundColor: COLORS.pink,
                    borderRadius: BRUTAL.r,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...BRUTAL.border,
                    ...BRUTAL.shadowSm,
                    opacity: isAtMaxImposters ? 0.3 : 1,
                    transform: pressed ? [{ scale: 0.95 }] : [],
                  })}
                >
                  <Text style={{ fontSize: 22, fontWeight: '900', color: COLORS.dark }}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Balancing Formula Pill */}
        <View
          style={{
            backgroundColor: COLORS.yellow,
            borderRadius: BRUTAL.pill,
            paddingVertical: 8,
            paddingHorizontal: 14,
            ...BRUTAL.border,
            ...BRUTAL.shadowSm,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.dark }}>
            (2 × {imposterCount}) + 1 = <Text style={{ fontWeight: '900' }}>{minRequired}</Text> min players ✓ balanced
          </Text>
        </View>

        {/* Seating Order Roster */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.dark }}>
              passing order (roster):
            </Text>
            <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textMuted }}>
              tap to rename
            </Text>
          </View>

          <View style={{ gap: 6 }}>
            {participantNames.slice(0, playerCount).map((name, i) => (
              <View
                key={`seat_${i}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.surface,
                  borderRadius: BRUTAL.r,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  gap: 10,
                  ...BRUTAL.border,
                  transform: [{ rotate: i % 2 === 0 ? '-0.4deg' : '0.4deg' }],
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: COLORS.lavender,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...BRUTAL.border,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '800' }}>{i + 1}</Text>
                </View>

                <TextInput
                  value={name}
                  onChangeText={(val) => setParticipantName(i, val)}
                  placeholder={`Player ${i + 1}`}
                  placeholderTextColor="#999"
                  maxLength={18}
                  style={{
                    flex: 1,
                    fontSize: 14,
                    fontWeight: '700',
                    color: COLORS.dark,
                    padding: 0,
                  }}
                />

                <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.textMuted }}>
                  seat {i + 1}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Game Mode Selection */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.dark, marginBottom: 8 }}>
            select game mode:
          </Text>

          <View style={{ gap: 8 }}>
            {MODES.map((m) => {
              const isSelected = selectedMode === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setSelectedMode(m.id)}
                  style={({ pressed }) => ({
                    backgroundColor: isSelected ? COLORS.yellow : COLORS.surface,
                    borderRadius: BRUTAL.r,
                    padding: 14,
                    ...BRUTAL.border,
                    ...(isSelected ? BRUTAL.shadowLg : BRUTAL.shadow),
                    transform: pressed ? [{ scale: 0.98 }] : [],
                  })}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.dark }}>
                      {m.title}
                    </Text>
                    {isSelected && (
                      <View
                        style={{
                          backgroundColor: COLORS.coral,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: BRUTAL.pill,
                          ...BRUTAL.border,
                        }}
                      >
                        <Text style={{ fontSize: 10, fontWeight: '800', color: '#fff' }}>active</Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4, lineHeight: 15 }}>
                    {m.subtitle}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Category Chips */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.dark, marginBottom: 8 }}>
            pick a category:
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={({ pressed }) => ({
                    backgroundColor: isSelected ? COLORS.teal : COLORS.surface,
                    borderRadius: BRUTAL.r,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    ...BRUTAL.border,
                    ...BRUTAL.shadowSm,
                    transform: pressed ? [{ scale: 0.95 }] : [],
                  })}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '800',
                      color: isSelected ? '#fff' : COLORS.dark,
                    }}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Start Game Deal CTA Button */}
        <Pressable
          onPress={() => startNewGame()}
          style={({ pressed }) => ({
            backgroundColor: COLORS.coral,
            borderRadius: BRUTAL.rLg,
            paddingVertical: 18,
            paddingHorizontal: 22,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...BRUTAL.borderThick,
            ...BRUTAL.shadowLg,
            transform: pressed ? [{ translateX: 3 }, { translateY: 3 }] : [],
          })}
        >
          <Text style={{ fontSize: 17, fontWeight: '900', color: '#fff', letterSpacing: -0.3 }}>
            DEAL SECRET ROLES
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '900', color: '#fff' }}>→</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
