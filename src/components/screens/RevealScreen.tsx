import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/gameStore';
import { PressableScale, triggerHaptic } from '@/components/common';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export const RevealScreen: React.FC = () => {
  const {
    players,
    currentRevealIndex,
    selectedMode,
    nextReveal,
    finishRevealAndStartDiscussion,
  } = useGameStore();

  const insets = useSafeAreaInsets();
  const [hasInspected, setHasInspected] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const currentPlayer = players[currentRevealIndex];
  const isLastPlayer = currentRevealIndex >= players.length - 1;
  const isImposter = currentPlayer?.role === 'imposter';

  const reducedMotion = useReducedMotion();

  // Reveal spring: 0 = hidden, 1 = revealed
  const revealProgress = useSharedValue(0);

  // Animated progress bar
  const progressWidth = useSharedValue(
    ((currentRevealIndex + 1) / (players.length || 1)) * 100
  );

  useEffect(() => {
    progressWidth.set(
      withTiming(((currentRevealIndex + 1) / (players.length || 1)) * 100, {
        duration: 200,
        easing: EASE_OUT,
      })
    );
  }, [currentRevealIndex, players.length]);

  // Reset inspection state when switching players
  useEffect(() => {
    setHasInspected(false);
    setIsHolding(false);
    revealProgress.set(0);
  }, [currentRevealIndex]);

  if (!currentPlayer) return null;

  const handlePressIn = () => {
    setIsHolding(true);
    setHasInspected(true);
    triggerHaptic('medium');

    if (reducedMotion) {
      revealProgress.set(1);
    } else {
      revealProgress.set(
        withSpring(1, {
          duration: 180,
          dampingRatio: 0.85,
        })
      );
    }
  };

  const handlePressOut = () => {
    setIsHolding(false);
    triggerHaptic('light');

    if (reducedMotion) {
      revealProgress.set(0);
    } else {
      // Instant snap-shut to prevent peeking
      revealProgress.set(
        withSpring(0, {
          duration: 120,
          dampingRatio: 1,
        })
      );
    }
  };

  const handleNext = () => {
    if (isLastPlayer) {
      finishRevealAndStartDiscussion();
    } else {
      nextReveal();
    }
  };

  // UI-thread animated styles
  const coverAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(revealProgress.get(), [0, 0.4], [1, 0]);
    const scale = interpolate(revealProgress.get(), [0, 1], [1, 0.98]);
    return {
      opacity,
      transform: [{ scale }],
      pointerEvents: revealProgress.get() > 0.5 ? 'none' : 'auto',
    };
  });

  const secretAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(revealProgress.get(), [0.3, 1], [0, 1]);
    const scale = interpolate(revealProgress.get(), [0, 1], [0.98, 1]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.get()}%`,
  }));

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
      {/* Top Header & Animated Progress */}
      <View>
        <View className="flex-row items-center justify-between pb-3 border-b border-neutral-800 mb-3">
          <Text className="text-sm font-black tracking-widest text-white uppercase">
            SUSPICION
          </Text>
          <Text className="text-xs font-mono text-neutral-500">
            {String(currentRevealIndex + 1).padStart(2, '0')} /{' '}
            {String(players.length).padStart(2, '0')}
          </Text>
        </View>

        {/* Hairline Progress Bar */}
        <View className="w-full h-1 bg-neutral-900 overflow-hidden">
          <Animated.View
            className="h-full bg-blue-500"
            style={progressBarAnimatedStyle}
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

        {/* Option B: Hold-to-Reveal Card (Strictly Bounded) */}
        <View className="w-full mt-8 h-64 relative overflow-hidden">
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessibilityRole="button"
            accessibilityLabel={`Hold to peek role for ${currentPlayer.name}. Release to conceal.`}
            className="w-full h-full"
          >
            {/* Secret Content Layer (Visible only while finger is down) */}
            <Animated.View
              style={secretAnimatedStyle}
              className={`absolute inset-0 border items-center justify-center p-6 bg-neutral-950 overflow-hidden ${
                isImposter ? 'border-red-500/80' : 'border-blue-500'
              }`}
            >
              <View
                className={`px-3 py-1 mb-4 border ${
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

              <Text className="text-[10px] font-mono text-neutral-500 mt-5 uppercase tracking-widest">
                RELEASE FINGER TO CONCEAL
              </Text>
            </Animated.View>

            {/* Hidden Cover Layer (Default state) */}
            <Animated.View
              style={coverAnimatedStyle}
              className="absolute inset-0 border border-neutral-800 bg-neutral-950 items-center justify-center p-6 overflow-hidden"
            >
              <Text className="text-xs font-mono uppercase text-neutral-500 tracking-widest font-bold mb-3">
                [ PRIVATE CARD ]
              </Text>
              <Text className="text-xl font-black text-white tracking-wider">
                HOLD TO PEEK
              </Text>
              <Text className="text-[10px] font-mono text-neutral-600 mt-3 uppercase tracking-wider">
                {hasInspected ? 'VERIFIED // HOLD TO RE-PEEK' : 'PRESS & HOLD THUMB'}
              </Text>
            </Animated.View>
          </Pressable>
        </View>

        {/* Status Indicator */}
        <Text className="text-[10px] font-mono text-neutral-600 mt-4 uppercase">
          {isHolding
            ? 'PEEKING ACTIVE'
            : hasInspected
            ? 'CARD CONCEALED • READY TO PASS'
            : 'CARD LOCKED'}
        </Text>
      </View>

      {/* Action Footer permanently docked */}
      <View>
        <PressableScale
          disabled={!hasInspected}
          onPress={handleNext}
          haptic="medium"
          activeScale={0.98}
          accessibilityRole="button"
          accessibilityLabel={isLastPlayer ? 'Start discussion' : 'Next player'}
          className={`w-full h-14 items-center justify-center ${
            hasInspected
              ? 'bg-white'
              : 'bg-neutral-900 border border-neutral-800 opacity-30'
          }`}
        >
          <Text
            className={`text-xs font-black uppercase tracking-widest ${
              hasInspected ? 'text-black' : 'text-neutral-500'
            }`}
          >
            {isLastPlayer ? 'START DISCUSSION →' : 'NEXT PLAYER →'}
          </Text>
        </PressableScale>
      </View>
    </View>
  );
};
