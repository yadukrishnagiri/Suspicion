import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/gameStore';
import { COLORS, BRUTAL } from '@/constants/theme';

export const GameOverScreen: React.FC = () => {
  const {
    winner,
    players,
    activeWordEntry,
    selectedMode,
    resetGameKeepSetup,
    backToSetup,
  } = useGameStore();

  const insets = useSafeAreaInsets();
  const isCitizensWin = winner === 'citizens';

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, paddingTop: 16 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom, 20) + 30,
        }}
      >
        {/* Magazine Victory Banner */}
        <View
          style={{
            backgroundColor: isCitizensWin ? COLORS.teal : COLORS.coral,
            borderRadius: BRUTAL.rLg,
            padding: 24,
            alignItems: 'center',
            ...BRUTAL.borderThick,
            ...BRUTAL.shadowLg,
            transform: [{ rotate: isCitizensWin ? '-1.5deg' : '1.5deg' }],
            marginBottom: 20,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: BRUTAL.pill,
              marginBottom: 10,
              ...BRUTAL.border,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '900', color: COLORS.dark }}>
              MATCH CONCLUDED
            </Text>
          </View>

          <Text style={{ fontSize: 36, fontWeight: '900', color: '#fff', textAlign: 'center', letterSpacing: -1 }}>
            {isCitizensWin ? 'CITIZENS WIN!' : 'IMPOSTORS WIN!'}
          </Text>

          <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff', opacity: 0.95, textAlign: 'center', marginTop: 6, lineHeight: 18 }}>
            {isCitizensWin
              ? 'All infiltrators have been uncovered! The room is safe once again.'
              : 'Parity reached! Imposters equal or outnumber the citizens.'}
          </Text>
        </View>

        {/* The Truth Revealed Card */}
        {activeWordEntry && (
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: BRUTAL.r,
              padding: 16,
              ...BRUTAL.border,
              ...BRUTAL.shadow,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '900', textTransform: 'uppercase', color: COLORS.textMuted, marginBottom: 10 }}>
              the secret knowledge revealed:
            </Text>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              {/* Citizens Word */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#eefcf8',
                  borderRadius: BRUTAL.r,
                  padding: 12,
                  alignItems: 'center',
                  ...BRUTAL.border,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '900', color: '#168575' }}>
                  CITIZEN WORD
                </Text>
                <Text style={{ fontSize: 18, fontWeight: '900', color: COLORS.dark, marginTop: 4 }}>
                  {activeWordEntry.mainWord}
                </Text>
              </View>

              {/* Imposter Word / Hint */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#fdf2f4',
                  borderRadius: BRUTAL.r,
                  padding: 12,
                  alignItems: 'center',
                  ...BRUTAL.border,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '900', color: COLORS.coral }}>
                  IMPOSTER CLUE
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '900', color: COLORS.coral, marginTop: 4, textAlign: 'center' }}>
                  {selectedMode === 'everyone_gets_word'
                    ? activeWordEntry.imposterWord
                    : selectedMode === 'imposter_gets_clue'
                    ? `"${activeWordEntry.imposterHint}"`
                    : 'Nothing (Blind)'}
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textAlign: 'center' }}>
              Theme: <Text style={{ color: COLORS.dark, fontWeight: '800' }}>{activeWordEntry.category}</Text>
            </Text>
          </View>
        )}

        {/* Final Roster Recap */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.dark, marginBottom: 8 }}>
            final player debrief:
          </Text>

          <View style={{ gap: 6 }}>
            {players.map((p, idx) => {
              const isImp = p.role === 'imposter';
              const isAlive = !p.isEliminated;

              return (
                <View
                  key={p.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isImp ? '#fef2f2' : COLORS.surface,
                    borderRadius: BRUTAL.r,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    ...BRUTAL.border,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: isImp ? COLORS.pink : COLORS.lavender,
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...BRUTAL.border,
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: '800' }}>{idx + 1}</Text>
                    </View>

                    <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.dark }}>
                      {p.name}
                    </Text>

                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '800',
                        color: isImp ? COLORS.coral : COLORS.teal,
                      }}
                    >
                      ({isImp ? 'Imposter' : 'Citizen'})
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: isAlive ? COLORS.teal : COLORS.lavender,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: BRUTAL.pill,
                      ...BRUTAL.border,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '800', color: isAlive ? '#fff' : COLORS.dark }}>
                      {isAlive ? 'survived' : 'eliminated'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Rematch Actions */}
        <View style={{ gap: 10 }}>
          <Pressable
            onPress={resetGameKeepSetup}
            style={({ pressed }) => ({
              backgroundColor: COLORS.coral,
              borderRadius: BRUTAL.rLg,
              paddingVertical: 18,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              ...BRUTAL.borderThick,
              ...BRUTAL.shadowLg,
              transform: pressed ? [{ translateX: 2 }, { translateY: 2 }] : [],
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: '900', color: '#fff' }}>
              ⚡ PLAY REMATCH (SAME PLAYERS)
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff' }}>↺</Text>
          </Pressable>

          <Pressable
            onPress={backToSetup}
            style={({ pressed }) => ({
              backgroundColor: COLORS.surface,
              borderRadius: BRUTAL.rLg,
              paddingVertical: 14,
              alignItems: 'center',
              ...BRUTAL.border,
              ...BRUTAL.shadowSm,
              transform: pressed ? [{ scale: 0.98 }] : [],
            })}
          >
            <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.dark }}>
              ⚙️ CHANGE SETUP / NEW GROUP
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};
