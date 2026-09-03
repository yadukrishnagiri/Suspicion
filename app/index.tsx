import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { useGameStore } from '@/store/gameStore';
import { SetupScreen } from '@/components/screens/SetupScreen';
import { RevealScreen } from '@/components/screens/RevealScreen';
import { DiscussionScreen } from '@/components/screens/DiscussionScreen';
import { GameOverScreen } from '@/components/screens/GameOverScreen';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export default function HomeScreen() {
  const { phase } = useGameStore();
  const reducedMotion = useReducedMotion();

  const enterAnim = reducedMotion
    ? FadeIn.duration(150)
    : FadeIn.duration(200).easing(EASE_OUT);

  const exitAnim = reducedMotion
    ? FadeOut.duration(100)
    : FadeOut.duration(150).easing(EASE_OUT);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, width: '100%', height: '100%', backgroundColor: '#000000', overflow: 'hidden' }}
    >
      <View style={{ flex: 1, width: '100%', height: '100%', overflow: 'hidden' }}>
        {phase === 'setup' && (
          <Animated.View
            key="setup"
            entering={enterAnim}
            exiting={exitAnim}
            style={{ flex: 1, width: '100%', height: '100%' }}
          >
            <SetupScreen />
          </Animated.View>
        )}
        {phase === 'reveal' && (
          <Animated.View
            key="reveal"
            entering={enterAnim}
            exiting={exitAnim}
            style={{ flex: 1, width: '100%', height: '100%' }}
          >
            <RevealScreen />
          </Animated.View>
        )}
        {phase === 'discussion' && (
          <Animated.View
            key="discussion"
            entering={enterAnim}
            exiting={exitAnim}
            style={{ flex: 1, width: '100%', height: '100%' }}
          >
            <DiscussionScreen />
          </Animated.View>
        )}
        {phase === 'game_over' && (
          <Animated.View
            key="game_over"
            entering={enterAnim}
            exiting={exitAnim}
            style={{ flex: 1, width: '100%', height: '100%' }}
          >
            <GameOverScreen />
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}
