import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { PressableScale } from '@/components/common';

export const GameOverScreen: React.FC = () => {
  const {
    winner,
    players,
    activeWordEntry,
    selectedMode,
    resetGameKeepSetup,
    backToSetup,
  } = useGameStore();

  const isCitizensWin = winner === 'citizens';

  return (
    <View className="flex-1 bg-black px-5 pt-6 pb-8 justify-between max-w-md w-full self-center">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Banner */}
        <View className="items-center mt-6 border-b border-neutral-800 pb-6">
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
        </View>

        {/* Post-Game Truth Reveal */}
        {activeWordEntry && (
          <View className="mt-6 border border-neutral-800 bg-neutral-950 p-4">
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
          </View>
        )}

        {/* Players Roster */}
        <View className="mt-6">
          <Text className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2 font-bold">
            ROSTER IDENTITIES
          </Text>
          <View className="border border-neutral-800 divide-y divide-neutral-800 bg-neutral-950">
            {players.map((p, idx) => (
              <View
                key={p.id}
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
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Persistence & New Game Actions */}
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
