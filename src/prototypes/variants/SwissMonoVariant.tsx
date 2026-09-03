import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GameCategory } from '@/types/game';

const CATEGORIES: GameCategory[] = [
  'Concepts & Weather',
  'Food & Drinks',
  'Animals & Nature',
  'Everyday Objects',
  'Places & Travel',
  'Sports & Activities',
  'Occupations',
  'Pop Culture & Media',
];

export const SwissMonoVariant: React.FC = () => {
  const [screen, setScreen] = useState<'landing' | 'rules'>('landing');
  const [playerCount, setPlayerCount] = useState(5);
  const [imposterCount, setImposterCount] = useState(1);
  const [names, setNames] = useState<string[]>([
    'Morgan',
    'Robin',
    'Quinn',
    'Avery',
    'Jordan',
  ]);
  const [mode, setMode] = useState<'everyone_gets_word' | 'imposter_gets_clue' | 'blind_imposter'>(
    'everyone_gets_word'
  );
  const [category, setCategory] = useState<string>('All Categories');
  const [gameStarted, setGameStarted] = useState(false);

  const maxImposters = Math.max(1, Math.floor((playerCount - 1) / 2));

  const handlePlayerChange = (newCount: number) => {
    const clamped = Math.max(3, Math.min(15, newCount));
    setPlayerCount(clamped);
    const newMax = Math.max(1, Math.floor((clamped - 1) / 2));
    if (imposterCount > newMax) setImposterCount(newMax);

    setNames((prev) => {
      const updated = [...prev];
      if (updated.length < clamped) {
        for (let i = updated.length; i < clamped; i++) {
          updated.push(`Player ${i + 1}`);
        }
      } else {
        return updated.slice(0, clamped);
      }
      return updated;
    });
  };

  const handleImposterChange = (newCount: number) => {
    const clamped = Math.max(1, Math.min(maxImposters, newCount));
    setImposterCount(clamped);
  };

  const handleNameChange = (index: number, val: string) => {
    setNames((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-black"
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        className="flex-1 px-5 pt-4 max-w-md w-full self-center"
      >
        {/* Top Minimalist Brand */}
        <View className="flex-row items-center justify-between pb-3 border-b border-neutral-800 mb-5">
          <Text className="text-sm font-black tracking-widest text-white uppercase">
            SUSPICION
          </Text>
          <Text className="text-xs font-mono text-neutral-500">
            {screen === 'landing' ? '01 / CONFIG' : '02 / RULES'}
          </Text>
        </View>

        {screen === 'landing' ? (
          /* ================= PAGE 1: LANDING & NAMES ================= */
          <View>
            {/* Bold Typographic Metric Row */}
            <View className="flex-row border border-neutral-800 divide-x divide-neutral-800 mb-6 bg-neutral-950">
              {/* Players Block */}
              <View className="flex-1 p-4">
                <Text className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
                  PLAYERS
                </Text>
                <Text className="text-4xl font-black text-white my-1">
                  {playerCount}
                </Text>
                <View className="flex-row gap-2 mt-2">
                  <TouchableOpacity
                    onPress={() => handlePlayerChange(playerCount - 1)}
                    disabled={playerCount <= 3}
                    className={`flex-1 py-1.5 border items-center justify-center ${
                      playerCount <= 3
                        ? 'border-neutral-800 bg-neutral-900 opacity-30'
                        : 'border-neutral-700 bg-neutral-900 active:bg-neutral-800'
                    }`}
                  >
                    <Text className="text-sm font-bold text-white">-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handlePlayerChange(playerCount + 1)}
                    disabled={playerCount >= 15}
                    className={`flex-1 py-1.5 border items-center justify-center ${
                      playerCount >= 15
                        ? 'border-neutral-800 bg-neutral-900 opacity-30'
                        : 'border-neutral-700 bg-neutral-900 active:bg-neutral-800'
                    }`}
                  >
                    <Text className="text-sm font-bold text-white">+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Imposters Block */}
              <View className="flex-1 p-4">
                <Text className="text-[10px] font-mono uppercase text-blue-400 tracking-wider">
                  IMPOSTERS (MAX {maxImposters})
                </Text>
                <Text className="text-4xl font-black text-blue-500 my-1">
                  {imposterCount}
                </Text>
                <View className="flex-row gap-2 mt-2">
                  <TouchableOpacity
                    onPress={() => handleImposterChange(imposterCount - 1)}
                    disabled={imposterCount <= 1}
                    className={`flex-1 py-1.5 border items-center justify-center ${
                      imposterCount <= 1
                        ? 'border-neutral-800 bg-neutral-900 opacity-30'
                        : 'border-neutral-700 bg-neutral-900 active:bg-neutral-800'
                    }`}
                  >
                    <Text className="text-sm font-bold text-white">-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleImposterChange(imposterCount + 1)}
                    disabled={imposterCount >= maxImposters}
                    className={`flex-1 py-1.5 border items-center justify-center ${
                      imposterCount >= maxImposters
                        ? 'border-neutral-800 bg-neutral-900 opacity-30'
                        : 'border-neutral-700 bg-neutral-900 active:bg-neutral-800'
                    }`}
                  >
                    <Text className="text-sm font-bold text-white">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Players Table */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-mono uppercase text-neutral-400 font-bold">
                  PLAYERS IN ORDER
                </Text>
                <Text className="text-[10px] font-mono text-neutral-600">
                  RETAINED BETWEEN GAMES
                </Text>
              </View>

              <View className="border-t border-b border-neutral-800 divide-y divide-neutral-800">
                {names.map((name, i) => (
                  <View key={i} className="flex-row items-center py-2.5 px-1 gap-3">
                    <Text className="text-xs font-mono text-neutral-500 w-5">
                      {i + 1}
                    </Text>
                    <TextInput
                      value={name}
                      onChangeText={(val) => handleNameChange(i, val)}
                      placeholder={`Player ${i + 1}`}
                      placeholderTextColor="#525252"
                      className="flex-1 text-sm font-medium text-white outline-none"
                    />
                  </View>
                ))}
              </View>
            </View>

            {/* Clean Bauhaus Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setScreen('rules')}
              className="w-full py-4 bg-white active:bg-neutral-200 items-center justify-center"
            >
              <Text className="text-xs font-black text-black uppercase tracking-widest">
                GAME RULES & CATEGORY →
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ================= PAGE 2: RULES & CATEGORY ================= */
          <View>
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => setScreen('landing')}
              className="py-1 self-start mb-4"
            >
              <Text className="text-xs font-mono font-bold text-blue-400">
                ← BACK TO PLAYERS
              </Text>
            </TouchableOpacity>

            <View className="mb-6">
              <Text className="text-2xl font-black text-white">
                Game Rules
              </Text>
              <Text className="text-xs text-neutral-400 font-mono mt-0.5">
                Configure mode and vocabulary set
              </Text>
            </View>

            {/* Mode Selector */}
            <View className="mb-6">
              <Text className="text-xs font-mono uppercase text-neutral-400 font-bold mb-2">
                MODE
              </Text>
              <View className="border border-neutral-800 divide-y divide-neutral-800 bg-neutral-950">
                {[
                  {
                    id: 'everyone_gets_word' as const,
                    name: 'Everyone Gets a Word',
                    detail: 'Main Word vs Imposter Word',
                  },
                  {
                    id: 'imposter_gets_clue' as const,
                    name: 'Imposter Gets a Clue',
                    detail: 'Indirect situational hint only',
                  },
                  {
                    id: 'blind_imposter' as const,
                    name: 'Blind Imposter',
                    detail: 'No information given to imposter',
                  },
                ].map((item) => {
                  const active = mode === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.8}
                      onPress={() => setMode(item.id)}
                      className={`p-3.5 flex-row items-center justify-between ${
                        active ? 'bg-neutral-900' : 'bg-transparent'
                      }`}
                    >
                      <View>
                        <Text
                          className={`text-sm font-bold ${
                            active ? 'text-blue-400' : 'text-neutral-200'
                          }`}
                        >
                          {item.name}
                        </Text>
                        <Text className="text-xs text-neutral-500 mt-0.5">
                          {item.detail}
                        </Text>
                      </View>
                      <View
                        className={`w-3 h-3 rounded-full ${
                          active ? 'bg-blue-500' : 'border border-neutral-700'
                        }`}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Category Matrix */}
            <View className="mb-6">
              <Text className="text-xs font-mono uppercase text-neutral-400 font-bold mb-2">
                CATEGORY
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {['All Categories', ...CATEGORIES].map((cat) => {
                  const active = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={`px-3 py-2 border ${
                        active
                          ? 'border-blue-500 bg-blue-600/10'
                          : 'border-neutral-800 bg-neutral-950'
                      }`}
                    >
                      <Text
                        className={`text-xs font-mono ${
                          active ? 'text-blue-400 font-bold' : 'text-neutral-400'
                        }`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setGameStarted(true)}
              className="w-full py-4 bg-white active:bg-neutral-200 items-center justify-center"
            >
              <Text className="text-xs font-black text-black uppercase tracking-widest">
                START GAME →
              </Text>
            </TouchableOpacity>

            {gameStarted && (
              <View className="mt-4 p-3 border border-blue-500 bg-blue-950/20 items-center">
                <Text className="text-xs font-mono text-blue-400 font-bold">
                  GAME READY • PASS DEVICE TO PLAYER 1
                </Text>
                <TouchableOpacity
                  onPress={() => setGameStarted(false)}
                  className="mt-2"
                >
                  <Text className="text-[11px] font-mono text-neutral-400">DISMISS</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
