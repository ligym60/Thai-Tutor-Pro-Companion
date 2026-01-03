import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Pressable, ScrollView, Switch } from "react-native";
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
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import Svg, { Circle, Line, Path, G } from "react-native-svg";

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

interface WarmupExercise {
  name: string;
  thai: string;
  romanization: string;
  duration: number;
  description: string;
}

interface Combination {
  id: string;
  name: string;
  moves: Move[];
  description: string;
  repetitions?: number;
}

interface Workout {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  combinations: Combination[];
  restBetweenCombos: number;
  warmupDuration: number;
}

const MOVES: Record<string, Move> = {
  jab: { name: "Jab", thai: "หมัดแย็บ", romanization: "Mat Yaep", number: "1" },
  cross: { name: "Cross", thai: "หมัดตรง", romanization: "Mat Trong", number: "2" },
  leftHook: { name: "Left Hook", thai: "หมัดเหวี่ยงซ้าย", romanization: "Mat Wiang Sai", number: "3" },
  rightHook: { name: "Right Hook", thai: "หมัดเหวี่ยงขวา", romanization: "Mat Wiang Kwaa", number: "4" },
  leftUppercut: { name: "Left Uppercut", thai: "หมัดเสยซ้าย", romanization: "Mat Soei Sai", number: "5" },
  rightUppercut: { name: "Right Uppercut", thai: "หมัดเสยขวา", romanization: "Mat Soei Kwaa", number: "6" },
  leftKick: { name: "Left Kick", thai: "เตะซ้าย", romanization: "Te Sai" },
  rightKick: { name: "Right Kick", thai: "เตะขวา", romanization: "Te Kwaa" },
  leftKnee: { name: "Left Knee", thai: "เข่าซ้าย", romanization: "Khao Sai" },
  rightKnee: { name: "Right Knee", thai: "เข่าขวา", romanization: "Khao Kwaa" },
  leftElbow: { name: "Left Elbow", thai: "ศอกซ้าย", romanization: "Sok Sai" },
  rightElbow: { name: "Right Elbow", thai: "ศอกขวา", romanization: "Sok Kwaa" },
  teep: { name: "Teep", thai: "ถีบ", romanization: "Teep" },
  block: { name: "Block", thai: "บล็อก", romanization: "Block" },
  slip: { name: "Slip", thai: "หลบ", romanization: "Lop" },
};

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface ExerciseAnimationProps {
  exerciseName: string;
  color: string;
}

