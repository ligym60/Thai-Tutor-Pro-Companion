import React, { useState, useCallback } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ThemedText } from "@/components/ThemedText";
import { LessonCard } from "@/components/LessonCard";
import { CategoryChip } from "@/components/CategoryChip";
import { DifficultyChip } from "@/components/DifficultyChip";
import { useTheme } from "@/hooks/useTheme";
import { useGameState } from "@/hooks/useGameState";
import { Spacing, Colors } from "@/constants/theme";

import {
  LESSONS,
  CATEGORIES,
  DIFFICULTIES,
  Category,
  Difficulty,
} from "@/lib/lessonData";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

export default function LessonsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { lessonProgress, reload } = useGameState();
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all",
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | "all"
  >("all");

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const filteredLessons = LESSONS.filter((lesson) => {
    const categoryMatch =
      selectedCategory === "all" || lesson.category === selectedCategory;
    const difficultyMatch =
      selectedDifficulty === "all" || lesson.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleLessonPress = (lessonId: string) => {
    navigation.navigate("LessonDetail", { lessonId });
  };

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
      <ThemedText
        type="small"
        style={[styles.filterLabel, { color: theme.textSecondary }]}
      >
        Category
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <CategoryChip
          label="All"
          icon="grid"
          isSelected={selectedCategory === "all"}
          onPress={() => setSelectedCategory("all")}
        />
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat.id}
            label={cat.label}
            icon={cat.icon}
            isSelected={selectedCategory === cat.id}
            onPress={() => setSelectedCategory(cat.id)}
          />
        ))}
      </ScrollView>

      <ThemedText
        type="small"
        style={[styles.filterLabel, { color: theme.textSecondary }]}
      >
        Level
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.difficultyContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <DifficultyChip
          label="All Levels"
          color={Colors.light.primary}
          isSelected={selectedDifficulty === "all"}
          onPress={() => setSelectedDifficulty("all")}
        />
        {DIFFICULTIES.map((diff) => (
          <DifficultyChip
            key={diff.id}
            label={diff.label}
            color={diff.color}
            isSelected={selectedDifficulty === diff.id}
            onPress={() => setSelectedDifficulty(diff.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.lessonsContainer}>
        {filteredLessons.length === 0 ? (
          <ThemedText
            type="body"
            style={[styles.emptyText, { color: theme.textSecondary }]}
          >
            No lessons found in this category.
          </ThemedText>
        ) : (
          filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              isCompleted={lessonProgress[lesson.id]?.completed}
              progress={
                lessonProgress[lesson.id]
                  ? lessonProgress[lesson.id].questionsAnswered /
                    lesson.questions.length
                  : 0
              }
              onPress={() => handleLessonPress(lesson.id)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterLabel: {
    marginBottom: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  categoriesContainer: {
    marginBottom: Spacing.md,
    marginHorizontal: -Spacing.lg,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.lg,
  },
  difficultyContainer: {
    marginBottom: Spacing.lg,
    marginHorizontal: -Spacing.lg,
  },
  lessonsContainer: {
    marginTop: Spacing.sm,
  },
  emptyText: {
    textAlign: "center",
    marginTop: Spacing["2xl"],
  },
});
