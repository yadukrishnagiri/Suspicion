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

const CATEGORY_MAP: { name: GameCategory; icon: string }[] = [
  { name: 'Concepts & Weather', icon: '⛈️' },
  { name: 'Food & Drinks', icon: '🍷' },
  { name: 'Animals & Nature', icon: '🐺' },
  { name: 'Everyday Objects', icon: '🗝️' },
  { name: 'Places & Travel', icon: '🏰' },
  { name: 'Sports & Activities', icon: '🎯' },
  { name: 'Occupations', icon: '🎭' },
  { name: 'Pop Culture & Media', icon: '🎬' },
];

export const VelvetParlorVariant: React.FC = () => {
  const [screen, setScreen] = useState<'landing' | 'rules'>('landing');
  const [playerCount, setPlayerCount] = useState(5);
  const [imposterCount, setImposterCount] = useState(1);
  const [names, setNames] = useState<string[]>([
    'Camilla',
    'Julian',
    'Elena',
    'Sebastian',
    'Vivienne',
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
          updated.push(`Guest ${i + 1}`);
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
      className="flex-1 bg-[#121114]"
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        className="flex-1 px-5 pt-5 max-w-md w-full self-center"
      >
        {screen === 'landing' ? (
          /* ================= PAGE 1: LANDING & GUEST LIST ================= */
          <View>
            {/* Header / Crest */}
            <View className="items-center mb-6 pt-2">
              <View className="w-12 h-12 rounded-2xl bg-[#2a1b22] border border-[#f43f5e]/30 items-center justify-center mb-2.5 shadow-lg shadow-[#f43f5e]/15">
                <Ionicons name="finger-print" size={26} color="#f43f5e" />
              </View>
              <Text className="text-3xl font-black tracking-wider text-white">
                SUSPICION
              </Text>
              <Text className="text-xs font-medium text-rose-300/70 tracking-widest uppercase mt-0.5">
                The Parlor Game of Deceit
              </Text>
            </View>

            {/* Counter Pods */}
            <View className="flex-row gap-3 mb-6">
              {/* Players Card */}
              <View className="flex-1 bg-[#1a181e] border border-white/5 rounded-3xl p-4 items-center">
                <Text className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Players
                </Text>
                <Text className="text-3xl font-black text-white my-1">
                  {playerCount}
                </Text>
                <View className="flex-row gap-2 mt-1">
                  <TouchableOpacity
                    onPress={() => handlePlayerChange(playerCount - 1)}
                    disabled={playerCount <= 3}
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      playerCount <= 3
                        ? 'bg-neutral-800/40 opacity-30'
                        : 'bg-neutral-800 active:bg-neutral-700'
                    }`}
                  >
                    <Text className="text-white text-base font-bold">-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handlePlayerChange(playerCount + 1)}
                    disabled={playerCount >= 15}
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      playerCount >= 15
                        ? 'bg-neutral-800/40 opacity-30'
                        : 'bg-neutral-800 active:bg-neutral-700'
                    }`}
                  >
                    <Text className="text-white text-base font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Imposters Card */}
              <View className="flex-1 bg-[#1a181e] border border-rose-500/20 rounded-3xl p-4 items-center">
                <Text className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                  Imposters
                </Text>
                <Text className="text-3xl font-black text-rose-500 my-1">
                  {imposterCount}
                </Text>
                <View className="flex-row gap-2 mt-1">
                  <TouchableOpacity
                    onPress={() => handleImposterChange(imposterCount - 1)}
                    disabled={imposterCount <= 1}
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      imposterCount <= 1
                        ? 'bg-neutral-800/40 opacity-30'
                        : 'bg-neutral-800 active:bg-neutral-700'
                    }`}
                  >
                    <Text className="text-white text-base font-bold">-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleImposterChange(imposterCount + 1)}
                    disabled={imposterCount >= maxImposters}
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      imposterCount >= maxImposters
                        ? 'bg-neutral-800/40 opacity-30'
                        : 'bg-neutral-800 active:bg-neutral-700'
                    }`}
                  >
                    <Text className="text-white text-base font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Guest List */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3 px-1">
                <Text className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Guest Cards ({names.length})
                </Text>
                <Text className="text-[11px] text-rose-400/80">Turn order</Text>
              </View>

              <View className="gap-2">
                {names.map((name, i) => (
                  <View
                    key={i}
                    className="flex-row items-center bg-[#1a181e] border border-white/5 rounded-2xl px-4 py-2.5 gap-3"
                  >
                    <View className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 items-center justify-center">
                      <Text className="text-xs font-bold text-rose-400">
                        {name.slice(0, 1).toUpperCase()}
                      </Text>
                    </View>
                    <TextInput
                      value={name}
                      onChangeText={(val) => handleNameChange(i, val)}
                      placeholder={`Guest ${i + 1}`}
                      placeholderTextColor="#71717a"
                      className="flex-1 text-sm font-semibold text-white py-1 outline-none"
                    />
                    <Text className="text-[11px] font-bold text-neutral-600">
                      #{i + 1}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Next Step CTA */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setScreen('rules')}
              className="w-full py-4 rounded-2xl bg-rose-600 active:bg-rose-700 items-center justify-center shadow-xl shadow-rose-950/50"
            >
              <Text className="text-sm font-black text-white uppercase tracking-wider">
                Select Rules & Words →
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ================= PAGE 2: RULES & CATEGORY ================= */
          <View>
            {/* Back Pill */}
            <TouchableOpacity
              onPress={() => setScreen('landing')}
              className="flex-row items-center gap-1.5 mb-5 self-start px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
            >
              <Ionicons name="arrow-back" size={14} color="#f43f5e" />
              <Text className="text-xs font-semibold text-neutral-300">
                Back to Guests
              </Text>
            </TouchableOpacity>

            <View className="mb-6">
              <Text className="text-2xl font-black text-white tracking-wide">
                Secret Rules
              </Text>
              <Text className="text-xs text-neutral-400 mt-1">
                Customize how information is whispered to the imposter.
              </Text>
            </View>

            {/* Game Mode Cards */}
            <View className="mb-6">
              <Text className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
                Game Mode
              </Text>
              <View className="gap-2.5">
                {[
                  {
                    id: 'everyone_gets_word' as const,
                    title: 'Everyone Gets a Word',
                    badge: 'Classic',
                    desc: 'Citizens receive Main Word; Imposter gets a related secret word.',
                  },
                  {
                    id: 'imposter_gets_clue' as const,
                    title: 'Imposter Gets a Clue',
                    badge: 'Indirect',
                    desc: 'Citizens receive Main Word; Imposter receives an elusive hint only.',
                  },
                  {
                    id: 'blind_imposter' as const,
                    title: 'Blind Imposter',
                    badge: 'Hardcore',
                    desc: 'Imposter gets zero information and must blend in entirely by ear.',
                  },
                ].map((item) => {
                  const active = mode === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.8}
                      onPress={() => setMode(item.id)}
                      className={`p-4 rounded-2xl border transition-all ${
                        active
                          ? 'bg-[#25171d] border-rose-500 shadow-md shadow-rose-950/40'
                          : 'bg-[#1a181e] border-white/5'
                      }`}
                    >
                      <View className="flex-row items-center justify-between mb-1">
                        <Text
                          className={`text-sm font-bold ${
                            active ? 'text-rose-400' : 'text-white'
                          }`}
                        >
                          {item.title}
                        </Text>
                        <View className="px-2 py-0.5 rounded-full bg-white/5">
                          <Text className="text-[10px] font-bold text-neutral-400">
                            {item.badge}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xs text-neutral-400 leading-relaxed">
                        {item.desc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Category Selector */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-2.5">
                <Text className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Category
                </Text>
                <Text className="text-xs text-rose-400">{category}</Text>
              </View>

              {/* All Categories Pill */}
              <TouchableOpacity
                onPress={() => setCategory('All Categories')}
                className={`w-full p-3 rounded-2xl mb-2 flex-row items-center justify-between border ${
                  category === 'All Categories'
                    ? 'bg-rose-500/20 border-rose-500'
                    : 'bg-[#1a181e] border-white/5'
                }`}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-base">🎲</Text>
                  <Text
                    className={`text-xs font-bold ${
                      category === 'All Categories' ? 'text-rose-400' : 'text-white'
                    }`}
                  >
                    All Categories (Random Deck)
                  </Text>
                </View>
                <Text className="text-[10px] font-bold text-neutral-500 uppercase">
                  840 Pairs
                </Text>
              </TouchableOpacity>

              {/* Grid of 8 Specific Categories */}
              <View className="flex-row flex-wrap gap-2">
                {CATEGORY_MAP.map((c) => {
                  const active = category === c.name;
                  return (
                    <TouchableOpacity
                      key={c.name}
                      onPress={() => setCategory(c.name)}
                      className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${
                        active
                          ? 'bg-rose-500 border-rose-500'
                          : 'bg-[#1a181e] border-white/5'
                      }`}
                    >
                      <Text className="text-xs">{c.icon}</Text>
                      <Text
                        className={`text-xs font-medium ${
                          active ? 'text-white font-bold' : 'text-neutral-300'
                        }`}
                      >
                        {c.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Start Game CTA */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setGameStarted(true)}
              className="w-full py-4 rounded-2xl bg-rose-600 active:bg-rose-700 items-center justify-center shadow-xl shadow-rose-950/50"
            >
              <Text className="text-sm font-black text-white uppercase tracking-wider">
                Begin Secret Deal
              </Text>
            </TouchableOpacity>

            {gameStarted && (
              <View className="mt-4 p-4 rounded-2xl bg-[#25171d] border border-rose-500 items-center">
                <Text className="text-xs font-bold text-rose-400">
                  🎉 Game configured! Ready to pass device.
                </Text>
                <TouchableOpacity
                  onPress={() => setGameStarted(false)}
                  className="mt-2 py-1 px-3 rounded-full bg-white/10"
                >
                  <Text className="text-[11px] text-neutral-300">Close preview</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
