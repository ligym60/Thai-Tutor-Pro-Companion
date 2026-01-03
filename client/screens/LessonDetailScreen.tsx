import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { AnswerCard } from "@/components/AnswerCard";
import { ProgressBar } from "@/components/ProgressBar";
import { LivesIndicator } from "@/components/LivesIndicator";
import { SpeakerButton } from "@/components/SpeakerButton";
import { useTheme } from "@/hooks/useTheme";
import { useGameState } from "@/hooks/useGameState";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { getLessonById, Question } from "@/lib/lessonData";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type LessonDetailRouteProp = RouteProp<RootStackParamList, "LessonDetail">;

export default function LessonDetailScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<LessonDetailRouteProp>();
  const { progress, completeLesson, loseLife, reload } = useGameState();

  const lesson = getLessonById(route.params.lessonId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [lives, setLives] = useState(progress?.lives || 5);
  const [isComplete, setIsComplete] = useState(false);

  const shakeX = useSharedValue(0);
  const feedbackOpacity = useSharedValue(0);

  useEffect(() => {
    if (progress) {
      setLives(progress.lives);
    }
  }, [progress]);

  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const animatedFeedbackStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
  }));

  const handleClose = () => {
    navigation.goBack();
  };

  const handleSelectAnswer = (index: number) => {
    if (!isChecked) {
      setSelectedAnswer(index);
      Haptics.selectionAsync();
    }
  };

  const handleCheck = async () => {
    if (selectedAnswer === null || !lesson) return;

    const currentQuestion = lesson.questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswer;

    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      setCorrectCount((prev) => prev + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      const hasLives = await loseLife();
      setLives((prev) => prev - 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );

      if (!hasLives) {
        Alert.alert(
          "Out of Lives",
          "You've run out of lives. Try again tomorrow!",
          [{ text: "OK", onPress: handleClose }]
        );
        return;
      }
    }

    feedbackOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(1, { duration: 800 }),
      withTiming(0, { duration: 200 })
    );
  };

  const handleContinue = async () => {
    if (!lesson) return;

    if (currentQuestionIndex >= lesson.questions.length - 1) {
      setIsComplete(true);
      await completeLesson(
        lesson.id,
        correctCount + (isCorrect ? 0 : 0),
        lesson.questions.length,
        lesson.xpReward
      );
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsChecked(false);
      setIsCorrect(false);
    }
  };

  const handleFinish = () => {
    reload();
    navigation.goBack();
  };

  if (!lesson) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText type="body">Lesson not found</ThemedText>
        <Button onPress={handleClose}>Go Back</Button>
      </ThemedView>
    );
  }

  if (isComplete) {
    const score = Math.round((correctCount / lesson.questions.length) * 100);
    const isPerfect = score === 100;

    return (
      <ThemedView
        style={[
          styles.container,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <View style={styles.completeContainer}>
          <Feather
            name={isPerfect ? "award" : "check-circle"}
            size={80}
            color={isPerfect ? Colors.light.streakGold : Colors.light.success}
          />
          <ThemedText type="h2" style={styles.completeTitle}>
            {isPerfect ? "Perfect!" : "Lesson Complete!"}
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.completeSubtitle, { color: theme.textSecondary }]}
          >
            You got {correctCount} out of {lesson.questions.length} correct
          </ThemedText>

          <View style={styles.rewardCard}>
            <View style={styles.rewardItem}>
              <Feather name="star" size={24} color={Colors.light.primary} />
              <ThemedText type="h4" style={styles.rewardValue}>
                +{lesson.xpReward}
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
              >
                XP Earned
              </ThemedText>
            </View>
            <View style={styles.rewardItem}>
              <Feather name="percent" size={24} color={Colors.light.success} />
              <ThemedText type="h4" style={styles.rewardValue}>
                {score}%
              </ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textSecondary }}
              >
                Score
              </ThemedText>
            </View>
          </View>

          <Button onPress={handleFinish} style={styles.finishButton}>
            Continue
          </Button>
        </View>
      </ThemedView>
    );
  }

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const progressValue = (currentQuestionIndex + 1) / lesson.questions.length;

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.lg,
        },
      ]}
    >
      <View style={styles.header}>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Feather name="x" size={24} color={theme.text} />
        </Pressable>
        <View style={styles.progressContainer}>
          <ProgressBar progress={progressValue} />
        </View>
        <LivesIndicator lives={lives} />
      </View>

      <Animated.View style={[styles.content, animatedShakeStyle]}>
        <View style={styles.questionContainer}>
          <View style={styles.thaiRow}>
            <ThemedText type="thaiLarge" style={styles.thaiText}>
              {currentQuestion.thai}
            </ThemedText>
            <SpeakerButton text={currentQuestion.thai} size="medium" />
          </View>
          <ThemedText
            type="body"
            style={[styles.romanization, { color: theme.textSecondary }]}
          >
            {currentQuestion.romanization}
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.instruction, { color: theme.textSecondary }]}
          >
            What does this mean?
          </ThemedText>
        </View>

        <View style={styles.answersContainer}>
          {currentQuestion.options.map((option, index) => (
            <AnswerCard
              key={index}
              text={option}
              isSelected={selectedAnswer === index}
              isCorrect={
                isChecked && index === currentQuestion.correctAnswer
              }
              isIncorrect={
                isChecked &&
                selectedAnswer === index &&
                index !== currentQuestion.correctAnswer
              }
              disabled={isChecked}
              onPress={() => handleSelectAnswer(index)}
            />
          ))}
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.feedback,
          {
            backgroundColor: isCorrect
              ? Colors.light.success
              : Colors.light.error,
          },
          animatedFeedbackStyle,
        ]}
        pointerEvents="none"
      >
        <Feather
          name={isCorrect ? "check" : "x"}
          size={32}
          color="#FFFFFF"
        />
        <ThemedText type="h4" style={styles.feedbackText}>
          {isCorrect ? "Correct!" : "Incorrect"}
        </ThemedText>
      </Animated.View>

      <View style={styles.footer}>
        {isChecked ? (
          <Button onPress={handleContinue} style={styles.actionButton}>
            Continue
          </Button>
        ) : (
          <Button
            onPress={handleCheck}
            disabled={selectedAnswer === null}
            style={styles.actionButton}
          >
            Check
          </Button>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: Spacing.lg,
  },
  content: {
    flex: 1,
  },
  questionContainer: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  thaiRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  thaiText: {
    textAlign: "center",
  },
  romanization: {
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: Spacing.lg,
  },
  instruction: {
    textAlign: "center",
  },
  answersContainer: {
    flex: 1,
  },
  feedback: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: [{ translateX: -60 }, { translateY: -30 }],
    width: 120,
    height: 60,
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackText: {
    color: "#FFFFFF",
    marginLeft: Spacing.sm,
  },
  footer: {
    marginTop: Spacing.lg,
  },
  actionButton: {
    width: "100%",
  },
  completeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  completeTitle: {
    marginTop: Spacing.xl,
    textAlign: "center",
  },
  completeSubtitle: {
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  rewardCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: Spacing["3xl"],
    paddingVertical: Spacing.xl,
  },
  rewardItem: {
    alignItems: "center",
  },
  rewardValue: {
    marginTop: Spacing.sm,
  },
  finishButton: {
    width: "100%",
    marginTop: Spacing["3xl"],
  },
});
