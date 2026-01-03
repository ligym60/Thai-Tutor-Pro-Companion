import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

interface Move {
  name: string;
  thai: string;
  romanization: string;
  number?: string;
}

interface Combination {
  id: string;
  name: string;
  moves: Move[];
  description: string;
}

interface Workout {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  combinations: Combination[];
  restBetweenCombos: number;
}

const MOVES: Record<string, Move> = {
  jab: { name: "Jab", thai: "หมัดแย็บ", romanization: "Mat Yaep", number: "1" },
  cross: { name: "Cross", thai: "หมัดตรง", romanization: "Mat Trong", number: "2" },
  leftHook: { name: "Left Hook", thai: "หมัดเหวี่ยงซ้าย", romanization: "Mat Wiang Sai", number: "3" },
  rightHook: { name: "Right Hook", thai: "หมัดเหวี่ยงขวา", romanization: "Mat Wiang Kwaa", number: "4" },
  leftUppercut: { name: "Left Uppercut", thai: "หมัดเสย", romanization: "Mat Soei Sai", number: "5" },
  rightUppercut: { name: "Right Uppercut", thai: "หมัดเสย", romanization: "Mat Soei Kwaa", number: "6" },
  leftKick: { name: "Left Kick", thai: "เตะซ้าย", romanization: "Te Sai" },
  rightKick: { name: "Right Kick", thai: "เตะขวา", romanization: "Te Kwaa" },
  leftKnee: { name: "Left Knee", thai: "เข่าซ้าย", romanization: "Khao Sai" },
  rightKnee: { name: "Right Knee", thai: "เข่าขวา", romanization: "Khao Kwaa" },
  leftElbow: { name: "Left Elbow", thai: "ศอกซ้าย", romanization: "Sok Sai" },
  rightElbow: { name: "Right Elbow", thai: "ศอกขวา", romanization: "Sok Kwaa" },
  teep: { name: "Teep (Push Kick)", thai: "ถีบ", romanization: "Teep" },
  block: { name: "Block", thai: "บล็อก", romanization: "Block" },
  slip: { name: "Slip", thai: "หลบ", romanization: "Lop" },
};

const WORKOUTS: Workout[] = [
  {
    id: "beginner-1",
    name: "Beginner Basics",
    level: "beginner",
    duration: "5 min",
    restBetweenCombos: 5,
    combinations: [
      {
        id: "b1",
        name: "Basic 1-2",
        moves: [MOVES.jab, MOVES.cross],
        description: "The fundamental combination",
      },
      {
        id: "b2",
        name: "1-2-3",
        moves: [MOVES.jab, MOVES.cross, MOVES.leftHook],
        description: "Add the hook",
      },
      {
        id: "b3",
        name: "Teep Drill",
        moves: [MOVES.teep, MOVES.teep],
        description: "Double push kick",
      },
      {
        id: "b4",
        name: "Jab-Kick",
        moves: [MOVES.jab, MOVES.rightKick],
        description: "Punch to kick transition",
      },
    ],
  },
  {
    id: "intermediate-1",
    name: "Power Combos",
    level: "intermediate",
    duration: "8 min",
    restBetweenCombos: 4,
    combinations: [
      {
        id: "i1",
        name: "1-2-Kick",
        moves: [MOVES.jab, MOVES.cross, MOVES.rightKick],
        description: "Classic Muay Thai combo",
      },
      {
        id: "i2",
        name: "Hook-Cross-Hook",
        moves: [MOVES.leftHook, MOVES.cross, MOVES.leftHook],
        description: "Power punching",
      },
      {
        id: "i3",
        name: "Teep-Cross-Kick",
        moves: [MOVES.teep, MOVES.cross, MOVES.rightKick],
        description: "Range management",
      },
      {
        id: "i4",
        name: "1-2-Knee",
        moves: [MOVES.jab, MOVES.cross, MOVES.rightKnee],
        description: "Close the distance",
      },
      {
        id: "i5",
        name: "Double Kick",
        moves: [MOVES.rightKick, MOVES.leftKick],
        description: "Switching kicks",
      },
    ],
  },
  {
    id: "advanced-1",
    name: "Master Combos",
    level: "advanced",
    duration: "12 min",
    restBetweenCombos: 3,
    combinations: [
      {
        id: "a1",
        name: "Full Combo",
        moves: [MOVES.jab, MOVES.cross, MOVES.leftHook, MOVES.rightKick],
        description: "4-hit combination",
      },
      {
        id: "a2",
        name: "Elbow Entry",
        moves: [MOVES.jab, MOVES.cross, MOVES.leftElbow, MOVES.rightElbow],
        description: "Close range devastation",
      },
      {
        id: "a3",
        name: "Knee Storm",
        moves: [MOVES.leftKnee, MOVES.rightKnee, MOVES.leftKnee, MOVES.rightKnee],
        description: "Clinch knees",
      },
      {
        id: "a4",
        name: "Kick-Punch-Kick",
        moves: [MOVES.rightKick, MOVES.jab, MOVES.cross, MOVES.leftKick],
        description: "Full range attack",
      },
      {
        id: "a5",
        name: "Defense Counter",
        moves: [MOVES.slip, MOVES.cross, MOVES.leftHook, MOVES.rightKick],
        description: "Defensive counter-attack",
      },
      {
        id: "a6",
        name: "The Finisher",
        moves: [MOVES.jab, MOVES.cross, MOVES.leftHook, MOVES.rightUppercut, MOVES.rightKick],
        description: "5-hit knockout combo",
      },
    ],
  },
];

