import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface AchievementBadgeProps {
  type: string;
  unlocked: boolean;
}

const ACHIEVEMENT_DATA: Record<
  string,
  { icon: string; color: string }
> = {
  firstLesson: { icon: "star", color: "#CD7F32" },
  streak7: { icon: "zap", color: "#FF6B6B" },
  lessons50: { icon: "award", color: "#FFD700" },
  perfectScore: { icon: "target", color: "#4ECDC4" },
  streak30: { icon: "crown", color: "#9B59B6" },
  thaiMaster: { icon: "trophy", color: "#F39C12" },
};

export function AchievementBadge({ type, unlocked }: AchievementBadgeProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const data = ACHIEVEMENT_DATA[type] || {
    icon: "circle",
    color: "#757575",
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: unlocked
              ? data.color + "30"
              : theme.backgroundSecondary,
          },
        ]}
      >
        <Feather
          name={data.icon as any}
          size={24}
          color={unlocked ? data.color : theme.textSecondary}
        />
      </View>
      <ThemedText
        type="small"
        style={[
          styles.label,
          { color: unlocked ? theme.text : theme.textSecondary },
        ]}
      >
        {t(`profile:achievementNames.${type}`)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "33%",
    marginBottom: Spacing.lg,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: Spacing.xs,
    textAlign: "center",
  },
});
