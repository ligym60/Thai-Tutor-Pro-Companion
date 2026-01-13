import React from "react";
import { StyleSheet, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { useSpeech } from "@/hooks/useSpeech";

interface SpeakerButtonProps {
  text: string;
  size?: "small" | "medium" | "large";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SpeakerButton({ text, size = "medium" }: SpeakerButtonProps) {
  const { speak, isSpeaking, isAvailable } = useSpeech();
  const scale = useSharedValue(1);

  const iconSize = size === "small" ? 18 : size === "large" ? 28 : 22;
  const buttonSize = size === "small" ? 36 : size === "large" ? 52 : 44;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (!isAvailable) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );
    speak(text);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          backgroundColor: !isAvailable
            ? "#ccc"
            : isSpeaking
            ? Colors.light.primary
            : Colors.light.primary + "20",
        },
        animatedStyle,
      ]}
    >
      <Feather
        name={isSpeaking ? "volume-2" : "volume-x"}
        size={iconSize}
        color={!isAvailable ? "#999" : isSpeaking ? "#FFFFFF" : Colors.light.primary}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
