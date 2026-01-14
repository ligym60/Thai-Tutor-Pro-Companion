import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { STORIES, Story } from "@/lib/storyData";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DIFFICULTY_COLORS = {
  beginner: Colors.light.success,
  intermediate: Colors.light.warning,
  advanced: "#E91E63",
  expert: Colors.light.primary,
};

interface StoryCardProps {
  story: Story;
  onPress: () => void;
}

function StoryCard({ story, onPress }: StoryCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const difficultyColor = DIFFICULTY_COLORS[story.difficulty];

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.storyCard,
        { backgroundColor: theme.backgroundSecondary },
        animatedStyle,
      ]}
    >
      <View style={styles.storyHeader}>
        <View style={styles.storyTitleContainer}>
          <ThemedText type="h4" numberOfLines={1}>
            {t(`storyMeta:${story.id}.title`)}
          </ThemedText>
          <ThemedText type="body" style={styles.storyTitleThai}>
            {story.titleThai}
          </ThemedText>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor + "20" }]}>
          <ThemedText type="small" style={{ color: difficultyColor, fontWeight: "600" }}>
            {t(`stories:difficulty.${story.difficulty}`)}
          </ThemedText>
        </View>
      </View>

      <ThemedText type="small" style={[styles.storyDescription, { color: theme.textSecondary }]}>
        {t(`storyMeta:${story.id}.description`)}
      </ThemedText>

      <View style={styles.storyFooter}>
        <View style={styles.wordCount}>
          <Feather name="type" size={14} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.xs }}>
            {story.words.length} {t("stories:words")}
          </ThemedText>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </View>
    </AnimatedPressable>
  );
}

type DifficultyFilter = "all" | "beginner" | "intermediate" | "advanced" | "expert";

export default function StoriesScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>("all");

  const filteredStories = selectedDifficulty === "all"
    ? STORIES
    : STORIES.filter((story) => story.difficulty === selectedDifficulty);

  const handleStoryPress = (storyId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("StoryReader", { storyId });
  };

  const difficulties: DifficultyFilter[] = ["all", "beginner", "intermediate", "advanced", "expert"];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <View style={[styles.expertBadge, { backgroundColor: Colors.light.primary + "20" }]}>
            <Feather name="star" size={16} color={Colors.light.primary} />
            <ThemedText type="small" style={{ color: Colors.light.primary, marginLeft: Spacing.xs, fontWeight: "600" }}>
              {t("stories:expertMode")}
            </ThemedText>
          </View>
          <ThemedText type="h3" style={styles.introTitle}>
            {t("stories:storyReading")}
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            {t("stories:storyReadingDesc")}
          </ThemedText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {difficulties.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            const color = diff === "all" ? Colors.light.primary : DIFFICULTY_COLORS[diff];
            return (
              <Pressable
                key={diff}
                onPress={() => {
                  setSelectedDifficulty(diff);
                  Haptics.selectionAsync();
                }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? color : theme.backgroundSecondary,
                    borderColor: color,
                    borderWidth: 1,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{ color: isSelected ? "#FFFFFF" : color, fontWeight: "500" }}
                >
                  {diff === "all" ? t("stories:allStories") : t(`stories:difficulty.${diff}`)}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.storiesList}>
          {filteredStories.length === 0 ? (
            <ThemedText type="body" style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t("stories:noStories")}
            </ThemedText>
          ) : (
            filteredStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onPress={() => handleStoryPress(story.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  intro: {
    marginBottom: Spacing.xl,
  },
  expertBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  introTitle: {
    marginBottom: Spacing.sm,
  },
  filterContainer: {
    marginBottom: Spacing.lg,
    marginHorizontal: -Spacing.lg,
  },
  filterContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  storiesList: {
    gap: Spacing.md,
  },
  storyCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius["2xl"],
  },
  storyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  storyTitleContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  storyTitleThai: {
    opacity: 0.7,
    marginTop: 2,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  storyDescription: {
    marginBottom: Spacing.md,
  },
  storyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wordCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: Spacing["2xl"],
  },
});
