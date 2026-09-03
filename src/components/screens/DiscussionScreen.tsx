import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
  Easing,
  useReducedMotion,
  withTiming,
  EntryAnimationsValues,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/gameStore';
import { Player } from '@/types/game';
import { PlayerCardSwiss } from '@/components/PlayerCardSwiss';
import { PressableScale, triggerHaptic } from '@/components/common';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

// Custom Dialog Entrance: Starts from scale(0.96) + opacity 0 (Eliminating scale(0))
function DialogEnter(_targetValues: EntryAnimationsValues) {
  'worklet';
  return {
    initialValues: {
      opacity: 0,
      transform: [{ scale: 0.96 }],
    },
    animations: {
      opacity: withTiming(1, { duration: 180, easing: EASE_OUT }),
      transform: [{ scale: withTiming(1, { duration: 180, easing: EASE_OUT }) }],
    },
  };
}

export const DiscussionScreen: React.FC = () => {
  const {
    players,
    discussionStarterId,
    lastEliminatedPlayer,
    clearLastEliminated,
    eliminatePlayer,
    backToSetup,
  } = useGameStore();

  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const [confirmPlayer, setConfirmPlayer] = useState<Player | null>(null);

  const activeCitizens = players.filter((p) => !p.isEliminated && p.role === 'citizen').length;
  const activeImposters = players.filter((p) => !p.isEliminated && p.role === 'imposter').length;

  const starter = players.find((p) => p.id === discussionStarterId);

  // Dramatic haptic effect on elimination outcome
  useEffect(() => {
    if (lastEliminatedPlayer) {
      if (lastEliminatedPlayer.role === 'imposter') {
        triggerHaptic('success');
      } else {
        triggerHaptic('warning');
      }
    }
  }, [lastEliminatedPlayer]);

  return (
    <View style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }} className="bg-black">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 24, 40) }}
        className="px-5 pt-4 max-w-md w-full self-center"
      >
        {/* Top Header Bar */}
        <View className="flex-row items-center justify-between pb-3 border-b border-neutral-800 mb-5">
          <PressableScale
            onPress={backToSetup}
            haptic="light"
            activeScale={0.94}
            accessibilityRole="button"
            accessibilityLabel="Back to setup"
            className="py-1 px-2 -ml-2 min-h-[44px] justify-center"
          >
            <Text className="text-xs font-mono font-bold text-neutral-400 uppercase">
              ← SETUP
            </Text>
          </PressableScale>

          <View className="flex-row items-center gap-3">
            <Text className="text-xs font-mono font-bold text-white">
              {activeCitizens} CITIZEN{activeCitizens !== 1 ? 'S' : ''}
            </Text>
            <Text className="text-xs font-mono text-neutral-600">/</Text>
            <Text className="text-xs font-mono font-bold text-red-400">
              {activeImposters} IMPOSTER{activeImposters !== 1 ? 'S' : ''}
            </Text>
          </View>
        </View>

        {/* Discussion Starter Callout */}
        <Animated.View
          entering={reducedMotion ? undefined : FadeInDown.duration(200).easing(EASE_OUT)}
          className="border border-blue-500 bg-neutral-950 p-4 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
              FIRST TO SPEAK
            </Text>
            <View className="w-2 h-2 rounded-full bg-blue-500" />
          </View>
          <Text className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
            {starter?.name ?? 'Player'}
          </Text>
        </Animated.View>

        {/* Player Cards List in Entered Order */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-mono uppercase text-neutral-400 font-bold">
              PARTICIPANTS ({players.filter((p) => !p.isEliminated).length} ACTIVE)
            </Text>
            <Text className="text-[10px] font-mono text-neutral-600 uppercase">
              TAP TO VOTE OUT
            </Text>
          </View>

          <Animated.View
            layout={reducedMotion ? undefined : LinearTransition.duration(200)}
          >
            {players.map((p, idx) => (
              <PlayerCardSwiss
                key={p.id}
                player={p}
                index={idx}
                isDiscussionStarter={p.id === discussionStarterId}
                onVote={(selected) => setConfirmPlayer(selected)}
              />
            ))}
          </Animated.View>
        </View>
      </ScrollView>

      {/* Confirmation Overlay (Solid, Centered, Zero Bleed) */}
      {confirmPlayer && (
        <Animated.View
          entering={FadeIn.duration(150)}
          style={[
            StyleSheet.absoluteFill,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9998,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
            },
          ]}
        >
          <Animated.View
            entering={reducedMotion ? undefined : DialogEnter}
            style={{ maxWidth: 380, width: '100%' }}
            className="bg-neutral-950 border border-neutral-700 p-6 shadow-2xl"
          >
            <Text className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
              CONFIRM VOTE
            </Text>
            <Text className="text-3xl font-black text-white mt-1 uppercase tracking-tight">
              {confirmPlayer.name}
            </Text>
            <Text className="text-xs font-mono text-neutral-400 mt-2 uppercase tracking-wide">
              VOTE OUT THIS PLAYER?
            </Text>

            <View className="flex-row gap-3 mt-6">
              <PressableScale
                onPress={() => setConfirmPlayer(null)}
                haptic="light"
                activeScale={0.96}
                accessibilityRole="button"
                accessibilityLabel="Cancel elimination"
                className="flex-1 h-12 border border-neutral-700 items-center justify-center min-h-[48px]"
              >
                <Text className="text-xs font-mono font-bold text-neutral-400 uppercase">
                  CANCEL
                </Text>
              </PressableScale>
              <PressableScale
                onPress={() => {
                  const targetId = confirmPlayer.id;
                  setConfirmPlayer(null);
                  eliminatePlayer(targetId);
                }}
                haptic="warning"
                activeScale={0.96}
                accessibilityRole="button"
                accessibilityLabel="Confirm elimination"
                className="flex-1 h-12 bg-red-600 items-center justify-center min-h-[48px]"
              >
                <Text className="text-xs font-mono font-bold text-white uppercase">
                  CONFIRM
                </Text>
              </PressableScale>
            </View>
          </Animated.View>
        </Animated.View>
      )}

      {/* Role Reveal Verdict Overlay (Solid, Centered, Zero Bleed) */}
      {lastEliminatedPlayer && (
        <Animated.View
          entering={FadeIn.duration(150)}
          style={[
            StyleSheet.absoluteFill,
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
            },
          ]}
        >
          <Animated.View
            entering={reducedMotion ? undefined : DialogEnter}
            style={{ maxWidth: 380, width: '100%' }}
            className="bg-neutral-950 border border-neutral-700 p-6 items-center shadow-2xl"
          >
            <Text className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
              VERDICT
            </Text>
            <Text className="text-3xl font-black text-white mt-1 text-center uppercase tracking-tight">
              {lastEliminatedPlayer.name}
            </Text>

            <View
              className={`mt-4 w-full py-4 items-center border ${
                lastEliminatedPlayer.role === 'imposter'
                  ? 'border-red-500 bg-red-950/30'
                  : 'border-neutral-700 bg-neutral-900'
              }`}
            >
              <Text
                className={`text-lg font-black font-mono uppercase tracking-widest text-center ${
                  lastEliminatedPlayer.role === 'imposter'
                    ? 'text-red-500'
                    : 'text-neutral-300'
                }`}
              >
                {lastEliminatedPlayer.role === 'imposter'
                  ? 'IMPOSTER FOUND'
                  : 'NOT THE IMPOSTER'}
              </Text>
            </View>

            <PressableScale
              onPress={clearLastEliminated}
              haptic="medium"
              activeScale={0.97}
              accessibilityRole="button"
              accessibilityLabel="Continue round"
              className="mt-6 w-full h-12 bg-white items-center justify-center min-h-[48px]"
            >
              <Text className="text-xs font-black font-mono text-black uppercase tracking-widest">
                CONTINUE ROUND →
              </Text>
            </PressableScale>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};
