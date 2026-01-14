import React, { useCallback, useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, RefreshControl, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/ThemedText";
import { StreakCard } from "@/components/StreakCard";
import { XPProgressBar } from "@/components/XPProgressBar";
import { StatsGrid } from "@/components/StatsGrid";
import { LessonCard } from "@/components/LessonCard";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { useGameState } from "@/hooks/useGameState";
import { Spacing, BorderRadius } from "@/constants/theme";
import { LESSONS } from "@/lib/lessonData";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getReviewStats } from "@/lib/spacedRepetition";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    userProfile,
    progress,
    lessonProgress,
    loading,
    getDailyGoalProgress,
    getAccuracy,
    reload,
  } = useGameState();
  
  const [reviewStats, setReviewStats] = useState({ wordsForReview: 0, totalWordsLearned: 0 });

  useFocusEffect(
    useCallback(() => {
      reload();
      getReviewStats().then(setReviewStats);
    }, [reload])
  );

  const handleSpeakingPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("SpeakingPractice");
  };

  const handleReviewPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Review");
  };

  const handleWritingPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("WritingPractice");
  };

  const nextLesson = LESSONS.find(
    (lesson) => !lessonProgress[lesson.id]?.completed
  ) || LESSONS[0];

  const handleLessonPress = () => {
    navigation.navigate("LessonDetail", { lessonId: nextLesson.id });
  };

  if (loading || !progress || !userProfile) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.backgroundRoot },
        ]}
      >
        <ThemedText type="body">{t("home:loading")}</ThemedText>
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
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={reload} />
      }
    >
      <ThemedText type="h3" style={styles.greeting}>
        {t("home:greeting", { name: userProfile.displayName })}
      </ThemedText>

      <StreakCard streak={progress.currentStreak} />

      <XPProgressBar
        dailyXP={progress.dailyXPEarned}
        dailyGoal={userProfile.dailyGoalMinutes}
        progress={getDailyGoalProgress()}
      />

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">{t("home:todaysLesson")}</ThemedText>
      </View>

      <LessonCard
        lesson={nextLesson}
        isCompleted={lessonProgress[nextLesson.id]?.completed}
        onPress={handleLessonPress}
      />

      <StatsGrid
        totalXP={progress.totalXP}
        lessonsCompleted={progress.lessonsCompleted}
        accuracy={getAccuracy()}
      />

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">{t("home:practiceModes")}</ThemedText>
      </View>

      <View style={styles.practiceRow}>
        <Card elevation={2} onPress={handleSpeakingPress} style={styles.practiceCard}>
          <View style={[styles.practiceIcon, { backgroundColor: "#2196F3" + "20" }]}>
            <Feather name="mic" size={24} color="#2196F3" />
          </View>
          <ThemedText type="small" style={{ fontWeight: "600", marginTop: Spacing.sm }}>
            {t("home:speaking")}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 10 }}>
            {t("home:listenAndRepeat")}
          </ThemedText>
        </Card>

        <Card elevation={2} onPress={handleReviewPress} style={styles.practiceCard}>
          <View style={[styles.practiceIcon, { backgroundColor: "#9C27B0" + "20" }]}>
            <Feather name="layers" size={24} color="#9C27B0" />
          </View>
          <ThemedText type="small" style={{ fontWeight: "600", marginTop: Spacing.sm }}>
            {t("home:review")}
          </ThemedText>
          {reviewStats.wordsForReview > 0 ? (
            <View style={styles.reviewBadge}>
              <ThemedText type="small" style={{ color: "#FF9800", fontWeight: "600", fontSize: 10 }}>
                {reviewStats.wordsForReview} {t("home:due")}
              </ThemedText>
            </View>
          ) : (
            <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 10 }}>
              {t("home:spacedRepetition")}
            </ThemedText>
          )}
        </Card>
      </View>

      <View style={[styles.practiceRow, { marginTop: Spacing.md }]}>
        <Card elevation={2} onPress={handleWritingPress} style={styles.practiceCard}>
          <View style={[styles.practiceIcon, { backgroundColor: "#FF5722" + "20" }]}>
            <Feather name="edit-3" size={24} color="#FF5722" />
          </View>
          <ThemedText type="small" style={{ fontWeight: "600", marginTop: Spacing.sm }}>
            {t("home:writing")}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 10 }}>
            {t("home:traceCharacters")}
          </ThemedText>
        </Card>

        <View style={styles.practiceCard} />
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
  greeting: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    marginTop: Spacing["2xl"],
    marginBottom: Spacing.md,
  },
  practiceRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  practiceCard: {
    flex: 1,
    padding: Spacing.md,
    alignItems: "center",
  },
  practiceIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewBadge: {
    backgroundColor: "#FF9800" + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: 2,
  },
});
