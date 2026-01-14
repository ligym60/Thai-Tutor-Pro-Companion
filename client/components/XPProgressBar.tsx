import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface XPProgressBarProps {
  dailyXP: number;
  dailyGoal: number;
  progress: number;
}

export function XPProgressBar({ dailyXP, dailyGoal, progress }: XPProgressBarProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(progress, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const xpPerMinute = 2;
  const goalXP = dailyGoal * xpPerMinute;
  const isGoalMet = dailyXP >= goalXP;

  return (
    <Card elevation={1} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather
            name="target"
            size={20}
            color={isGoalMet ? Colors.light.success : Colors.light.primary}
          />
          <ThemedText type="body" style={styles.title}>
            {t("common:dailyGoal")}
          </ThemedText>
        </View>
        <ThemedText
          type="small"
          style={[styles.xpText, { color: theme.textSecondary }]}
        >
          {dailyXP} / {goalXP} XP
        </ThemedText>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: theme.backgroundSecondary }]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor: isGoalMet
                ? Colors.light.success
                : Colors.light.primary,
            },
            animatedBarStyle,
          ]}
        />
      </View>
      {isGoalMet ? (
        <View style={styles.completedRow}>
          <Feather name="check-circle" size={16} color={Colors.light.success} />
          <ThemedText
            type="small"
            style={[styles.completedText, { color: Colors.light.success }]}
          >
            {t("common:goalCompleted")}
          </ThemedText>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginLeft: Spacing.sm,
    fontWeight: "600",
  },
  xpText: {},
  progressTrack: {
    height: 12,
    borderRadius: BorderRadius.full,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: BorderRadius.full,
  },
  completedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  completedText: {
    marginLeft: Spacing.xs,
    fontWeight: "500",
  },
});
