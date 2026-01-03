import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Colors } from "@/constants/theme";

interface AvatarProps {
  preset: number;
  size?: number;
  onPress?: () => void;
}

const AVATAR_ICONS: { icon: string; bgColor: string }[] = [
  { icon: "sun", bgColor: "#E8D5FF" },
  { icon: "droplet", bgColor: "#FFE4EC" },
  { icon: "hexagon", bgColor: "#D5F5E3" },
];

export function Avatar({ preset, size = 60, onPress }: AvatarProps) {
  const { theme } = useTheme();
  const avatarData = AVATAR_ICONS[preset % AVATAR_ICONS.length];

  const content = (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: avatarData.bgColor,
        },
      ]}
    >
      <Feather
        name={avatarData.icon as any}
        size={size * 0.5}
        color={Colors.light.primary}
      />
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
