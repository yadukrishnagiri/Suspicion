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

export const AcidStealthVariant: React.FC = () => {
  const [screen, setScreen] = useState<'landing' | 'rules'>('landing');
  const [playerCount, setPlayerCount] = useState(5);
  const [imposterCount, setImposterCount] = useState(1);
  const [names, setNames] = useState<string[]>([
    'Viper',
    'Ghost',
    'Cipher',
    'Raven',
    'Shadow',
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
      className="flex-1 bg-[#09090b]"
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        className="flex-1 px-5 pt-4 max-w-md w-full self-center"
      >
        {/* Top Status Bar */}
        <View className="flex-row items-center justify-between mb-4 border-b border-[#27272a] pb-3">
          <View className="flex-row items-center gap-2">
            <View className="w-2.5 h-2.5 rounded-full bg-[#ccff00] shadow-sm shadow-[#ccff00]" />
            <Text className="text-[11px] font-mono tracking-widest text-[#ccff00] uppercase font-bold">
              SYS.SECURE // V4.2
            </Text>
          </View>
          <Text className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            {screen === 'landing' ? 'CONFIG_ROSTER' : 'CONFIG_RULES'}
          </Text>
        </View>

        {screen === 'landing' ? (
          /* ================= PAGE 1: LANDING & ROSTER ================= */
          <View>
            {/* Minimal Brand Identity */}
            <View className="mb-6">
              <Text className="text-4xl font-black tracking-tighter text-white font-mono">
                SUSPICION<Text className="text-[#ccff00]">_</Text>
              </Text>
              <Text className="text-xs text-zinc-400 font-mono mt-1">
                IN-PERSON SOCIAL DEDUCTION PROTOCOL
              </Text>
            </View>

            {/* Tactical Control Cluster: Players & Imposters */}
            <View className="bg-[#121215] border border-[#27272a] p-4 rounded-xl mb-6">
              {/* Players Counter */}
              <View className="flex-row items-center justify-between pb-3.5 border-b border-[#1f1f23]">
                <View>
                  <Text className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    TOTAL PLAYERS
                  </Text>
                  <Text className="text-[11px] font-mono text-zinc-600">RANGE 03 - 15</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => handlePlayerChange(playerCount - 1)}
                    disabled={playerCount <= 3}
                    className={`w-9 h-9 rounded-lg items-center justify-center border font-mono ${
                      playerCount <= 3
                        ? 'border-[#27272a] bg-[#18181b] opacity-30'
                        : 'border-[#3f3f46] bg-[#18181b] active:bg-[#27272a]'
                    }`}
                  >
                    <Text className="text-lg font-mono text-white">-</Text>
                  </TouchableOpacity>
                  <View className="w-10 items-center justify-center">
                    <Text className="text-2xl font-black font-mono text-white">
                      {String(playerCount).padStart(2, '0')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handlePlayerChange(playerCount + 1)}
                    disabled={playerCount >= 15}
                    className={`w-9 h-9 rounded-lg items-center justify-center border font-mono ${
                      playerCount >= 15
                        ? 'border-[#27272a] bg-[#18181b] opacity-30'
                        : 'border-[#3f3f46] bg-[#18181b] active:bg-[#27272a]'
                    }`}
                  >
                    <Text className="text-lg font-mono text-white">+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Imposters Counter */}
              <View className="flex-row items-center justify-between pt-3.5">
                <View>
                  <Text className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    IMPOSTERS
                  </Text>
                  <Text className="text-[11px] font-mono text-zinc-600">
                    MAX ALLOWED {String(maxImposters).padStart(2, '0')}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => handleImposterChange(imposterCount - 1)}
                    disabled={imposterCount <= 1}
                    className={`w-9 h-9 rounded-lg items-center justify-center border font-mono ${
                      imposterCount <= 1
                        ? 'border-[#27272a] bg-[#18181b] opacity-30'
                        : 'border-[#3f3f46] bg-[#18181b] active:bg-[#27272a]'
                    }`}
                  >
                    <Text className="text-lg font-mono text-white">-</Text>
                  </TouchableOpacity>
                  <View className="w-10 items-center justify-center">
                    <Text className="text-2xl font-black font-mono text-[#ccff00]">
                      {String(imposterCount).padStart(2, '0')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleImposterChange(imposterCount + 1)}
                    disabled={imposterCount >= maxImposters}
                    className={`w-9 h-9 rounded-lg items-center justify-center border font-mono ${
                      imposterCount >= maxImposters
                        ? 'border-[#27272a] bg-[#18181b] opacity-30'
                        : 'border-[#3f3f46] bg-[#18181b] active:bg-[#27272a]'
                    }`}
                  >
                    <Text className="text-lg font-mono text-white">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Names Input List */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  ROSTER REGISTER ({names.length})
                </Text>
                <Text className="text-[10px] font-mono text-zinc-500 uppercase">
                  ORDER DETERMINES DEALS
                </Text>
              </View>

              <View className="bg-[#121215] border border-[#27272a] rounded-xl overflow-hidden divide-y divide-[#1f1f23]">
                {names.map((name, i) => (
                  <View key={i} className="flex-row items-center px-3.5 py-2.5 gap-3">
                    <Text className="text-xs font-mono font-bold text-[#ccff00] w-6">
                      {String(i + 1).padStart(2, '0')}
                    </Text>
                    <TextInput
                      value={name}
                      onChangeText={(val) => handleNameChange(i, val)}
                      placeholder={`Agent ${i + 1}`}
                      placeholderTextColor="#52525b"
                      className="flex-1 text-sm font-mono text-white py-1 outline-none"
                    />
                    <Ionicons name="create-outline" size={14} color="#52525b" />
                  </View>
                ))}
              </View>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setScreen('rules')}
              className="w-full py-4 rounded-xl bg-[#ccff00] active:bg-[#bbf000] flex-row items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/10"
            >
              <Text className="text-sm font-mono font-black text-black uppercase tracking-wider">
                RULES & CATEGORY →
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ================= PAGE 2: MODE & CATEGORY ================= */
          <View>
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => setScreen('landing')}
              className="flex-row items-center gap-2 mb-4 self-start py-1"
            >
              <Ionicons name="arrow-back" size={16} color="#ccff00" />
              <Text className="text-xs font-mono font-bold text-[#ccff00] uppercase tracking-wider">
                ← EDIT ROSTER
              </Text>
            </TouchableOpacity>

            <View className="mb-6">
              <Text className="text-3xl font-black font-mono text-white tracking-tight">
                PROTOCOL RULES
              </Text>
              <Text className="text-xs font-mono text-zinc-400 mt-0.5">
                {playerCount} PLAYERS • {imposterCount} IMPOSTER{imposterCount > 1 ? 'S' : ''}
              </Text>
            </View>

            {/* Game Mode Selection */}
            <View className="mb-6">
              <Text className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                DEAL MODE
              </Text>
              <View className="gap-2.5">
                {[
                  {
                    id: 'everyone_gets_word' as const,
                    title: 'WORD EXCHANGE',
                    desc: 'Citizens receive Main Word. Imposter receives related secret word.',
                  },
                  {
                    id: 'imposter_gets_clue' as const,
                    title: 'CLUE ONLY',
                    desc: 'Citizens receive Main Word. Imposter receives indirect situational clue.',
                  },
                  {
                    id: 'blind_imposter' as const,
                    title: 'BLIND INFILTRATION',
                    desc: 'Citizens receive Main Word. Imposter receives zero information.',
                  },
                ].map((item) => {
                  const active = mode === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.8}
                      onPress={() => setMode(item.id)}
                      className={`p-3.5 rounded-xl border transition-all ${
                        active
                          ? 'bg-[#181a10] border-[#ccff00]'
                          : 'bg-[#121215] border-[#27272a]'
                      }`}
                    >
                      <View className="flex-row items-center justify-between mb-1">
                        <Text
                          className={`text-sm font-mono font-bold ${
                            active ? 'text-[#ccff00]' : 'text-white'
                          }`}
                        >
                          {item.title}
                        </Text>
                        <View
                          className={`w-4 h-4 rounded-full border items-center justify-center ${
                            active ? 'border-[#ccff00] bg-[#ccff00]' : 'border-zinc-700'
                          }`}
                        >
                          {active && <View className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </View>
                      </View>
                      <Text className="text-xs font-mono text-zinc-400 leading-relaxed">
                        {item.desc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Category Grid */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-2.5">
                <Text className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  WORD DECK (840 PAIRS)
                </Text>
                <Text className="text-[10px] font-mono text-[#ccff00]">
                  ACTIVE: {category.toUpperCase()}
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {['All Categories', ...CATEGORIES].map((cat) => {
                  const active = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={`px-3 py-2 rounded-lg border font-mono ${
                        active
                          ? 'bg-[#ccff00] border-[#ccff00]'
                          : 'bg-[#121215] border-[#27272a]'
                      }`}
                    >
                      <Text
                        className={`text-xs font-mono font-bold ${
                          active ? 'text-black font-black' : 'text-zinc-300'
                        }`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Launch CTA */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setGameStarted(true)}
              className="w-full py-4 rounded-xl bg-[#ccff00] active:bg-[#bbf000] items-center justify-center shadow-lg shadow-[#ccff00]/15"
            >
              <Text className="text-sm font-mono font-black text-black uppercase tracking-wider">
                INITIALIZE SECRET DEAL
              </Text>
            </TouchableOpacity>

            {/* Feedback Modal / Toast */}
            {gameStarted && (
              <View className="mt-4 p-4 rounded-xl bg-[#181a10] border border-[#ccff00] items-center">
                <Text className="text-xs font-mono font-bold text-[#ccff00] uppercase">
                  ✓ READY: DECK SHUFFLED & PASS READY
                </Text>
                <TouchableOpacity
                  onPress={() => setGameStarted(false)}
                  className="mt-2 py-1 px-3 rounded bg-zinc-800"
                >
                  <Text className="text-[11px] font-mono text-zinc-300">DISMISS PREVIEW</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
