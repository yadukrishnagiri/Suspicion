import React, { useState } from 'react';
import { View, Text, Modal } from 'react-native';
import { Player } from '@/types/game';
import { PressableScale } from '@/components/common';

interface PlayerCardProps {
  player: Player;
  index: number;
  isDiscussionStarter: boolean;
  onEliminate: (playerId: string) => void;
}

export const PlayerCardSwiss: React.FC<PlayerCardProps> = ({
  player,
  index,
  isDiscussionStarter,
  onEliminate,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <PressableScale
        disabled={player.isEliminated}
        onPress={() => !player.isEliminated && setShowConfirm(true)}
        haptic="light"
        activeScale={0.98}
        accessibilityRole="button"
        accessibilityLabel={`${player.name}, ${player.isEliminated ? 'eliminated' : 'active'}. Vote out`}
        className={`w-full min-h-[56px] p-4 border border-neutral-800 mb-2 justify-center ${
          player.isEliminated
            ? 'bg-neutral-950 opacity-40 border-neutral-900'
            : isDiscussionStarter
            ? 'bg-neutral-950 border-blue-500'
            : 'bg-neutral-950'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Text className="text-xs font-mono text-neutral-500 w-5">
              {String(index + 1).padStart(2, '0')}
            </Text>

            <View>
              <View className="flex-row items-center gap-2">
                <Text
                  className={`text-base font-bold ${
                    player.isEliminated
                      ? 'text-neutral-600 line-through'
                      : 'text-white'
                  }`}
                >
                  {player.name}
                </Text>
                {isDiscussionStarter && !player.isEliminated && (
                  <View className="border border-blue-500/40 px-1.5 py-0.5 bg-blue-500/10">
                    <Text className="text-[9px] font-mono font-bold text-blue-400 uppercase">
                      STARTS
                    </Text>
                  </View>
                )}
              </View>

              {player.isEliminated && (
                <View className="flex-row items-center mt-1">
                  <Text
                    className={`text-[10px] font-mono font-bold uppercase ${
                      player.role === 'imposter' ? 'text-red-400' : 'text-neutral-500'
                    }`}
                  >
                    [{player.role === 'imposter' ? 'IMPOSTER' : 'CITIZEN'}]
                  </Text>
                </View>
              )}
            </View>
          </View>

          {!player.isEliminated ? (
            <View className="border border-red-500/80 px-2.5 py-1.5 bg-red-950/20">
              <Text className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider">
                VOTE OUT
              </Text>
            </View>
          ) : (
            <Text className="text-[10px] font-mono text-neutral-600 uppercase font-bold">
              ELIMINATED
            </Text>
          )}
        </View>
      </PressableScale>

      {/* Swiss Confirmation Modal */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 bg-black/90 items-center justify-center p-6">
          <View className="w-full max-w-sm bg-black border border-neutral-700 p-6">
            <Text className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">
              CONFIRM VOTE
            </Text>
            <Text className="text-3xl font-black text-white mt-1 uppercase">
              {player.name}
            </Text>
            <Text className="text-xs font-mono text-neutral-400 mt-2 uppercase tracking-wide">
              VOTE OUT THIS PLAYER?
            </Text>

            <View className="flex-row gap-3 mt-6">
              <PressableScale
                onPress={() => setShowConfirm(false)}
                haptic="light"
                activeScale={0.96}
                accessibilityRole="button"
                accessibilityLabel="Cancel elimination"
                className="flex-1 h-12 border border-neutral-700 items-center justify-center min-h-[48px]"
              >
                <Text className="text-xs font-mono font-bold text-neutral-400 uppercase">
                  CANCEL
                </Text>
              </PressableScale>
              <PressableScale
                onPress={() => {
                  setShowConfirm(false);
                  onEliminate(player.id);
                }}
                haptic="warning"
                activeScale={0.96}
                accessibilityRole="button"
                accessibilityLabel="Confirm elimination"
                className="flex-1 h-12 bg-red-600 items-center justify-center min-h-[48px]"
              >
                <Text className="text-xs font-mono font-bold text-white uppercase">
                  CONFIRM
                </Text>
              </PressableScale>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
