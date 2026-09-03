import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  FadeInDown,
  LinearTransition,
  useReducedMotion,
} from 'react-native-reanimated';
import { Player } from '@/types/game';
import { PressableScale } from '@/components/common';

interface PlayerCardProps {
  player: Player;
  index: number;
  isDiscussionStarter: boolean;
  onVote: (player: Player) => void;
}

export const PlayerCardSwiss: React.FC<PlayerCardProps> = ({
  player,
  index,
  isDiscussionStarter,
  onVote,
}) => {
  const reducedMotion = useReducedMotion();

  return (
    <Animated.View
      entering={
        reducedMotion
          ? undefined
          : FadeInDown.duration(200).delay(Math.min(index * 30, 250))
      }
      layout={reducedMotion ? undefined : LinearTransition.duration(200)}
    >
      <PressableScale
        disabled={player.isEliminated}
        onPress={() => !player.isEliminated && onVote(player)}
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
    </Animated.View>
  );
};
