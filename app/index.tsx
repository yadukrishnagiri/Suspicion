import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LedgerFlow, LEDGER } from '@/components/live/LedgerFlow';

export default function HomeScreen() {
  return <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: LEDGER.bg }}><LedgerFlow /></SafeAreaView>;
}
