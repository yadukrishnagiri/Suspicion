import React, { useEffect } from 'react';
import { View, Text, ScrollView, Modal } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { PlayerCardSwiss } from '@/components/PlayerCardSwiss';
import { PressableScale, triggerHaptic } from '@/components/common';

export const DiscussionScreen: React.FC = () => {
  const {
    players,
    discussionStarterId,
    lastEliminatedPlayer,
    clearLastEliminated,
    eliminatePlayer,
    backToSetup,
  } = useGameStore();

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
    <View className="flex-1 bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-5 pt-4 max-w-md w-full self-center"
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
        <View className="border border-blue-500 bg-neutral-950 p-4 mb-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
              FIRST TO SPEAK
            </Text>
            <View className="w-2 h-2 rounded-full bg-blue-500" />
          </View>
          <Text className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
            {starter?.name ?? 'Player'}
          </Text>
        </View>

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

          {players.map((p, idx) => (
            <PlayerCardSwiss
              key={p.id}
              player={p}
              index={idx}
              isDiscussionStarter={p.id === discussionStarterId}
              onEliminate={eliminatePlayer}
            />
          ))}
        </View>
      </ScrollView>

      {/* Role Reveal Modal on Elimination */}
      <Modal
        visible={!!lastEliminatedPlayer}
        transparent
        animationType="fade"
        onRequestClose={clearLastEliminated}
      >
        <View className="flex-1 bg-black/90 items-center justify-center p-6">
          <View className="w-full max-w-sm bg-black border border-neutral-700 p-6 items-center">
            <Text className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
              VERDICT
            </Text>
            <Text className="text-3xl font-black text-white mt-1 text-center uppercase">
              {lastEliminatedPlayer?.name}
            </Text>

            <View
              className={`mt-4 w-full py-4 items-center border ${
                lastEliminatedPlayer?.role === 'imposter'
                  ? 'border-red-500 bg-red-950/30'
                  : 'border-neutral-700 bg-neutral-900'
              }`}
            >
              <Text
                className={`text-lg font-black font-mono uppercase tracking-widest text-center ${
                  lastEliminatedPlayer?.role === 'imposter'
                    ? 'text-red-500'
                    : 'text-neutral-300'
                }`}
              >
                {lastEliminatedPlayer?.role === 'imposter'
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
          </View>
        </View>
      </Modal>
    </View>
  );
};
