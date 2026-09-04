import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/store/useAppStore';
import { PressableScale } from '@/components/common';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { loginWithGoogle, loginAsGuest } = useAppStore();
  const reducedMotion = useReducedMotion();

  const handleGooglePress = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setAuthError(null);

    try {
      // Simulated Google OAuth handshake
      // In production with native credentials, this triggers Expo AuthSession / Google Sign-In
      await new Promise((resolve) => setTimeout(resolve, 850));
      loginWithGoogle();
    } catch (err) {
      setAuthError('Authentication handshake failed. Try again or continue as guest.');
      setIsLoading(false);
    }
  };

  const handleGuestPress = () => {
    if (isLoading) return;
    loginAsGuest();
  };

  // Emil Kowalski animation timings: sub-250ms, strong ease-out, staggered entry
  const animHeader = reducedMotion
    ? FadeIn.duration(150)
    : FadeInDown.duration(200).easing(EASE_OUT);

  const animTitle = reducedMotion
    ? FadeIn.duration(150)
    : FadeInDown.duration(220).delay(40).easing(EASE_OUT);

  const animGrid = reducedMotion
    ? FadeIn.duration(150)
    : FadeInDown.duration(220).delay(80).easing(EASE_OUT);

  const animAction = reducedMotion
    ? FadeIn.duration(150)
    : FadeInDown.duration(240).delay(120).easing(EASE_OUT);

  const animFooter = reducedMotion
    ? FadeIn.duration(150)
    : FadeIn.duration(200).delay(160);

  return (
    <View className="flex-1 w-full bg-black justify-between p-6 max-w-md self-center">
      {/* 01: Top Swiss Metadata */}
      <Animated.View entering={animHeader}>
        <View className="flex-row items-center justify-between pb-3 border-b border-neutral-800">
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <Text className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
              EDITION // 2026
            </Text>
          </View>
          <Text className="text-xs font-mono text-neutral-500">
            SYS.VER 1.0.4
          </Text>
        </View>

        {/* Monumental Headline */}
        <Animated.View entering={animTitle} className="mt-8 mb-6">
          <Text className="text-[54px] leading-[0.88] font-black text-white tracking-tighter uppercase">
            SUSPICION
          </Text>
          <Text className="text-xs font-mono uppercase tracking-widest text-blue-500 mt-3 font-semibold">
            SOCIAL DEDUCTION ENGINE
          </Text>
        </Animated.View>

        {/* Structured 1px Architectural Spec Grid */}
        <Animated.View
          entering={animGrid}
          className="flex-row border border-neutral-800 divide-x divide-neutral-800 bg-neutral-950 mb-6"
        >
          <View className="flex-1 p-3">
            <Text className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
              PLAYERS
            </Text>
            <Text className="text-lg font-black text-white mt-0.5">3 – 15</Text>
          </View>
          <View className="flex-1 p-3">
            <Text className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
              ACCESS
            </Text>
            <Text className="text-lg font-black text-white mt-0.5">OAUTH2</Text>
          </View>
          <View className="flex-1 p-3">
            <Text className="text-[10px] font-mono uppercase text-blue-400 tracking-wider">
              PROTOCOL
            </Text>
            <Text className="text-lg font-black text-blue-400 mt-0.5">STRICT</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* 02: Primary Action Panel */}
      <Animated.View entering={animAction} className="my-6">
        <View className="border border-neutral-800 bg-neutral-950 p-5">
          <Text className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-4 font-bold">
            IDENTIFY OPERATOR
          </Text>

          {authError && (
            <View className="mb-4 p-3 bg-red-950/40 border border-red-500/50">
              <Text className="text-xs font-mono text-red-300">{authError}</Text>
            </View>
          )}

          {/* Monolithic Stark White Google Button */}
          <PressableScale
            activeScale={0.97}
            haptic="medium"
            onPress={handleGooglePress}
            disabled={isLoading}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Sign in with Google"
            accessibilityHint="Authenticates using your Google account to track stats and enter game"
            className="w-full py-4 px-5 bg-white items-center justify-between flex-row min-h-[52px]"
          >
            <View className="flex-row items-center">
              {isLoading ? (
                <ActivityIndicator size="small" color="#000000" style={{ marginRight: 10 }} />
              ) : (
                <Ionicons
                  name="logo-google"
                  size={18}
                  color="#000000"
                  style={{ marginRight: 10 }}
                />
              )}
              <Text className="text-xs font-black tracking-wider text-black uppercase">
                {isLoading ? 'ESTABLISHING CLEARANCE...' : 'SIGN IN WITH GOOGLE'}
              </Text>
            </View>
            <Text className="text-base font-black text-black">
              {isLoading ? '·' : '→'}
            </Text>
          </PressableScale>

          {/* Secondary Guest Action */}
          <PressableScale
            activeScale={0.98}
            haptic="light"
            onPress={handleGuestPress}
            disabled={isLoading}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Continue as Guest"
            accessibilityHint="Skips authentication and enters as an unverified local guest"
            className="w-full mt-3 py-3 px-4 border border-neutral-800 bg-neutral-900/60 flex-row items-center justify-between min-h-[44px]"
          >
            <Text className="text-xs font-mono text-neutral-400 font-medium">
              CONTINUE AS GUEST
            </Text>
            <Text className="text-xs font-mono text-neutral-500">→</Text>
          </PressableScale>
        </View>
      </Animated.View>

      {/* 03: Swiss Colophon Footer */}
      <Animated.View
        entering={animFooter}
        className="pt-4 border-t border-neutral-900 flex-row justify-between items-center"
      >
        <Text className="text-[10px] font-mono text-neutral-600 uppercase">
          ZURICH // BERLIN // GLOBAL
        </Text>
        <Text className="text-[10px] font-mono text-neutral-600">
          ALL SESSIONS EPHEMERAL
        </Text>
      </Animated.View>
    </View>
  );
};