const LEVEL_COLORS = {
  beginner: "#4CAF50",
  intermediate: "#FF9800",
  advanced: "#E53935",
};

type WorkoutPhase = "idle" | "countdown" | "calling" | "executing" | "rest" | "complete";

export default function MuayThaiWorkoutScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [phase, setPhase] = useState<WorkoutPhase>("idle");
  const [currentComboIndex, setCurrentComboIndex] = useState(0);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [countdown, setCountdown] = useState(3);
  const [restCountdown, setRestCountdown] = useState(0);
  
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isActiveRef = useRef(false);
  
  const currentCombo = selectedWorkout?.combinations[currentComboIndex];
  const currentMove = currentMoveIndex >= 0 && currentCombo ? currentCombo.moves[currentMoveIndex] : null;
  
  const clearAllTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }
  };
  
  useEffect(() => {
    return () => {
      clearAllTimers();
      Speech.stop();
    };
  }, []);
  
  const speakMove = (move: Move) => {
    Speech.speak(move.name, {
      language: "en-US",
      rate: 1.2,
      pitch: 1.0,
    });
  };
  
  const speakText = (text: string, rate = 0.9) => {
    Speech.speak(text, {
      language: "en-US",
      rate,
      pitch: 1.0,
    });
  };
  
  const animatePulse = () => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 5 }),
      withSpring(1, { damping: 10 })
    );
  };
  
  const startWorkout = (workout: Workout) => {
    clearAllTimers();
    isActiveRef.current = true;
    setSelectedWorkout(workout);
    setPhase("countdown");
    setCurrentComboIndex(0);
    setCurrentMoveIndex(-1);
    setCountdown(3);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    speakText("Get ready. Workout starting in 3, 2, 1");
    
    let count = 3;
    countdownIntervalRef.current = setInterval(() => {
      if (!isActiveRef.current) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        return;
      }
      count--;
      setCountdown(count);
      if (count <= 0) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        startCombo(workout, 0);
      }
    }, 1000);
  };
  
  const startCombo = (workout: Workout, comboIndex: number) => {
    if (!isActiveRef.current) return;
    
    const combo = workout.combinations[comboIndex];
    setPhase("calling");
    setCurrentMoveIndex(-1);
    
    speakText(`Combo: ${combo.name}`, 0.8);
    
    timerRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        callMoves(workout, comboIndex, 0);
      }
    }, 2000);
  };
  
  const callMoves = (workout: Workout, comboIndex: number, moveIndex: number) => {
    if (!isActiveRef.current) return;
    
    const combo = workout.combinations[comboIndex];
    
    if (moveIndex >= combo.moves.length) {
      if (comboIndex < workout.combinations.length - 1) {
        setPhase("rest");
        setRestCountdown(workout.restBetweenCombos);
        speakText("Rest");
        
        let rest = workout.restBetweenCombos;
        restIntervalRef.current = setInterval(() => {
          if (!isActiveRef.current) {
            if (restIntervalRef.current) clearInterval(restIntervalRef.current);
            return;
          }
          rest--;
          setRestCountdown(rest);
          if (rest <= 0) {
            if (restIntervalRef.current) clearInterval(restIntervalRef.current);
            setCurrentComboIndex(comboIndex + 1);
            startCombo(workout, comboIndex + 1);
          }
        }, 1000);
      } else {
        setPhase("complete");
        speakText("Workout complete. Great job!");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      return;
    }
    
    setPhase("executing");
    setCurrentMoveIndex(moveIndex);
    animatePulse();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    const move = combo.moves[moveIndex];
    speakMove(move);
    
    timerRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        callMoves(workout, comboIndex, moveIndex + 1);
      }
    }, 1200);
  };
  
  const stopWorkout = () => {
    isActiveRef.current = false;
    clearAllTimers();
    Speech.stop();
    setPhase("idle");
    setSelectedWorkout(null);
    setCurrentComboIndex(0);
    setCurrentMoveIndex(-1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const animatedMoveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  if (phase !== "idle" && selectedWorkout) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.workoutHeader, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable onPress={stopWorkout} style={styles.stopButton}>
            <Feather name="x" size={24} color="#FFFFFF" />
          </Pressable>
          <ThemedText type="h3" style={{ flex: 1, textAlign: "center" }}>
            {selectedWorkout.name}
          </ThemedText>
          <View style={{ width: 44 }} />
        </View>
        
        <View style={styles.progressSection}>
          <View style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: LEVEL_COLORS[selectedWorkout.level],
                  width: `${((currentComboIndex + 1) / selectedWorkout.combinations.length) * 100}%`,
                },
              ]}
            />
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Combo {currentComboIndex + 1} / {selectedWorkout.combinations.length}
          </ThemedText>
        </View>
        
        {phase === "countdown" ? (
          <View style={styles.centerContent}>
            <ThemedText type="h1" style={styles.countdownText}>
              {countdown}
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Get Ready
            </ThemedText>
          </View>
        ) : phase === "rest" ? (
          <View style={styles.centerContent}>
            <ThemedText type="h1" style={[styles.countdownText, { color: "#FF9800" }]}>
              {restCountdown}
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Rest - Next combo coming up
            </ThemedText>
          </View>
        ) : phase === "complete" ? (
          <View style={styles.centerContent}>
            <View style={[styles.completeIcon, { backgroundColor: "#4CAF50" + "20" }]}>
              <Feather name="check" size={64} color="#4CAF50" />
            </View>
            <ThemedText type="h2" style={{ marginTop: Spacing.xl }}>
              Workout Complete!
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
              Great training session
            </ThemedText>
            <Pressable
              onPress={stopWorkout}
              style={[styles.doneButton, { backgroundColor: Colors.light.primary }]}
            >
              <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "600" }}>
                Done
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <View style={styles.centerContent}>
            {currentCombo ? (
              <>
                <ThemedText type="body" style={{ color: theme.textSecondary, marginBottom: Spacing.md }}>
                  {currentCombo.name}
                </ThemedText>
                
                <Animated.View style={[styles.moveDisplay, animatedMoveStyle]}>
                  {currentMove ? (
                    <>
                      <ThemedText style={styles.moveName}>
                        {currentMove.name}
                      </ThemedText>
                      <ThemedText style={[styles.moveThai, { color: Colors.light.primary }]}>
                        {currentMove.thai}
                      </ThemedText>
                      <ThemedText type="body" style={{ color: theme.textSecondary }}>
                        {currentMove.romanization}
                      </ThemedText>
                    </>
                  ) : (
                    <ThemedText type="body" style={{ color: theme.textSecondary }}>
                      Listen for the moves...
                    </ThemedText>
                  )}
                </Animated.View>
                
                <View style={styles.comboPreview}>
                  {currentCombo.moves.map((move, index) => (
                    <View
                      key={index}
                      style={[
                        styles.moveIndicator,
                        {
                          backgroundColor:
                            index === currentMoveIndex
                              ? Colors.light.primary
                              : index < currentMoveIndex
                              ? "#4CAF50"
                              : theme.backgroundSecondary,
                        },
                      ]}
                    >
                      <ThemedText
                        type="small"
                        style={{
                          color: index <= currentMoveIndex ? "#FFFFFF" : theme.textSecondary,
                          fontWeight: "600",
                        }}
                      >
                        {move.number || move.name.charAt(0)}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </>
            ) : null}
          </View>
        )}
        
        <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.lg }]}>
          <Pressable
            onPress={stopWorkout}
            style={[styles.stopWorkoutButton, { backgroundColor: "#E53935" }]}
          >
            <Feather name="square" size={20} color="#FFFFFF" />
            <ThemedText type="body" style={{ color: "#FFFFFF", marginLeft: Spacing.sm }}>
              Stop Workout
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={theme.text} />
          </Pressable>
          <View style={styles.headerText}>
            <ThemedText type="h2">Master Workout</ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              Follow the voice commands
            </ThemedText>
          </View>
        </View>
        
        <View style={[styles.instructionCard, { backgroundColor: theme.backgroundSecondary }]}>
          <Feather name="volume-2" size={24} color={Colors.light.primary} />
          <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.md, flex: 1 }}>
            Listen to the Muay Thai master call out combinations. Follow along with each move!
          </ThemedText>
        </View>
        
        {WORKOUTS.map((workout) => (
          <Card
            key={workout.id}
            elevation={2}
            onPress={() => startWorkout(workout)}
            style={styles.workoutCard}
          >
            <View style={styles.workoutCardHeader}>
              <View
                style={[
                  styles.levelBadge,
                  { backgroundColor: LEVEL_COLORS[workout.level] + "20" },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{ color: LEVEL_COLORS[workout.level], fontWeight: "600" }}
                >
                  {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
                </ThemedText>
              </View>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {workout.duration}
              </ThemedText>
            </View>
            
            <ThemedText type="h4" style={{ marginTop: Spacing.sm }}>
              {workout.name}
            </ThemedText>
            
            <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
              {workout.combinations.length} combinations
            </ThemedText>
            
            <View style={styles.comboList}>
              {workout.combinations.slice(0, 3).map((combo, index) => (
                <View key={combo.id} style={styles.comboItem}>
                  <View style={[styles.comboDot, { backgroundColor: LEVEL_COLORS[workout.level] }]} />
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {combo.name}: {combo.moves.map((m) => m.name).join(" - ")}
                  </ThemedText>
                </View>
              ))}
              {workout.combinations.length > 3 ? (
                <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.lg }}>
                  +{workout.combinations.length - 3} more...
                </ThemedText>
              ) : null}
            </View>
            
            <View style={[styles.startButton, { backgroundColor: LEVEL_COLORS[workout.level] }]}>
              <Feather name="play" size={16} color="#FFFFFF" />
              <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "600", marginLeft: Spacing.sm }}>
                Start Workout
              </ThemedText>
            </View>
          </Card>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  instructionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
  },
  workoutCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  workoutCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  comboList: {
    marginTop: Spacing.md,
  },
  comboItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  comboDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing.sm,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.lg,
  },
  workoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  stopButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
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
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: "700",
  },
  moveDisplay: {
    alignItems: "center",
    padding: Spacing.xl,
  },
  moveName: {
    fontSize: 48,
    fontWeight: "700",
  },
  moveThai: {
    fontSize: 32,
    marginTop: Spacing.sm,
  },
  comboPreview: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  moveIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  completeIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButton: {
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.xl,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
  },
  stopWorkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
  },
});
