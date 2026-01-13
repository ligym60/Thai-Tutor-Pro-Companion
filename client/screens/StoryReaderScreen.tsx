import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { getStoryById, StoryWord } from "@/lib/storyData";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { addWordToReview, isWordSaved } from "@/lib/spacedRepetition";

type StoryReaderRouteProp = RouteProp<RootStackParamList, "StoryReader">;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const POPUP_WIDTH = 220;
const POPUP_HEIGHT = 180;

interface WordLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PopupPosition {
  pageX: number;
  pageY: number;
}

export default function StoryReaderScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<StoryReaderRouteProp>();

  const story = getStoryById(route.params.storyId);

  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedWordData, setSelectedWordData] = useState<{
    word: StoryWord;
    position: PopupPosition;
    index: number;
  } | null>(null);
  const [showFullTranslation, setShowFullTranslation] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.8);
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());

  const scrollViewRef = useRef<ScrollView>(null);
  const storyCardRef = useRef<View>(null);
  const wordLayouts = useRef<WordLayout[]>([]);
  const isPlayingRef = useRef(false);
  const currentIndexRef = useRef(-1);

  const popupScale = useSharedValue(0);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    currentIndexRef.current = currentWordIndex;
  }, [currentWordIndex]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const handleClose = () => {
    Speech.stop();
    setIsPlaying(false);
    navigation.goBack();
  };

  const speakWordAtIndex = useCallback(
    (index: number) => {
      if (!story || index >= story.words.length) {
        setIsPlaying(false);
        setCurrentWordIndex(-1);
        return;
      }

      setCurrentWordIndex(index);

      const wordLayout = wordLayouts.current[index];
      if (wordLayout && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: Math.max(0, wordLayout.y - 100),
          animated: true,
        });
      }

      Speech.speak(story.words[index].thai, {
        language: "th-TH",
        rate: playbackSpeed,
        onDone: () => {
          if (isPlayingRef.current && index < story.words.length - 1) {
            setTimeout(() => {
              if (isPlayingRef.current) {
                speakWordAtIndex(index + 1);
              }
            }, 400);
          } else {
            setIsPlaying(false);
            setCurrentWordIndex(-1);
          }
        },
      });
    },
    [story, playbackSpeed],
  );

  const handlePlay = () => {
    if (!story) return;

    Speech.stop();
    setIsPlaying(true);
    const startIndex = currentWordIndex >= 0 ? currentWordIndex : 0;

    setTimeout(() => {
      speakWordAtIndex(startIndex);
    }, 100);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePause = () => {
    Speech.stop();
    setIsPlaying(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStop = () => {
    Speech.stop();
    setIsPlaying(false);
    setCurrentWordIndex(-1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSkipForward = () => {
    if (!story) return;
    Speech.stop();
    const nextIndex = Math.min(currentWordIndex + 1, story.words.length - 1);
    setCurrentWordIndex(nextIndex);

    if (isPlaying) {
      setTimeout(() => {
        speakWordAtIndex(nextIndex);
      }, 100);
    } else {
      Speech.speak(story.words[nextIndex].thai, {
        language: "th-TH",
        rate: playbackSpeed,
      });
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleWordLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    wordLayouts.current[index] = { x, y, width, height };
  };

  const handleWordPress = (word: StoryWord, index: number, event: any) => {
    Haptics.selectionAsync();

    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    }

    setCurrentWordIndex(index);

    Speech.speak(word.thai, {
      language: "th-TH",
      rate: playbackSpeed,
    });

    const pageX = event.nativeEvent.pageX;
    const pageY = event.nativeEvent.pageY;

    setSelectedWordData({ word, position: { pageX, pageY }, index });
    popupScale.value = 0;
    popupScale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
  };

  const closePopup = () => {
    popupScale.value = withSpring(0, { damping: 20, stiffness: 300 });
    setTimeout(() => setSelectedWordData(null), 150);
  };

  const toggleSpeed = () => {
    const speeds = [0.5, 0.8, 1.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
    Haptics.selectionAsync();
  };

  const getPopupPosition = () => {
    if (!selectedWordData) return { top: 0, left: 0 };

    const { position } = selectedWordData;
    const safeTop = insets.top + 20;
    const safeBottom = SCREEN_HEIGHT - insets.bottom - 160;
    const safeLeft = Spacing.lg;
    const safeRight = SCREEN_WIDTH - POPUP_WIDTH - Spacing.lg;

    let top = position.pageY + 20;
    let left = position.pageX - POPUP_WIDTH / 2;

    if (top + POPUP_HEIGHT > safeBottom) {
      top = position.pageY - POPUP_HEIGHT - 20;
    }

    top = Math.max(safeTop, Math.min(top, safeBottom - POPUP_HEIGHT));
    left = Math.max(safeLeft, Math.min(left, safeRight));

    return { top, left };
  };

  const animatedPopupStyle = useAnimatedStyle(() => ({
    transform: [{ scale: popupScale.value }],
    opacity: popupScale.value,
  }));

  if (!story) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <ThemedText>Story not found</ThemedText>
      </ThemedView>
    );
  }

  const popupPosition = getPopupPosition();

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Feather name="x" size={24} color={theme.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <ThemedText type="h4" numberOfLines={1}>
            {story.title}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, fontFamily: "NotoSansThai" }}>
            {story.titleThai}
          </ThemedText>
        </View>
        <Pressable onPress={toggleSpeed} style={styles.speedButton}>
          <ThemedText type="small" style={{ color: Colors.light.primary }}>
            {playbackSpeed}x
          </ThemedText>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 140 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          ref={storyCardRef}
          style={[
            styles.storyCard,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <View style={styles.wordsContainer}>
            {story.words.map((word, index) => (
              <Pressable
                key={`${word.thai}-${index}`}
                onLayout={(e) => handleWordLayout(index, e)}
                onPress={(e) => handleWordPress(word, index, e)}
                style={[
                  styles.wordWrapper,
                  currentWordIndex === index && {
                    backgroundColor: Colors.light.primary + "30",
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.thaiWord,
                    currentWordIndex === index && {
                      color: Colors.light.primary,
                      fontWeight: "700",
                    },
                  ]}
                >
                  {word.thai}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => setShowFullTranslation(!showFullTranslation)}
          style={[
            styles.translationCard,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <View style={styles.translationHeader}>
            <ThemedText type="body" style={{ fontWeight: "600" }}>
              Full Translation
            </ThemedText>
            <Feather
              name={showFullTranslation ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.textSecondary}
            />
          </View>
          {showFullTranslation ? (
            <ThemedText
              type="body"
              style={[styles.translationText, { color: theme.textSecondary }]}
            >
              {story.fullTranslation}
            </ThemedText>
          ) : null}
        </Pressable>

        <View
          style={[
            styles.legendCard,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary, marginBottom: Spacing.sm }}
          >
            Tap any word to hear pronunciation and see translation
          </ThemedText>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: Colors.light.primary },
              ]}
            />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Currently playing word
            </ThemedText>
          </View>
        </View>

        <Pressable
          onPress={() => {
            Speech.stop();
            setIsPlaying(false);
            navigation.navigate("StoryQuiz", { storyId: story.id });
          }}
          style={[styles.quizButton, { backgroundColor: Colors.light.primary }]}
        >
          <Feather name="help-circle" size={20} color="#FFFFFF" />
          <ThemedText
            type="body"
            style={{
              color: "#FFFFFF",
              fontWeight: "600",
              marginLeft: Spacing.sm,
            }}
          >
            Take Quiz
          </ThemedText>
        </Pressable>
      </ScrollView>

      <View
        style={[
          styles.controlsContainer,
          {
            paddingBottom: insets.bottom + Spacing.md,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.backgroundSecondary },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: Colors.light.primary,
                  width: `${story.words.length > 0 ? ((currentWordIndex + 1) / story.words.length) * 100 : 0}%`,
                },
              ]}
            />
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {currentWordIndex >= 0 ? currentWordIndex + 1 : 0} /{" "}
            {story.words.length}
          </ThemedText>
        </View>
        <View style={styles.controls}>
          <Pressable onPress={handleStop} style={styles.controlButton}>
            <View
              style={[
                styles.controlButtonInner,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Feather name="square" size={20} color={theme.text} />
            </View>
          </Pressable>

          <Pressable
            onPress={isPlaying ? handlePause : handlePlay}
            style={styles.playButton}
          >
            <View
              style={[
                styles.playButtonInner,
                { backgroundColor: Colors.light.primary },
              ]}
            >
              <Feather
                name={isPlaying ? "pause" : "play"}
                size={32}
                color="#FFFFFF"
              />
            </View>
          </Pressable>

          <Pressable onPress={handleSkipForward} style={styles.controlButton}>
            <View
              style={[
                styles.controlButtonInner,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Feather name="skip-forward" size={20} color={theme.text} />
            </View>
          </Pressable>
        </View>
      </View>

      {selectedWordData ? (
        <Pressable style={styles.popupOverlay} onPress={closePopup}>
          <Animated.View
            style={[
              styles.popup,
              {
                backgroundColor: theme.cardBackground,
                top: popupPosition.top,
                left: popupPosition.left,
              },
              animatedPopupStyle,
            ]}
          >
            <ThemedText style={styles.popupThai}>
              {selectedWordData.word.thai}
            </ThemedText>
            <ThemedText
              type="small"
              style={[styles.popupRoman, { color: theme.textSecondary }]}
            >
              {selectedWordData.word.romanization}
            </ThemedText>
            <View
              style={[styles.popupDivider, { backgroundColor: theme.border }]}
            />
            <ThemedText type="body" style={styles.popupEnglish}>
              {selectedWordData.word.english}
            </ThemedText>
            <View style={styles.popupButtons}>
              <Pressable
                onPress={() => {
                  Speech.speak(selectedWordData.word.thai, {
                    language: "th-TH",
                    rate: playbackSpeed,
                  });
                }}
                style={[
                  styles.popupSpeakButton,
                  { backgroundColor: Colors.light.primary + "20" },
                ]}
              >
                <Feather
                  name="volume-2"
                  size={16}
                  color={Colors.light.primary}
                />
                <ThemedText
                  type="small"
                  style={{
                    color: Colors.light.primary,
                    marginLeft: Spacing.xs,
                  }}
                >
                  Listen
                </ThemedText>
              </Pressable>

              <Pressable
                onPress={async () => {
                  const wordId = `story-word-${story.id}-${selectedWordData.index}`;
                  await addWordToReview(
                    wordId,
                    selectedWordData.word.thai,
                    selectedWordData.word.romanization,
                    selectedWordData.word.english,
                  );
                  setSavedWords((prev) => new Set(prev).add(wordId));
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                  );
                }}
                style={[
                  styles.popupSaveButton,
                  {
                    backgroundColor: savedWords.has(
                      `story-word-${story.id}-${selectedWordData.index}`,
                    )
                      ? "#4CAF50" + "20"
                      : theme.backgroundSecondary,
                  },
                ]}
              >
                <Feather
                  name={
                    savedWords.has(
                      `story-word-${story.id}-${selectedWordData.index}`,
                    )
                      ? "check"
                      : "plus"
                  }
                  size={16}
                  color={
                    savedWords.has(
                      `story-word-${story.id}-${selectedWordData.index}`,
                    )
                      ? "#4CAF50"
                      : theme.text
                  }
                />
                <ThemedText
                  type="small"
                  style={{
                    color: savedWords.has(
                      `story-word-${story.id}-${selectedWordData.index}`,
                    )
                      ? "#4CAF50"
                      : theme.text,
                    marginLeft: Spacing.xs,
                  }}
                >
                  {savedWords.has(
                    `story-word-${story.id}-${selectedWordData.index}`,
                  )
                    ? "Saved"
                    : "Save"}
                </ThemedText>
              </Pressable>
            </View>
          </Animated.View>
        </Pressable>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  speedButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.light.primary + "20",
    borderRadius: BorderRadius.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  storyCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius["2xl"],
    marginBottom: Spacing.lg,
  },
  wordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  wordWrapper: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  thaiWord: {
    fontSize: 28,
    fontWeight: "500",
    fontFamily: "NotoSansThai",
  },
  translationCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
  },
  translationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  translationText: {
    marginTop: Spacing.md,
    lineHeight: 24,
  },
  legendCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  quizButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.lg,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.xl,
  },
  controlButton: {
    padding: Spacing.sm,
  },
  controlButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    padding: Spacing.sm,
  },
  playButtonInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  popup: {
    position: "absolute",
    width: POPUP_WIDTH,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  popupThai: {
    fontSize: 32,
    fontWeight: "600",
    textAlign: "center",
  },
  popupRoman: {
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  popupDivider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  popupEnglish: {
    textAlign: "center",
    fontWeight: "500",
  },
  popupButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  popupSpeakButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  popupSaveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
});
