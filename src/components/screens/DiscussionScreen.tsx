import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/gameStore';
import { Player } from '@/types/game';
import { COLORS, BRUTAL } from '@/constants/theme';

export const DiscussionScreen: React.FC = () => {
  const {
    players,
    discussionStarterId,
    lastEliminatedPlayer,
    clearLastEliminated,
    eliminatePlayer,
    backToSetup,
  } = useGameStore();

  const insets = useSafeAreaInsets();
  const [selectedSuspect, setSelectedSuspect] = useState<Player | null>(null);
  const [showEliminateModal, setShowEliminateModal] = useState(false);
  const [roundCount, setRoundCount] = useState(1);

  const activePlayers = players.filter((p) => !p.isEliminated);
  const activeCitizens = players.filter((p) => !p.isEliminated && p.role === 'citizen').length;
  const activeImposters = players.filter((p) => !p.isEliminated && p.role === 'imposter').length;

  const starter = players.find((p) => p.id === discussionStarterId);

  const handleConfirmElimination = () => {
    if (!selectedSuspect) return;
    eliminatePlayer(selectedSuspect.id);
    setSelectedSuspect(null);
    setShowEliminateModal(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, paddingTop: 12 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom, 20) + 30,
        }}
      >
        {/* Top Header Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 12,
            borderBottomWidth: 2,
            borderColor: COLORS.border,
            marginBottom: 16,
          }}
        >
          <Pressable
            onPress={backToSetup}
            style={({ pressed }) => ({
              backgroundColor: COLORS.surface,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: BRUTAL.pill,
              ...BRUTAL.border,
              transform: pressed ? [{ scale: 0.95 }] : [],
            })}
          >
            <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.dark }}>← SETUP</Text>
          </Pressable>

          <View style={{ flexDirection: 'row', gap: 6 }}>
            <View
              style={{
                backgroundColor: COLORS.lavender,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: BRUTAL.pill,
                ...BRUTAL.border,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.dark }}>
                {activeCitizens} citizens
              </Text>
            </View>
            <View
              style={{
                backgroundColor: COLORS.pink,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: BRUTAL.pill,
                ...BRUTAL.border,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.coral }}>
                {activeImposters} imposters
              </Text>
            </View>
          </View>
        </View>

        {/* Discussion Starter Banner (Permanent Discussion Starter) */}
        <View
          style={{
            backgroundColor: COLORS.yellow,
            borderRadius: BRUTAL.rLg,
            padding: 16,
            ...BRUTAL.border,
            ...BRUTAL.shadowLg,
            transform: [{ rotate: '-1deg' }],
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: COLORS.surface,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: BRUTAL.pill,
                ...BRUTAL.border,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '800' }}>⭐ discussion starter</Text>
            </View>
            <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.coral }}>
              round {roundCount}
            </Text>
          </View>

          <Text style={{ fontSize: 26, fontWeight: '900', letterSpacing: -0.5, marginTop: 6, color: COLORS.dark }}>
            {starter?.name || 'Julian'}
          </Text>

          <Text style={{ fontSize: 12, fontWeight: '600', color: '#333', marginTop: 4, lineHeight: 16 }}>
            Starting from <Text style={{ fontWeight: '800' }}>{starter?.name || 'Julian'}</Text>, each active player says exactly <Text style={{ fontWeight: '800' }}>one spoken word</Text> relating to their secret.
          </Text>
        </View>

        {/* Players Grid Title */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.dark }}>
            room roster ({activePlayers.length} active):
          </Text>
          <Text style={{ fontSize: 11, fontWeight: '600', color: COLORS.textMuted }}>
            tap to accuse
          </Text>
        </View>

        {/* Players Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          {players.map((p, idx) => {
            const isStarter = p.id === discussionStarterId;
            const isEliminated = p.isEliminated;

            return (
              <Pressable
                key={p.id}
                disabled={isEliminated}
                onPress={() => {
                  setSelectedSuspect(p);
                  setShowEliminateModal(true);
                }}
                style={({ pressed }) => ({
                  width: '48%',
                  backgroundColor: isEliminated ? '#eae8dc' : isStarter ? '#fffae6' : COLORS.surface,
                  borderRadius: BRUTAL.r,
                  padding: 12,
                  ...BRUTAL.border,
                  ...(isEliminated ? {} : BRUTAL.shadow),
                  borderStyle: isEliminated ? 'dashed' : 'solid',
                  opacity: isEliminated ? 0.6 : 1,
                  transform: pressed && !isEliminated ? [{ scale: 0.96 }] : [],
                })}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: COLORS.lavender,
                      alignItems: 'center',
                      justifyContent: 'center',
                      ...BRUTAL.border,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '800' }}>{idx + 1}</Text>
                  </View>
                  {isStarter && (
                    <Text style={{ fontSize: 9, fontWeight: '800', color: COLORS.coral }}>★ STARTER</Text>
                  )}
                  {isEliminated && (
                    <Text style={{ fontSize: 9, fontWeight: '800', color: '#777' }}>OUT</Text>
                  )}
                </View>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '800',
                    marginTop: 6,
                    color: COLORS.dark,
                    textDecorationLine: isEliminated ? 'line-through' : 'none',
                  }}
                  numberOfLines={1}
                >
                  {p.name}
                </Text>

                <Text style={{ fontSize: 10, fontWeight: '700', color: isEliminated ? '#888' : COLORS.coral, marginTop: 2 }}>
                  {isEliminated ? 'eliminated' : 'tap to accuse'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Action Controls */}
        <View style={{ gap: 10 }}>
          <Pressable
            onPress={() => {
              if (activePlayers.length > 0) {
                setSelectedSuspect(activePlayers[0]);
                setShowEliminateModal(true);
              }
            }}
            style={({ pressed }) => ({
              backgroundColor: COLORS.coral,
              borderRadius: BRUTAL.rLg,
              paddingVertical: 16,
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
              ⚡ VOTE & ELIMINATE SUSPECT
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff' }}>→</Text>
          </Pressable>

          <Pressable
            onPress={() => setRoundCount(roundCount + 1)}
            style={({ pressed }) => ({
              backgroundColor: COLORS.surface,
              borderRadius: BRUTAL.rLg,
              paddingVertical: 14,
              paddingHorizontal: 16,
              alignItems: 'center',
              ...BRUTAL.border,
              ...BRUTAL.shadowSm,
              transform: pressed ? [{ scale: 0.98 }] : [],
            })}
          >
            <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.dark }}>
              ⏭️ SKIP VOTE / NEXT SPOKEN CLUE ROUND
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Elimination Selection & Confirm Modal */}
      <Modal visible={showEliminateModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(10,10,10,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View
            style={{
              width: '100%',
              maxWidth: 380,
              backgroundColor: COLORS.bg,
              borderRadius: 20,
              padding: 20,
              ...BRUTAL.borderThick,
              ...BRUTAL.shadowLg,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: COLORS.dark }}>
                vote & eliminate
              </Text>
              <Pressable onPress={() => setShowEliminateModal(false)}>
                <Text style={{ fontSize: 20, fontWeight: '900', color: COLORS.dark }}>✕</Text>
              </Pressable>
            </View>

            <Text style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 14, lineHeight: 16 }}>
              Select the player the room has voted to eliminate:
            </Text>

            <ScrollView style={{ maxHeight: 220, marginBottom: 14 }}>
              <View style={{ gap: 6 }}>
                {activePlayers.map((p) => {
                  const isSelected = selectedSuspect?.id === p.id;
                  return (
                    <Pressable
                      key={`modal_${p.id}`}
                      onPress={() => setSelectedSuspect(p)}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: isSelected ? COLORS.yellow : COLORS.surface,
                        padding: 10,
                        borderRadius: BRUTAL.r,
                        ...BRUTAL.border,
                      }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.dark }}>{p.name}</Text>
                      <Text style={{ fontSize: 11, fontWeight: '800', color: isSelected ? COLORS.coral : COLORS.textMuted }}>
                        {isSelected ? '✓ SELECTED' : 'CHOOSE'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {selectedSuspect && (
              <Pressable
                onPress={handleConfirmElimination}
                style={({ pressed }) => ({
                  backgroundColor: COLORS.coral,
                  borderRadius: BRUTAL.r,
                  paddingVertical: 14,
                  alignItems: 'center',
                  ...BRUTAL.border,
                  ...BRUTAL.shadow,
                  transform: pressed ? [{ scale: 0.97 }] : [],
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: '900', color: '#fff' }}>
                  CONFIRM ELIMINATION: {selectedSuspect.name.toUpperCase()}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>

      {/* Elimination Result Role Reveal Modal (Golden Rule: Secret Words NEVER shown!) */}
      <Modal visible={!!lastEliminatedPlayer} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(10,10,10,0.75)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View
            style={{
              width: '100%',
              maxWidth: 380,
              backgroundColor: COLORS.surface,
              borderRadius: 20,
              padding: 24,
              alignItems: 'center',
              ...BRUTAL.borderThick,
              ...BRUTAL.shadowLg,
            }}
          >
            <View
              style={{
                backgroundColor: lastEliminatedPlayer?.role === 'imposter' ? COLORS.pink : COLORS.lavender,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: BRUTAL.pill,
                marginBottom: 12,
                ...BRUTAL.border,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '900', color: lastEliminatedPlayer?.role === 'imposter' ? COLORS.coral : COLORS.dark }}>
                {lastEliminatedPlayer?.role === 'imposter' ? '🎉 IMPOSTOR UNCOVERED' : '❌ INNOCENT CITIZEN'}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 32,
                fontWeight: '900',
                textAlign: 'center',
                color: lastEliminatedPlayer?.role === 'imposter' ? COLORS.coral : COLORS.dark,
                letterSpacing: -0.5,
                marginVertical: 6,
              }}
            >
              {lastEliminatedPlayer?.role === 'imposter' ? 'IMPOSTOR FOUND!' : 'NOT THE IMPOSTOR!'}
            </Text>

            <Text style={{ fontSize: 16, fontWeight: '800', textAlign: 'center', color: COLORS.dark, marginVertical: 8 }}>
              <Text style={{ fontWeight: '900' }}>{lastEliminatedPlayer?.name}</Text> was a <Text style={{ fontWeight: '900', color: lastEliminatedPlayer?.role === 'imposter' ? COLORS.coral : COLORS.teal }}>{lastEliminatedPlayer?.role === 'imposter' ? 'Imposter' : 'Citizen'}</Text>.
            </Text>

            {/* Golden Rule banner */}
            <View
              style={{
                backgroundColor: COLORS.bg,
                borderRadius: BRUTAL.r,
                padding: 12,
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: COLORS.dark,
                marginVertical: 14,
                width: '100%',
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.textMuted, textAlign: 'center', lineHeight: 16 }}>
                🔒 <Text style={{ fontWeight: '900', color: COLORS.dark }}>The Golden Rule:</Text> Secret words and hints are NEVER revealed on elimination so the match can continue fairly!
              </Text>
            </View>

            <Pressable
              onPress={clearLastEliminated}
              style={({ pressed }) => ({
                width: '100%',
                backgroundColor: COLORS.teal,
                borderRadius: BRUTAL.rLg,
                paddingVertical: 14,
                alignItems: 'center',
                ...BRUTAL.border,
                ...BRUTAL.shadow,
                transform: pressed ? [{ scale: 0.97 }] : [],
              })}
            >
              <Text style={{ fontSize: 15, fontWeight: '900', color: '#fff' }}>
                CONTINUE MATCH →
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
