import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/ThemedText";
import { Avatar } from "@/components/Avatar";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface LeaderboardItemProps {
  rank: number;
  name: string;
  avatarPreset: number;
  xp: number;
  trend: "up" | "down" | "same";
  isCurrentUser?: boolean;
}

export function LeaderboardItem({
  rank,
  name,
  avatarPreset,
  xp,
  trend,
  isCurrentUser = false,
}: LeaderboardItemProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const getRankColor = () => {
    if (rank === 1) return "#FFD700";
    if (rank === 2) return "#C0C0C0";
    if (rank === 3) return "#CD7F32";
    return theme.textSecondary;
  };

  const getTrendIcon = () => {
    if (trend === "up") return "trending-up";
    if (trend === "down") return "trending-down";
    return "minus";
  };

  const getTrendColor = () => {
    if (trend === "up") return Colors.light.success;
    if (trend === "down") return Colors.light.error;
    return theme.textSecondary;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isCurrentUser
            ? Colors.light.primary + "15"
            : theme.backgroundDefault,
          borderColor: isCurrentUser ? Colors.light.primary : "transparent",
          borderWidth: isCurrentUser ? 2 : 0,
        },
      ]}
    >
      <ThemedText
        type="body"
        style={[styles.rank, { color: getRankColor() }]}
      >
        {rank}
      </ThemedText>
      <Avatar preset={avatarPreset} size={40} />
      <View style={styles.info}>
        <ThemedText type="body" style={styles.name}>
          {name}
          {isCurrentUser ? ` ${t("common:you")}` : ""}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.xp, { color: theme.textSecondary }]}
        >
          {xp.toLocaleString()} XP
        </ThemedText>
      </View>
      <Feather name={getTrendIcon()} size={18} color={getTrendColor()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  rank: {
    width: 30,
    fontWeight: "700",
    textAlign: "center",
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    fontWeight: "600",
  },
  xp: {},
});
