import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors } from "@/constants/theme";

interface StreakCardProps {
  streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Card elevation={1} style={styles.card}>
      <View style={styles.content}>
        <Animated.View style={animatedStyle}>
          <Feather
            name="zap"
            size={32}
            color={Colors.light.streakGold}
          />
        </Animated.View>
        <View style={styles.textContainer}>
          <ThemedText type="h2" style={styles.streakNumber}>
            {streak}
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.label, { color: theme.textSecondary }]}
          >
            {t("common:dayStreak")}
          </ThemedText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: Spacing["2xl"],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: Spacing.lg,
  },
  streakNumber: {
    color: Colors.light.streakGold,
  },
  label: {
    marginTop: Spacing.xs,
  },
});