function ExerciseAnimation({ exerciseName, color }: ExerciseAnimationProps) {
  const rotation = useSharedValue(0);
  const bounce = useSharedValue(0);
  const swing = useSharedValue(0);
  
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
    bounce.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 400, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 400, easing: Easing.in(Easing.quad) })
      ),
      -1,
      true
    );
    swing.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 500, easing: Easing.inOut(Easing.quad) }),
        withTiming(-30, { duration: 500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    
    return () => {
      cancelAnimation(rotation);
      cancelAnimation(bounce);
      cancelAnimation(swing);
    };
  }, []);
  
  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  
  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));
  
  const swingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${swing.value}deg` }],
  }));
  
  const renderStickFigure = (armAngle: number = 45, legSpread: number = 20) => (
    <Svg width={120} height={120} viewBox="0 0 120 120">
      <Circle cx="60" cy="20" r="12" stroke={color} strokeWidth="3" fill="none" />
      <Line x1="60" y1="32" x2="60" y2="70" stroke={color} strokeWidth="3" />
      <Line x1="60" y1="45" x2={60 - armAngle} y2="60" stroke={color} strokeWidth="3" />
      <Line x1="60" y1="45" x2={60 + armAngle} y2="60" stroke={color} strokeWidth="3" />
      <Line x1="60" y1="70" x2={60 - legSpread} y2="100" stroke={color} strokeWidth="3" />
      <Line x1="60" y1="70" x2={60 + legSpread} y2="100" stroke={color} strokeWidth="3" />
    </Svg>
  );
  
  switch (exerciseName) {
    case "Jumping Jacks":
      return (
        <Animated.View style={bounceStyle}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Circle cx="60" cy="20" r="12" stroke={color} strokeWidth="3" fill="none" />
            <Line x1="60" y1="32" x2="60" y2="70" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="42" x2="25" y2="25" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="42" x2="95" y2="25" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="70" x2="35" y2="105" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="70" x2="85" y2="105" stroke={color} strokeWidth="3" />
          </Svg>
        </Animated.View>
      );
    case "Arm Circles":
      return (
        <Animated.View style={rotationStyle}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Circle cx="60" cy="60" r="40" stroke={color} strokeWidth="3" fill="none" strokeDasharray="10 5" />
            <Circle cx="60" cy="20" r="8" fill={color} />
          </Svg>
        </Animated.View>
      );
    case "Hip Rotations":
      return (
        <Animated.View style={swingStyle}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Circle cx="60" cy="25" r="10" stroke={color} strokeWidth="3" fill="none" />
            <Line x1="60" y1="35" x2="60" y2="60" stroke={color} strokeWidth="3" />
            <Circle cx="60" cy="70" r="15" stroke={color} strokeWidth="3" fill="none" strokeDasharray="8 4" />
            <Line x1="60" y1="85" x2="45" y2="110" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="85" x2="75" y2="110" stroke={color} strokeWidth="3" />
          </Svg>
        </Animated.View>
      );
    case "High Knees":
      return (
        <Animated.View style={bounceStyle}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Circle cx="60" cy="15" r="10" stroke={color} strokeWidth="3" fill="none" />
            <Line x1="60" y1="25" x2="60" y2="55" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="35" x2="40" y2="50" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="35" x2="80" y2="50" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="55" x2="60" y2="75" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="75" x2="50" y2="60" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="55" x2="75" y2="100" stroke={color} strokeWidth="3" />
          </Svg>
        </Animated.View>
      );
    case "Leg Swings":
      return (
        <Animated.View style={swingStyle}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Circle cx="60" cy="20" r="10" stroke={color} strokeWidth="3" fill="none" />
            <Line x1="60" y1="30" x2="60" y2="60" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="40" x2="40" y2="55" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="40" x2="80" y2="55" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="60" x2="60" y2="100" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="60" x2="30" y2="90" stroke={color} strokeWidth="3" />
          </Svg>
        </Animated.View>
      );
    case "Shadow Boxing":
      return (
        <Animated.View style={bounceStyle}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Circle cx="50" cy="25" r="10" stroke={color} strokeWidth="3" fill="none" />
            <Line x1="50" y1="35" x2="50" y2="70" stroke={color} strokeWidth="3" />
            <Line x1="50" y1="45" x2="90" y2="40" stroke={color} strokeWidth="3" />
            <Circle cx="95" cy="40" r="8" fill={color} />
            <Line x1="50" y1="50" x2="30" y2="60" stroke={color} strokeWidth="3" />
            <Line x1="50" y1="70" x2="35" y2="100" stroke={color} strokeWidth="3" />
            <Line x1="50" y1="70" x2="65" y2="100" stroke={color} strokeWidth="3" />
          </Svg>
        </Animated.View>
      );
    case "Neck Rotations":
      return (
        <Animated.View style={rotationStyle}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Circle cx="60" cy="60" r="25" stroke={color} strokeWidth="3" fill="none" />
            <Circle cx="60" cy="35" r="15" stroke={color} strokeWidth="3" fill="none" />
            <Circle cx="60" cy="30" r="5" fill={color} />
          </Svg>
        </Animated.View>
      );
    case "Torso Twists":
      return (
        <Animated.View style={swingStyle}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Circle cx="60" cy="20" r="10" stroke={color} strokeWidth="3" fill="none" />
            <Line x1="60" y1="30" x2="60" y2="65" stroke={color} strokeWidth="3" />
            <Line x1="30" y1="50" x2="90" y2="50" stroke={color} strokeWidth="3" />
            <Circle cx="30" cy="50" r="5" fill={color} />
            <Circle cx="90" cy="50" r="5" fill={color} />
            <Line x1="60" y1="65" x2="45" y2="100" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="65" x2="75" y2="100" stroke={color} strokeWidth="3" />
          </Svg>
        </Animated.View>
      );
    case "Ankle Circles":
      return (
        <Animated.View style={rotationStyle}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Circle cx="60" cy="60" r="30" stroke={color} strokeWidth="3" fill="none" strokeDasharray="8 4" />
            <Path d="M60 85 L55 110 L65 110 Z" fill={color} />
          </Svg>
        </Animated.View>
      );
    case "Light Bouncing":
      return (
        <Animated.View style={bounceStyle}>
          {renderStickFigure(30, 15)}
        </Animated.View>
      );
    case "Slow Teeps":
      return (
        <Animated.View style={swingStyle}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Circle cx="40" cy="25" r="10" stroke={color} strokeWidth="3" fill="none" />
            <Line x1="40" y1="35" x2="40" y2="65" stroke={color} strokeWidth="3" />
            <Line x1="40" y1="45" x2="25" y2="55" stroke={color} strokeWidth="3" />
            <Line x1="40" y1="45" x2="55" y2="55" stroke={color} strokeWidth="3" />
            <Line x1="40" y1="65" x2="30" y2="100" stroke={color} strokeWidth="3" />
            <Line x1="40" y1="65" x2="90" y2="60" stroke={color} strokeWidth="3" />
            <Path d="M85 55 L100 60 L85 65 Z" fill={color} />
          </Svg>
        </Animated.View>
      );
    case "Knee Raises":
      return (
        <Animated.View style={bounceStyle}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <Circle cx="60" cy="15" r="10" stroke={color} strokeWidth="3" fill="none" />
            <Line x1="60" y1="25" x2="60" y2="55" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="35" x2="40" y2="50" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="35" x2="80" y2="50" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="55" x2="60" y2="75" stroke={color} strokeWidth="3" />
            <Line x1="60" y1="75" x2="60" y2="55" stroke={color} strokeWidth="3" />
            <Circle cx="55" cy="55" r="8" stroke={color} strokeWidth="2" fill="none" />
            <Line x1="60" y1="55" x2="75" y2="100" stroke={color} strokeWidth="3" />
          </Svg>
        </Animated.View>
      );
    default:
      return (
        <Animated.View style={bounceStyle}>
          {renderStickFigure()}
        </Animated.View>
      );
  }
}

interface MoveAnimationProps {
  moveName: string;
  color: string;
}

function MoveAnimation({ moveName, color }: MoveAnimationProps) {
  const strike = useSharedValue(0);
  const kick = useSharedValue(0);
  
  useEffect(() => {
    strike.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 400, easing: Easing.in(Easing.quad) })
      ),
      -1,
      false
    );
    kick.value = withRepeat(
      withSequence(
        withTiming(45, { duration: 300, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) })
      ),
      -1,
      false
    );
    
    return () => {
      cancelAnimation(strike);
      cancelAnimation(kick);
    };
  }, []);
  
  const strikeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: strike.value * 30 }],
  }));
  
  const kickStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${kick.value}deg` }],
  }));
  
  const renderFist = (x: number, y: number) => (
    <G>
      <Circle cx={x} cy={y} r="12" fill={color} />
      <Circle cx={x} cy={y} r="12" stroke={color} strokeWidth="2" fill="none" />
    </G>
  );
  
  if (moveName.includes("Jab") || moveName === "Jab") {
    return (
      <Animated.View style={strikeStyle}>
        <Svg width={140} height={100} viewBox="0 0 140 100">
          <Line x1="20" y1="50" x2="100" y2="50" stroke={color} strokeWidth="6" strokeLinecap="round" />
          {renderFist(110, 50)}
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Cross") || moveName === "Cross") {
    return (
      <Animated.View style={strikeStyle}>
        <Svg width={140} height={100} viewBox="0 0 140 100">
          <Line x1="10" y1="60" x2="100" y2="45" stroke={color} strokeWidth="6" strokeLinecap="round" />
          {renderFist(112, 42)}
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Hook")) {
    const isLeft = moveName.includes("Left");
    return (
      <Animated.View style={strikeStyle}>
        <Svg width={140} height={100} viewBox="0 0 140 100">
          <Path 
            d={isLeft ? "M30 70 Q60 70 70 50 Q80 30 100 35" : "M110 70 Q80 70 70 50 Q60 30 40 35"} 
            stroke={color} 
            strokeWidth="6" 
            fill="none" 
            strokeLinecap="round"
          />
          {renderFist(isLeft ? 105 : 35, 35)}
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Uppercut")) {
    return (
      <Animated.View style={[strikeStyle, { transform: [{ rotate: "-45deg" }] }]}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Line x1="60" y1="100" x2="60" y2="40" stroke={color} strokeWidth="6" strokeLinecap="round" />
          {renderFist(60, 30)}
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Kick")) {
    const isLeft = moveName.includes("Left");
    return (
      <Animated.View style={kickStyle}>
        <Svg width={140} height={120} viewBox="0 0 140 120">
          <Line x1={isLeft ? 20 : 120} y1="80" x2={isLeft ? 110 : 30} y2="50" stroke={color} strokeWidth="8" strokeLinecap="round" />
          <Path 
            d={isLeft ? "M105 45 L125 40 L120 55 Z" : "M35 45 L15 40 L20 55 Z"} 
            fill={color} 
          />
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Knee")) {
    return (
      <Animated.View style={kickStyle}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Line x1="60" y1="100" x2="60" y2="60" stroke={color} strokeWidth="8" strokeLinecap="round" />
          <Circle cx="60" cy="50" r="15" fill={color} />
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Elbow")) {
    const isLeft = moveName.includes("Left");
    return (
      <Animated.View style={strikeStyle}>
        <Svg width={120} height={100} viewBox="0 0 120 100">
          <Path 
            d={isLeft ? "M20 60 L50 60 L80 40" : "M100 60 L70 60 L40 40"} 
            stroke={color} 
            strokeWidth="6" 
            fill="none" 
            strokeLinecap="round"
          />
          <Path 
            d={isLeft ? "M75 35 L90 30 L85 50 Z" : "M45 35 L30 30 L35 50 Z"} 
            fill={color} 
          />
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Teep")) {
    return (
      <Animated.View style={kickStyle}>
        <Svg width={140} height={100} viewBox="0 0 140 100">
          <Line x1="20" y1="70" x2="100" y2="50" stroke={color} strokeWidth="8" strokeLinecap="round" />
          <Path d="M95 40 L120 45 L100 60 Z" fill={color} />
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Slip") || moveName.includes("Block")) {
    return (
      <Animated.View style={strikeStyle}>
        <Svg width={120} height={100} viewBox="0 0 120 100">
          <Circle cx="60" cy="40" r="20" stroke={color} strokeWidth="3" fill="none" />
          <Line x1="40" y1="60" x2="30" y2="80" stroke={color} strokeWidth="4" />
          <Line x1="80" y1="60" x2="90" y2="80" stroke={color} strokeWidth="4" />
          <Path d="M50 25 L40 15 M70 25 L80 15" stroke={color} strokeWidth="3" />
        </Svg>
      </Animated.View>
    );
  }
  
  return (
    <Animated.View style={strikeStyle}>
      <Svg width={100} height={100} viewBox="0 0 100 100">
        {renderFist(50, 50)}
      </Svg>
    </Animated.View>
  );
}

const WARMUP_EXERCISES: WarmupExercise[] = [
  { name: "Jumping Jacks", thai: "กระโดดตบ", romanization: "Kra-dot Top", duration: 60, description: "Full body warm up" },
  { name: "Arm Circles", thai: "หมุนแขน", romanization: "Mun Khaen", duration: 45, description: "Shoulder mobility" },
  { name: "Hip Rotations", thai: "หมุนสะโพก", romanization: "Mun Sa-phok", duration: 45, description: "Hip flexibility" },
  { name: "High Knees", thai: "ยกเข่าสูง", romanization: "Yok Khao Soong", duration: 60, description: "Cardio warm up" },
  { name: "Leg Swings", thai: "แกว่งขา", romanization: "Kwaeng Khaa", duration: 45, description: "Dynamic stretching" },
  { name: "Shadow Boxing", thai: "ชกลม", romanization: "Chok Lom", duration: 90, description: "Light punching practice" },
  { name: "Neck Rotations", thai: "หมุนคอ", romanization: "Mun Kho", duration: 30, description: "Neck mobility" },
  { name: "Torso Twists", thai: "บิดลำตัว", romanization: "Bit Lam Tua", duration: 45, description: "Core activation" },
  { name: "Ankle Circles", thai: "หมุนข้อเท้า", romanization: "Mun Kho Thao", duration: 30, description: "Ankle mobility" },
  { name: "Light Bouncing", thai: "เด้งเบาๆ", romanization: "Deng Bao Bao", duration: 60, description: "Ready stance practice" },
  { name: "Slow Teeps", thai: "ถีบช้าๆ", romanization: "Teep Cha Cha", duration: 60, description: "Kick technique warm up" },
  { name: "Knee Raises", thai: "ยกเข่า", romanization: "Yok Khao", duration: 60, description: "Balance and core" },
];

const WORKOUTS: Workout[] = [
  {
    id: "beginner-1",
    name: "Foundation Training",
    level: "beginner",
    duration: "22 min",
    warmupDuration: 630,
    restBetweenCombos: 12,
    combinations: [
      { id: "b1", name: "Basic 1-2", moves: [MOVES.jab, MOVES.cross], description: "The fundamental punch combo", repetitions: 12 },
      { id: "b2", name: "1-2-3", moves: [MOVES.jab, MOVES.cross, MOVES.leftHook], description: "Add the hook", repetitions: 12 },
      { id: "b3", name: "Double Jab", moves: [MOVES.jab, MOVES.jab, MOVES.cross], description: "Set up with jabs", repetitions: 10 },
      { id: "b4", name: "Teep Drill", moves: [MOVES.teep, MOVES.teep], description: "Double push kick", repetitions: 12 },
      { id: "b5", name: "Jab-Teep", moves: [MOVES.jab, MOVES.teep], description: "Range management", repetitions: 12 },
      { id: "b6", name: "Jab-Kick", moves: [MOVES.jab, MOVES.rightKick], description: "Punch to kick", repetitions: 12 },
      { id: "b7", name: "1-2-Kick", moves: [MOVES.jab, MOVES.cross, MOVES.rightKick], description: "Classic combo", repetitions: 10 },
      { id: "b8", name: "Hook Practice", moves: [MOVES.leftHook, MOVES.rightHook], description: "Power hooks", repetitions: 12 },
      { id: "b9", name: "Teep-Cross", moves: [MOVES.teep, MOVES.cross], description: "Push and punch", repetitions: 12 },
      { id: "b10", name: "Final 1-2-3", moves: [MOVES.jab, MOVES.cross, MOVES.leftHook], description: "Finish strong", repetitions: 12 },
    ],
  },
  {
    id: "intermediate-1",
    name: "Power Development",
    level: "intermediate",
    duration: "28 min",
    warmupDuration: 630,
    restBetweenCombos: 10,
    combinations: [
      { id: "i1", name: "1-2-Kick", moves: [MOVES.jab, MOVES.cross, MOVES.rightKick], description: "Classic Muay Thai", repetitions: 12 },
      { id: "i2", name: "Hook-Cross-Hook", moves: [MOVES.leftHook, MOVES.cross, MOVES.leftHook], description: "Power punching", repetitions: 12 },
      { id: "i3", name: "Teep-Cross-Kick", moves: [MOVES.teep, MOVES.cross, MOVES.rightKick], description: "Range control", repetitions: 10 },
      { id: "i4", name: "1-2-Knee", moves: [MOVES.jab, MOVES.cross, MOVES.rightKnee], description: "Close distance", repetitions: 10 },
      { id: "i5", name: "Double Kick", moves: [MOVES.rightKick, MOVES.leftKick], description: "Switching kicks", repetitions: 12 },
      { id: "i6", name: "1-2-3-2", moves: [MOVES.jab, MOVES.cross, MOVES.leftHook, MOVES.cross], description: "Boxing combo", repetitions: 10 },
      { id: "i7", name: "Teep-Knee", moves: [MOVES.teep, MOVES.rightKnee], description: "Push then knee", repetitions: 12 },
      { id: "i8", name: "Hook-Kick", moves: [MOVES.leftHook, MOVES.rightKick], description: "Same side attack", repetitions: 12 },
      { id: "i9", name: "Triple Kick", moves: [MOVES.rightKick, MOVES.leftKick, MOVES.rightKick], description: "Kick flow", repetitions: 10 },
      { id: "i10", name: "1-2-Elbow", moves: [MOVES.jab, MOVES.cross, MOVES.leftElbow], description: "Close range", repetitions: 10 },
      { id: "i11", name: "Full Combo", moves: [MOVES.jab, MOVES.cross, MOVES.leftHook, MOVES.rightKick], description: "4-hit combo", repetitions: 12 },
      { id: "i12", name: "Finisher", moves: [MOVES.jab, MOVES.cross, MOVES.leftHook, MOVES.cross, MOVES.rightKick], description: "5-hit finish", repetitions: 10 },
    ],
  },
  {
    id: "advanced-1",
    name: "Warrior Workout",
    level: "advanced",
    duration: "35 min",
    warmupDuration: 630,
    restBetweenCombos: 8,
    combinations: [
      { id: "a1", name: "Full Combo", moves: [MOVES.jab, MOVES.cross, MOVES.leftHook, MOVES.rightKick], description: "4-hit combination", repetitions: 14 },
      { id: "a2", name: "Elbow Entry", moves: [MOVES.jab, MOVES.cross, MOVES.leftElbow, MOVES.rightElbow], description: "Close range", repetitions: 12 },
      { id: "a3", name: "Knee Storm", moves: [MOVES.leftKnee, MOVES.rightKnee, MOVES.leftKnee, MOVES.rightKnee], description: "Clinch knees", repetitions: 12 },
      { id: "a4", name: "Kick-Punch-Kick", moves: [MOVES.rightKick, MOVES.jab, MOVES.cross, MOVES.leftKick], description: "Full range", repetitions: 12 },
      { id: "a5", name: "Defense Counter", moves: [MOVES.slip, MOVES.cross, MOVES.leftHook, MOVES.rightKick], description: "Counter attack", repetitions: 12 },
      { id: "a6", name: "Elbow-Knee", moves: [MOVES.leftElbow, MOVES.rightKnee, MOVES.rightElbow, MOVES.leftKnee], description: "Clinch weapons", repetitions: 10 },
      { id: "a7", name: "Triple Kick Flow", moves: [MOVES.rightKick, MOVES.leftKick, MOVES.rightKick, MOVES.teep], description: "Kick variety", repetitions: 12 },
      { id: "a8", name: "Box-Kick-Box", moves: [MOVES.jab, MOVES.cross, MOVES.rightKick, MOVES.jab, MOVES.cross], description: "Mix it up", repetitions: 12 },
      { id: "a9", name: "Uppercut Entry", moves: [MOVES.jab, MOVES.leftUppercut, MOVES.rightUppercut, MOVES.leftHook], description: "Inside fighting", repetitions: 10 },
      { id: "a10", name: "Teep-Kick-Knee", moves: [MOVES.teep, MOVES.rightKick, MOVES.rightKnee], description: "Leg weapons", repetitions: 12 },
      { id: "a11", name: "All Eight", moves: [MOVES.jab, MOVES.cross, MOVES.leftHook, MOVES.leftElbow, MOVES.rightKnee, MOVES.rightKick], description: "All weapons", repetitions: 10 },
      { id: "a12", name: "The Finisher", moves: [MOVES.jab, MOVES.cross, MOVES.leftHook, MOVES.rightUppercut, MOVES.rightKick], description: "KO combo", repetitions: 14 },
    ],
  },
];

const LEVEL_COLORS = {
  beginner: "#4CAF50",
  intermediate: "#FF9800",
  advanced: "#E53935",
};

type WorkoutPhase = "idle" | "warmup" | "warmup-exercise" | "countdown" | "calling" | "executing" | "rest" | "complete";

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
  const [useThai, setUseThai] = useState(false);
  const [currentWarmupIndex, setCurrentWarmupIndex] = useState(0);
  const [warmupTimeLeft, setWarmupTimeLeft] = useState(0);
  const [currentRepetition, setCurrentRepetition] = useState(0);
  
  const scale = useSharedValue(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warmupIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isActiveRef = useRef(false);
  
  const currentCombo = selectedWorkout?.combinations[currentComboIndex];
  const currentMove = currentMoveIndex >= 0 && currentCombo ? currentCombo.moves[currentMoveIndex] : null;
  const currentWarmup = WARMUP_EXERCISES[currentWarmupIndex];
  
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
    if (warmupIntervalRef.current) {
      clearInterval(warmupIntervalRef.current);
      warmupIntervalRef.current = null;
    }
  };
  
  useEffect(() => {
    return () => {
      clearAllTimers();
      Speech.stop();
    };
  }, []);
  
  const speakMove = (move: Move) => {
    const text = useThai ? move.thai : move.name;
    Speech.speak(text, {
      language: useThai ? "th-TH" : "en-US",
      rate: useThai ? 0.85 : 1.2,
      pitch: 1.0,
    });
  };
  
  const speakText = (text: string, rate = 0.9) => {
    Speech.speak(text, {
      language: useThai ? "th-TH" : "en-US",
      rate,
      pitch: 1.0,
    });
  };
  
  const speakExercise = (exercise: WarmupExercise) => {
    const text = useThai ? exercise.thai : exercise.name;
    Speech.speak(text, {
      language: useThai ? "th-TH" : "en-US",
      rate: 0.9,
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
    setCurrentComboIndex(0);
    setCurrentMoveIndex(-1);
    setCurrentRepetition(0);
    setCurrentWarmupIndex(0);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    startWarmup(workout);
  };
  
  const startWarmup = (workout: Workout) => {
    if (!isActiveRef.current) return;
    
    setPhase("warmup");
    const text = useThai ? "เริ่มอบอุ่นร่างกาย" : "Starting warmup. Let's get your body ready.";
    speakText(text, 0.85);
    
    timerRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        startWarmupExercise(0, workout);
      }
    }, 3000);
  };
  
  const startWarmupExercise = (index: number, workout: Workout) => {
    if (!isActiveRef.current) return;
    
    if (index >= WARMUP_EXERCISES.length) {
      const text = useThai ? "อบอุ่นเสร็จแล้ว เริ่มฝึกซ้อม" : "Warmup complete. Starting combinations.";
      speakText(text, 0.85);
      timerRef.current = setTimeout(() => {
        if (isActiveRef.current) {
          startMainWorkout(workout);
        }
      }, 3000);
      return;
    }
    
    const exercise = WARMUP_EXERCISES[index];
    setCurrentWarmupIndex(index);
    setWarmupTimeLeft(exercise.duration);
    setPhase("warmup-exercise");
    
    speakExercise(exercise);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    let timeLeft = exercise.duration;
    warmupIntervalRef.current = setInterval(() => {
      if (!isActiveRef.current) {
        if (warmupIntervalRef.current) clearInterval(warmupIntervalRef.current);
        return;
      }
      timeLeft--;
      setWarmupTimeLeft(timeLeft);
      
      if (timeLeft === 10 && timeLeft > 0) {
        speakText(useThai ? "สิบวินาที" : "10 seconds");
      }
      
      if (timeLeft <= 0) {
        if (warmupIntervalRef.current) clearInterval(warmupIntervalRef.current);
        startWarmupExercise(index + 1, workout);
      }
    }, 1000);
  };
  
  const startMainWorkout = (workout: Workout) => {
    if (!isActiveRef.current) return;
    
    setPhase("countdown");
    setCountdown(5);
    const text = useThai ? "เตรียมตัว ห้า สี่ สาม สอง หนึ่ง" : "Get ready. 5, 4, 3, 2, 1";
    speakText(text);
    
    let count = 5;
    countdownIntervalRef.current = setInterval(() => {
      if (!isActiveRef.current) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        return;
      }
      count--;
      setCountdown(count);
      if (count <= 0) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        startCombo(workout, 0, 0);
      }
    }, 1000);
  };
  
  const startCombo = (workout: Workout, comboIndex: number, repIndex: number) => {
    if (!isActiveRef.current) return;
    
    const combo = workout.combinations[comboIndex];
    const reps = combo.repetitions || 3;
    
    setCurrentComboIndex(comboIndex);
    setCurrentRepetition(repIndex);
    setPhase("calling");
    setCurrentMoveIndex(-1);
    
    if (repIndex === 0) {
      const text = useThai ? `คอมโบ ${combo.name}` : `Combo: ${combo.name}`;
      speakText(text, 0.8);
    }
    
    timerRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        callMoves(workout, comboIndex, 0, repIndex);
      }
    }, repIndex === 0 ? 2000 : 800);
  };
  
  const callMoves = (workout: Workout, comboIndex: number, moveIndex: number, repIndex: number) => {
    if (!isActiveRef.current) return;
    
    const combo = workout.combinations[comboIndex];
    const reps = combo.repetitions || 3;
    
    if (moveIndex >= combo.moves.length) {
      if (repIndex < reps - 1) {
        timerRef.current = setTimeout(() => {
          if (isActiveRef.current) {
            startCombo(workout, comboIndex, repIndex + 1);
          }
        }, 1500);
      } else if (comboIndex < workout.combinations.length - 1) {
        setPhase("rest");
        setRestCountdown(workout.restBetweenCombos);
        speakText(useThai ? "พัก" : "Rest");
        
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
            startCombo(workout, comboIndex + 1, 0);
          }
        }, 1000);
      } else {
        setPhase("complete");
        speakText(useThai ? "ฝึกซ้อมเสร็จแล้ว ทำได้ดีมาก" : "Workout complete. Great job!");
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
        callMoves(workout, comboIndex, moveIndex + 1, repIndex);
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
    setCurrentRepetition(0);
    setCurrentWarmupIndex(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const animatedMoveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
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
        
        {(phase === "warmup" || phase === "warmup-exercise") ? (
          <View style={styles.centerContent}>
            {phase === "warmup" ? (
              <>
                <View style={[styles.warmupIcon, { backgroundColor: "#FF9800" + "20" }]}>
                  <Feather name="sun" size={64} color="#FF9800" />
                </View>
                <ThemedText type="h2" style={{ marginTop: Spacing.xl }}>
                  Warmup Starting
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
                  10 minutes to prepare your body
                </ThemedText>
              </>
            ) : (
              <>
                <View style={styles.warmupProgress}>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    Exercise {currentWarmupIndex + 1} / {WARMUP_EXERCISES.length}
                  </ThemedText>
                  <View style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary, marginTop: Spacing.sm }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: "#FF9800",
                          width: `${((currentWarmupIndex + 1) / WARMUP_EXERCISES.length) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
                
                <View style={styles.animationContainer}>
                  <ExerciseAnimation 
                    exerciseName={currentWarmup.name} 
                    color="#FF9800" 
                  />
                </View>
                
                <ThemedText type="h1" style={[styles.countdownText, { color: "#FF9800", fontSize: 72 }]}>
                  {formatTime(warmupTimeLeft)}
                </ThemedText>
                
                <ThemedText type="h2" style={{ marginTop: Spacing.md }}>
                  {useThai ? currentWarmup.thai : currentWarmup.name}
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
                  {useThai ? currentWarmup.romanization : currentWarmup.description}
                </ThemedText>
              </>
            )}
          </View>
        ) : (
          <>
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
                {currentCombo?.repetitions ? ` (Rep ${currentRepetition + 1}/${currentCombo.repetitions})` : ""}
              </ThemedText>
            </View>
            
            {phase === "countdown" ? (
              <View style={styles.centerContent}>
                <ThemedText type="h1" style={styles.countdownText}>
                  {countdown}
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textSecondary }}>
                  {useThai ? "เตรียมตัว" : "Get Ready"}
                </ThemedText>
              </View>
            ) : phase === "rest" ? (
              <View style={styles.centerContent}>
                <ThemedText type="h1" style={[styles.countdownText, { color: "#FF9800" }]}>
                  {restCountdown}
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textSecondary }}>
                  {useThai ? "พัก - คอมโบถัดไปกำลังมา" : "Rest - Next combo coming up"}
                </ThemedText>
              </View>
            ) : phase === "complete" ? (
              <View style={styles.centerContent}>
                <View style={[styles.completeIcon, { backgroundColor: "#4CAF50" + "20" }]}>
                  <Feather name="check" size={64} color="#4CAF50" />
                </View>
                <ThemedText type="h2" style={{ marginTop: Spacing.xl }}>
                  {useThai ? "ฝึกซ้อมเสร็จแล้ว!" : "Workout Complete!"}
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
                  {useThai ? "ทำได้ดีมาก" : "Great training session"}
                </ThemedText>
                <Pressable
                  onPress={stopWorkout}
                  style={[styles.doneButton, { backgroundColor: LEVEL_COLORS[selectedWorkout.level] }]}
                >
                  <ThemedText type="body" style={{ color: "#FFFFFF", fontWeight: "600" }}>
                    {useThai ? "เสร็จสิ้น" : "Done"}
                  </ThemedText>
                </Pressable>
              </View>
            ) : (
              <View style={styles.centerContent}>
                {currentCombo ? (
                  <>
                    <ThemedText type="body" style={{ color: theme.textSecondary }}>
                      {currentCombo.name}
                    </ThemedText>
                    
                    {currentMove ? (
                      <View style={styles.moveAnimationContainer}>
                        <MoveAnimation 
                          moveName={currentMove.name} 
                          color={LEVEL_COLORS[selectedWorkout.level]} 
                        />
                      </View>
                    ) : null}
                    
                    <Animated.View style={[styles.moveDisplay, animatedMoveStyle]}>
                      {currentMove ? (
                        <>
                          <ThemedText type="h1" style={styles.moveName}>
                            {useThai ? currentMove.thai : currentMove.name}
                          </ThemedText>
                          <ThemedText type="h3" style={{ color: LEVEL_COLORS[selectedWorkout.level], marginTop: Spacing.sm }}>
                            {useThai ? currentMove.name : currentMove.romanization}
                          </ThemedText>
                        </>
                      ) : (
                        <ThemedText type="h2" style={{ color: theme.textSecondary }}>
                          {useThai ? "เตรียมพร้อม..." : "Ready..."}
                        </ThemedText>
                      )}
                    </Animated.View>
                    
                    <View style={styles.comboPreview}>
                      {currentCombo.moves.map((move, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.comboMoveIndicator,
                            {
                              backgroundColor: idx === currentMoveIndex
                                ? LEVEL_COLORS[selectedWorkout.level]
                                : idx < currentMoveIndex
                                  ? LEVEL_COLORS[selectedWorkout.level] + "60"
                                  : theme.backgroundSecondary,
                            },
                          ]}
                        >
                          <ThemedText
                            type="small"
                            style={{
                              color: idx <= currentMoveIndex ? "#FFFFFF" : theme.textSecondary,
                              fontSize: 10,
                            }}
                          >
                            {useThai ? move.romanization.split(" ")[0] : move.number || move.name.split(" ")[0]}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  </>
                ) : null}
              </View>
            )}
          </>
        )}
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
      >
        <ThemedText type="h2">Master Workout</ThemedText>
        <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
          20-30 minute sessions with 10 min warmup
        </ThemedText>
        
        <View style={styles.languageToggle}>
          <ThemedText type="body">
            Voice Commands:
          </ThemedText>
          <View style={styles.toggleContainer}>
            <ThemedText type="body" style={{ color: !useThai ? theme.primary : theme.textSecondary }}>
              English
            </ThemedText>
            <Switch
              value={useThai}
              onValueChange={setUseThai}
              trackColor={{ false: theme.backgroundSecondary, true: "#FF9800" }}
              thumbColor="#FFFFFF"
              style={{ marginHorizontal: Spacing.sm }}
            />
            <ThemedText type="body" style={{ color: useThai ? "#FF9800" : theme.textSecondary }}>
              Thai
            </ThemedText>
          </View>
        </View>
        
        {WORKOUTS.map((workout) => (
          <Card key={workout.id} style={{ marginTop: Spacing.lg }}>
            <View style={styles.workoutCard}>
              <View style={styles.workoutInfo}>
                <View style={styles.workoutTitleRow}>
                  <ThemedText type="h3">{workout.name}</ThemedText>
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
                </View>
                
                <View style={styles.workoutMeta}>
                  <View style={styles.metaItem}>
                    <Feather name="clock" size={14} color={theme.textSecondary} />
                    <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: 4 }}>
                      {workout.duration} (+ 10 min warmup)
                    </ThemedText>
                  </View>
                  <View style={styles.metaItem}>
                    <Feather name="layers" size={14} color={theme.textSecondary} />
                    <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: 4 }}>
                      {workout.combinations.length} combos
                    </ThemedText>
                  </View>
                </View>
                
                <View style={styles.combosList}>
                  {workout.combinations.slice(0, 3).map((combo, idx) => (
                    <ThemedText key={idx} type="small" style={{ color: theme.textSecondary }}>
                      {combo.name}: {combo.moves.map(m => m.name).join(" - ")}
                    </ThemedText>
                  ))}
                  {workout.combinations.length > 3 ? (
                    <ThemedText type="small" style={{ color: theme.textSecondary, fontStyle: "italic" }}>
                      + {workout.combinations.length - 3} more combos
                    </ThemedText>
                  ) : null}
                </View>
              </View>
              
              <Pressable
                onPress={() => startWorkout(workout)}
                style={[styles.startButton, { backgroundColor: LEVEL_COLORS[workout.level] }]}
              >
                <Feather name="play" size={24} color="#FFFFFF" />
              </Pressable>
            </View>
          </Card>
        ))}
        
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: "bold",
    lineHeight: 130,
  },
  moveDisplay: {
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  moveName: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
  },
  comboPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  comboMoveIndicator: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 50,
    alignItems: "center",
  },
  completeIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  warmupIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  warmupProgress: {
    width: "100%",
    marginBottom: Spacing.md,
  },
  animationContainer: {
    height: 140,
    width: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  moveAnimationContainer: {
    height: 120,
    width: 160,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
  },
  doneButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xl,
  },
  languageToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    borderRadius: BorderRadius.md,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  workoutCard: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  levelBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  workoutMeta: {
    flexDirection: "row",
    marginTop: Spacing.sm,
    gap: Spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  combosList: {
    marginTop: Spacing.md,
    gap: 2,
  },
  startButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.md,
  },
});
