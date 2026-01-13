import React, { useState, useEffect, useMemo } from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
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
import { getRandomPracticeQuestions, Question } from "@/lib/lessonData";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const PRACTICE_XP_REWARD = 5;
const PRACTICE_QUESTION_COUNT = 5;

export default function PracticeScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { progress, addXP, loseLife, reload } = useGameState();

  const questions = useMemo(
    () => getRandomPracticeQuestions(PRACTICE_QUESTION_COUNT),
    [],
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [lives, setLives] = useState(progress?.lives || 5);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

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
    if (selectedAnswer === null || questions.length === 0) return;

    const currentQuestion = questions[currentQuestionIndex];
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
        withTiming(0, { duration: 50 }),
      );

      if (!hasLives) {
        Alert.alert(
          "Out of Lives",
          "You've run out of lives. Try again tomorrow!",
          [{ text: "OK", onPress: handleClose }],
        );
        return;
      }
    }

    feedbackOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(1, { duration: 800 }),
      withTiming(0, { duration: 200 }),
    );
  };

  const handleContinue = async () => {
    if (currentQuestionIndex >= questions.length - 1) {
      setIsComplete(true);
      if (correctCount > 0) {
        await addXP(PRACTICE_XP_REWARD * correctCount);
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsChecked(false);
      setIsCorrect(false);
      setShowHint(false);
    }
  };

  const handleFinish = () => {
    reload();
    navigation.goBack();
  };

  if (questions.length === 0) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText type="body">No practice questions available</ThemedText>
        <Button onPress={handleClose}>Go Back</Button>
      </ThemedView>
    );
  }

  if (isComplete) {
    const score = Math.round((correctCount / questions.length) * 100);
    const xpEarned = PRACTICE_XP_REWARD * correctCount;

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
          <Feather name="zap" size={80} color={Colors.light.primary} />
          <ThemedText type="h2" style={styles.completeTitle}>
            Practice Complete!
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.completeSubtitle, { color: theme.textSecondary }]}
          >
            You got {correctCount} out of {questions.length} correct
          </ThemedText>

          <View style={styles.rewardCard}>
            <View style={styles.rewardItem}>
              <Feather name="star" size={24} color={Colors.light.primary} />
              <ThemedText type="h4" style={styles.rewardValue}>
                +{xpEarned}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                XP Earned
              </ThemedText>
            </View>
            <View style={styles.rewardItem}>
              <Feather name="percent" size={24} color={Colors.light.success} />
              <ThemedText type="h4" style={styles.rewardValue}>
                {score}%
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
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

  const currentQuestion = questions[currentQuestionIndex];
  const progressValue = (currentQuestionIndex + 1) / questions.length;

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

      <View style={styles.practiceLabel}>
        <Feather name="zap" size={16} color={Colors.light.primary} />
        <ThemedText
          type="small"
          style={[styles.practiceLabelText, { color: Colors.light.primary }]}
        >
          Quick Practice
        </ThemedText>
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
              isCorrect={isChecked && index === currentQuestion.correctAnswer}
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

        {!isChecked && currentQuestion.hint ? (
          <View style={styles.hintContainer}>
            {showHint ? (
              <View
                style={[
                  styles.hintBox,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Feather
                  name="help-circle"
                  size={16}
                  color={Colors.light.primary}
                />
                <ThemedText
                  type="small"
                  style={[styles.hintText, { color: theme.textSecondary }]}
                >
                  {currentQuestion.hint}
                </ThemedText>
              </View>
            ) : (
              <Pressable
                style={styles.hintButton}
                onPress={() => {
                  setShowHint(true);
                  Haptics.selectionAsync();
                }}
              >
                <Feather
                  name="help-circle"
                  size={16}
                  color={Colors.light.primary}
                />
                <ThemedText
                  type="small"
                  style={{ color: Colors.light.primary }}
                >
                  Need a hint?
                </ThemedText>
              </Pressable>
            )}
          </View>
        ) : null}
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
        <Feather name={isCorrect ? "check" : "x"} size={32} color="#FFFFFF" />
        <ThemedText type="h4" style={styles.feedbackText}>
          {isCorrect ? "Correct!" : "Incorrect"}
        </ThemedText>
      </Animated.View>

      {isChecked && currentQuestion.explanation ? (
        <View
          style={[
            styles.explanationContainer,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <View style={styles.explanationHeader}>
            <Feather name="info" size={16} color={Colors.light.primary} />
            <ThemedText
              type="small"
              style={[styles.explanationTitle, { color: Colors.light.primary }]}
            >
              Explanation
            </ThemedText>
          </View>
          <ThemedText
            type="small"
            style={[styles.explanationText, { color: theme.textSecondary }]}
          >
            {currentQuestion.explanation}
          </ThemedText>
        </View>
      ) : null}

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
    marginBottom: Spacing.lg,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: Spacing.lg,
  },
  practiceLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  practiceLabelText: {
    marginLeft: Spacing.xs,
    fontWeight: "600",
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
  hintContainer: {
    marginTop: Spacing.md,
    alignItems: "center",
  },
  hintButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    width: "100%",
  },
  hintText: {
    flex: 1,
    lineHeight: 20,
  },
  explanationContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  explanationTitle: {
    marginLeft: Spacing.xs,
    fontWeight: "600",
  },
  explanationText: {
    lineHeight: 20,
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
