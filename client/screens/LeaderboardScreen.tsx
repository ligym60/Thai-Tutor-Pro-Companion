import React, { useState, useCallback, useMemo } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { CategoryChip } from "@/components/CategoryChip";
import { LeaderboardItem } from "@/components/LeaderboardItem";
import { Avatar } from "@/components/Avatar";
import { useTheme } from "@/hooks/useTheme";
import { useGameState } from "@/hooks/useGameState";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { generateLeaderboard, getUserRank } from "@/lib/leaderboardData";

type TimeFilter = "week" | "all";

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { progress, userProfile, reload } = useGameState();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const leaderboard = useMemo(() => {
    if (!progress || !userProfile) return [];
    return generateLeaderboard(progress.totalXP, userProfile.displayName);
  }, [progress, userProfile]);

  const userRank = getUserRank(leaderboard);
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  if (!progress || !userProfile) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.backgroundRoot },
        ]}
      >
        <ThemedText type="body">Loading...</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing["4xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.filterContainer}>
        <CategoryChip
          label="This Week"
          icon="calendar"
          isSelected={timeFilter === "week"}
          onPress={() => setTimeFilter("week")}
        />
        <CategoryChip
          label="All Time"
          icon="clock"
          isSelected={timeFilter === "all"}
          onPress={() => setTimeFilter("all")}
        />
      </View>

      <View style={styles.podiumContainer}>
        {topThree[1] ? (
          <View style={styles.podiumItem}>
            <Avatar preset={topThree[1].avatarPreset} size={50} />
            <View
              style={[
                styles.podiumBadge,
                { backgroundColor: "#C0C0C0" },
              ]}
            >
              <ThemedText type="small" style={styles.podiumRank}>
                2
              </ThemedText>
            </View>
            <ThemedText type="small" style={styles.podiumName} numberOfLines={1}>
              {topThree[1].name}
            </ThemedText>
            <ThemedText
              type="small"
              style={[styles.podiumXP, { color: theme.textSecondary }]}
            >
              {topThree[1].xp.toLocaleString()}
            </ThemedText>
          </View>
        ) : null}

        {topThree[0] ? (
          <View style={[styles.podiumItem, styles.firstPlace]}>
            <Feather name="award" size={24} color="#FFD700" style={styles.crown} />
            <Avatar preset={topThree[0].avatarPreset} size={60} />
            <View
              style={[
                styles.podiumBadge,
                { backgroundColor: "#FFD700" },
              ]}
            >
              <ThemedText type="small" style={styles.podiumRank}>
                1
              </ThemedText>
            </View>
            <ThemedText type="small" style={styles.podiumName} numberOfLines={1}>
              {topThree[0].name}
            </ThemedText>
            <ThemedText
              type="small"
              style={[styles.podiumXP, { color: theme.textSecondary }]}
            >
              {topThree[0].xp.toLocaleString()}
            </ThemedText>
          </View>
        ) : null}

        {topThree[2] ? (
          <View style={styles.podiumItem}>
            <Avatar preset={topThree[2].avatarPreset} size={50} />
            <View
              style={[
                styles.podiumBadge,
                { backgroundColor: "#CD7F32" },
              ]}
            >
              <ThemedText type="small" style={styles.podiumRank}>
                3
              </ThemedText>
            </View>
            <ThemedText type="small" style={styles.podiumName} numberOfLines={1}>
              {topThree[2].name}
            </ThemedText>
            <ThemedText
              type="small"
              style={[styles.podiumXP, { color: theme.textSecondary }]}
            >
              {topThree[2].xp.toLocaleString()}
            </ThemedText>
          </View>
        ) : null}
      </View>

      <View style={styles.listContainer}>
        {rest.map((entry, index) => (
          <LeaderboardItem
            key={entry.id}
            rank={index + 4}
            name={entry.name}
            avatarPreset={entry.avatarPreset}
            xp={entry.xp}
            trend={entry.trend}
            isCurrentUser={entry.id === "current-user"}
          />
        ))}
      </View>

      <View
        style={[
          styles.userRankCard,
          { backgroundColor: Colors.light.primary + "15" },
        ]}
      >
        <ThemedText type="body" style={styles.userRankLabel}>
          Your Rank
        </ThemedText>
        <ThemedText type="h2" style={{ color: Colors.light.primary }}>
          #{userRank}
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: Spacing.xl,
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: Spacing["2xl"],
  },
  podiumItem: {
    alignItems: "center",
    width: 90,
  },
  firstPlace: {
    marginBottom: Spacing.lg,
    marginHorizontal: Spacing.md,
  },
  crown: {
    marginBottom: Spacing.xs,
  },
  podiumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -12,
  },
  podiumRank: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  podiumName: {
    marginTop: Spacing.xs,
    fontWeight: "600",
  },
  podiumXP: {
    marginTop: 2,
  },
  listContainer: {
    marginTop: Spacing.md,
  },
  userRankCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  userRankLabel: {
    fontWeight: "500",
    marginBottom: Spacing.xs,
  },
});
