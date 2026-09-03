import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';

export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error'
  | 'none';

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  activeScale?: number;
  activeOpacity?: number;
  haptic?: HapticType;
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  className?: string;
}

export const triggerHaptic = async (type: HapticType = 'light') => {
  if (type === 'none') return;
  try {
    switch (type) {
      case 'selection':
        await Haptics.selectionAsync();
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'light':
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  } catch {
    // Graceful fallback on web or unsupported hardware
  }
};

export const PressableScale: React.FC<PressableScaleProps> = ({
  children,
  activeScale = 0.97,
  activeOpacity = 1,
  haptic = 'light',
  style,
  disabled,
  onPressIn,
  ...props
}) => {
  const handlePressIn = (e: GestureResponderEvent) => {
    if (!disabled && haptic !== 'none') {
      triggerHaptic(haptic);
    }
    onPressIn?.(e);
  };

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPressIn={handlePressIn}
      style={(state) => {
        const resolvedStyle = typeof style === 'function' ? style(state) : style;
        const scaleTransform = state.pressed && !disabled ? [{ scale: activeScale }] : [{ scale: 1 }];

        return [
          resolvedStyle,
          {
            transform: scaleTransform,
            opacity: state.pressed && !disabled ? activeOpacity : 1,
          },
        ];
      }}
    >
      {children}
    </Pressable>
  );
};
