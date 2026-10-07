import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MasqueradeFlow } from '@/components/live/MasqueradeFlow';
import { STAGE } from '@/components/live/masqueradeTheme';

export default function HomeScreen() {
  return <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: STAGE.bg }}><MasqueradeFlow /></SafeAreaView>;
}
