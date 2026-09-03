import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Player } from '@/types/game';

interface PlayerCardProps {
  player: Player;
  isDiscussionStarter: boolean;
  onEliminate: (playerId: string) => void;
}

export const PlayerCardDossier: React.FC<PlayerCardProps> = ({
  player,
  isDiscussionStarter,
  onEliminate,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <TouchableOpacity
        activeOpacity={player.isEliminated ? 1 : 0.8}
        disabled={player.isEliminated}
        onPress={() => !player.isEliminated && setShowConfirm(true)}
        className={`w-full mb-3 rounded-none p-4 border-2 transition-all relative overflow-hidden ${
          player.isEliminated
            ? 'bg-neutral-950 border-neutral-800 opacity-40'
            : isDiscussionStarter
            ? 'bg-zinc-900 border-amber-400'
            : 'bg-zinc-900 border-zinc-700'
        }`}
      >
        {/* Stamp for eliminated dossier */}
        {player.isEliminated && (
          <View className="absolute right-4 top-3 border-2 border-red-500/80 px-2 py-0.5 rotate-12 bg-black/60">
            <Text className="text-[11px] font-black tracking-widest text-red-500 uppercase">
              {player.role === 'imposter' ? 'IMPOSTOR IDENTIFIED' : 'CITIZEN CLEARED'}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View
              className={`w-10 h-10 items-center justify-center border font-mono ${
                player.isEliminated
                  ? 'bg-neutral-900 border-neutral-800'
                  : isDiscussionStarter
                  ? 'bg-amber-400 border-black'
                  : 'bg-zinc-800 border-zinc-600'
              }`}
            >
              <Text
                className={`text-sm font-black font-mono ${
                  isDiscussionStarter && !player.isEliminated
                    ? 'text-black'
                    : 'text-zinc-300'
                }`}
              >
                {player.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>

            <View>
              <View className="flex-row items-center gap-2">
                <Text
                  className={`text-base font-mono uppercase tracking-wider font-bold ${
                    player.isEliminated ? 'text-zinc-600 line-through' : 'text-zinc-100'
                  }`}
                >
                  {player.name}
                </Text>
              </View>

              <Text className="text-[11px] font-mono text-zinc-400 mt-0.5 tracking-tight">
                {isDiscussionStarter && !player.isEliminated
                  ? '[LEAD SPEAKER • STARTS ROUND]'
                  : player.isEliminated
                  ? '[FILE CLOSED]'
                  : '[ACTIVE SUSPECT]'}
              </Text>
            </View>
          </View>

          {!player.isEliminated && (
            <View className="border border-red-500/80 px-2.5 py-1 bg-red-950/20">
              <Text className="text-[11px] font-mono font-bold text-red-400 tracking-wider">
                FLAG
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
        <View className="flex-1 bg-black/85 items-center justify-center p-6">
          <View className="w-full max-w-sm bg-zinc-900 border-2 border-zinc-500 p-6">
            <Text className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
              // CASE FILE REVIEW
            </Text>
            <Text className="text-xl font-mono font-black text-white mt-2 uppercase">
              CONFIRM CHARGE: {player.name}
            </Text>
            <Text className="text-sm font-mono text-zinc-300 mt-3 leading-relaxed">
              Subject will be formally interrogated and eliminated from the round. Identity record will be disclosed.
            </Text>

            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="flex-1 py-3 border border-zinc-600 bg-zinc-800 items-center"
              >
                <Text className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-widest">
                  ABORT
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowConfirm(false);
                  onEliminate(player.id);
                }}
                className="flex-1 py-3 border-2 border-red-500 bg-red-600 items-center"
              >
                <Text className="text-xs font-mono font-black text-white uppercase tracking-widest">
                  EXECUTE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
