import React, { useState, useRef } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import Svg, { Path, G } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CANVAS_SIZE = Math.min(SCREEN_WIDTH - Spacing.lg * 2, 350);
const STROKE_WIDTH = 8;

interface ThaiCharacter {
  id: string;
  character: string;
  romanization: string;
  english: string;
  type: "consonant" | "vowel" | "tone";
}

const thaiCharacters: ThaiCharacter[] = [
  {
    id: "1",
    character: "ก",
    romanization: "gɔɔ gài",
    english: "chicken (first consonant)",
    type: "consonant",
  },
  {
    id: "2",
    character: "ข",
    romanization: "kɔ̌ɔ kài",
    english: "egg",
    type: "consonant",
  },
  {
    id: "3",
    character: "ค",
    romanization: "kɔɔ kwaai",
    english: "buffalo",
    type: "consonant",
  },
  {
    id: "4",
    character: "ง",
    romanization: "ngɔɔ nguu",
    english: "snake",
    type: "consonant",
  },
  {
    id: "5",
    character: "จ",
    romanization: "jɔɔ jaan",
    english: "plate",
    type: "consonant",
  },
  {
    id: "6",
    character: "ฉ",
    romanization: "chɔ̌ɔ chìng",
    english: "cymbals",
    type: "consonant",
  },
  {
    id: "7",
    character: "ช",
    romanization: "chɔɔ cháang",
    english: "elephant",
    type: "consonant",
  },
  {
    id: "8",
    character: "ม",
    romanization: "mɔɔ máa",
    english: "horse",
    type: "consonant",
  },
  {
    id: "9",
    character: "น",
    romanization: "nɔɔ nǔu",
    english: "mouse",
    type: "consonant",
  },
  {
    id: "10",
    character: "ส",
    romanization: "sɔ̌ɔ sǔua",
    english: "tiger",
    type: "consonant",
  },
  {
    id: "11",
    character: "ห",
    romanization: "hɔ̌ɔ hìip",
    english: "chest/box",
    type: "consonant",
  },
  {
    id: "12",
    character: "อ",
    romanization: "ɔɔ àang",
    english: "basin",
    type: "consonant",
  },
  {
    id: "v1",
    character: "ะ",
    romanization: "a",
    english: "short 'a' vowel",
    type: "vowel",
  },
  {
    id: "v2",
    character: "า",
    romanization: "aa",
    english: "long 'aa' vowel",
    type: "vowel",
  },
  {
    id: "v3",
    character: "ิ",
    romanization: "i",
    english: "short 'i' vowel",
    type: "vowel",
  },
  {
    id: "v4",
    character: "ี",
    romanization: "ii",
    english: "long 'ii' vowel",
    type: "vowel",
  },
  {
    id: "v5",
    character: "ุ",
    romanization: "u",
    english: "short 'u' vowel",
    type: "vowel",
  },
  {
    id: "v6",
    character: "ู",
    romanization: "uu",
    english: "long 'uu' vowel",
    type: "vowel",
  },
  {
    id: "v7",
    character: "เ",
    romanization: "e",
    english: "'e' vowel (before consonant)",
    type: "vowel",
  },
  {
    id: "v8",
    character: "แ",
    romanization: "ae",
    english: "'ae' vowel",
    type: "vowel",
  },
  {
    id: "v9",
    character: "โ",
    romanization: "o",
    english: "'o' vowel",
    type: "vowel",
  },
  {
    id: "v10",
    character: "ใ",
    romanization: "ai",
    english: "'ai' vowel (short form)",
    type: "vowel",
  },
  {
    id: "v11",
    character: "ไ",
    romanization: "ai",
    english: "'ai' vowel (long form)",
    type: "vowel",
  },
  {
    id: "t1",
    character: "่",
    romanization: "màai èek",
    english: "low tone mark",
    type: "tone",
  },
  {
    id: "t2",
    character: "้",
    romanization: "màai too",
    english: "falling tone mark",
    type: "tone",
  },
  {
    id: "t3",
    character: "๊",
    romanization: "màai dtrii",
    english: "high tone mark",
    type: "tone",
  },
  {
    id: "t4",
    character: "๋",
    romanization: "màai jàt-dtà-waa",
    english: "rising tone mark",
    type: "tone",
  },
];

interface PathData {
  id: number;
  d: string;
}

