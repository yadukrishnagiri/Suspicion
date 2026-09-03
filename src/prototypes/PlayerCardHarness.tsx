import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlayerCardNoir } from './variants/PlayerCardNoir';
import { PlayerCardDossier } from './variants/PlayerCardDossier';
import { PlayerCardPartyGrid } from './variants/PlayerCardPartyGrid';
import { Player } from '@/types/game';

const SAMPLE_PLAYERS: Player[] = [
  { id: '1', name: 'Alex', role: 'citizen', isEliminated: false, assignedWordOrHint: 'Pizza' },
  { id: '2', name: 'Jordan', role: 'imposter', isEliminated: false, assignedWordOrHint: 'Burger' },
  { id: '3', name: 'Sam', role: 'citizen', isEliminated: true, assignedWordOrHint: 'Pizza' },
  { id: '4', name: 'Taylor', role: 'imposter', isEliminated: true, assignedWordOrHint: 'Taco' },
  { id: '5', name: 'Casey', role: 'citizen', isEliminated: false, assignedWordOrHint: 'Pizza' },
];

const VARIANTS = [
  { id: 'noir', name: 'Noir Suspicion', axis: 'Atmospheric Glassmorphism', component: PlayerCardNoir },
  { id: 'dossier', name: 'Classified Dossier', axis: 'Tactical Monospace', component: PlayerCardDossier },
  { id: 'party', name: 'Party Playful', axis: 'Vibrant & Accessible', component: PlayerCardPartyGrid },
];

export default function PrototypeHarness() {
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [players, setPlayers] = useState<Player[]>(SAMPLE_PLAYERS);
  const [lastNotice, setLastNotice] = useState<string | null>(null);

  // Keyboard shortcut support on web
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= VARIANTS.length) {
        setActiveVariantIndex(num - 1);
      } else if (e.key === 'ArrowRight') {
        setActiveVariantIndex((prev) => (prev + 1) % VARIANTS.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveVariantIndex((prev) => (prev - 1 + VARIANTS.length) % VARIANTS.length);
      } else if (e.key === 'r' || e.key === 'R') {
        setPlayers(SAMPLE_PLAYERS);
        setLastNotice('Reset all cards');
        setTimeout(() => setLastNotice(null), 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEliminate = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          const eliminated = { ...p, isEliminated: true };
          setLastNotice(
            eliminated.role === 'imposter'
              ? `🎯 ${p.name} was an IMPOSTOR!`
              : `🛡️ ${p.name} was NOT the Impostor (Citizen)`
          );
          setTimeout(() => setLastNotice(null), 3500);
          return eliminated;
        }
        return p;
      })
    );
  };

  const handleResetCards = () => {
    setPlayers(SAMPLE_PLAYERS);
    setLastNotice('Reset cards');
    setTimeout(() => setLastNotice(null), 1500);
  };

  const ActiveComponent = VARIANTS[activeVariantIndex].component;

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        className="flex-1 px-4 pt-4 max-w-lg w-full self-center"
      >
        {/* Context Header: Discussion Phase Simulation */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-semibold tracking-widest text-amber-500 uppercase">
                Phase 3 • Discussion & Voting
              </Text>
              <Text className="text-2xl font-black text-white mt-1">
                Active Participants
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleResetCards}
              className="bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700"
            >
              <Text className="text-xs font-medium text-neutral-300">Reset State (R)</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-xs text-neutral-400 mt-2">
            The group speaks one word each in real life. When ready to vote, tap a player card to reveal their role.
          </Text>

          {lastNotice && (
            <View className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <Text className="text-xs font-bold text-amber-300 text-center">{lastNotice}</Text>
            </View>
          )}
        </View>

        {/* Render Variant Cards */}
        {players.map((p) => (
          <ActiveComponent
            key={p.id}
            player={p}
            isDiscussionStarter={p.id === '1'} // Alex starts discussion
            onEliminate={handleEliminate}
          />
        ))}

        <View className="mt-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <Text className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
            Current Variant: {VARIANTS[activeVariantIndex].name}
          </Text>
          <Text className="text-xs text-neutral-500">
            Axis: {VARIANTS[activeVariantIndex].axis}
          </Text>
        </View>
      </ScrollView>

      {/* Floating Prototype Picker from PICKER.md */}
      <View
        className="absolute bottom-6 self-center flex-row items-center p-1 rounded-full bg-neutral-900/95 border border-white/10 shadow-2xl"
        style={{
          zIndex: 999999,
        }}
      >
        {VARIANTS.map((v, i) => (
          <TouchableOpacity
            key={v.id}
            onPress={() => setActiveVariantIndex(i)}
            className={`px-3 py-1.5 rounded-full ${
              activeVariantIndex === i ? 'bg-white/20' : 'bg-transparent'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                activeVariantIndex === i ? 'text-white' : 'text-neutral-400'
              }`}
            >
              {v.name}
            </Text>
          </TouchableOpacity>
        ))}

        <View className="w-[1px] h-4 bg-white/15 mx-1" />

        <TouchableOpacity
          onPress={handleResetCards}
          className="px-2.5 py-1.5 rounded-full"
        >
          <Text className="text-neutral-400 font-bold text-xs">↻</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
