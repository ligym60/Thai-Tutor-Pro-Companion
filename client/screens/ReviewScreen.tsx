import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { VocabularyWord } from "@/lib/vocabularyData";
import {
  getWordsForReview,
  getReviewStats,
  recordReview,
  ReviewQuality,
} from "@/lib/spacedRepetition";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RatingButtonProps {
  label: string;
  sublabel: string;
  quality: ReviewQuality;
  color: string;
  onPress: () => void;
}

function RatingButton({
  label,
  sublabel,
  quality,
  color,
  onPress,
}: RatingButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[
        styles.ratingButton,
        { backgroundColor: color + "20" },
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <ThemedText type="body" style={{ color, fontWeight: "600" }}>
        {label}
      </ThemedText>
      <ThemedText type="small" style={{ color: color + "99", fontSize: 10 }}>
        {sublabel}
      </ThemedText>
    </AnimatedPressable>
  );
}

export default function ReviewScreen() {
  const { theme } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();

  const [dueWords, setDueWords] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWordsLearned: 0,
    wordsForReview: 0,
    masteredWords: 0,
    reviewStreak: 0,
  });
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, correct: 0 });
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cardFlip = useSharedValue(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [words, reviewStats] = await Promise.all([
      getWordsForReview(),
      getReviewStats(),
    ]);
    setDueWords(words.slice(0, 20));
    setStats(reviewStats);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentWord = dueWords[currentIndex];

  const speakWord = useCallback(async () => {
    if (!currentWord || isSpeaking) return;

    setIsSpeaking(true);
    await Speech.speak(currentWord.thai, {
      language: "th-TH",
      rate: 0.8,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [currentWord, isSpeaking]);

  const handleShowAnswer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAnswer(true);
    speakWord();
  };

  const handleRating = async (quality: ReviewQuality) => {
    if (!currentWord) return;

    Haptics.notificationAsync(
      quality >= 3
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning,
    );

    await recordReview(currentWord.id, quality);

    setSessionStats((prev) => ({
      reviewed: prev.reviewed + 1,
      correct: quality >= 3 ? prev.correct + 1 : prev.correct,
    }));

    if (currentIndex < dueWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      await loadData();
      setCurrentIndex(0);
      setShowAnswer(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText type="body">Loading review...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (dueWords.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.emptyContainer,
            { paddingBottom: tabBarHeight + Spacing.xl },
          ]}
        >
          <Card elevation={2} style={styles.emptyCard}>
            <View
              style={[
                styles.celebrateIcon,
                { backgroundColor: "#4CAF50" + "20" },
              ]}
            >
              <Feather name="check-circle" size={48} color="#4CAF50" />
            </View>
            <ThemedText
              type="h3"
              style={{ textAlign: "center", marginTop: Spacing.lg }}
            >
              All Caught Up!
            </ThemedText>
            <ThemedText
              type="body"
              style={{
                textAlign: "center",
                color: theme.textSecondary,
                marginTop: Spacing.sm,
              }}
            >
              No words are due for review right now. Come back later or practice
              speaking!
            </ThemedText>
          </Card>

          <Card elevation={2} style={styles.statsCard}>
            <ThemedText
              type="body"
              style={{ fontWeight: "600", marginBottom: Spacing.md }}
            >
              Your Progress
            </ThemedText>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <ThemedText type="h3" style={{ color: theme.primary }}>
                  {stats.totalWordsLearned}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Words Learned
                </ThemedText>
              </View>

              <View style={styles.statItem}>
                <ThemedText type="h3" style={{ color: "#4CAF50" }}>
                  {stats.masteredWords}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Mastered
                </ThemedText>
              </View>

              <View style={styles.statItem}>
                <ThemedText type="h3" style={{ color: "#FF9800" }}>
                  {stats.reviewStreak}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Day Streak
                </ThemedText>
              </View>
            </View>
          </Card>

          <Button onPress={loadData} style={{ marginTop: Spacing.lg }}>
            Refresh
          </Button>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
      >
        <View style={styles.progressHeader}>
          <View
            style={[
              styles.progressBadge,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Feather name="layers" size={16} color={theme.primary} />
            <ThemedText
              type="small"
              style={{ marginLeft: 6, color: theme.textSecondary }}
            >
              {currentIndex + 1} / {dueWords.length}
            </ThemedText>
          </View>
          <View
            style={[
              styles.progressBadge,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <Feather name="target" size={16} color="#4CAF50" />
            <ThemedText
              type="small"
              style={{ marginLeft: 6, color: theme.textSecondary }}
            >
              {sessionStats.correct}/{sessionStats.reviewed} correct
            </ThemedText>
          </View>
        </View>

        <Card elevation={2} style={styles.wordCard}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <ThemedText
              type="small"
              style={{ color: theme.primary, fontWeight: "600" }}
            >
              {currentWord?.category}
            </ThemedText>
          </View>

          <ThemedText
            type="body"
            style={{ color: theme.textSecondary, marginBottom: Spacing.md }}
          >
            What does this mean?
          </ThemedText>

          <ThemedText type="h1" style={styles.thaiText}>
            {currentWord?.thai}
          </ThemedText>

          <ThemedText
            type="body"
            style={{ color: theme.textSecondary, marginTop: Spacing.sm }}
          >
            {currentWord?.romanization}
          </ThemedText>

          <Pressable
            style={[
              styles.speakerButton,
              {
                backgroundColor: isSpeaking
                  ? theme.primary
                  : theme.primary + "20",
              },
            ]}
            onPress={speakWord}
            disabled={isSpeaking}
          >
            <Feather
              name="volume-2"
              size={20}
              color={isSpeaking ? "#fff" : theme.primary}
            />
          </Pressable>

          {showAnswer ? (
            <Animated.View entering={FadeIn} style={styles.answerContainer}>
              <View
                style={[styles.divider, { backgroundColor: theme.border }]}
              />
              <ThemedText
                type="h3"
                style={{ color: theme.primary, marginTop: Spacing.lg }}
              >
                {currentWord?.english}
              </ThemedText>

              {currentWord?.exampleSentence ? (
                <View
                  style={[
                    styles.exampleContainer,
                    { backgroundColor: theme.backgroundRoot },
                  ]}
                >
                  <ThemedText
                    type="small"
                    style={{ fontWeight: "600", marginBottom: 4 }}
                  >
                    Example:
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {currentWord.exampleSentence.thai}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.primary, marginTop: 4 }}
                  >
                    {currentWord.exampleSentence.english}
                  </ThemedText>
                </View>
              ) : null}
            </Animated.View>
          ) : null}
        </Card>

        {!showAnswer ? (
          <Button onPress={handleShowAnswer} style={styles.showAnswerButton}>
            Show Answer
          </Button>
        ) : (
          <View style={styles.ratingContainer}>
            <ThemedText
              type="body"
              style={{ textAlign: "center", marginBottom: Spacing.md }}
            >
              How well did you remember?
            </ThemedText>

            <View style={styles.ratingGrid}>
              <RatingButton
                label="Again"
                sublabel="< 1 min"
                quality={0}
                color="#E53935"
                onPress={() => handleRating(0)}
              />
              <RatingButton
                label="Hard"
                sublabel="1 day"
                quality={2}
                color="#FF9800"
                onPress={() => handleRating(2)}
              />
              <RatingButton
                label="Good"
                sublabel="3 days"
                quality={3}
                color="#4CAF50"
                onPress={() => handleRating(3)}
              />
              <RatingButton
                label="Easy"
                sublabel="1 week"
                quality={5}
                color="#2196F3"
                onPress={() => handleRating(5)}
              />
            </View>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  emptyCard: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  celebrateIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  statsCard: {
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  wordCard: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  categoryBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  thaiText: {
    fontSize: 48,
    textAlign: "center",
  },
  speakerButton: {
    marginTop: Spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  answerContainer: {
    width: "100%",
    alignItems: "center",
  },
  divider: {
    height: 1,
    width: "100%",
    marginTop: Spacing.lg,
  },
  exampleContainer: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    width: "100%",
  },
  showAnswerButton: {
    marginTop: Spacing.xl,
  },
  ratingContainer: {
    marginTop: Spacing.xl,
  },
  ratingGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  ratingButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderRadius: BorderRadius.md,
  },
});
