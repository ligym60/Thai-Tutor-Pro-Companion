import React, { useCallback } from "react";
import { ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { StreakCard } from "@/components/StreakCard";
import { XPProgressBar } from "@/components/XPProgressBar";
import { StatsGrid } from "@/components/StatsGrid";
import { LessonCard } from "@/components/LessonCard";
import { useTheme } from "@/hooks/useTheme";
import { useGameState } from "@/hooks/useGameState";
import { Spacing } from "@/constants/theme";
import { LESSONS } from "@/lib/lessonData";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
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

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

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
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={reload} />
      }
    >
      <ThemedText type="h3" style={styles.greeting}>
        Hello, {userProfile.displayName}
      </ThemedText>

      <StreakCard streak={progress.currentStreak} />

      <XPProgressBar
        dailyXP={progress.dailyXPEarned}
        dailyGoal={userProfile.dailyGoalMinutes}
        progress={getDailyGoalProgress()}
      />

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Today's Lesson</ThemedText>
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
});
