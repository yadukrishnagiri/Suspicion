import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useGameStore } from '@/store/gameStore';
import { PressableScale, triggerHaptic } from '@/components/common';

export const RevealScreen: React.FC = () => {
  const {
    players,
    currentRevealIndex,
    selectedMode,
    nextReveal,
    finishRevealAndStartDiscussion,
  } = useGameStore();

  const [isRevealed, setIsRevealed] = useState(false);

  const currentPlayer = players[currentRevealIndex];
  const isLastPlayer = currentRevealIndex >= players.length - 1;

  if (!currentPlayer) return null;

  const handleReveal = () => {
    triggerHaptic('medium');
    setIsRevealed(true);
  };

  const handleHide = () => {
    triggerHaptic('light');
    setIsRevealed(false);
  };

  const handleNext = () => {
    setIsRevealed(false);
    if (isLastPlayer) {
      finishRevealAndStartDiscussion();
    } else {
      nextReveal();
    }
  };

  const isImposter = currentPlayer.role === 'imposter';

  return (
    <View className="flex-1 bg-black px-5 pt-6 justify-between pb-8 max-w-md w-full self-center">
      {/* Top Header & Progress */}
      <View>
        <View className="flex-row items-center justify-between pb-3 border-b border-neutral-800 mb-3">
          <Text className="text-sm font-black tracking-widest text-white uppercase">
            SUSPICION
          </Text>
          <Text className="text-xs font-mono text-neutral-500">
            {String(currentRevealIndex + 1).padStart(2, '0')} / {String(players.length).padStart(2, '0')}
          </Text>
        </View>

        {/* Hairline Progress Bar */}
        <View className="w-full h-1 bg-neutral-900 overflow-hidden">
          <View
            className="h-full bg-blue-500"
            style={{
              width: `${((currentRevealIndex + 1) / players.length) * 100}%`,
            }}
          />
        </View>
      </View>

      {/* Center Pass Instruction */}
      <View className="items-center my-auto w-full">
        <Text className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
          PASS DEVICE TO
        </Text>
        <Text className="text-4xl font-black text-white mt-1 uppercase text-center tracking-tight">
          {currentPlayer.name}
        </Text>

        {/* Secret Card */}
        <View className="w-full mt-8">
          {!isRevealed ? (
            <PressableScale
              onPress={handleReveal}
              haptic="none"
              activeScale={0.96}
              accessibilityRole="button"
              accessibilityLabel={`Reveal secret assignment for ${currentPlayer.name}`}
              className="w-full h-64 border border-neutral-800 bg-neutral-950 items-center justify-center p-6"
            >
              <Text className="text-xs font-mono uppercase text-neutral-500 tracking-widest font-bold mb-3">
                [ PRIVATE CARD ]
              </Text>
              <Text className="text-lg font-black text-white tracking-wider">
                TAP TO REVEAL
              </Text>
            </PressableScale>
          ) : (
            <View
              className={`w-full h-64 border items-center justify-center p-6 bg-neutral-950 ${
                isImposter ? 'border-red-500/80' : 'border-blue-500'
              }`}
            >
              <View
                className={`px-2.5 py-1 mb-4 border ${
                  isImposter
                    ? 'border-red-500 bg-red-950/30'
                    : 'border-blue-500 bg-blue-950/30'
                }`}
              >
                <Text
                  className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                    isImposter ? 'text-red-400' : 'text-blue-400'
                  }`}
                >
                  {isImposter ? 'IMPOSTER' : 'CITIZEN'}
                </Text>
              </View>

              {currentPlayer.assignedWordOrHint ? (
                <>
                  <Text className="text-3xl font-black text-white text-center uppercase tracking-wider">
                    {currentPlayer.assignedWordOrHint}
                  </Text>
                  {isImposter && selectedMode === 'imposter_gets_clue' && (
                    <Text className="text-xs font-mono text-blue-300 mt-2 text-center uppercase tracking-wider">
                      INDIRECT CLUE
                    </Text>
                  )}
                </>
              ) : (
                <View className="items-center">
                  <Text className="text-2xl font-black text-red-500 text-center uppercase tracking-wider">
                    BLIND IMPOSTER
                  </Text>
                  <Text className="text-xs font-mono text-neutral-500 mt-1 uppercase tracking-wider">
                    NO CLUE
                  </Text>
                </View>
              )}

              <PressableScale
                onPress={handleHide}
                haptic="light"
                activeScale={0.94}
                accessibilityRole="button"
                accessibilityLabel="Hide card"
                className="mt-6 py-2 px-4 border border-neutral-800 bg-neutral-900 min-h-[40px] items-center justify-center"
              >
                <Text className="text-xs font-mono text-neutral-400 uppercase font-bold">
                  HIDE CARD
                </Text>
              </PressableScale>
            </View>
          )}
        </View>
      </View>

      {/* Action Footer */}
      <View>
        <PressableScale
          disabled={!isRevealed}
          onPress={handleNext}
          haptic="medium"
          activeScale={0.98}
          accessibilityRole="button"
          accessibilityLabel={isLastPlayer ? 'Start discussion' : 'Next player'}
          className={`w-full h-14 items-center justify-center ${
            isRevealed
              ? 'bg-white'
              : 'bg-neutral-900 border border-neutral-800 opacity-30'
          }`}
        >
          <Text
            className={`text-xs font-black uppercase tracking-widest ${
              isRevealed ? 'text-black' : 'text-neutral-500'
            }`}
          >
            {isLastPlayer ? 'START DISCUSSION →' : 'NEXT PLAYER →'}
          </Text>
        </PressableScale>
      </View>
    </View>
  );
};
