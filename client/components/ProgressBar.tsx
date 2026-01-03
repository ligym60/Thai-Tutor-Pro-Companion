import React from "react";
import { View, StyleSheet } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Colors } from "@/constants/theme";

interface ProgressBarProps {
  progress: number;
  height?: number;
}

export function ProgressBar({ progress, height = 8 }: ProgressBarProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: theme.backgroundSecondary,
        },
      ]}
    >
      <View
        style={[
          styles.bar,
          {
            width: `${Math.min(100, Math.max(0, progress * 100))}%`,
            backgroundColor: Colors.light.primary,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flex: 1,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
});
