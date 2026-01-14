import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Colors, Spacing } from "@/constants/theme";

interface LivesIndicatorProps {
  lives: number;
  maxLives?: number;
}

export function LivesIndicator({ lives, maxLives = 5 }: LivesIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: maxLives }).map((_, index) => (
        <Feather
          key={index}
          name="heart"
          size={18}
          color={index < lives ? Colors.light.error : "#E0E0E0"}
          style={styles.heart}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  heart: {
    marginLeft: Spacing.xs,
  },
});
