import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Player } from '@/types/game';

interface PlayerCardProps {
  player: Player;
  isDiscussionStarter: boolean;
  onEliminate: (playerId: string) => void;
}

export const PlayerCardNoir: React.FC<PlayerCardProps> = ({
  player,
  isDiscussionStarter,
  onEliminate,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <TouchableOpacity
        activeOpacity={player.isEliminated ? 1 : 0.75}
        disabled={player.isEliminated}
        onPress={() => !player.isEliminated && setShowConfirm(true)}
        className={`w-full mb-3 rounded-2xl p-4 border transition-all ${
          player.isEliminated
            ? 'bg-neutral-900/40 border-neutral-800/60 opacity-45'
            : isDiscussionStarter
            ? 'bg-neutral-900 border-amber-500/50 shadow-lg shadow-amber-950/20'
            : 'bg-neutral-900/90 border-neutral-800'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3 gap-3">
            {/* Avatar Pill */}
            <View
              className={`w-11 h-11 rounded-full items-center justify-center font-bold ${
                player.isEliminated
                  ? 'bg-neutral-800'
                  : isDiscussionStarter
                  ? 'bg-amber-500/20 border border-amber-500/40'
                  : 'bg-neutral-800 border border-neutral-700'
              }`}
            >
              <Text
                className={`text-base font-bold ${
                  player.isEliminated
                    ? 'text-neutral-500'
                    : isDiscussionStarter
                    ? 'text-amber-400'
                    : 'text-neutral-200'
                }`}
              >
                {player.name.slice(0, 1).toUpperCase()}
              </Text>
            </View>

            <View>
              <View className="flex-row items-center gap-2">
                <Text
                  className={`text-base font-semibold ${
                    player.isEliminated
                      ? 'text-neutral-500 line-through'
                      : 'text-neutral-100'
                  }`}
                >
                  {player.name}
                </Text>
                {isDiscussionStarter && !player.isEliminated && (
                  <View className="bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                    <Text className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                      Starts discussion
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-xs text-neutral-500 mt-0.5">
                {player.isEliminated
                  ? player.role === 'imposter'
                    ? 'Eliminated • Was Impostor'
                    : 'Eliminated • Was Citizen'
                  : 'Active participant'}
              </Text>
            </View>
          </View>

          {/* Action trigger */}
          {!player.isEliminated ? (
            <View className="flex-row items-center gap-1 bg-red-950/40 border border-red-900/40 px-3 py-1.5 rounded-xl">
              <Ionicons name="skull-outline" size={14} color="#ef4444" />
              <Text className="text-xs font-medium text-red-400">Eliminate</Text>
            </View>
          ) : (
            <View className="px-2.5 py-1 rounded-lg bg-neutral-800/80">
              <Text className="text-xs font-semibold text-neutral-400 uppercase tracking-widest text-[10px]">
                {player.role === 'imposter' ? 'Impostor' : 'Citizen'}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 bg-black/80 items-center justify-center p-6">
          <View className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl">
            <View className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 items-center justify-center mb-4 self-center">
              <Ionicons name="alert-circle" size={26} color="#ef4444" />
            </View>

            <Text className="text-xl font-bold text-white text-center">
              Vote out {player.name}?
            </Text>
            <Text className="text-sm text-neutral-400 text-center mt-2 leading-relaxed">
              Has the group voted to eliminate this player? Their secret identity (Citizen or Impostor) will be unveiled. Their word remains hidden.
            </Text>

            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-neutral-800 border border-neutral-700 items-center"
              >
                <Text className="text-sm font-semibold text-neutral-300">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowConfirm(false);
                  onEliminate(player.id);
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 active:bg-red-700 items-center justify-center shadow-lg shadow-red-950/40"
              >
                <Text className="text-sm font-semibold text-white">Eliminate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
