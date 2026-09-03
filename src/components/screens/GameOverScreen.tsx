import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, {
  FadeInDown,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/gameStore';
import { PressableScale } from '@/components/common';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export const GameOverScreen: React.FC = () => {
  const {
    winner,
    players,
    activeWordEntry,
    selectedMode,
    resetGameKeepSetup,
    backToSetup,
  } = useGameStore();

  const insets = useSafeAreaInsets();
  const isCitizensWin = winner === 'citizens';
  const reducedMotion = useReducedMotion();

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        paddingBottom: Math.max(insets.bottom, 16),
      }}
      className="bg-black px-5 pt-6 justify-between max-w-md w-full self-center"
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Banner with Climax Entrance */}
        <Animated.View
          entering={
            reducedMotion
              ? undefined
              : FadeInDown.duration(250).easing(EASE_OUT)
          }
          className="items-center mt-6 border-b border-neutral-800 pb-6"
        >
          <Text
            className={`text-xs font-mono font-bold uppercase tracking-widest ${
              isCitizensWin ? 'text-blue-400' : 'text-red-500'
            }`}
          >
            GAME OVER // VERDICT
          </Text>

          <Text className="text-4xl font-black text-white text-center mt-2 tracking-tight">
            {isCitizensWin ? 'CITIZENS WIN' : 'IMPOSTORS WIN'}
          </Text>

          <Text className="text-xs font-mono text-neutral-400 text-center mt-2">
            {isCitizensWin
              ? 'All impostors identified and eliminated.'
              : 'Impostors achieved parity with active citizens.'}
          </Text>
        </Animated.View>

        {/* Post-Game Truth Reveal (Staggered) */}
        {activeWordEntry && (
          <Animated.View
            entering={
              reducedMotion
                ? undefined
                : FadeInDown.duration(250).delay(80).easing(EASE_OUT)
            }
            className="mt-6 border border-neutral-800 bg-neutral-950 p-4"
          >
            <Text className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-3 font-bold">
              TRUTH REVEAL
            </Text>

            <View className="flex-row items-center justify-between pb-3 border-b border-neutral-900">
              <Text className="text-xs font-mono text-neutral-400 uppercase">CITIZEN WORD</Text>
              <Text className="text-base font-black font-mono text-white uppercase">
                {activeWordEntry.mainWord}
              </Text>
            </View>

            {selectedMode === 'everyone_gets_word' && (
              <View className="flex-row items-center justify-between py-3 border-b border-neutral-900">
                <Text className="text-xs font-mono text-neutral-400 uppercase">IMPOSTER WORD</Text>
                <Text className="text-base font-black font-mono text-red-500 uppercase">
                  {activeWordEntry.imposterWord}
                </Text>
              </View>
            )}

            {selectedMode === 'imposter_gets_clue' && (
              <View className="flex-row items-center justify-between py-3 border-b border-neutral-900">
                <Text className="text-xs font-mono text-neutral-400 uppercase">IMPOSTER CLUE</Text>
                <Text className="text-sm font-bold font-mono text-blue-400 uppercase">
                  "{activeWordEntry.imposterHint}"
                </Text>
              </View>
            )}

            <View className="flex-row items-center justify-between pt-3">
              <Text className="text-xs font-mono text-neutral-400 uppercase">CATEGORY</Text>
              <Text className="text-xs font-mono text-neutral-300 uppercase">
                {activeWordEntry.category}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Players Roster (Cascading Reveal) */}
        <View className="mt-6">
          <Text className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2 font-bold">
            ROSTER IDENTITIES
          </Text>
          <View className="border border-neutral-800 divide-y divide-neutral-800 bg-neutral-950">
            {players.map((p, idx) => (
              <Animated.View
                key={p.id}
                entering={
                  reducedMotion
                    ? undefined
                    : FadeInDown.duration(180).delay(100 + idx * 35)
                }
                className="flex-row items-center justify-between py-3 px-3"
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs font-mono text-neutral-500">
                    {String(idx + 1).padStart(2, '0')}
                  </Text>
                  <Text className="text-sm font-bold text-white">{p.name}</Text>
                </View>
                <Text
                  className={`text-[10px] font-mono font-bold uppercase ${
                    p.role === 'imposter' ? 'text-red-400' : 'text-blue-400'
                  }`}
                >
                  [{p.role === 'imposter' ? 'IMPOSTER' : 'CITIZEN'}]
                </Text>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Persistence & New Game Actions permanently docked */}
      <View className="gap-2.5 pt-4 border-t border-neutral-900">
        <PressableScale
          onPress={resetGameKeepSetup}
          haptic="medium"
          activeScale={0.98}
          accessibilityRole="button"
          accessibilityLabel="Play again with same players"
          className="w-full h-14 bg-white items-center justify-center min-h-[56px]"
        >
          <Text className="text-xs font-black font-mono text-black uppercase tracking-widest">
            PLAY AGAIN (SAME PLAYERS) →
          </Text>
        </PressableScale>

        <PressableScale
          onPress={backToSetup}
          haptic="light"
          activeScale={0.98}
          accessibilityRole="button"
          accessibilityLabel="Edit setup and rules"
          className="w-full h-12 border border-neutral-800 bg-neutral-950 items-center justify-center min-h-[48px]"
        >
          <Text className="text-xs font-mono font-bold text-neutral-400 uppercase">
            EDIT SETUP / RULES
          </Text>
        </PressableScale>
      </View>
    </View>
  );
};
