import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Player } from '@/types/game';

interface PlayerCardProps {
  player: Player;
  isDiscussionStarter: boolean;
  onEliminate: (playerId: string) => void;
}

export const PlayerCardPartyGrid: React.FC<PlayerCardProps> = ({
  player,
  isDiscussionStarter,
  onEliminate,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  // Gradient vibe hues for energetic party table
  const colors = [
    'from-indigo-600 to-purple-600',
    'from-pink-600 to-rose-600',
    'from-emerald-600 to-teal-600',
    'from-cyan-600 to-blue-600',
    'from-amber-600 to-orange-600',
  ];
  const charCode = player.name.charCodeAt(0) || 0;
  const gradientClass = colors[charCode % colors.length];

  return (
    <>
      <TouchableOpacity
        activeOpacity={player.isEliminated ? 1 : 0.75}
        disabled={player.isEliminated}
        onPress={() => !player.isEliminated && setShowConfirm(true)}
        className={`w-full mb-3 rounded-2xl p-4 transition-all ${
          player.isEliminated
            ? 'bg-neutral-800/40 border border-neutral-800 opacity-40'
            : isDiscussionStarter
            ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-2 border-amber-400'
            : 'bg-neutral-800/80 border border-neutral-700/80'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            {/* Playful Circle Avatar */}
            <View
              className={`w-12 h-12 rounded-2xl items-center justify-center shadow-md ${
                player.isEliminated
                  ? 'bg-neutral-700'
                  : isDiscussionStarter
                  ? 'bg-amber-400'
                  : `bg-gradient-to-tr ${gradientClass} bg-indigo-600`
              }`}
            >
              <Text
                className={`text-lg font-black ${
                  isDiscussionStarter && !player.isEliminated ? 'text-black' : 'text-white'
                }`}
              >
                {player.name.slice(0, 1).toUpperCase()}
              </Text>
            </View>

            <View>
              <View className="flex-row items-center gap-2">
                <Text
                  className={`text-base font-bold ${
                    player.isEliminated ? 'text-neutral-500 line-through' : 'text-white'
                  }`}
                >
                  {player.name}
                </Text>
                {isDiscussionStarter && !player.isEliminated && (
                  <View className="bg-amber-400 px-2 py-0.5 rounded-full">
                    <Text className="text-[10px] font-black text-black uppercase">
                      Speaking 1st
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-xs text-neutral-400 mt-0.5">
                {player.isEliminated
                  ? player.role === 'imposter'
                    ? '💥 Was Impostor!'
                    : '🛡️ Innocent Citizen'
                  : 'In the game'}
              </Text>
            </View>
          </View>

          {!player.isEliminated ? (
            <View className="w-9 h-9 rounded-full bg-rose-500/20 border border-rose-500/40 items-center justify-center">
              <Ionicons name="hand-right" size={16} color="#f43f5e" />
            </View>
          ) : (
            <View className="px-2.5 py-1 rounded-full bg-neutral-700">
              <Text className="text-[10px] font-black text-neutral-300 uppercase">
                {player.role === 'imposter' ? 'Impostor' : 'Citizen'}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 bg-black/80 items-center justify-center p-6">
          <View className="w-full max-w-sm bg-neutral-900 border border-neutral-700 rounded-3xl p-6">
            <View className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 items-center justify-center mb-3 self-center">
              <Text className="text-2xl">🗳️</Text>
            </View>

            <Text className="text-xl font-black text-white text-center">
              Vote to Eliminate?
            </Text>
            <Text className="text-sm text-neutral-300 text-center mt-2 leading-relaxed">
              Did the group choose <Text className="font-bold text-white">{player.name}</Text>? We will reveal if they are a Citizen or an Impostor!
            </Text>

            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="flex-1 py-3.5 rounded-2xl bg-neutral-800 items-center"
              >
                <Text className="text-sm font-bold text-neutral-300">Keep Playing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowConfirm(false);
                  onEliminate(player.id);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-rose-600 items-center"
              >
                <Text className="text-sm font-black text-white">Eliminate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
