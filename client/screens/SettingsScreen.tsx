import React, { useCallback, useState } from "react";
import { View, StyleSheet, Switch, Alert, Pressable, TouchableOpacity, Platform, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { LanguagePicker } from "@/components/LanguagePicker";
import { useTheme } from "@/hooks/useTheme";
import { useGameState } from "@/hooks/useGameState";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { SUPPORTED_LANGUAGES } from "@/i18n";
import {
  requestNotificationPermissions,
  scheduleWorkoutNotifications,
  formatTime,
  parseTimeToString,
} from "@/lib/notifications";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const [languagePickerVisible, setLanguagePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [tempHour, setTempHour] = useState(9);
  const [tempMinute, setTempMinute] = useState(0);
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
      t("settings:resetProgress"),
      t("settings:resetProgressWarning"),
      [
        { text: t("common:cancel"), style: "cancel" },
        {
          text: t("common:delete"),
          style: "destructive",
          onPress: async () => {
            await resetProgress();
            Alert.alert(t("settings:progressReset"), t("settings:progressReset"));
          },
        },
      ]
    );
  };

  const handleNotificationToggle = async () => {
    if (!userProfile) return;

    const newEnabled = !userProfile.notificationsEnabled;

    if (newEnabled) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          t("settings:notificationPermissionDenied"),
          t("settings:notificationPermissionDeniedDescription")
        );
        return;
      }
    }

    await updateProfile({ notificationsEnabled: newEnabled });
    await scheduleWorkoutNotifications(
      newEnabled,
      userProfile.notificationTime || "09:00"
    );
  };

  const openTimePicker = () => {
    if (!userProfile) return;
    const [hours, minutes] = (userProfile.notificationTime || "09:00")
      .split(":")
      .map(Number);
    setTempHour(hours);
    setTempMinute(minutes);
    setTimePickerVisible(true);
  };

  const handleTimeConfirm = async () => {
    if (!userProfile) return;
    const newTime = parseTimeToString(tempHour, tempMinute);
    await updateProfile({ notificationTime: newTime });
    if (userProfile.notificationsEnabled) {
      await scheduleWorkoutNotifications(true, newTime);
    }
    setTimePickerVisible(false);
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === i18n.language
  ) || SUPPORTED_LANGUAGES[0];

  if (loading || !userProfile) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.backgroundRoot },
        ]}
      >
        <ThemedText type="body">{t("common:loading")}</ThemedText>
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
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setLanguagePickerVisible(true)}
        >
          <View style={styles.settingInfo}>
            <Feather name="globe" size={20} color={theme.text} />
            <View style={styles.settingTextContainer}>
              <ThemedText type="body" style={styles.settingLabel}>
                {t("settings:language")}
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary, marginTop: 2 }}
              >
                {currentLanguage.nativeName}
              </ThemedText>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </Card>

      <Card elevation={1} style={styles.section}>
        <ThemedText type="body" style={styles.sectionTitle}>
          {t("settings:dailyGoal")}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.description, { color: theme.textSecondary }]}
        >
          {t("settings:dailyGoalDescription")}
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
            {userProfile.dailyGoalMinutes} {t("settings:minutes")}
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
              {t("settings:soundEffects")}
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
          {t("settings:workoutReminders")}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.description, { color: theme.textSecondary }]}
        >
          {t("settings:workoutRemindersDescription")}
        </ThemedText>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Feather name="bell" size={20} color={theme.text} />
            <ThemedText type="body" style={styles.settingLabel}>
              {t("settings:dailyReminder")}
            </ThemedText>
          </View>
          <Switch
            value={userProfile.notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{
              false: theme.backgroundTertiary,
              true: Colors.light.primary + "80",
            }}
            thumbColor={
              userProfile.notificationsEnabled
                ? Colors.light.primary
                : theme.backgroundSecondary
            }
          />
        </View>
        {userProfile.notificationsEnabled && (
          <TouchableOpacity
            style={[styles.timePickerButton, { backgroundColor: theme.backgroundSecondary }]}
            onPress={openTimePicker}
          >
            <View style={styles.settingInfo}>
              <Feather name="clock" size={20} color={theme.text} />
              <View style={styles.settingTextContainer}>
                <ThemedText type="body" style={{ marginLeft: 0 }}>
                  {t("settings:reminderTime")}
                </ThemedText>
                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary, marginTop: 2 }}
                >
                  {formatTime(userProfile.notificationTime || "09:00")}
                </ThemedText>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </Card>

      <Card elevation={1} style={styles.section}>
        <ThemedText type="body" style={styles.sectionTitle}>
          {t("settings:dataManagement")}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.description, { color: theme.textSecondary }]}
        >
          {t("settings:dataManagementDescription")}
        </ThemedText>
        <Button
          onPress={handleResetProgress}
          style={[styles.resetButton, { backgroundColor: Colors.light.error }]}
        >
          {t("settings:resetProgress")}
        </Button>
      </Card>

      <View style={styles.appInfo}>
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary, textAlign: "center" }}
        >
          {t("settings:version")}
        </ThemedText>
      </View>

      <LanguagePicker
        visible={languagePickerVisible}
        onClose={() => setLanguagePickerVisible(false)}
        currentLanguage={i18n.language}
        onLanguageChange={(lang: string) => {
          updateProfile({ language: lang });
        }}
      />

      <Modal
        visible={timePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setTimePickerVisible(false)}
        >
          <Pressable
            style={[styles.timePickerModal, { backgroundColor: theme.backgroundRoot }]}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedText type="h4" style={styles.timePickerTitle}>
              {t("settings:selectReminderTime")}
            </ThemedText>
            <View style={styles.timePickerRow}>
              <View style={styles.timePickerColumn}>
                <Pressable
                  style={styles.timePickerArrow}
                  onPress={() => setTempHour((h) => (h + 1) % 24)}
                >
                  <Feather name="chevron-up" size={28} color={theme.text} />
                </Pressable>
                <ThemedText type="h2" style={styles.timePickerValue}>
                  {tempHour.toString().padStart(2, "0")}
                </ThemedText>
                <Pressable
                  style={styles.timePickerArrow}
                  onPress={() => setTempHour((h) => (h - 1 + 24) % 24)}
                >
                  <Feather name="chevron-down" size={28} color={theme.text} />
                </Pressable>
              </View>
              <ThemedText type="h2" style={styles.timePickerColon}>:</ThemedText>
              <View style={styles.timePickerColumn}>
                <Pressable
                  style={styles.timePickerArrow}
                  onPress={() => setTempMinute((m) => (m + 5) % 60)}
                >
                  <Feather name="chevron-up" size={28} color={theme.text} />
                </Pressable>
                <ThemedText type="h2" style={styles.timePickerValue}>
                  {tempMinute.toString().padStart(2, "0")}
                </ThemedText>
                <Pressable
                  style={styles.timePickerArrow}
                  onPress={() => setTempMinute((m) => (m - 5 + 60) % 60)}
                >
                  <Feather name="chevron-down" size={28} color={theme.text} />
                </Pressable>
              </View>
            </View>
            <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: "center", marginBottom: Spacing.lg }}>
              {formatTime(parseTimeToString(tempHour, tempMinute))}
            </ThemedText>
            <View style={styles.timePickerButtons}>
              <Pressable
                style={[styles.timePickerButton2, { backgroundColor: theme.backgroundSecondary }]}
                onPress={() => setTimePickerVisible(false)}
              >
                <ThemedText type="body">{t("common:cancel")}</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.timePickerButton2, { backgroundColor: Colors.light.primary }]}
                onPress={handleTimeConfirm}
              >
                <ThemedText type="body" style={{ color: "#FFFFFF" }}>
                  {t("common:save")}
                </ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: Spacing.md,
    flex: 1,
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
  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  timePickerModal: {
    width: "80%",
    maxWidth: 320,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  timePickerTitle: {
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  timePickerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  timePickerColumn: {
    alignItems: "center",
  },
  timePickerArrow: {
    padding: Spacing.sm,
  },
  timePickerValue: {
    minWidth: 60,
    textAlign: "center",
  },
  timePickerColon: {
    marginHorizontal: Spacing.md,
  },
  timePickerButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  timePickerButton2: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
});
