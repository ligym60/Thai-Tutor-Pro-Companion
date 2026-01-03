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
import Svg, { Circle, Line, Path, G, Defs, LinearGradient, Stop, Ellipse, Rect, RadialGradient } from "react-native-svg";

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
  const pulse = useSharedValue(1);
  
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
    bounce.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 350, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 350, easing: Easing.in(Easing.quad) })
      ),
      -1,
      true
    );
    swing.value = withRepeat(
      withSequence(
        withTiming(25, { duration: 450, easing: Easing.inOut(Easing.quad) }),
        withTiming(-25, { duration: 450, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.95, { duration: 600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    
    return () => {
      cancelAnimation(rotation);
      cancelAnimation(bounce);
      cancelAnimation(swing);
      cancelAnimation(pulse);
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
  
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));
  
  const darkerColor = color + "CC";
  const lighterColor = color + "88";
  const shadowColor = "#00000040";
  
  const render3DFigure = (pose: "standing" | "jumping" | "punching" | "kicking" | "kneeUp") => (
    <Svg width={130} height={130} viewBox="0 0 130 130">
      <Defs>
        <LinearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
        </LinearGradient>
        <RadialGradient id="headGrad" cx="40%" cy="35%" r="60%">
          <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
          <Stop offset="100%" stopColor={color} stopOpacity="1" />
        </RadialGradient>
        <LinearGradient id="limbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Ellipse cx="65" cy="125" rx="25" ry="5" fill={shadowColor} />
      <Ellipse cx="65" cy="22" rx="14" ry="16" fill="url(#headGrad)" />
      <Circle cx="58" cy="18" r="2" fill="#FFFFFF" opacity="0.4" />
      <Ellipse cx="65" cy="50" rx="16" ry="22" fill="url(#bodyGrad)" />
      <Ellipse cx="65" cy="45" rx="8" ry="4" fill={lighterColor} opacity="0.3" />
      {pose === "jumping" ? (
        <>
          <Path d="M52 42 Q35 30 25 18" stroke="url(#limbGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <Path d="M78 42 Q95 30 105 18" stroke="url(#limbGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <Path d="M55 68 Q40 85 30 110" stroke="url(#limbGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          <Path d="M75 68 Q90 85 100 110" stroke="url(#limbGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
        </>
      ) : pose === "punching" ? (
        <>
          <Path d="M78 45 Q100 42 120 40" stroke="url(#limbGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <Ellipse cx="125" cy="40" rx="8" ry="10" fill={color} />
          <Path d="M52 48 Q40 55 35 60" stroke="url(#limbGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <Path d="M55 70 Q50 90 42 115" stroke="url(#limbGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          <Path d="M75 70 Q80 90 88 115" stroke="url(#limbGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
        </>
      ) : pose === "kicking" ? (
        <>
          <Path d="M52 45 Q35 50 25 55" stroke="url(#limbGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <Path d="M78 45 Q85 55 80 60" stroke="url(#limbGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <Path d="M55 70 Q50 90 45 115" stroke="url(#limbGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          <Path d="M75 68 Q100 55 120 50" stroke="url(#limbGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          <Ellipse cx="125" cy="48" rx="12" ry="8" fill={color} />
        </>
      ) : pose === "kneeUp" ? (
        <>
          <Path d="M52 45 Q40 50 35 55" stroke="url(#limbGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <Path d="M78 45 Q90 50 95 55" stroke="url(#limbGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <Path d="M55 70 Q50 90 45 115" stroke="url(#limbGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          <Path d="M75 68 Q85 65 80 50" stroke="url(#limbGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          <Circle cx="80" cy="48" r="10" fill={color} />
        </>
      ) : (
        <>
          <Path d="M52 45 Q35 55 30 65" stroke="url(#limbGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <Path d="M78 45 Q95 55 100 65" stroke="url(#limbGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <Path d="M55 70 Q50 90 48 115" stroke="url(#limbGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          <Path d="M75 70 Q80 90 82 115" stroke="url(#limbGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
        </>
      )}
    </Svg>
  );
  
  const render3DCircle = () => (
    <Svg width={130} height={130} viewBox="0 0 130 130">
      <Defs>
        <RadialGradient id="sphereGrad" cx="35%" cy="30%" r="65%">
          <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
          <Stop offset="60%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Circle cx="65" cy="65" r="45" stroke={darkerColor} strokeWidth="4" fill="none" strokeDasharray="15 8" />
      <Circle cx="65" cy="20" r="12" fill="url(#sphereGrad)" />
      <Circle cx="60" cy="16" r="3" fill="#FFFFFF" opacity="0.5" />
    </Svg>
  );
  
  switch (exerciseName) {
    case "Jumping Jacks":
      return (
        <Animated.View style={bounceStyle}>
          {render3DFigure("jumping")}
        </Animated.View>
      );
    case "Arm Circles":
      return (
        <Animated.View style={rotationStyle}>
          {render3DCircle()}
        </Animated.View>
      );
    case "Hip Rotations":
      return (
        <Animated.View style={swingStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="hipBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
              <RadialGradient id="hipHeadGrad" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="65" cy="125" rx="20" ry="4" fill={shadowColor} />
            <Ellipse cx="65" cy="20" rx="12" ry="14" fill="url(#hipHeadGrad)" />
            <Ellipse cx="65" cy="45" rx="14" ry="18" fill="url(#hipBodyGrad)" />
            <Ellipse cx="65" cy="70" rx="18" ry="12" fill={color} stroke={darkerColor} strokeWidth="2" strokeDasharray="6 4" />
            <Path d="M52 80 Q45 100 40 120" stroke="url(#hipBodyGrad)" strokeWidth="11" strokeLinecap="round" fill="none" />
            <Path d="M78 80 Q85 100 90 120" stroke="url(#hipBodyGrad)" strokeWidth="11" strokeLinecap="round" fill="none" />
          </Svg>
        </Animated.View>
      );
    case "High Knees":
      return (
        <Animated.View style={bounceStyle}>
          {render3DFigure("kneeUp")}
        </Animated.View>
      );
    case "Leg Swings":
      return (
        <Animated.View style={swingStyle}>
          {render3DFigure("kicking")}
        </Animated.View>
      );
    case "Shadow Boxing":
      return (
        <Animated.View style={bounceStyle}>
          {render3DFigure("punching")}
        </Animated.View>
      );
    case "Neck Rotations":
      return (
        <Animated.View style={[rotationStyle, pulseStyle]}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <RadialGradient id="neckGrad" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Circle cx="65" cy="65" r="30" stroke={darkerColor} strokeWidth="3" fill="none" />
            <Ellipse cx="65" cy="65" rx="18" ry="22" fill="url(#neckGrad)" />
            <Circle cx="58" cy="58" r="4" fill="#FFFFFF" opacity="0.4" />
            <Circle cx="65" cy="30" r="6" fill={color} />
          </Svg>
        </Animated.View>
      );
    case "Torso Twists":
      return (
        <Animated.View style={swingStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="twistGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
              <RadialGradient id="twistHeadGrad" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="65" cy="125" rx="22" ry="4" fill={shadowColor} />
            <Ellipse cx="65" cy="18" rx="12" ry="14" fill="url(#twistHeadGrad)" />
            <Ellipse cx="65" cy="48" rx="16" ry="22" fill="url(#twistGrad)" />
            <Path d="M20 50 L110 50" stroke="url(#twistGrad)" strokeWidth="10" strokeLinecap="round" />
            <Ellipse cx="15" cy="50" rx="10" ry="12" fill={color} />
            <Ellipse cx="115" cy="50" rx="10" ry="12" fill={color} />
            <Circle cx="12" cy="46" r="3" fill="#FFFFFF" opacity="0.4" />
            <Circle cx="112" cy="46" r="3" fill="#FFFFFF" opacity="0.4" />
            <Path d="M55 70 Q48 95 42 120" stroke="url(#twistGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            <Path d="M75 70 Q82 95 88 120" stroke="url(#twistGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          </Svg>
        </Animated.View>
      );
    case "Ankle Circles":
      return (
        <Animated.View style={rotationStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <RadialGradient id="ankleGrad" cx="35%" cy="30%" r="65%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Circle cx="65" cy="65" r="35" stroke={darkerColor} strokeWidth="4" fill="none" strokeDasharray="10 6" />
            <Ellipse cx="65" cy="28" rx="14" ry="10" fill="url(#ankleGrad)" />
            <Circle cx="60" cy="25" r="3" fill="#FFFFFF" opacity="0.4" />
          </Svg>
        </Animated.View>
      );
    case "Light Bouncing":
      return (
        <Animated.View style={bounceStyle}>
          {render3DFigure("standing")}
        </Animated.View>
      );
    case "Slow Teeps":
      return (
        <Animated.View style={swingStyle}>
          {render3DFigure("kicking")}
        </Animated.View>
      );
    case "Knee Raises":
      return (
        <Animated.View style={bounceStyle}>
          {render3DFigure("kneeUp")}
        </Animated.View>
      );
    case "Standing Side Stretch":
      return (
        <Animated.View style={swingStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="sideStretchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
              <RadialGradient id="sideStretchHead" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="65" cy="125" rx="20" ry="4" fill={shadowColor} />
            <Ellipse cx="65" cy="22" rx="12" ry="14" fill="url(#sideStretchHead)" />
            <Ellipse cx="65" cy="50" rx="14" ry="20" fill="url(#sideStretchGrad)" />
            <Path d="M52 40 Q30 25 20 15" stroke="url(#sideStretchGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M78 40 Q95 25 110 15" stroke="url(#sideStretchGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M55 70 Q50 95 48 120" stroke="url(#sideStretchGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            <Path d="M75 70 Q80 95 82 120" stroke="url(#sideStretchGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          </Svg>
        </Animated.View>
      );
    case "Quad Stretch":
      return (
        <Animated.View style={pulseStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="quadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
              <RadialGradient id="quadHead" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="55" cy="125" rx="18" ry="4" fill={shadowColor} />
            <Ellipse cx="55" cy="22" rx="12" ry="14" fill="url(#quadHead)" />
            <Ellipse cx="55" cy="50" rx="14" ry="20" fill="url(#quadGrad)" />
            <Path d="M42 45 Q30 50 25 55" stroke="url(#quadGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M68 45 Q85 40 95 50" stroke="url(#quadGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M45 70 Q40 95 38 120" stroke="url(#quadGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            <Path d="M65 70 Q80 75 85 55 Q90 40 100 45" stroke="url(#quadGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          </Svg>
        </Animated.View>
      );
    case "Hamstring Stretch":
    case "Forward Fold":
      return (
        <Animated.View style={pulseStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="hamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
              <RadialGradient id="hamHead" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="65" cy="120" rx="22" ry="4" fill={shadowColor} />
            <Ellipse cx="65" cy="75" rx="14" ry="18" fill="url(#hamGrad)" />
            <Ellipse cx="65" cy="100" rx="12" ry="14" fill="url(#hamHead)" />
            <Path d="M52 65 Q40 80 35 95" stroke="url(#hamGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M78 65 Q90 80 95 95" stroke="url(#hamGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M55 60 Q50 40 45 25" stroke="url(#hamGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            <Path d="M75 60 Q80 40 85 25" stroke="url(#hamGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          </Svg>
        </Animated.View>
      );
    case "Calf Stretch":
      return (
        <Animated.View style={pulseStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="calfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
              <RadialGradient id="calfHead" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="55" cy="125" rx="25" ry="4" fill={shadowColor} />
            <Ellipse cx="45" cy="28" rx="12" ry="14" fill="url(#calfHead)" />
            <Ellipse cx="45" cy="55" rx="14" ry="18" fill="url(#calfGrad)" />
            <Path d="M32 48 Q20 55 15 60" stroke="url(#calfGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M58 48 Q70 55 75 60" stroke="url(#calfGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M35 72 Q30 95 28 120" stroke="url(#calfGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            <Path d="M55 72 Q75 85 95 120" stroke="url(#calfGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          </Svg>
        </Animated.View>
      );
    case "Deep Breathing":
      return (
        <Animated.View style={pulseStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <RadialGradient id="breathGrad" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="0.8" />
                <Stop offset="70%" stopColor={color} stopOpacity="0.6" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="0.3" />
              </RadialGradient>
              <RadialGradient id="breathHead" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Circle cx="65" cy="65" r="50" fill="url(#breathGrad)" />
            <Circle cx="65" cy="65" r="35" fill="url(#breathGrad)" />
            <Circle cx="65" cy="65" r="20" fill="url(#breathHead)" />
            <Circle cx="60" cy="60" r="4" fill="#FFFFFF" opacity="0.4" />
          </Svg>
        </Animated.View>
      );
    case "Hip Flexor Stretch":
      return (
        <Animated.View style={pulseStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="hipFlexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
              <RadialGradient id="hipFlexHead" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="65" cy="120" rx="30" ry="4" fill={shadowColor} />
            <Ellipse cx="50" cy="35" rx="12" ry="14" fill="url(#hipFlexHead)" />
            <Ellipse cx="50" cy="60" rx="14" ry="18" fill="url(#hipFlexGrad)" />
            <Path d="M37 55 Q25 60 20 65" stroke="url(#hipFlexGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M63 55 Q75 60 80 65" stroke="url(#hipFlexGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M40 78 Q35 100 30 118" stroke="url(#hipFlexGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            <Path d="M60 78 Q85 90 105 118" stroke="url(#hipFlexGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          </Svg>
        </Animated.View>
      );
    case "Shoulder Stretch":
    case "Tricep Stretch":
      return (
        <Animated.View style={swingStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="shoulderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
              <RadialGradient id="shoulderHead" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="65" cy="125" rx="20" ry="4" fill={shadowColor} />
            <Ellipse cx="65" cy="22" rx="12" ry="14" fill="url(#shoulderHead)" />
            <Ellipse cx="65" cy="50" rx="14" ry="20" fill="url(#shoulderGrad)" />
            <Path d="M52 42 Q35 45 25 50 Q40 55 55 50" stroke="url(#shoulderGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M78 45 Q95 50 100 55" stroke="url(#shoulderGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M55 70 Q50 95 48 120" stroke="url(#shoulderGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            <Path d="M75 70 Q80 95 82 120" stroke="url(#shoulderGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          </Svg>
        </Animated.View>
      );
    case "Neck Stretch":
      return (
        <Animated.View style={swingStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="neckStretchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
              <RadialGradient id="neckStretchHead" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="65" cy="125" rx="20" ry="4" fill={shadowColor} />
            <Ellipse cx="50" cy="25" rx="14" ry="16" fill="url(#neckStretchHead)" />
            <Circle cx="45" cy="20" r="3" fill="#FFFFFF" opacity="0.4" />
            <Ellipse cx="65" cy="55" rx="14" ry="20" fill="url(#neckStretchGrad)" />
            <Path d="M52 50 Q40 55 35 60" stroke="url(#neckStretchGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M78 50 Q90 55 95 60" stroke="url(#neckStretchGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M55 75 Q50 95 48 120" stroke="url(#neckStretchGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            <Path d="M75 75 Q80 95 82 120" stroke="url(#neckStretchGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          </Svg>
        </Animated.View>
      );
    case "Seated Twist":
      return (
        <Animated.View style={swingStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="seatedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
              <RadialGradient id="seatedHead" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="65" cy="115" rx="30" ry="5" fill={shadowColor} />
            <Ellipse cx="65" cy="35" rx="12" ry="14" fill="url(#seatedHead)" />
            <Ellipse cx="65" cy="60" rx="14" ry="18" fill="url(#seatedGrad)" />
            <Path d="M52 55 Q30 50 20 55" stroke="url(#seatedGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M78 55 Q100 50 110 55" stroke="url(#seatedGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M55 78 Q45 90 30 100" stroke="url(#seatedGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            <Path d="M75 78 Q85 90 100 100" stroke="url(#seatedGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          </Svg>
        </Animated.View>
      );
    case "Butterfly Stretch":
      return (
        <Animated.View style={pulseStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="butterflyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
              <RadialGradient id="butterflyHead" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="65" cy="110" rx="35" ry="5" fill={shadowColor} />
            <Ellipse cx="65" cy="30" rx="12" ry="14" fill="url(#butterflyHead)" />
            <Ellipse cx="65" cy="55" rx="14" ry="16" fill="url(#butterflyGrad)" />
            <Path d="M52 50 Q40 55 35 60" stroke="url(#butterflyGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M78 50 Q90 55 95 60" stroke="url(#butterflyGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M55 70 Q30 85 20 100" stroke="url(#butterflyGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            <Path d="M75 70 Q100 85 110 100" stroke="url(#butterflyGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            <Ellipse cx="65" cy="95" rx="20" ry="10" fill={color} opacity="0.6" />
          </Svg>
        </Animated.View>
      );
    case "Child's Pose":
      return (
        <Animated.View style={pulseStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="childGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
              <RadialGradient id="childHead" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="65" cy="90" rx="40" ry="6" fill={shadowColor} />
            <Ellipse cx="65" cy="75" rx="30" ry="15" fill="url(#childGrad)" />
            <Ellipse cx="65" cy="55" rx="14" ry="16" fill="url(#childHead)" />
            <Circle cx="60" cy="50" r="3" fill="#FFFFFF" opacity="0.4" />
            <Path d="M35 70 Q15 65 5 60" stroke="url(#childGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M95 70 Q115 65 125 60" stroke="url(#childGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
            <Path d="M50 88 Q45 100 40 110" stroke="url(#childGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
            <Path d="M80 88 Q85 100 90 110" stroke="url(#childGrad)" strokeWidth="12" strokeLinecap="round" fill="none" />
          </Svg>
        </Animated.View>
      );
    default:
      return (
        <Animated.View style={[bounceStyle, pulseStyle]}>
          {render3DFigure("standing")}
        </Animated.View>
      );
  }
}

interface FootworkAnimationProps {
  drillName: string;
  color: string;
}

function FootworkAnimation({ drillName, color }: FootworkAnimationProps) {
  const slide = useSharedValue(0);
  const bounce = useSharedValue(0);
  const rotate = useSharedValue(0);
  
  const darkerColor = color + "CC";
  const lighterColor = color + "88";
  const shadowColor = "#00000040";
  
  useEffect(() => {
    slide.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 400, easing: Easing.out(Easing.quad) }),
        withTiming(20, { duration: 800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 400, easing: Easing.in(Easing.quad) })
      ),
      -1,
      true
    );
    bounce.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 250, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 250, easing: Easing.in(Easing.quad) })
      ),
      -1,
      true
    );
    rotate.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 600, easing: Easing.out(Easing.quad) }),
        withTiming(15, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 600, easing: Easing.in(Easing.quad) })
      ),
      -1,
      true
    );
    
    return () => {
      cancelAnimation(slide);
      cancelAnimation(bounce);
      cancelAnimation(rotate);
    };
  }, []);
  
  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slide.value }],
  }));
  
  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));
  
  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));
  
  const renderFeet = () => (
    <Svg width={130} height={130} viewBox="0 0 130 130">
      <Defs>
        <RadialGradient id="footGradL" cx="40%" cy="35%" r="60%">
          <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
          <Stop offset="100%" stopColor={color} stopOpacity="1" />
        </RadialGradient>
        <RadialGradient id="footGradR" cx="40%" cy="35%" r="60%">
          <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
          <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Ellipse cx="45" cy="85" rx="18" ry="8" fill={shadowColor} />
      <Ellipse cx="85" cy="85" rx="18" ry="8" fill={shadowColor} />
      <Ellipse cx="45" cy="70" rx="16" ry="25" fill="url(#footGradL)" />
      <Ellipse cx="85" cy="70" rx="16" ry="25" fill="url(#footGradR)" />
      <Circle cx="40" cy="58" r="4" fill="#FFFFFF" opacity="0.4" />
      <Circle cx="80" cy="58" r="4" fill="#FFFFFF" opacity="0.4" />
    </Svg>
  );
  
  switch (drillName) {
    case "Basic Shuffle":
    case "Forward-Back Step":
    case "Bounce Step":
      return (
        <Animated.View style={slideStyle}>
          {renderFeet()}
        </Animated.View>
      );
    case "Circle Left":
    case "Circle Right":
      return (
        <Animated.View style={rotateStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <RadialGradient id="circleFootGrad" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Circle cx="65" cy="65" r="40" stroke={darkerColor} strokeWidth="3" fill="none" strokeDasharray="8 5" />
            <Path d="M65 25 L70 35 L60 35 Z" fill={color} />
            <Ellipse cx="65" cy="65" rx="16" ry="25" fill="url(#circleFootGrad)" />
            <Circle cx="60" cy="55" r="4" fill="#FFFFFF" opacity="0.4" />
          </Svg>
        </Animated.View>
      );
    case "Diamond Steps":
    case "L-Step":
      return (
        <Animated.View style={bounceStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <LinearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Path d="M65 20 L100 65 L65 110 L30 65 Z" stroke={darkerColor} strokeWidth="3" fill="none" strokeDasharray="6 4" />
            <Ellipse cx="65" cy="65" rx="14" ry="22" fill="url(#diamondGrad)" />
            <Circle cx="60" cy="55" r="4" fill="#FFFFFF" opacity="0.4" />
          </Svg>
        </Animated.View>
      );
    case "Switch Stance":
      return (
        <Animated.View style={[slideStyle, bounceStyle]}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <RadialGradient id="switchGrad" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="40" cy="90" rx="14" ry="6" fill={shadowColor} />
            <Ellipse cx="90" cy="90" rx="14" ry="6" fill={shadowColor} />
            <Ellipse cx="40" cy="65" rx="14" ry="22" fill="url(#switchGrad)" />
            <Ellipse cx="90" cy="75" rx="14" ry="22" fill="url(#switchGrad)" />
            <Path d="M55 60 L75 70" stroke={darkerColor} strokeWidth="2" strokeDasharray="4 2" />
            <Path d="M73 67 L75 70 L71 70" fill={darkerColor} />
            <Circle cx="36" cy="55" r="3" fill="#FFFFFF" opacity="0.4" />
            <Circle cx="86" cy="65" r="3" fill="#FFFFFF" opacity="0.4" />
          </Svg>
        </Animated.View>
      );
    case "Angle Off":
    case "Retreat & Reset":
      return (
        <Animated.View style={bounceStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <RadialGradient id="angleGrad" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Path d="M65 85 L35 30" stroke={darkerColor} strokeWidth="3" strokeDasharray="6 4" />
            <Path d="M35 30 L40 42 L32 38" fill={darkerColor} />
            <Ellipse cx="65" cy="90" rx="20" ry="6" fill={shadowColor} />
            <Ellipse cx="65" cy="75" rx="16" ry="22" fill="url(#angleGrad)" />
            <Circle cx="60" cy="65" r="4" fill="#FFFFFF" opacity="0.4" />
          </Svg>
        </Animated.View>
      );
    case "Pendulum":
      return (
        <Animated.View style={slideStyle}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <RadialGradient id="pendGrad" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Path d="M25 65 L105 65" stroke={darkerColor} strokeWidth="2" strokeDasharray="4 3" />
            <Ellipse cx="65" cy="90" rx="25" ry="5" fill={shadowColor} />
            <Ellipse cx="65" cy="70" rx="18" ry="26" fill="url(#pendGrad)" />
            <Circle cx="58" cy="58" r="5" fill="#FFFFFF" opacity="0.4" />
          </Svg>
        </Animated.View>
      );
    case "Check Step":
      return (
        <Animated.View style={[bounceStyle, slideStyle]}>
          <Svg width={130} height={130} viewBox="0 0 130 130">
            <Defs>
              <RadialGradient id="checkGrad" cx="40%" cy="35%" r="60%">
                <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="55" cy="92" rx="16" ry="5" fill={shadowColor} />
            <Ellipse cx="80" cy="92" rx="12" ry="4" fill={shadowColor} />
            <Ellipse cx="55" cy="70" rx="16" ry="24" fill="url(#checkGrad)" />
            <Ellipse cx="80" cy="78" rx="12" ry="18" fill="url(#checkGrad)" opacity="0.7" />
            <Circle cx="50" cy="58" r="4" fill="#FFFFFF" opacity="0.4" />
          </Svg>
        </Animated.View>
      );
    default:
      return (
        <Animated.View style={bounceStyle}>
          {renderFeet()}
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
  const pulse = useSharedValue(1);
  
  const darkerColor = color + "CC";
  const lighterColor = color + "88";
  const shadowColor = "#00000040";
  
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
        withTiming(40, { duration: 280, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 450, easing: Easing.in(Easing.quad) })
      ),
      -1,
      false
    );
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 250, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 350, easing: Easing.in(Easing.quad) })
      ),
      -1,
      false
    );
    
    return () => {
      cancelAnimation(strike);
      cancelAnimation(kick);
      cancelAnimation(pulse);
    };
  }, []);
  
  const strikeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: strike.value * 25 }, { scale: 1 + strike.value * 0.05 }],
  }));
  
  const kickStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${kick.value}deg` }],
  }));
  
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));
  
  const render3DFist = (x: number, y: number) => (
    <G>
      <Defs>
        <RadialGradient id="fistGrad" cx="35%" cy="30%" r="65%">
          <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
          <Stop offset="60%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Ellipse cx={x} cy={y + 2} rx="14" ry="12" fill={shadowColor} />
      <Ellipse cx={x} cy={y} rx="14" ry="16" fill="url(#fistGrad)" />
      <Circle cx={x - 4} cy={y - 4} r="3" fill="#FFFFFF" opacity="0.4" />
    </G>
  );
  
  const render3DFoot = (x: number, y: number, rotation: number = 0) => (
    <G>
      <Defs>
        <RadialGradient id="footGrad" cx="35%" cy="30%" r="65%">
          <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
          <Stop offset="60%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Ellipse cx={x} cy={y} rx="16" ry="10" fill="url(#footGrad)" transform={`rotate(${rotation} ${x} ${y})`} />
      <Circle cx={x - 5} cy={y - 3} r="2" fill="#FFFFFF" opacity="0.4" />
    </G>
  );
  
  const render3DKnee = (x: number, y: number) => (
    <G>
      <Defs>
        <RadialGradient id="kneeGrad" cx="40%" cy="35%" r="60%">
          <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
          <Stop offset="60%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Ellipse cx={x} cy={y + 3} rx="16" ry="14" fill={shadowColor} />
      <Ellipse cx={x} cy={y} rx="16" ry="18" fill="url(#kneeGrad)" />
      <Circle cx={x - 4} cy={y - 5} r="4" fill="#FFFFFF" opacity="0.35" />
    </G>
  );
  
  if (moveName.includes("Jab") || moveName === "Jab") {
    return (
      <Animated.View style={[strikeStyle, pulseStyle]}>
        <Svg width={150} height={100} viewBox="0 0 150 100">
          <Defs>
            <LinearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={darkerColor} stopOpacity="1" />
              <Stop offset="50%" stopColor={color} stopOpacity="1" />
              <Stop offset="100%" stopColor={lighterColor} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="70" cy="55" rx="50" ry="6" fill={shadowColor} />
          <Path d="M15 50 Q60 48 105 50" stroke="url(#armGrad)" strokeWidth="14" strokeLinecap="round" fill="none" />
          {render3DFist(120, 50)}
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Cross") || moveName === "Cross") {
    return (
      <Animated.View style={[strikeStyle, pulseStyle]}>
        <Svg width={150} height={100} viewBox="0 0 150 100">
          <Defs>
            <LinearGradient id="crossArmGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={darkerColor} stopOpacity="1" />
              <Stop offset="50%" stopColor={color} stopOpacity="1" />
              <Stop offset="100%" stopColor={lighterColor} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="70" cy="58" rx="55" ry="5" fill={shadowColor} />
          <Path d="M5 65 Q55 55 105 45" stroke="url(#crossArmGrad)" strokeWidth="14" strokeLinecap="round" fill="none" />
          {render3DFist(118, 42)}
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Hook")) {
    const isLeft = moveName.includes("Left");
    return (
      <Animated.View style={[strikeStyle, pulseStyle]}>
        <Svg width={150} height={100} viewBox="0 0 150 100">
          <Defs>
            <LinearGradient id="hookGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={darkerColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={color} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="75" cy="60" rx="45" ry="5" fill={shadowColor} />
          <Path 
            d={isLeft ? "M25 75 Q55 75 70 55 Q85 35 110 38" : "M125 75 Q95 75 80 55 Q65 35 40 38"} 
            stroke="url(#hookGrad)" 
            strokeWidth="12" 
            fill="none" 
            strokeLinecap="round"
          />
          {render3DFist(isLeft ? 118 : 32, 38)}
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Uppercut")) {
    return (
      <Animated.View style={[strikeStyle, pulseStyle, { transform: [{ rotate: "-40deg" }] }]}>
        <Svg width={120} height={120} viewBox="0 0 120 120">
          <Defs>
            <LinearGradient id="upperGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <Stop offset="0%" stopColor={darkerColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={color} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="60" cy="65" rx="8" ry="35" fill={shadowColor} />
          <Path d="M60 105 Q58 75 60 45" stroke="url(#upperGrad)" strokeWidth="14" strokeLinecap="round" fill="none" />
          {render3DFist(60, 32)}
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Kick")) {
    const isLeft = moveName.includes("Left");
    return (
      <Animated.View style={kickStyle}>
        <Svg width={160} height={120} viewBox="0 0 160 120">
          <Defs>
            <LinearGradient id="legGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={darkerColor} stopOpacity="1" />
              <Stop offset="50%" stopColor={color} stopOpacity="1" />
              <Stop offset="100%" stopColor={lighterColor} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="80" cy="75" rx="60" ry="8" fill={shadowColor} />
          <Path 
            d={isLeft ? "M15 85 Q60 70 115 55" : "M145 85 Q100 70 45 55"} 
            stroke="url(#legGrad)" 
            strokeWidth="18" 
            strokeLinecap="round" 
            fill="none" 
          />
          {render3DFoot(isLeft ? 130 : 30, 52, isLeft ? -15 : 15)}
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Knee")) {
    return (
      <Animated.View style={kickStyle}>
        <Svg width={120} height={130} viewBox="0 0 120 130">
          <Defs>
            <LinearGradient id="kneeLegGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <Stop offset="0%" stopColor={darkerColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={color} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="60" cy="75" rx="10" ry="40" fill={shadowColor} />
          <Path d="M60 115 Q55 85 60 60" stroke="url(#kneeLegGrad)" strokeWidth="18" strokeLinecap="round" fill="none" />
          {render3DKnee(60, 48)}
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Elbow")) {
    const isLeft = moveName.includes("Left");
    return (
      <Animated.View style={[strikeStyle, pulseStyle]}>
        <Svg width={130} height={100} viewBox="0 0 130 100">
          <Defs>
            <LinearGradient id="elbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={darkerColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={color} stopOpacity="1" />
            </LinearGradient>
            <RadialGradient id="elbowTipGrad" cx="40%" cy="35%" r="60%">
              <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={color} stopOpacity="1" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="65" cy="55" rx="40" ry="6" fill={shadowColor} />
          <Path 
            d={isLeft ? "M15 65 L50 65 L90 40" : "M115 65 L80 65 L40 40"} 
            stroke="url(#elbowGrad)" 
            strokeWidth="12" 
            fill="none" 
            strokeLinecap="round"
          />
          <Path 
            d={isLeft ? "M82 32 L105 25 L98 52 Z" : "M48 32 L25 25 L32 52 Z"} 
            fill="url(#elbowTipGrad)" 
          />
          <Circle cx={isLeft ? 92 : 38} cy={35} r="3" fill="#FFFFFF" opacity="0.4" />
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Teep")) {
    return (
      <Animated.View style={kickStyle}>
        <Svg width={160} height={100} viewBox="0 0 160 100">
          <Defs>
            <LinearGradient id="teepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={darkerColor} stopOpacity="1" />
              <Stop offset="50%" stopColor={color} stopOpacity="1" />
              <Stop offset="100%" stopColor={lighterColor} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="75" cy="68" rx="55" ry="6" fill={shadowColor} />
          <Path d="M15 75 Q60 60 115 50" stroke="url(#teepGrad)" strokeWidth="18" strokeLinecap="round" fill="none" />
          {render3DFoot(130, 48, -10)}
        </Svg>
      </Animated.View>
    );
  }
  
  if (moveName.includes("Slip") || moveName.includes("Block")) {
    return (
      <Animated.View style={[strikeStyle, pulseStyle]}>
        <Svg width={130} height={110} viewBox="0 0 130 110">
          <Defs>
            <RadialGradient id="blockHeadGrad" cx="40%" cy="35%" r="60%">
              <Stop offset="0%" stopColor={lighterColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={color} stopOpacity="1" />
            </RadialGradient>
            <LinearGradient id="blockArmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={color} stopOpacity="1" />
              <Stop offset="100%" stopColor={darkerColor} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Ellipse cx="65" cy="105" rx="22" ry="4" fill={shadowColor} />
          <Ellipse cx="65" cy="45" rx="22" ry="26" fill="url(#blockHeadGrad)" />
          <Circle cx="58" cy="38" r="4" fill="#FFFFFF" opacity="0.35" />
          <Path d="M45 60 Q35 45 40 25" stroke="url(#blockArmGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
          <Path d="M85 60 Q95 45 90 25" stroke="url(#blockArmGrad)" strokeWidth="10" strokeLinecap="round" fill="none" />
          {render3DFist(40, 20)}
          {render3DFist(90, 20)}
        </Svg>
      </Animated.View>
    );
  }
  
  return (
    <Animated.View style={[strikeStyle, pulseStyle]}>
      <Svg width={100} height={100} viewBox="0 0 100 100">
        {render3DFist(50, 50)}
      </Svg>
    </Animated.View>
  );
}

const WARMUP_EXERCISES: WarmupExercise[] = [
  { name: "Jumping Jacks", thai: "กระโดดตบ", romanization: "Kra-dot Top", duration: 60, description: "Full body warm up" },
  { name: "Arm Circles", thai: "หมุนแขน", romanization: "Mun Khaen", duration: 45, description: "Shoulder mobility" },
  { name: "Standing Side Stretch", thai: "ยืดข้าง", romanization: "Yuet Khang", duration: 40, description: "Side body stretch" },
  { name: "Hip Rotations", thai: "หมุนสะโพก", romanization: "Mun Sa-phok", duration: 45, description: "Hip flexibility" },
  { name: "Quad Stretch", thai: "ยืดต้นขา", romanization: "Yuet Ton Khaa", duration: 40, description: "Front thigh stretch" },
  { name: "High Knees", thai: "ยกเข่าสูง", romanization: "Yok Khao Soong", duration: 60, description: "Cardio warm up" },
  { name: "Leg Swings", thai: "แกว่งขา", romanization: "Kwaeng Khaa", duration: 45, description: "Dynamic stretching" },
  { name: "Hamstring Stretch", thai: "ยืดขาหลัง", romanization: "Yuet Khaa Lang", duration: 40, description: "Back of leg stretch" },
  { name: "Shadow Boxing", thai: "ชกลม", romanization: "Chok Lom", duration: 90, description: "Light punching practice" },
  { name: "Neck Rotations", thai: "หมุนคอ", romanization: "Mun Kho", duration: 30, description: "Neck mobility" },
  { name: "Torso Twists", thai: "บิดลำตัว", romanization: "Bit Lam Tua", duration: 45, description: "Core activation" },
  { name: "Calf Stretch", thai: "ยืดน่อง", romanization: "Yuet Nong", duration: 40, description: "Lower leg stretch" },
  { name: "Ankle Circles", thai: "หมุนข้อเท้า", romanization: "Mun Kho Thao", duration: 30, description: "Ankle mobility" },
  { name: "Light Bouncing", thai: "เด้งเบาๆ", romanization: "Deng Bao Bao", duration: 60, description: "Ready stance practice" },
  { name: "Slow Teeps", thai: "ถีบช้าๆ", romanization: "Teep Cha Cha", duration: 60, description: "Kick technique warm up" },
  { name: "Knee Raises", thai: "ยกเข่า", romanization: "Yok Khao", duration: 60, description: "Balance and core" },
];

interface FootworkDrill {
  name: string;
  thai: string;
  romanization: string;
  duration: number;
  description: string;
}

const FOOTWORK_DRILLS: FootworkDrill[] = [
  { name: "Basic Shuffle", thai: "สลับเท้า", romanization: "Sa-lap Thao", duration: 45, description: "Side to side movement" },
  { name: "Forward-Back Step", thai: "ก้าวหน้า-ถอย", romanization: "Kaao Naa - Thoi", duration: 45, description: "In and out movement" },
  { name: "Circle Left", thai: "วงกลมซ้าย", romanization: "Wong Klom Saai", duration: 40, description: "Pivot around opponent" },
  { name: "Circle Right", thai: "วงกลมขวา", romanization: "Wong Klom Khwaa", duration: 40, description: "Pivot around opponent" },
  { name: "Diamond Steps", thai: "สี่เหลี่ยม", romanization: "Sii Liam", duration: 50, description: "Move in diamond pattern" },
  { name: "Angle Off", thai: "หลบมุม", romanization: "Lop Mum", duration: 45, description: "Cut angles after strikes" },
  { name: "Switch Stance", thai: "สลับท่า", romanization: "Sa-lap Thaa", duration: 40, description: "Orthodox to southpaw" },
  { name: "Retreat & Reset", thai: "ถอยแล้วตั้งรับ", romanization: "Thoi Laeo Tang Rap", duration: 45, description: "Create distance" },
  { name: "Bounce Step", thai: "เด้งเท้า", romanization: "Deng Thao", duration: 40, description: "Stay light and mobile" },
  { name: "L-Step", thai: "ก้าวตัวแอล", romanization: "Kaao Tua L", duration: 45, description: "Exit at 90 degrees" },
  { name: "Pendulum", thai: "เหวี่ยง", romanization: "Wiang", duration: 50, description: "Weight shift rhythm" },
  { name: "Check Step", thai: "ก้าวเช็ค", romanization: "Kaao Check", duration: 40, description: "Feint with footwork" },
];

const COOLDOWN_EXERCISES: WarmupExercise[] = [
  { name: "Deep Breathing", thai: "หายใจลึก", romanization: "Hai Jai Luek", duration: 45, description: "Slow your heart rate" },
  { name: "Standing Side Stretch", thai: "ยืดข้าง", romanization: "Yuet Khang", duration: 45, description: "Side body stretch" },
  { name: "Forward Fold", thai: "ก้มตัว", romanization: "Kom Tua", duration: 50, description: "Hamstring and back stretch" },
  { name: "Quad Stretch", thai: "ยืดต้นขา", romanization: "Yuet Ton Khaa", duration: 45, description: "Front thigh stretch" },
  { name: "Hip Flexor Stretch", thai: "ยืดสะโพก", romanization: "Yuet Sa-phok", duration: 50, description: "Hip opening stretch" },
  { name: "Calf Stretch", thai: "ยืดน่อง", romanization: "Yuet Nong", duration: 40, description: "Lower leg stretch" },
  { name: "Shoulder Stretch", thai: "ยืดไหล่", romanization: "Yuet Lai", duration: 40, description: "Shoulder release" },
  { name: "Tricep Stretch", thai: "ยืดแขน", romanization: "Yuet Khaen", duration: 40, description: "Upper arm stretch" },
  { name: "Neck Stretch", thai: "ยืดคอ", romanization: "Yuet Kho", duration: 40, description: "Neck release" },
  { name: "Seated Twist", thai: "บิดตัวนั่ง", romanization: "Bit Tua Nang", duration: 50, description: "Spine rotation" },
  { name: "Butterfly Stretch", thai: "ผีเสื้อ", romanization: "Phii Suea", duration: 50, description: "Inner thigh stretch" },
  { name: "Child's Pose", thai: "ท่าเด็ก", romanization: "Thaa Dek", duration: 60, description: "Full body relaxation" },
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

type WorkoutPhase = "idle" | "warmup" | "warmup-exercise" | "footwork" | "footwork-drill" | "countdown" | "calling" | "executing" | "rest" | "cooldown" | "cooldown-exercise" | "complete";

interface TrainingDay {
  day: number;
  type: "workout" | "active-recovery" | "rest";
  workoutId?: string;
  focus?: string;
  description: string;
}

const TRAINING_SCHEDULES: Record<string, TrainingDay[]> = {
  beginner: Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const week = Math.ceil(day / 7);
    const dayOfWeek = ((day - 1) % 7) + 1;
    
    if (dayOfWeek === 7) return { day, type: "rest", description: "Full rest day - recover" };
    if (dayOfWeek === 4) return { day, type: "active-recovery", focus: "Stretching & light cardio", description: "Active recovery" };
    
    const focuses = ["Fundamentals", "Punch combos", "Kick technique", "Defense basics", "Full combinations"];
    const focusIndex = (day - 1) % focuses.length;
    
    return {
      day,
      type: "workout",
      workoutId: "beginner-1",
      focus: focuses[focusIndex],
      description: `Week ${week} - ${focuses[focusIndex]}`,
    };
  }),
  intermediate: Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const week = Math.ceil(day / 7);
    const dayOfWeek = ((day - 1) % 7) + 1;
    
    if (dayOfWeek === 7) return { day, type: "rest", description: "Full rest day - recover" };
    if (dayOfWeek === 4) return { day, type: "active-recovery", focus: "Mobility & shadow boxing", description: "Active recovery" };
    
    const focuses = ["Power punches", "Kick combinations", "Knee & clinch", "Counter attacks", "Flow drills", "Conditioning"];
    const focusIndex = (day - 1) % focuses.length;
    
    return {
      day,
      type: "workout",
      workoutId: "intermediate-1",
      focus: focuses[focusIndex],
      description: `Week ${week} - ${focuses[focusIndex]}`,
    };
  }),
  advanced: Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const week = Math.ceil(day / 7);
    const dayOfWeek = ((day - 1) % 7) + 1;
    
    if (dayOfWeek === 7) return { day, type: "rest", description: "Full rest day - recover" };
    if (dayOfWeek === 3 || dayOfWeek === 6) return { day, type: "active-recovery", focus: "Technical drilling", description: "Active recovery" };
    
    const focuses = ["All 8 limbs", "Speed & timing", "Power rounds", "Clinch work", "Sparring prep"];
    const focusIndex = (day - 1) % focuses.length;
    
    return {
      day,
      type: "workout",
      workoutId: "advanced-1",
      focus: focuses[focusIndex],
      description: `Week ${week} - ${focuses[focusIndex]}`,
    };
  }),
};

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
  const [currentCooldownIndex, setCurrentCooldownIndex] = useState(0);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const [currentFootworkIndex, setCurrentFootworkIndex] = useState(0);
  const [footworkTimeLeft, setFootworkTimeLeft] = useState(0);
  
  const scale = useSharedValue(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warmupIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const footworkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isActiveRef = useRef(false);
  
  const currentCombo = selectedWorkout?.combinations[currentComboIndex];
  const currentMove = currentMoveIndex >= 0 && currentCombo ? currentCombo.moves[currentMoveIndex] : null;
  const currentWarmup = WARMUP_EXERCISES[currentWarmupIndex];
  const currentCooldown = COOLDOWN_EXERCISES[currentCooldownIndex];
  const currentFootwork = FOOTWORK_DRILLS[currentFootworkIndex];
  
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
    if (cooldownIntervalRef.current) {
      clearInterval(cooldownIntervalRef.current);
      cooldownIntervalRef.current = null;
    }
    if (footworkIntervalRef.current) {
      clearInterval(footworkIntervalRef.current);
      footworkIntervalRef.current = null;
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
      startFootwork(workout);
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
  
  const startFootwork = (workout: Workout) => {
    if (!isActiveRef.current) return;
    
    setPhase("footwork");
    setCurrentFootworkIndex(0);
    const text = useThai ? "ฝึกก้าวเท้า เคลื่อนไหวให้คล่อง" : "Footwork drills. Stay light on your feet.";
    speakText(text, 0.85);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    timerRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        startFootworkDrill(0, workout);
      }
    }, 3000);
  };
  
  const startFootworkDrill = (index: number, workout: Workout) => {
    if (!isActiveRef.current) return;
    
    const drillsForLevel = selectedWorkout?.level === "beginner" ? 4 : 
                           selectedWorkout?.level === "intermediate" ? 6 : 8;
    
    if (index >= drillsForLevel) {
      const text = useThai ? "ฝึกก้าวเท้าเสร็จแล้ว เริ่มคอมโบ" : "Footwork complete. Starting combinations.";
      speakText(text, 0.85);
      timerRef.current = setTimeout(() => {
        if (isActiveRef.current) {
          startMainWorkout(workout);
        }
      }, 3000);
      return;
    }
    
    const drill = FOOTWORK_DRILLS[index];
    setCurrentFootworkIndex(index);
    setFootworkTimeLeft(drill.duration);
    setPhase("footwork-drill");
    
    const drillText = useThai ? `${drill.thai}` : `${drill.name}`;
    speakText(drillText, 0.9);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    let timeLeft = drill.duration;
    footworkIntervalRef.current = setInterval(() => {
      if (!isActiveRef.current) {
        if (footworkIntervalRef.current) clearInterval(footworkIntervalRef.current);
        return;
      }
      timeLeft--;
      setFootworkTimeLeft(timeLeft);
      
      if (timeLeft === 5) {
        speakText(useThai ? "ห้าวินาที" : "5 seconds");
      }
      
      if (timeLeft <= 0) {
        if (footworkIntervalRef.current) clearInterval(footworkIntervalRef.current);
        startFootworkDrill(index + 1, workout);
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
        startCooldown();
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
    setCurrentCooldownIndex(0);
    setCurrentFootworkIndex(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const startCooldown = () => {
    if (!isActiveRef.current) return;
    
    setPhase("cooldown");
    setCurrentCooldownIndex(0);
    const text = useThai ? "เริ่มคูลดาวน์ ยืดกล้ามเนื้อ" : "Starting cooldown. Let's stretch and recover.";
    speakText(text, 0.85);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    timerRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        startCooldownExercise(0);
      }
    }, 3500);
  };
  
  const startCooldownExercise = (index: number) => {
    if (!isActiveRef.current) return;
    
    if (index >= COOLDOWN_EXERCISES.length) {
      setPhase("complete");
      const text = useThai ? "ฝึกซ้อมเสร็จแล้ว ทำได้ดีมาก" : "Workout complete. Great job!";
      speakText(text, 0.85);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }
    
    const exercise = COOLDOWN_EXERCISES[index];
    setCurrentCooldownIndex(index);
    setCooldownTimeLeft(exercise.duration);
    setPhase("cooldown-exercise");
    
    speakExercise(exercise);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    let timeLeft = exercise.duration;
    cooldownIntervalRef.current = setInterval(() => {
      if (!isActiveRef.current) {
        if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
        return;
      }
      timeLeft--;
      setCooldownTimeLeft(timeLeft);
      
      if (timeLeft === 10 && timeLeft > 0) {
        speakText(useThai ? "สิบวินาที" : "10 seconds");
      }
      
      if (timeLeft <= 0) {
        if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
        startCooldownExercise(index + 1);
      }
    }, 1000);
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
                  {useThai ? "เริ่มอบอุ่นร่างกาย" : "Warmup Starting"}
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
                  {useThai ? "ยืดกล้ามเนื้อและเตรียมร่างกาย" : "Stretching and preparing your body"}
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
        ) : (phase === "footwork" || phase === "footwork-drill") ? (
          <View style={styles.centerContent}>
            {phase === "footwork" ? (
              <>
                <View style={[styles.warmupIcon, { backgroundColor: "#2196F3" + "20" }]}>
                  <Feather name="move" size={64} color="#2196F3" />
                </View>
                <ThemedText type="h2" style={{ marginTop: Spacing.xl }}>
                  {useThai ? "ฝึกก้าวเท้า" : "Footwork Drills"}
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
                  {useThai ? "เคลื่อนไหวให้คล่อง" : "Stay light and mobile"}
                </ThemedText>
              </>
            ) : (
              <>
                <View style={styles.warmupProgress}>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    Drill {currentFootworkIndex + 1} / {selectedWorkout?.level === "beginner" ? 4 : selectedWorkout?.level === "intermediate" ? 6 : 8}
                  </ThemedText>
                  <View style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary, marginTop: Spacing.sm }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: "#2196F3",
                          width: `${((currentFootworkIndex + 1) / (selectedWorkout?.level === "beginner" ? 4 : selectedWorkout?.level === "intermediate" ? 6 : 8)) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
                
                <View style={styles.animationContainer}>
                  <FootworkAnimation 
                    drillName={currentFootwork.name} 
                    color="#2196F3" 
                  />
                </View>
                
                <ThemedText type="h1" style={[styles.countdownText, { color: "#2196F3", fontSize: 72 }]}>
                  {formatTime(footworkTimeLeft)}
                </ThemedText>
                
                <ThemedText type="h2" style={{ marginTop: Spacing.md }}>
                  {useThai ? currentFootwork.thai : currentFootwork.name}
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
                  {useThai ? currentFootwork.romanization : currentFootwork.description}
                </ThemedText>
              </>
            )}
          </View>
        ) : (phase === "cooldown" || phase === "cooldown-exercise") ? (
          <View style={styles.centerContent}>
            {phase === "cooldown" ? (
              <>
                <View style={[styles.warmupIcon, { backgroundColor: "#9C27B0" + "20" }]}>
                  <Feather name="moon" size={64} color="#9C27B0" />
                </View>
                <ThemedText type="h2" style={{ marginTop: Spacing.xl }}>
                  {useThai ? "คูลดาวน์" : "Cool Down"}
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
                  {useThai ? "ยืดกล้ามเนื้อและผ่อนคลาย" : "Stretching and recovery time"}
                </ThemedText>
              </>
            ) : (
              <>
                <View style={styles.warmupProgress}>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    Stretch {currentCooldownIndex + 1} / {COOLDOWN_EXERCISES.length}
                  </ThemedText>
                  <View style={[styles.progressBar, { backgroundColor: theme.backgroundSecondary, marginTop: Spacing.sm }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: "#9C27B0",
                          width: `${((currentCooldownIndex + 1) / COOLDOWN_EXERCISES.length) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
                
                <View style={styles.animationContainer}>
                  <ExerciseAnimation 
                    exerciseName={currentCooldown.name} 
                    color="#9C27B0" 
                  />
                </View>
                
                <ThemedText type="h1" style={[styles.countdownText, { color: "#9C27B0", fontSize: 72 }]}>
                  {formatTime(cooldownTimeLeft)}
                </ThemedText>
                
                <ThemedText type="h2" style={{ marginTop: Spacing.md }}>
                  {useThai ? currentCooldown.thai : currentCooldown.name}
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
                  {useThai ? currentCooldown.romanization : currentCooldown.description}
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