export default function WritingPracticeScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const currentPathRef = useRef("");
  const pathIdRef = useRef(0);

  const scale = useSharedValue(1);

  const currentChar = thaiCharacters[currentIndex];

  const startPath = (x: number, y: number) => {
    const newPath = `M ${x} ${y}`;
    currentPathRef.current = newPath;
    setCurrentPath(newPath);
  };

  const appendToPath = (x: number, y: number) => {
    const newPath = currentPathRef.current + ` L ${x} ${y}`;
    currentPathRef.current = newPath;
    setCurrentPath(newPath);
  };

  const finishPath = () => {
    if (currentPathRef.current) {
      setPaths((prev) => [
        ...prev,
        { id: pathIdRef.current++, d: currentPathRef.current },
      ]);
      currentPathRef.current = "";
      setCurrentPath("");
    }
  };

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      runOnJS(startPath)(event.x, event.y);
    })
    .onUpdate((event) => {
      runOnJS(appendToPath)(event.x, event.y);
    })
    .onEnd(() => {
      runOnJS(finishPath)();
    })
    .minDistance(1);

  const handleClear = () => {
    setPaths([]);
    setCurrentPath("");
    currentPathRef.current = "";
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleNext = () => {
    if (currentIndex < thaiCharacters.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPaths([]);
      setCurrentPath("");
      currentPathRef.current = "";
      scale.value = withSpring(1.1, { damping: 10 }, () => {
        scale.value = withSpring(1);
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPaths([]);
      setCurrentPath("");
      currentPathRef.current = "";
      scale.value = withSpring(1.1, { damping: 10 }, () => {
        scale.value = withSpring(1);
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const animatedCharStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getTypeColor = (type: string) => {
    switch (type) {
      case "consonant":
        return Colors.light.primary;
      case "vowel":
        return "#FF6B6B";
      case "tone":
        return "#9B59B6";
      default:
        return Colors.light.primary;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <ThemedText type="h2" style={styles.headerTitle}>
          Writing Practice
        </ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary }}>
          Trace over the character
        </ThemedText>
      </View>

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
                width: `${((currentIndex + 1) / thaiCharacters.length) * 100}%`,
              },
            ]}
          />
        </View>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {currentIndex + 1} / {thaiCharacters.length}
        </ThemedText>
      </View>

      <View style={styles.characterInfo}>
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: getTypeColor(currentChar.type) + "20" },
          ]}
        >
          <ThemedText
            type="small"
            style={{ color: getTypeColor(currentChar.type), fontWeight: "600" }}
          >
            {currentChar.type.charAt(0).toUpperCase() +
              currentChar.type.slice(1)}
          </ThemedText>
        </View>
        <ThemedText
          type="body"
          style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
        >
          {currentChar.romanization}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {currentChar.english}
        </ThemedText>
      </View>

      <View style={styles.canvasContainer}>
        <GestureDetector gesture={panGesture}>
          <View
            style={[
              styles.canvas,
              {
                width: CANVAS_SIZE,
                height: CANVAS_SIZE,
                backgroundColor: theme.backgroundSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <Animated.View style={[styles.characterOverlay, animatedCharStyle]}>
              <ThemedText
                style={[
                  styles.templateCharacter,
                  { color: theme.textSecondary + "40" },
                ]}
              >
                {currentChar.character}
              </ThemedText>
            </Animated.View>

            <Svg width={CANVAS_SIZE} height={CANVAS_SIZE} style={styles.svg}>
              <G>
                {paths.map((path) => (
                  <Path
                    key={path.id}
                    d={path.d}
                    stroke={Colors.light.primary}
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ))}
                {currentPath ? (
                  <Path
                    d={currentPath}
                    stroke={Colors.light.primary}
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ) : null}
              </G>
            </Svg>
          </View>
        </GestureDetector>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={handleClear}
          style={[
            styles.clearButton,
            { backgroundColor: theme.backgroundSecondary },
          ]}
        >
          <Feather name="trash-2" size={20} color={theme.text} />
          <ThemedText type="body" style={{ marginLeft: Spacing.sm }}>
            Clear
          </ThemedText>
        </Pressable>
      </View>

      <View
        style={[
          styles.navigation,
          { paddingBottom: insets.bottom + Spacing.lg },
        ]}
      >
        <Pressable
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          style={[
            styles.navButton,
            {
              backgroundColor: theme.backgroundSecondary,
              opacity: currentIndex === 0 ? 0.5 : 1,
            },
          ]}
        >
          <Feather name="chevron-left" size={24} color={theme.text} />
          <ThemedText type="body" style={{ marginLeft: Spacing.xs }}>
            Previous
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={handleNext}
          disabled={currentIndex === thaiCharacters.length - 1}
          style={[
            styles.navButton,
            {
              backgroundColor: Colors.light.primary,
              opacity: currentIndex === thaiCharacters.length - 1 ? 0.5 : 1,
            },
          ]}
        >
          <ThemedText
            type="body"
            style={{ color: "#FFFFFF", marginRight: Spacing.xs }}
          >
            Next
          </ThemedText>
          <Feather name="chevron-right" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  headerTitle: {
    marginBottom: Spacing.xs,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  characterInfo: {
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  typeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  canvasContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    overflow: "hidden",
    position: "relative",
  },
  characterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  templateCharacter: {
    fontSize: 200,
    fontWeight: "300",
    fontFamily: "NotoSansThai",
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
  },
});
