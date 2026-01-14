import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors } from "@/constants/theme";

interface StatItemProps {
  icon: string;
  value: string | number;
  label: string;
  color: string;
}

function StatItem({ icon, value, label, color }: StatItemProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.statItem}>
      <View style={[styles.iconCircle, { backgroundColor: color + "20" }]}>
        <Feather name={icon as any} size={20} color={color} />
      </View>
      <ThemedText type="h4" style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.statLabel, { color: theme.textSecondary }]}
      >
        {label}
      </ThemedText>
    </View>
  );
}

interface StatsGridProps {
  totalXP: number;
  lessonsCompleted: number;
  accuracy: number;
}

export function StatsGrid({ totalXP, lessonsCompleted, accuracy }: StatsGridProps) {
  const { t } = useTranslation();

  return (
    <Card elevation={1} style={styles.card}>
      <View style={styles.grid}>
        <StatItem
          icon="book"
          value={lessonsCompleted}
          label={t("common:lessons")}
          color={Colors.light.primary}
        />
        <StatItem
          icon="percent"
          value={`${accuracy}%`}
          label={t("common:accuracy")}
          color={Colors.light.success}
        />
        <StatItem
          icon="star"
          value={totalXP}
          label={t("common:totalXp")}
          color={Colors.light.secondary}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: Spacing.lg,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    marginTop: Spacing.sm,
  },
  statLabel: {
    marginTop: Spacing.xs,
  },
});
