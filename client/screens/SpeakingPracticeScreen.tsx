import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useSpeech } from "@/hooks/useSpeech";
import { Spacing, BorderRadius } from "@/constants/theme";
import { VOCABULARY, VocabularyWord } from "@/lib/vocabularyData";
import { recordReview, ReviewQuality } from "@/lib/spacedRepetition";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface RatingButtonProps {
  label: string;
  quality: ReviewQuality;
  color: string;
  onPress: () => void;
}

function RatingButton({ label, quality, color, onPress }: RatingButtonProps) {
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
      style={[styles.ratingButton, { backgroundColor: color + "20" }, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <ThemedText type="small" style={{ color, fontWeight: "600" }}>
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

export default function SpeakingPracticeScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { speak, isSpeaking, hasThaiVoice } = useSpeech();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<VocabularyWord[]>([]);
  
  const pulseScale = useSharedValue(1);
  const cardProgress = useSharedValue(0);

  useEffect(() => {
    const shuffled = [...VOCABULARY]
      .filter(w => w.difficulty === "beginner")
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setShuffledWords(shuffled);
  }, []);

  const currentWord = shuffledWords[currentIndex];

  const speakWord = useCallback(() => {
    if (!currentWord || isSpeaking) return;
    
    pulseScale.value = withSequence(
      withSpring(1.1),
      withSpring(1)
    );
    
    speak(currentWord.thai);
  }, [currentWord, isSpeaking, pulseScale, speak]);

  const handleListenPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    speakWord();
  };

  const handleShowRating = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowRating(true);
  };

  const handleRating = async (quality: ReviewQuality) => {
    if (!currentWord) return;
    
    Haptics.notificationAsync(
      quality >= 3 ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
    );
    
    await recordReview(currentWord.id, quality);
    setWordsCompleted(prev => prev + 1);
    
    cardProgress.value = withTiming(1, { duration: 300 }, () => {
      cardProgress.value = 0;
    });
    
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowRating(false);
    } else {
      setCurrentIndex(0);
      setShowRating(false);
      const reshuffled = [...shuffledWords].sort(() => Math.random() - 0.5);
      setShuffledWords(reshuffled);
    }
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  if (shuffledWords.length === 0) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ThemedText type="body">Loading vocabulary...</ThemedText>
        </View>
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
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        {Platform.OS === "web" && hasThaiVoice === false ? (
          <View style={[styles.warningBanner, { backgroundColor: "#FF9800" + "20" }]}>
            <Feather name="alert-circle" size={16} color="#FF9800" />
            <ThemedText type="small" style={{ color: "#FF9800", marginLeft: Spacing.sm, flex: 1 }}>
              Thai voice not available in this browser. Use the Expo Go app on your phone for audio.
            </ThemedText>
          </View>
        ) : null}

        <View style={styles.progressHeader}>
          <View style={[styles.progressBadge, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="volume-2" size={16} color={theme.primary} />
            <ThemedText type="small" style={{ marginLeft: 6, color: theme.textSecondary }}>
              {currentIndex + 1} / {shuffledWords.length}
            </ThemedText>
          </View>
          <View style={[styles.progressBadge, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="check-circle" size={16} color="#4CAF50" />
            <ThemedText type="small" style={{ marginLeft: 6, color: theme.textSecondary }}>
              {wordsCompleted} practiced
            </ThemedText>
          </View>
        </View>

        <Card elevation={2} style={styles.wordCard}>
          <ThemedText type="small" style={{ color: theme.textSecondary, marginBottom: Spacing.sm }}>
            Listen and repeat:
          </ThemedText>
          
          <ThemedText type="h1" style={styles.thaiText}>
            {currentWord?.thai}
          </ThemedText>
          
          <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
            {currentWord?.romanization}
          </ThemedText>
          
          {showRating ? (
            <ThemedText type="body" style={[styles.englishText, { color: theme.primary }]}>
              {currentWord?.english}
            </ThemedText>
          ) : null}

          <Animated.View style={[styles.speakerContainer, pulseStyle]}>
            <Pressable
              style={[
                styles.speakerButton,
                { backgroundColor: isSpeaking ? theme.primary : theme.primary + "20" },
              ]}
              onPress={handleListenPress}
              disabled={isSpeaking}
            >
              <Feather
                name="volume-2"
                size={32}
                color={isSpeaking ? "#fff" : theme.primary}
              />
            </Pressable>
            <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
              {isSpeaking ? "Speaking..." : "Tap to listen"}
            </ThemedText>
          </Animated.View>

          {currentWord?.exampleSentence ? (
            <View style={[styles.exampleContainer, { backgroundColor: theme.backgroundRoot }]}>
              <ThemedText type="small" style={{ fontWeight: "600", marginBottom: 4 }}>
                Example:
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {currentWord.exampleSentence.thai}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary, fontStyle: "italic" }}>
                {currentWord.exampleSentence.romanization}
              </ThemedText>
              {showRating ? (
                <ThemedText type="small" style={{ color: theme.primary, marginTop: 4 }}>
                  {currentWord.exampleSentence.english}
                </ThemedText>
              ) : null}
            </View>
          ) : null}
        </Card>

        {!showRating ? (
          <Button
            onPress={handleShowRating}
            style={styles.practiceButton}
          >
            I've practiced saying it
          </Button>
        ) : (
          <View style={styles.ratingContainer}>
            <ThemedText type="body" style={{ textAlign: "center", marginBottom: Spacing.md }}>
              How well did you pronounce it?
            </ThemedText>
            
            <View style={styles.ratingRow}>
              <RatingButton
                label="Again"
                quality={0}
                color="#E53935"
                onPress={() => handleRating(0)}
              />
              <RatingButton
                label="Hard"
                quality={2}
                color="#FF9800"
                onPress={() => handleRating(2)}
              />
              <RatingButton
                label="Good"
                quality={3}
                color="#4CAF50"
                onPress={() => handleRating(3)}
              />
              <RatingButton
                label="Easy"
                quality={5}
                color="#2196F3"
                onPress={() => handleRating(5)}
              />
            </View>
          </View>
        )}
        
        <ThemedText type="small" style={[styles.tipText, { color: theme.textSecondary }]}>
          Tip: Listen carefully to the tones. Thai is a tonal language where pitch changes the meaning!
        </ThemedText>
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
  thaiText: {
    fontSize: 48,
    textAlign: "center",
  },
  englishText: {
    marginTop: Spacing.md,
    fontWeight: "600",
  },
  speakerContainer: {
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  speakerButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  exampleContainer: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    width: "100%",
  },
  practiceButton: {
    marginTop: Spacing.xl,
  },
  ratingContainer: {
    marginTop: Spacing.xl,
  },
  ratingRow: {
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
  tipText: {
    textAlign: "center",
    marginTop: Spacing.xl,
    fontStyle: "italic",
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
});
