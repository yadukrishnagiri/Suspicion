import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/gameStore';
import { COLORS, BRUTAL } from '@/constants/theme';

export const RevealScreen: React.FC = () => {
  const {
    players,
    currentRevealIndex,
    selectedMode,
    selectedCategory,
    nextReveal,
  } = useGameStore();

  const insets = useSafeAreaInsets();
  const [isRevealed, setIsRevealed] = useState(false);

  const currentPlayer = players[currentRevealIndex];
  const isLastPlayer = currentRevealIndex >= players.length - 1;
  const isImposter = currentPlayer?.role === 'imposter';

  // Reset revealed state when reveal index changes
  useEffect(() => {
    setIsRevealed(false);
  }, [currentRevealIndex]);

  if (!currentPlayer) return null;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, paddingBottom: Math.max(insets.bottom, 20), paddingTop: 12 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1, justifyContent: 'space-between' }}>
        {/* Top Progress Bar */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <View
              style={{
                backgroundColor: COLORS.lavender,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: BRUTAL.pill,
                ...BRUTAL.border,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.dark }}>
                player {currentRevealIndex + 1} of {players.length}
              </Text>
            </View>
            <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted }}>
              pass in seating order
            </Text>
          </View>

          <View
            style={{
              height: 10,
              backgroundColor: COLORS.surface,
              borderRadius: BRUTAL.pill,
              overflow: 'hidden',
              ...BRUTAL.border,
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${((currentRevealIndex + 1) / players.length) * 100}%`,
                backgroundColor: COLORS.coral,
              }}
            />
          </View>
        </View>

        {/* Card Stage */}
        <View style={{ flex: 1, justifyContent: 'center', marginVertical: 12 }}>
          {!isRevealed ? (
            /* Front Face: Privacy Pass Screen */
            <View
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: BRUTAL.rLg,
                padding: 24,
                alignItems: 'center',
                ...BRUTAL.borderThick,
                ...BRUTAL.shadowLg,
                minHeight: 400,
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.yellow,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: BRUTAL.pill,
                  ...BRUTAL.border,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '800' }}>pass phone to</Text>
              </View>

              <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Text style={{ fontSize: 40, fontWeight: '900', textAlign: 'center', color: COLORS.dark, letterSpacing: -1 }}>
                  {currentPlayer.name}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.textMuted, marginTop: 4 }}>
                  seat {currentPlayer.id.replace('player_', '') ? Number(currentPlayer.id.replace('player_', '')) + 1 : currentRevealIndex + 1}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: COLORS.bg,
                  borderRadius: BRUTAL.r,
                  padding: 16,
                  borderWidth: 2,
                  borderStyle: 'dashed',
                  borderColor: COLORS.dark,
                  width: '100%',
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 }}>
                  🔒 <Text style={{ fontWeight: '800', color: COLORS.dark }}>Privacy Check:</Text> Make sure only <Text style={{ fontWeight: '800', color: COLORS.dark }}>{currentPlayer.name}</Text> can see the screen before tapping.
                </Text>
              </View>

              <Pressable
                onPress={() => setIsRevealed(true)}
                style={({ pressed }) => ({
                  width: '100%',
                  backgroundColor: COLORS.coral,
                  borderRadius: BRUTAL.rLg,
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  ...BRUTAL.border,
                  ...BRUTAL.shadow,
                  transform: pressed ? [{ translateX: 2 }, { translateY: 2 }] : [],
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: '900', color: '#fff' }}>
                  TAP TO REVEAL SECRET
                </Text>
                <Text style={{ fontSize: 18 }}>👁️</Text>
              </Pressable>
            </View>
          ) : (
            /* Back Face: Secret Revealed Screen */
            <View
              style={{
                backgroundColor: isImposter ? COLORS.pink : COLORS.yellow,
                borderRadius: BRUTAL.rLg,
                padding: 24,
                alignItems: 'center',
                ...BRUTAL.borderThick,
                ...BRUTAL.shadowLg,
                minHeight: 400,
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  backgroundColor: isImposter ? COLORS.coral : COLORS.teal,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: BRUTAL.pill,
                  ...BRUTAL.border,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '900', color: '#fff' }}>
                  {isImposter ? '🕵️ YOU ARE AN IMPOSTER' : '🛡️ YOU ARE A CITIZEN'}
                </Text>
              </View>

              <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.dark, marginTop: 6 }}>
                category: {selectedCategory}
              </Text>

              {/* Main Word / Secret Box */}
              <View
                style={{
                  backgroundColor: COLORS.surface,
                  borderRadius: BRUTAL.rLg,
                  padding: 20,
                  width: '100%',
                  alignItems: 'center',
                  marginVertical: 16,
                  ...BRUTAL.border,
                  ...BRUTAL.shadow,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 4 }}>
                  {isImposter ? (selectedMode === 'imposter_gets_clue' ? 'your secret hint' : 'your secret word') : 'your secret word'}
                </Text>
                <Text
                  style={{
                    fontSize: 34,
                    fontWeight: '900',
                    textAlign: 'center',
                    color: isImposter ? COLORS.coral : COLORS.dark,
                    letterSpacing: -0.5,
                  }}
                >
                  {currentPlayer.assignedWordOrHint || (selectedMode === 'blind_imposter' ? '???' : '???')}
                </Text>
              </View>

              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.dark, textAlign: 'center', lineHeight: 17, marginBottom: 14 }}>
                {isImposter
                  ? (selectedMode === 'everyone_gets_word'
                      ? '⚠️ Your word is slightly different from the Citizens. Blend in and don\'t get caught!'
                      : selectedMode === 'imposter_gets_clue'
                      ? '⚠️ You have an indirect hint instead of the word. Bluff and deduce what they are talking about!'
                      : '⚠️ You have NO word and NO hint! Listen closely to everyone\'s clues and bluff your way through.')
                  : '💡 Memorize your word! During discussion, you will say ONE spoken clue hinting at this word.'}
              </Text>

              <Pressable
                onPress={() => nextReveal()}
                style={({ pressed }) => ({
                  width: '100%',
                  backgroundColor: isLastPlayer ? COLORS.teal : COLORS.surface,
                  borderRadius: BRUTAL.rLg,
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  ...BRUTAL.border,
                  ...BRUTAL.shadow,
                  transform: pressed ? [{ translateX: 2 }, { translateY: 2 }] : [],
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: '900', color: isLastPlayer ? '#fff' : COLORS.dark }}>
                  {isLastPlayer ? 'FINISH & START DISCUSSION' : 'HIDE CARD & PASS PHONE'}
                </Text>
                <Text style={{ fontSize: 18 }}>{isLastPlayer ? '→' : '🔒'}</Text>
              </Pressable>
            </View>
          )}
        </View>

        <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textMuted, textAlign: 'center' }}>
          phone remains in hands of the current player
        </Text>
      </ScrollView>
    </View>
  );
};
