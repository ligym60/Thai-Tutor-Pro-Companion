import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { useTranslation } from "react-i18next";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { getStoryById, StoryWord } from "@/lib/storyData";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type StoryQuizRouteProp = RouteProp<RootStackParamList, "StoryQuiz">;

interface QuizQuestion {
  type: "thai-to-english" | "english-to-thai" | "romanization";
  word: StoryWord;
  options: string[];
  correctIndex: number;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuestions(words: StoryWord[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const uniqueWords = words.filter((word, index, self) =>
    index === self.findIndex((w) => w.thai === word.thai)
  );
  
  const selectedWords = shuffleArray(uniqueWords).slice(0, Math.min(10, uniqueWords.length));
  
  for (const word of selectedWords) {
    const questionType = Math.random() < 0.5 ? "thai-to-english" : "english-to-thai";
    
    let options: string[] = [];
    let correctAnswer: string;
    
    if (questionType === "thai-to-english") {
      correctAnswer = word.english;
      const otherWords = uniqueWords
        .filter((w) => w.english !== word.english)
        .map((w) => w.english);
      options = shuffleArray([
        correctAnswer,
        ...shuffleArray(otherWords).slice(0, 3),
      ]);
    } else {
      correctAnswer = word.thai;
      const otherWords = uniqueWords
        .filter((w) => w.thai !== word.thai)
        .map((w) => w.thai);
      options = shuffleArray([
        correctAnswer,
        ...shuffleArray(otherWords).slice(0, 3),
      ]);
    }
    
    questions.push({
      type: questionType,
      word,
      options,
      correctIndex: options.indexOf(correctAnswer),
    });
  }
  
  return questions;
}

export default function StoryQuizScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<StoryQuizRouteProp>();

  const story = getStoryById(route.params.storyId);
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  
  const shakeX = useSharedValue(0);
  const scaleValue = useSharedValue(1);
  
  useEffect(() => {
    if (story) {
      setQuestions(generateQuestions(story.words));
    }
  }, [story]);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleClose = () => {
    Speech.stop();
    navigation.goBack();
  };
  
  const handlePlayAudio = () => {
    if (currentQuestion) {
      Speech.speak(currentQuestion.word.thai, {
        language: "th-TH",
        rate: 0.8,
      });
    }
  };
  
  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = index === currentQuestion.correctIndex;
    setIsCorrect(correct);
    
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore((prev) => prev + 1);
      scaleValue.value = withSequence(
        withSpring(1.1, { damping: 10 }),
        withSpring(1, { damping: 10 })
      );
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setQuizComplete(true);
    }
  };
  
  const handleRetry = () => {
    if (story) {
      setQuestions(generateQuestions(story.words));
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setScore(0);
      setQuizComplete(false);
    }
  };
  
  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));
  
  const animatedScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));
  
  if (!story || questions.length === 0) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ThemedText>{t("stories:loadingQuiz")}</ThemedText>
        </View>
      </ThemedView>
    );
  }
  
  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    let messageKey = "";
    let icon: keyof typeof Feather.glyphMap = "star";

    if (percentage >= 90) {
      messageKey = "stories:excellentMessage";
      icon = "award";
    } else if (percentage >= 70) {
      messageKey = "stories:greatJobMessage";
      icon = "thumbs-up";
    } else if (percentage >= 50) {
      messageKey = "stories:goodEffortMessage";
      icon = "book-open";
    } else {
      messageKey = "stories:keepLearningMessage";
      icon = "heart";
    }

    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={theme.text} />
          </Pressable>
          <ThemedText type="h4">{t("stories:quizComplete")}</ThemedText>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.resultContainer}>
          <View style={[styles.resultIcon, { backgroundColor: Colors.light.primary + "20" }]}>
            <Feather name={icon} size={48} color={Colors.light.primary} />
          </View>

          <ThemedText type="h2" style={{ marginTop: Spacing.xl }}>
            {score} / {questions.length}
          </ThemedText>

          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
            {t("stories:percentCorrect", { percentage })}
          </ThemedText>

          <ThemedText type="body" style={{ textAlign: "center", marginTop: Spacing.lg, paddingHorizontal: Spacing.xl }}>
            {t(messageKey)}
          </ThemedText>

          <View style={styles.resultButtons}>
            <Pressable
              onPress={handleRetry}
              style={[styles.resultButton, { backgroundColor: Colors.light.primary }]}
            >
              <Feather name="refresh-cw" size={20} color="#FFFFFF" />
              <ThemedText type="body" style={{ color: "#FFFFFF", marginLeft: Spacing.sm }}>
                {t("stories:tryAgain")}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleClose}
              style={[styles.resultButton, { backgroundColor: theme.backgroundSecondary }]}
            >
              <Feather name="check" size={20} color={theme.text} />
              <ThemedText type="body" style={{ marginLeft: Spacing.sm }}>
                {t("common:done")}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Feather name="x" size={24} color={theme.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <ThemedText type="h4">{t("stories:storyQuizTitle", { title: story.title })}</ThemedText>
        </View>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.progressRow}>
        <View style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: Colors.light.primary,
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
              },
            ]}
          />
        </View>
        <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.md }}>
          {currentQuestionIndex + 1}/{questions.length}
        </ThemedText>
      </View>
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + Spacing["4xl"] },
        ]}
      >
        <Animated.View style={animatedShakeStyle}>
          <Card elevation={2} style={styles.questionCard}>
            <ThemedText type="small" style={{ color: theme.textSecondary, marginBottom: Spacing.md }}>
              {currentQuestion.type === "thai-to-english"
                ? t("stories:whatDoesThisMean")
                : t("stories:howDoYouSayInThai")}
            </ThemedText>

            <Pressable onPress={handlePlayAudio} style={styles.wordContainer}>
              <Animated.View style={animatedScaleStyle}>
                <ThemedText style={styles.questionWord}>
                  {currentQuestion.type === "thai-to-english"
                    ? currentQuestion.word.thai
                    : currentQuestion.word.english}
                </ThemedText>
              </Animated.View>
              {currentQuestion.type === "thai-to-english" ? (
                <View style={styles.audioHint}>
                  <Feather name="volume-2" size={16} color={Colors.light.primary} />
                  <ThemedText type="small" style={{ color: Colors.light.primary, marginLeft: Spacing.xs }}>
                    {t("stories:tapToHear")}
                  </ThemedText>
                </View>
              ) : null}
            </Pressable>
            
            {currentQuestion.type === "thai-to-english" ? (
              <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
                {currentQuestion.word.romanization}
              </ThemedText>
            ) : null}
          </Card>
        </Animated.View>
        
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            let optionStyle = { backgroundColor: theme.backgroundSecondary };
            let textColor = theme.text;
            
            if (selectedAnswer !== null) {
              if (index === currentQuestion.correctIndex) {
                optionStyle = { backgroundColor: "#4CAF50" + "20" };
                textColor = "#4CAF50";
              } else if (index === selectedAnswer && !isCorrect) {
                optionStyle = { backgroundColor: "#F44336" + "20" };
                textColor = "#F44336";
              }
            }
            
            return (
              <Pressable
                key={index}
                onPress={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                style={[styles.optionButton, optionStyle]}
              >
                <ThemedText
                  style={[
                    styles.optionText,
                    { color: textColor },
                    currentQuestion.type === "english-to-thai" && { fontSize: 24 },
                  ]}
                >
                  {option}
                </ThemedText>
                {selectedAnswer !== null && index === currentQuestion.correctIndex ? (
                  <Feather name="check-circle" size={20} color="#4CAF50" />
                ) : null}
                {selectedAnswer === index && !isCorrect ? (
                  <Feather name="x-circle" size={20} color="#F44336" />
                ) : null}
              </Pressable>
            );
          })}
        </View>
        
        {selectedAnswer !== null ? (
          <View style={styles.feedbackContainer}>
            <View
              style={[
                styles.feedbackCard,
                { backgroundColor: isCorrect ? "#4CAF50" + "10" : "#F44336" + "10" },
              ]}
            >
              <View style={styles.feedbackHeader}>
                <Feather
                  name={isCorrect ? "check-circle" : "info"}
                  size={20}
                  color={isCorrect ? "#4CAF50" : "#F44336"}
                />
                <ThemedText
                  type="body"
                  style={{
                    fontWeight: "600",
                    marginLeft: Spacing.sm,
                    color: isCorrect ? "#4CAF50" : "#F44336",
                  }}
                >
                  {isCorrect ? t("stories:correct") : t("stories:notQuite")}
                </ThemedText>
              </View>
              {!isCorrect ? (
                <ThemedText type="body" style={{ marginTop: Spacing.sm, color: theme.textSecondary }}>
                  {t("stories:correctAnswerIs", { answer: currentQuestion.options[currentQuestion.correctIndex] })}
                </ThemedText>
              ) : null}
            </View>

            <Pressable
              onPress={handleNext}
              style={[styles.continueButton, { backgroundColor: Colors.light.primary }]}
            >
              <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "600" }}>
                {currentQuestionIndex < questions.length - 1 ? t("common:continue") : t("stories:seeResults")}
              </ThemedText>
              <Feather name="arrow-right" size={20} color="#FFFFFF" style={{ marginLeft: Spacing.sm }} />
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  questionCard: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  wordContainer: {
    alignItems: "center",
  },
  questionWord: {
    fontSize: 36,
    fontWeight: "600",
    textAlign: "center",
  },
  audioHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  optionsContainer: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  feedbackContainer: {
    marginTop: Spacing.xl,
  },
  feedbackCard: {
    padding: Spacing.lg,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.lg,
  },
  resultContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  resultIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  resultButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing["2xl"],
  },
  resultButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },
});
