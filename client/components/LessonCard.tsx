import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { Lesson, getDifficultyColor } from "@/lib/lessonData";

interface LessonCardProps {
  lesson: Lesson;
  isCompleted?: boolean;
  isLocked?: boolean;
  progress?: number;
  onPress?: () => void;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function LessonCard({
  lesson,
  isCompleted = false,
  isLocked = false,
  progress = 0,
  onPress,
}: LessonCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isLocked) {
      scale.value = withSpring(0.98, springConfig);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const difficultyColor = getDifficultyColor(lesson.difficulty);

  return (
    <AnimatedPressable
      onPress={isLocked ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundDefault,
          opacity: isLocked ? 0.6 : 1,
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.backgroundSecondary },
        ]}
      >
        <Feather
          name={lesson.icon as any}
          size={24}
          color={Colors.light.primary}
        />
      </View>
      <View style={styles.content}>
        <ThemedText type="body" style={styles.title}>
          {lesson.title}
        </ThemedText>
        <View style={styles.metaRow}>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: difficultyColor + "20" },
            ]}
          >
            <ThemedText
              type="small"
              style={[styles.difficultyText, { color: difficultyColor }]}
            >
              {lesson.difficulty}
            </ThemedText>
          </View>
          <ThemedText
            type="small"
            style={[styles.xpText, { color: theme.textSecondary }]}
          >
            +{lesson.xpReward} XP
          </ThemedText>
        </View>
        {progress > 0 && progress < 1 ? (
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: theme.backgroundTertiary },
            ]}
          >
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: Colors.light.primary,
                },
              ]}
            />
          </View>
        ) : null}
      </View>
      <View style={styles.statusIcon}>
        {isLocked ? (
          <Feather name="lock" size={20} color={theme.textSecondary} />
        ) : isCompleted ? (
          <Feather name="check-circle" size={20} color={Colors.light.success} />
        ) : (
          <Feather name="chevron-right" size={20} color={theme.textSecondary} />
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  title: {
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  xpText: {
    marginLeft: Spacing.sm,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    marginTop: Spacing.sm,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  statusIcon: {
    marginLeft: Spacing.sm,
  },
});
