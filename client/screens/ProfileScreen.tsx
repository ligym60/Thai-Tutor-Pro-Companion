import React, { useCallback } from "react";
import { View, StyleSheet, TextInput, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { AchievementBadge } from "@/components/AchievementBadge";
import { useTheme } from "@/hooks/useTheme";
import { useGameState } from "@/hooks/useGameState";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const {
    userProfile,
    progress,
    achievements,
    loading,
    updateProfile,
    getAccuracy,
    reload,
  } = useGameState();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const handleAvatarPress = () => {
    if (!userProfile) return;
    const nextPreset = (userProfile.avatarPreset + 1) % 3;
    updateProfile({ avatarPreset: nextPreset });
  };

  const handleNameChange = (text: string) => {
    updateProfile({ displayName: text });
  };

  if (loading || !userProfile || !progress || !achievements) {
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
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing["4xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.profileHeader}>
        <Avatar
          preset={userProfile.avatarPreset}
          size={80}
          onPress={handleAvatarPress}
        />
        <ThemedText
          type="small"
          style={[styles.tapHint, { color: theme.textSecondary }]}
        >
          Tap to change avatar
        </ThemedText>
        <TextInput
          style={[
            styles.nameInput,
            {
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          value={userProfile.displayName}
          onChangeText={handleNameChange}
          placeholder="Your name"
          placeholderTextColor={theme.textSecondary}
        />
      </View>

      <Card elevation={1} style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Feather name="zap" size={24} color={Colors.light.streakGold} />
            <ThemedText type="h4" style={styles.statValue}>
              {progress.currentStreak}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Streak
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <Feather name="star" size={24} color={Colors.light.primary} />
            <ThemedText type="h4" style={styles.statValue}>
              {progress.totalXP}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Total XP
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <Feather name="book" size={24} color={Colors.light.success} />
            <ThemedText type="h4" style={styles.statValue}>
              {progress.lessonsCompleted}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Lessons
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <Feather name="target" size={24} color={Colors.light.secondary} />
            <ThemedText type="h4" style={styles.statValue}>
              {getAccuracy()}%
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Accuracy
            </ThemedText>
          </View>
        </View>
      </Card>

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Achievements</ThemedText>
      </View>

      <View style={styles.achievementsGrid}>
        {Object.entries(achievements).map(([key, value]) => (
          <AchievementBadge key={key} type={key} unlocked={value.unlocked} />
        ))}
      </View>

      <Button
        onPress={() => navigation.navigate("Settings")}
        style={styles.settingsButton}
      >
        Settings
      </Button>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  tapHint: {
    marginTop: Spacing.xs,
  },
  nameInput: {
    marginTop: Spacing.lg,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    minWidth: 150,
  },
  statsCard: {
    marginBottom: Spacing["2xl"],
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    marginTop: Spacing.sm,
  },
  sectionHeader: {
    marginBottom: Spacing.lg,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  settingsButton: {
    marginTop: Spacing.xl,
  },
});
