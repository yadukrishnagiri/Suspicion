import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/gameStore';
import { SetupScreen } from '@/components/screens/SetupScreen';
import { RevealScreen } from '@/components/screens/RevealScreen';
import { DiscussionScreen } from '@/components/screens/DiscussionScreen';
import { GameOverScreen } from '@/components/screens/GameOverScreen';

export default function HomeScreen() {
  const { phase } = useGameStore();

  return (
    <SafeAreaView className="flex-1 bg-black">
      {phase === 'setup' && <SetupScreen />}
      {phase === 'reveal' && <RevealScreen />}
      {phase === 'discussion' && <DiscussionScreen />}
      {phase === 'game_over' && <GameOverScreen />}
    </SafeAreaView>
  );
}
