import React, { useCallback } from "react";
import { View, StyleSheet, Switch, Alert, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import { Feather } from "@expo/vector-icons";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useGameState } from "@/hooks/useGameState";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const {
    userProfile,
    loading,
    updateProfile,
    resetProgress,
    reload,
  } = useGameState();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const handleDailyGoalChange = (value: number) => {
    const roundedValue = Math.round(value / 5) * 5;
    updateProfile({ dailyGoalMinutes: Math.max(5, Math.min(30, roundedValue)) });
  };

  const handleSoundToggle = () => {
    if (!userProfile) return;
    updateProfile({ soundEnabled: !userProfile.soundEnabled });
  };

  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "This will erase all your learning progress, XP, and achievements. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetProgress();
            Alert.alert("Progress Reset", "Your progress has been reset.");
          },
        },
      ]
    );
  };

  if (loading || !userProfile) {
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
        paddingBottom: insets.bottom + Spacing["2xl"],
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <Card elevation={1} style={styles.section}>
        <ThemedText type="body" style={styles.sectionTitle}>
          Daily Goal
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.description, { color: theme.textSecondary }]}
        >
          Set your daily learning target
        </ThemedText>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={5}
            maximumValue={30}
            step={5}
            value={userProfile.dailyGoalMinutes}
            onSlidingComplete={handleDailyGoalChange}
            minimumTrackTintColor={Colors.light.primary}
            maximumTrackTintColor={theme.backgroundTertiary}
            thumbTintColor={Colors.light.primary}
          />
          <ThemedText type="h4" style={styles.sliderValue}>
            {userProfile.dailyGoalMinutes} min
          </ThemedText>
        </View>
        <View style={styles.goalPresets}>
          {[5, 10, 15, 30].map((value) => (
            <Pressable
              key={value}
              style={[
                styles.goalPreset,
                {
                  backgroundColor:
                    userProfile.dailyGoalMinutes === value
                      ? Colors.light.primary
                      : theme.backgroundSecondary,
                },
              ]}
              onPress={() => updateProfile({ dailyGoalMinutes: value })}
            >
              <ThemedText
                type="small"
                style={{
                  color:
                    userProfile.dailyGoalMinutes === value
                      ? "#FFFFFF"
                      : theme.text,
                  fontWeight: "600",
                }}
              >
                {value}m
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card elevation={1} style={styles.section}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Feather name="volume-2" size={20} color={theme.text} />
            <ThemedText type="body" style={styles.settingLabel}>
              Sound Effects
            </ThemedText>
          </View>
          <Switch
            value={userProfile.soundEnabled}
            onValueChange={handleSoundToggle}
            trackColor={{
              false: theme.backgroundTertiary,
              true: Colors.light.primary + "80",
            }}
            thumbColor={
              userProfile.soundEnabled
                ? Colors.light.primary
                : theme.backgroundSecondary
            }
          />
        </View>
      </Card>

      <Card elevation={1} style={styles.section}>
        <ThemedText type="body" style={styles.sectionTitle}>
          Data Management
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.description, { color: theme.textSecondary }]}
        >
          Reset your learning progress if you want to start fresh.
        </ThemedText>
        <Button
          onPress={handleResetProgress}
          style={[styles.resetButton, { backgroundColor: Colors.light.error }]}
        >
          Reset All Progress
        </Button>
      </Card>

      <View style={styles.appInfo}>
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary, textAlign: "center" }}
        >
          SawasdeeLearn v1.0.0
        </ThemedText>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  description: {
    marginBottom: Spacing.lg,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    flex: 1,
  },
  sliderValue: {
    minWidth: 60,
    textAlign: "right",
  },
  goalPresets: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.lg,
  },
  goalPreset: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    marginLeft: Spacing.md,
  },
  resetButton: {
    marginTop: Spacing.sm,
  },
  appInfo: {
    marginTop: Spacing["2xl"],
  },
});
