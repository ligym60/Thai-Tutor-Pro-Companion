import React from "react";
import { StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface CategoryChipProps {
  label: string;
  icon: string;
  isSelected?: boolean;
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

export function CategoryChip({
  label,
  icon,
  isSelected = false,
  onPress,
}: CategoryChipProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.chip,
        {
          backgroundColor: isSelected
            ? Colors.light.primary
            : theme.backgroundDefault,
        },
        animatedStyle,
      ]}
    >
      <Feather
        name={icon as any}
        size={16}
        color={isSelected ? "#FFFFFF" : theme.text}
      />
      <ThemedText
        type="small"
        style={[styles.label, { color: isSelected ? "#FFFFFF" : theme.text }]}
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  label: {
    marginLeft: Spacing.xs,
    fontWeight: "500",
  },
});
