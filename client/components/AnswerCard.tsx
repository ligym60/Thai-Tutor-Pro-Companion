import React from "react";
import { StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface AnswerCardProps {
  text: string;
  isSelected?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AnswerCard({
  text,
  isSelected = false,
  isCorrect = false,
  isIncorrect = false,
  disabled = false,
  onPress,
}: AnswerCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.97, springConfig);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const getBackgroundColor = () => {
    if (isCorrect) return Colors.light.success + "20";
    if (isIncorrect) return Colors.light.error + "20";
    if (isSelected) return Colors.light.primary + "20";
    return theme.backgroundDefault;
  };

  const getBorderColor = () => {
    if (isCorrect) return Colors.light.success;
    if (isIncorrect) return Colors.light.error;
    if (isSelected) return Colors.light.primary;
    return "transparent";
  };

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: isSelected || isCorrect || isIncorrect ? 2 : 0,
          opacity: disabled && !isCorrect && !isIncorrect ? 0.5 : 1,
        },
        animatedStyle,
      ]}
    >
      <ThemedText type="body" style={styles.text}>
        {text}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    minHeight: 56,
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontWeight: "500",
  },
});
