import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  Keyboard,
  Platform,
  KeyboardEvent,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  LinearTransition,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from './PressableScale';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;

function project(velocity: number, decelerationRate = 0.998) {
  'worklet';
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  'worklet';
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

interface PlayerSelectionSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectName: (name: string) => void;
  initialValue?: string;
  recentNames: string[];
  alreadySelectedNames: string[];
}

export const PlayerSelectionSheet: React.FC<PlayerSelectionSheetProps> = ({
  isVisible,
  onClose,
  onSelectName,
  initialValue = '',
  recentNames,
  alreadySelectedNames,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  const translateY = useSharedValue(SHEET_HEIGHT);
  const context = useSharedValue(0);

  // Sync isVisible to animations
  useEffect(() => {
    if (isVisible) {
      setInputValue(initialValue.startsWith('Player ') ? '' : initialValue);
      translateY.set(
        withSpring(0, { duration: 300, dampingRatio: 0.8 })
      );
    } else {
      translateY.set(
        withSpring(
          SHEET_HEIGHT,
          { duration: 300, dampingRatio: 1, overshootClamping: true }
        )
      );
      Keyboard.dismiss();
    }
  }, [isVisible]);

  // Track keyboard height so we can pad the bottom of the list
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-10, 10]) // require intent
        .onStart(() => {
          context.set(translateY.get());
          scheduleOnRN(Keyboard.dismiss);
        })
        .onUpdate((e) => {
          const next = context.get() + e.translationY;
          // downward is free; upward past the top resists
          translateY.set(next >= 0 ? next : rubberband(next, SHEET_HEIGHT));
        })
        .onEnd((e) => {
          const projected = translateY.get() + project(e.velocityY);
          if (projected > SHEET_HEIGHT * 0.4) {
            // Dismiss
            translateY.set(
              withSpring(
                SHEET_HEIGHT,
                {
                  duration: 300,
                  dampingRatio: 1,
                  velocity: e.velocityY,
                  overshootClamping: true,
                },
                (finished) => {
                  if (finished) scheduleOnRN(onClose);
                }
              )
            );
          } else {
            // Snap back
            translateY.set(
              withSpring(0, { duration: 300, dampingRatio: 0.8, velocity: e.velocityY })
            );
            scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Light);
          }
        }),
    [onClose]
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.get(),
      [0, SHEET_HEIGHT],
      [1, 0],
      Extrapolation.CLAMP
    ),
    pointerEvents: translateY.get() > SHEET_HEIGHT * 0.5 ? 'none' : 'auto',
  }));

  // Filtering suggestions
  const suggestions = recentNames.filter(
    (name) =>
      name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !alreadySelectedNames.includes(name)
  );

  const isExactMatch = suggestions.some(
    (s) => s.toLowerCase() === inputValue.trim().toLowerCase()
  );
  
  const showAddNew = inputValue.trim().length > 0 && !isExactMatch;

  const ROW_CLOSE = LinearTransition.duration(200);

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: 50 }]}
      pointerEvents={isVisible ? 'box-none' : 'none'}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }, backdropStyle]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: SHEET_HEIGHT,
              backgroundColor: '#0a0a0a', // neutral-950
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderWidth: 1,
              borderColor: '#262626', // neutral-800
              borderBottomWidth: 0,
              overflow: 'hidden',
              paddingBottom: Math.max(insets.bottom, keyboardHeight),
            },
            sheetStyle,
          ]}
        >
          {/* Drag Handle */}
          <View className="w-full items-center py-4">
            <View className="w-12 h-1.5 rounded-full bg-neutral-700" />
          </View>

          {/* Search/Add Input */}
          <View className="px-5 pb-4 border-b border-neutral-800">
            <Text className="text-[10px] font-mono text-neutral-500 mb-2 uppercase">
              Player Name
            </Text>
            <View className="flex-row items-center bg-neutral-900 border border-neutral-700 px-4 py-3">
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Type name..."
                placeholderTextColor="#525252"
                autoCapitalize="words"
                autoCorrect={false}
                autoFocus={false}
                className="flex-1 text-base text-white outline-none"
                onSubmitEditing={() => {
                  if (inputValue.trim()) {
                    onSelectName(inputValue.trim());
                    onClose();
                  }
                }}
              />
            </View>
          </View>

          {/* Results List */}
          <Animated.ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
            itemLayoutAnimation={ROW_CLOSE}
          >
            {showAddNew && (
              <Animated.View layout={ROW_CLOSE}>
                <PressableScale
                  onPress={() => {
                    onSelectName(inputValue.trim());
                    onClose();
                  }}
                  activeScale={0.97}
                  className="bg-blue-600/20 border border-blue-500/50 p-4 mb-3 flex-row items-center justify-between"
                >
                  <Text className="text-sm font-bold text-blue-400">
                    Add new: "{inputValue.trim()}"
                  </Text>
                  <Text className="text-lg text-blue-400">+</Text>
                </PressableScale>
              </Animated.View>
            )}

            {suggestions.map((name) => (
              <Animated.View key={name} layout={ROW_CLOSE}>
                <PressableScale
                  onPress={() => {
                    onSelectName(name);
                    onClose();
                  }}
                  activeScale={0.97}
                  className="border-b border-neutral-800 py-4 flex-row items-center justify-between"
                >
                  <Text className="text-base text-white">{name}</Text>
                  <Text className="text-xs font-mono text-neutral-500">PAST PLAYER</Text>
                </PressableScale>
              </Animated.View>
            ))}

            {suggestions.length === 0 && !showAddNew && (
              <Text className="text-sm text-neutral-500 text-center mt-8 font-mono">
                No past players match your search.
              </Text>
            )}
          </Animated.ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
