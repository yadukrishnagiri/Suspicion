import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { useGameStore, CATEGORIES, getMaxImposters } from '@/store/gameStore';
import { GameMode, GameCategory } from '@/types/game';
import { PressableScale } from '@/components/common';

const MODES: { id: GameMode; title: string; subtitle: string; label: string }[] = [
  {
    id: 'everyone_gets_word',
    title: 'Everyone Gets a Word',
    subtitle: 'Main Word vs Imposter Word',
    label: 'Everyone Gets a Word: Normal players get Main Word, Imposter gets secret related word.',
  },
  {
    id: 'imposter_gets_clue',
    title: 'Imposter Gets a Clue',
    subtitle: 'Indirect situational clue',
    label: 'Imposter Gets a Clue: Normal players get Main Word, Imposter gets an indirect hint.',
  },
  {
    id: 'blind_imposter',
    title: 'Blind Imposter',
    subtitle: 'Zero clues provided',
    label: 'Blind Imposter: Imposter receives no clues and blends in.',
  },
];

export const SetupScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'rules'>('landing');
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Animation values for step transition (180ms ease-out)
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

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
  const isAtMaxImposters = imposterCount >= maxImposters;

  const transitionToStep = (nextStep: 'landing' | 'rules') => {
    const exitDirection = nextStep === 'rules' ? -12 : 12;
    const enterDirection = nextStep === 'rules' ? 12 : -12;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: exitDirection,
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(nextStep);
      slideAnim.setValue(enterDirection);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 110,
          easing: Easing.bezier(0.23, 1, 0.32, 1),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 110,
          easing: Easing.bezier(0.23, 1, 0.32, 1),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-black"
    >
      <View className="flex-1 max-w-md w-full self-center justify-between">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          className="flex-1 px-5 pt-4"
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Swiss Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-neutral-800 mb-6">
            <Text className="text-sm font-black tracking-widest text-white uppercase">
              SUSPICION
            </Text>
            <Text className="text-xs font-mono text-neutral-500">
              {currentStep === 'landing' ? '01 / ROSTER' : '02 / RULES'}
            </Text>
          </View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }}
          >
            {currentStep === 'landing' ? (
              /* ================= PAGE 1: LANDING & ROSTER ================= */
              <View>
                {/* Split Metric Counter Block */}
                <View className="border border-neutral-800 divide-y divide-neutral-800 mb-6 bg-neutral-950">
                  <View className="flex-row divide-x divide-neutral-800">
                    {/* Total Players */}
                    <View className="flex-1 p-4">
                      <Text className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider font-bold">
                        PLAYERS
                      </Text>
                      <Text className="text-5xl font-black text-white my-1 tracking-tight">
                        {playerCount}
                      </Text>
                      <View className="flex-row gap-2 mt-2">
                        <PressableScale
                          onPress={() => setPlayerCount(playerCount - 1)}
                          disabled={playerCount <= 3}
                          haptic="selection"
                          activeScale={0.92}
                          accessibilityRole="button"
                          accessibilityLabel="Decrease players"
                          className={`flex-1 h-12 border items-center justify-center ${
                            playerCount <= 3
                              ? 'border-neutral-800 bg-neutral-900 opacity-20'
                              : 'border-neutral-700 bg-neutral-900'
                          }`}
                        >
                          <Text className="text-xl font-bold text-white">-</Text>
                        </PressableScale>
                        <PressableScale
                          onPress={() => setPlayerCount(playerCount + 1)}
                          disabled={playerCount >= 15}
                          haptic="selection"
                          activeScale={0.92}
                          accessibilityRole="button"
                          accessibilityLabel="Increase players"
                          className={`flex-1 h-12 border items-center justify-center ${
                            playerCount >= 15
                              ? 'border-neutral-800 bg-neutral-900 opacity-20'
                              : 'border-neutral-700 bg-neutral-900'
                          }`}
                        >
                          <Text className="text-xl font-bold text-white">+</Text>
                        </PressableScale>
                      </View>
                    </View>

                    {/* Imposters Counter */}
                    <View className="flex-1 p-4">
                      <Text className="text-[10px] font-mono uppercase text-blue-400 tracking-wider font-bold">
                        IMPOSTERS
                      </Text>
                      <Text className="text-5xl font-black text-blue-500 my-1 tracking-tight">
                        {imposterCount}
                      </Text>
                      <View className="flex-row gap-2 mt-2">
                        <PressableScale
                          onPress={() => setImposterCount(imposterCount - 1)}
                          disabled={imposterCount <= 1}
                          haptic="selection"
                          activeScale={0.92}
                          accessibilityRole="button"
                          accessibilityLabel="Decrease imposters"
                          className={`flex-1 h-12 border items-center justify-center ${
                            imposterCount <= 1
                              ? 'border-neutral-800 bg-neutral-900 opacity-20'
                              : 'border-neutral-700 bg-neutral-900'
                          }`}
                        >
                          <Text className="text-xl font-bold text-white">-</Text>
                        </PressableScale>
                        <PressableScale
                          onPress={() => setImposterCount(imposterCount + 1)}
                          disabled={isAtMaxImposters}
                          haptic="selection"
                          activeScale={0.92}
                          accessibilityRole="button"
                          accessibilityLabel="Increase imposters"
                          className={`flex-1 h-12 border items-center justify-center ${
                            isAtMaxImposters
                              ? 'border-neutral-800 bg-neutral-900 opacity-20'
                              : 'border-neutral-700 bg-neutral-900'
                          }`}
                        >
                          <Text className="text-xl font-bold text-white">+</Text>
                        </PressableScale>
                      </View>
                    </View>
                  </View>

                  {/* Parity Feedback Strip */}
                  <View className="px-4 py-2 flex-row items-center justify-between bg-neutral-900/50">
                    <Text className="text-[10px] font-mono text-neutral-400">
                      PARITY: MIN (2×IMPOSTERS)+1
                    </Text>
                    <Text
                      className={`text-[10px] font-mono font-bold ${
                        isAtMaxImposters ? 'text-blue-400' : 'text-neutral-500'
                      }`}
                    >
                      {isAtMaxImposters
                        ? `MAX FOR ${playerCount} PLAYERS`
                        : `UP TO ${maxImposters} ALLOWED`}
                    </Text>
                  </View>
                </View>

                {/* Players Roster */}
                <View className="mb-6">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider">
                      ROSTER ({playerCount})
                    </Text>
                    <Text className="text-[10px] font-mono text-neutral-600 uppercase">
                      SEATING ORDER
                    </Text>
                  </View>

                  <View className="border-t border-b border-neutral-800 divide-y divide-neutral-800 bg-neutral-950">
                    {Array.from({ length: playerCount }).map((_, i) => {
                      const isFocused = focusedInput === i;
                      return (
                        <View
                          key={i}
                          className={`flex-row items-center min-h-[48px] px-3 gap-3 ${
                            isFocused
                              ? 'bg-neutral-900 border-l-2 border-blue-500'
                              : 'bg-transparent'
                          }`}
                        >
                          <Text className="text-xs font-mono text-neutral-500 w-6">
                            {String(i + 1).padStart(2, '0')}
                          </Text>
                          <TextInput
                            ref={(el) => {
                              inputRefs.current[i] = el;
                            }}
                            value={participantNames[i] ?? `Player ${i + 1}`}
                            onChangeText={(val) => setParticipantName(i, val)}
                            onFocus={() => setFocusedInput(i)}
                            onBlur={() => setFocusedInput(null)}
                            placeholder={`Player ${i + 1}`}
                            placeholderTextColor="#525252"
                            returnKeyType={i === playerCount - 1 ? 'done' : 'next'}
                            onSubmitEditing={() => {
                              if (i < playerCount - 1) {
                                inputRefs.current[i + 1]?.focus();
                              }
                            }}
                            autoCapitalize="words"
                            autoCorrect={false}
                            accessibilityLabel={`Player ${i + 1} name`}
                            className="flex-1 text-sm font-medium text-white outline-none py-2"
                          />
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            ) : (
              /* ================= PAGE 2: RULES & CATEGORY ================= */
              <View>
                {/* Back to Players Link */}
                <PressableScale
                  onPress={() => transitionToStep('landing')}
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel="Back to roster"
                  className="py-2 self-start mb-4 flex-row items-center gap-1 min-h-[44px]"
                >
                  <Text className="text-xs font-mono font-bold text-blue-400">
                    ← BACK TO ROSTER
                  </Text>
                </PressableScale>

                <View className="mb-6">
                  <Text className="text-3xl font-black text-white tracking-tight">
                    Game Rules
                  </Text>
                  <Text className="text-xs text-neutral-400 font-mono mt-0.5">
                    {playerCount} Players • {imposterCount} Imposter{imposterCount > 1 ? 's' : ''}
                  </Text>
                </View>

                {/* Game Mode Selector */}
                <View className="mb-6" accessibilityRole="radiogroup">
                  <Text className="text-xs font-mono uppercase text-neutral-400 font-bold mb-2">
                    DEAL MODE
                  </Text>
                  <View className="border border-neutral-800 divide-y divide-neutral-800 bg-neutral-950">
                    {MODES.map((m) => {
                      const active = selectedMode === m.id;
                      return (
                        <PressableScale
                          key={m.id}
                          onPress={() => setSelectedMode(m.id)}
                          haptic="selection"
                          activeScale={0.98}
                          accessibilityRole="radio"
                          accessibilityState={{ checked: active }}
                          accessibilityLabel={m.label}
                          className={`p-4 flex-row items-center justify-between min-h-[56px] ${
                            active ? 'bg-neutral-900' : 'bg-transparent'
                          }`}
                        >
                          <View className="flex-1 pr-3">
                            <Text
                              className={`text-sm font-bold ${
                                active ? 'text-blue-400' : 'text-neutral-200'
                              }`}
                            >
                              {m.title}
                            </Text>
                            <Text className="text-xs text-neutral-400 mt-0.5 font-mono">
                              {m.subtitle}
                            </Text>
                          </View>
                          <View
                            className={`w-4 h-4 rounded-full items-center justify-center ${
                              active
                                ? 'border border-blue-500 bg-blue-500'
                                : 'border border-neutral-700'
                            }`}
                          >
                            {active && <View className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </View>
                        </PressableScale>
                      );
                    })}
                  </View>
                </View>

                {/* Category Matrix */}
                <View className="mb-6">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-xs font-mono uppercase text-neutral-400 font-bold">
                      CATEGORY
                    </Text>
                    <Text className="text-[10px] font-mono text-blue-400">
                      840 MASTER PAIRS
                    </Text>
                  </View>

                  {/* Featured All Categories Option */}
                  <PressableScale
                    onPress={() => setSelectedCategory('All Categories')}
                    haptic="selection"
                    activeScale={0.98}
                    accessibilityRole="button"
                    accessibilityLabel="All categories random deck"
                    className={`p-4 mb-2 border flex-row items-center justify-between min-h-[56px] ${
                      selectedCategory === 'All Categories'
                        ? 'border-blue-500 bg-blue-600/10'
                        : 'border-neutral-800 bg-neutral-950'
                    }`}
                  >
                    <View>
                      <Text
                        className={`text-xs font-mono font-bold ${
                          selectedCategory === 'All Categories' ? 'text-blue-400' : 'text-white'
                        }`}
                      >
                        ALL CATEGORIES (RANDOM DECK)
                      </Text>
                      <Text className="text-[10px] font-mono text-neutral-500 mt-0.5">
                        Pulls randomly across all 8 master categories
                      </Text>
                    </View>
                    <Text className="text-xs font-mono font-bold text-neutral-400">
                      840 PAIRS
                    </Text>
                  </PressableScale>

                  {/* 8 Distinct Categories - meeting 48px touch targets */}
                  <View className="flex-row flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const active = selectedCategory === cat;
                      return (
                        <PressableScale
                          key={cat}
                          onPress={() => setSelectedCategory(cat)}
                          haptic="selection"
                          activeScale={0.96}
                          accessibilityRole="button"
                          accessibilityLabel={`${cat} category with 105 pairs`}
                          className={`px-4 py-3 border min-h-[48px] items-center justify-center ${
                            active
                              ? 'border-blue-500 bg-blue-600/10'
                              : 'border-neutral-800 bg-neutral-950'
                          }`}
                        >
                          <Text
                            className={`text-xs font-mono ${
                              active ? 'text-blue-400 font-bold' : 'text-neutral-400'
                            }`}
                          >
                            {cat}
                          </Text>
                        </PressableScale>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* Sticky Bottom Action Bar */}
        <View className="px-5 py-3 border-t border-neutral-900 bg-black">
          {currentStep === 'landing' ? (
            <PressableScale
              onPress={() => transitionToStep('rules')}
              haptic="medium"
              activeScale={0.98}
              accessibilityRole="button"
              accessibilityLabel="Proceed to game rules and category"
              className="w-full h-14 bg-white items-center justify-center"
            >
              <Text className="text-xs font-black text-black uppercase tracking-widest">
                GAME RULES & CATEGORY →
              </Text>
            </PressableScale>
          ) : (
            <PressableScale
              onPress={startNewGame}
              haptic="medium"
              activeScale={0.98}
              accessibilityRole="button"
              accessibilityLabel="Start game and begin secret deal"
              className="w-full h-14 bg-white items-center justify-center"
            >
              <Text className="text-xs font-black text-black uppercase tracking-widest">
                START GAME →
              </Text>
            </PressableScale>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
