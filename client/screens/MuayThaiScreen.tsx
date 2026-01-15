import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { muayThaiTips, MuayThaiTip } from "@/lib/tipsData";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type WorkoutLevel = "beginner" | "intermediate" | "advanced";
type ScheduleDay = { type: "workout"; focus: string } | { type: "rest" } | { type: "active-recovery"; activity: string };

const LEVEL_COLORS: Record<WorkoutLevel, string> = {
  beginner: "#4CAF50",
  intermediate: "#FF9800",
  advanced: "#E53935",
};

const TRAINING_SCHEDULES: Record<WorkoutLevel, ScheduleDay[]> = {
  beginner: [
    { type: "workout", focus: "Basic stance & jab" },
    { type: "rest" },
    { type: "workout", focus: "Footwork fundamentals" },
    { type: "rest" },
    { type: "workout", focus: "Cross & hook intro" },
    { type: "active-recovery", activity: "Light stretching" },
    { type: "rest" },
    { type: "workout", focus: "Jab-cross combo" },
    { type: "rest" },
    { type: "workout", focus: "Defense basics" },
    { type: "rest" },
    { type: "workout", focus: "Low kick intro" },
    { type: "active-recovery", activity: "Walking" },
    { type: "rest" },
    { type: "workout", focus: "Full review week 1-2" },
    { type: "rest" },
    { type: "workout", focus: "Teep (push kick)" },
    { type: "rest" },
    { type: "workout", focus: "3-punch combos" },
    { type: "active-recovery", activity: "Yoga" },
    { type: "rest" },
    { type: "workout", focus: "Kick combinations" },
    { type: "rest" },
    { type: "workout", focus: "Mixed hand-leg" },
    { type: "rest" },
    { type: "workout", focus: "Clinch awareness" },
    { type: "active-recovery", activity: "Swimming" },
    { type: "rest" },
    { type: "workout", focus: "Final assessment" },
    { type: "active-recovery", activity: "Light stretching" },
  ],
  intermediate: [
    { type: "workout", focus: "Power jab-cross" },
    { type: "workout", focus: "Round kick power" },
    { type: "rest" },
    { type: "workout", focus: "4-punch combos" },
    { type: "workout", focus: "Check & counter" },
    { type: "active-recovery", activity: "Light run" },
    { type: "rest" },
    { type: "workout", focus: "Clinch entries" },
    { type: "workout", focus: "Knee strikes" },
    { type: "rest" },
    { type: "workout", focus: "Switch kick" },
    { type: "workout", focus: "Elbow basics" },
    { type: "active-recovery", activity: "Shadow boxing" },
    { type: "rest" },
    { type: "workout", focus: "Combo flow drill" },
    { type: "workout", focus: "Defense patterns" },
    { type: "rest" },
    { type: "workout", focus: "Clinch knees" },
    { type: "workout", focus: "Teep variations" },
    { type: "active-recovery", activity: "Jump rope" },
    { type: "rest" },
    { type: "workout", focus: "Power combos" },
    { type: "workout", focus: "Counter attacks" },
    { type: "rest" },
    { type: "workout", focus: "Full sparring prep" },
    { type: "workout", focus: "Timing drills" },
    { type: "active-recovery", activity: "Stretching" },
    { type: "rest" },
    { type: "workout", focus: "Assessment round" },
    { type: "active-recovery", activity: "Recovery" },
  ],
  advanced: [
    { type: "workout", focus: "Speed combos" },
    { type: "workout", focus: "Power rounds" },
    { type: "workout", focus: "Clinch warfare" },
    { type: "rest" },
    { type: "workout", focus: "Elbow combos" },
    { type: "workout", focus: "Knee combinations" },
    { type: "active-recovery", activity: "Running" },
    { type: "rest" },
    { type: "workout", focus: "Advanced footwork" },
    { type: "workout", focus: "Counter fighting" },
    { type: "workout", focus: "Pressure rounds" },
    { type: "rest" },
    { type: "workout", focus: "Full power day" },
    { type: "active-recovery", activity: "Technical review" },
    { type: "rest" },
    { type: "workout", focus: "Sprint combos" },
    { type: "workout", focus: "Clinch to strike" },
    { type: "workout", focus: "Defense & counter" },
    { type: "rest" },
    { type: "workout", focus: "Championship prep" },
    { type: "active-recovery", activity: "Light sparring" },
    { type: "rest" },
    { type: "workout", focus: "Endurance rounds" },
    { type: "workout", focus: "Mixed weapons" },
    { type: "workout", focus: "High intensity" },
    { type: "rest" },
    { type: "workout", focus: "Fight simulation" },
    { type: "active-recovery", activity: "Recovery" },
    { type: "workout", focus: "Peak performance" },
    { type: "rest" },
  ],
};

const TYPE_COLORS = {
  do: "#4CAF50",
  dont: "#E53935",
};

const SAFETY_COLOR = "#FF9800";

interface MuayThaiCardProps {
  tip: MuayThaiTip;
}

function MuayThaiCard({ tip }: MuayThaiCardProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    Haptics.selectionAsync();
    setExpanded(!expanded);
  };

  const typeColor = TYPE_COLORS[tip.type];
  const typeLabel = tip.type === "do" ? t("muaythai:do") : t("muaythai:dont");

  return (
    <Card elevation={2} onPress={handlePress} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: typeColor + "20" }]}>
          <Feather name={tip.icon as any} size={20} color={typeColor} />
        </View>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <ThemedText type="body" style={{ fontWeight: "600", flex: 1 }}>
              {t(`muayThaiTips:${tip.id}.title`)}
            </ThemedText>
            {tip.priority === "safety" ? (
              <View style={[styles.safetyBadge, { backgroundColor: SAFETY_COLOR + "20" }]}>
                <Feather name="alert-circle" size={10} color={SAFETY_COLOR} />
                <ThemedText type="small" style={{ color: SAFETY_COLOR, fontWeight: "600", fontSize: 10, marginLeft: 4 }}>
                  {t("muaythai:safety")}
                </ThemedText>
              </View>
            ) : null}
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {tip.titleThai}
          </ThemedText>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: typeColor + "20" }]}>
          <ThemedText type="small" style={{ color: typeColor, fontWeight: "600", fontSize: 10 }}>
            {typeLabel}
          </ThemedText>
        </View>
      </View>
      
      {expanded ? (
        <ThemedText type="small" style={[styles.description, { color: theme.textSecondary }]}>
          {t(`muayThaiTips:${tip.id}.description`)}
        </ThemedText>
      ) : null}
      
      <View style={styles.expandIndicator}>
        <Feather 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={16} 
          color={theme.textSecondary} 
        />
      </View>
    </Card>
  );
}

const STORAGE_KEY = "@sawasdee_muaythai_schedule";

function ScheduleCalendar({
  level,
  completedDays,
  onCompleteDay
}: {
  level: WorkoutLevel;
  completedDays: number[];
  onCompleteDay: (day: number) => void;
}) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const schedule = TRAINING_SCHEDULES[level];
  const color = LEVEL_COLORS[level];
  
  const rows: ScheduleDay[][] = [];
  for (let i = 0; i < schedule.length; i += 7) {
    rows.push(schedule.slice(i, i + 7));
  }
  
  return (
    <View style={scheduleStyles.calendar}>
      <View style={scheduleStyles.weekHeader}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <ThemedText key={i} type="small" style={[scheduleStyles.weekDay, { color: theme.textSecondary }]}>
            {d}
          </ThemedText>
        ))}
      </View>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={scheduleStyles.week}>
          {row.map((day, dayIndex) => {
            const dayNum = rowIndex * 7 + dayIndex + 1;
            const isCompleted = completedDays.includes(dayNum);
            const isWorkout = day.type === "workout";
            const isRest = day.type === "rest";
            const isRecovery = day.type === "active-recovery";
            
            return (
              <Pressable
                key={dayIndex}
                style={[
                  scheduleStyles.dayCell,
                  isWorkout ? { backgroundColor: color + "20" } : null,
                  isRecovery ? { backgroundColor: "#2196F3" + "15" } : null,
                  isCompleted ? { backgroundColor: color } : null,
                ]}
                onPress={() => {
                  if (!isRest) {
                    Haptics.selectionAsync();
                    onCompleteDay(dayNum);
                  }
                }}
              >
                <ThemedText 
                  type="small" 
                  style={[
                    scheduleStyles.dayNum, 
                    isCompleted ? { color: "#FFFFFF" } : null,
                  ]}
                >
                  {dayNum}
                </ThemedText>
                {isWorkout ? (
                  <Feather name="target" size={12} color={isCompleted ? "#FFFFFF" : color} />
                ) : isRecovery ? (
                  <Feather name="heart" size={12} color={isCompleted ? "#FFFFFF" : "#2196F3"} />
                ) : (
                  <Feather name="moon" size={12} color={theme.textSecondary} />
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
      <View style={scheduleStyles.legend}>
        <View style={scheduleStyles.legendItem}>
          <View style={[scheduleStyles.legendDot, { backgroundColor: color }]} />
          <ThemedText type="small" style={{ color: theme.textSecondary }}>{t("muaythai:legend.workout")}</ThemedText>
        </View>
        <View style={scheduleStyles.legendItem}>
          <View style={[scheduleStyles.legendDot, { backgroundColor: "#2196F3" }]} />
          <ThemedText type="small" style={{ color: theme.textSecondary }}>{t("muaythai:legend.recovery")}</ThemedText>
        </View>
        <View style={scheduleStyles.legendItem}>
          <View style={[scheduleStyles.legendDot, { backgroundColor: theme.textSecondary }]} />
          <ThemedText type="small" style={{ color: theme.textSecondary }}>{t("muaythai:legend.rest")}</ThemedText>
        </View>
      </View>
    </View>
  );
}

export default function MuayThaiScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [scheduleLevel, setScheduleLevel] = useState<WorkoutLevel>("beginner");
  const [completedDays, setCompletedDays] = useState<Record<WorkoutLevel, number[]>>({
    beginner: [],
    intermediate: [],
    advanced: [],
  });
  const [showSchedule, setShowSchedule] = useState(false);
  
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          setCompletedDays(parsed);
        } catch (e) {}
      }
    });
  }, []);
  
  const saveProgress = async (newData: Record<WorkoutLevel, number[]>) => {
    setCompletedDays(newData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };
  
  const handleCompleteDay = (day: number) => {
    const current = completedDays[scheduleLevel];
    const newDays = current.includes(day) 
      ? current.filter(d => d !== day)
      : [...current, day];
    saveProgress({ ...completedDays, [scheduleLevel]: newDays });
  };
  
  const doTips = muayThaiTips.filter(t => t.type === "do");
  const dontTips = muayThaiTips.filter(t => t.type === "dont");
  
  const handleWorkoutPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("MuayThaiWorkout");
  };
  
  const toggleSchedule = () => {
    Haptics.selectionAsync();
    setShowSchedule(!showSchedule);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={handleWorkoutPress}
          style={[styles.workoutBanner, { backgroundColor: "#E53935" }]}
        >
          <View style={styles.workoutBannerContent}>
            <View style={styles.workoutBannerText}>
              <ThemedText type="h4" style={{ color: "#FFFFFF" }}>
                {t("muaythai:masterWorkout")}
              </ThemedText>
              <ThemedText type="small" style={{ color: "#FFFFFF" + "CC", marginTop: 2 }}>
                {t("muaythai:voiceGuidedCombos")}
              </ThemedText>
            </View>
            <View style={styles.workoutBannerIcon}>
              <Feather name="play-circle" size={32} color="#FFFFFF" />
            </View>
          </View>
        </Pressable>
        
        <Card elevation={1} style={styles.scheduleCard}>
          <Pressable onPress={toggleSchedule} style={styles.scheduleHeader}>
            <View style={styles.scheduleHeaderLeft}>
              <View style={[styles.scheduleIcon, { backgroundColor: LEVEL_COLORS[scheduleLevel] + "20" }]}>
                <Feather name="calendar" size={20} color={LEVEL_COLORS[scheduleLevel]} />
              </View>
              <View>
                <ThemedText type="body" style={{ fontWeight: "600" }}>
                  {t("muaythai:trainingSchedule")}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {t("muaythai:daysCompleted", { count: completedDays[scheduleLevel].length })}
                </ThemedText>
              </View>
            </View>
            <Feather 
              name={showSchedule ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={theme.textSecondary} 
            />
          </Pressable>
          
          {showSchedule ? (
            <>
              <View style={styles.levelTabs}>
                {(["beginner", "intermediate", "advanced"] as WorkoutLevel[]).map((lvl) => (
                  <Pressable
                    key={lvl}
                    style={[
                      styles.levelTab,
                      { borderColor: LEVEL_COLORS[lvl] },
                      scheduleLevel === lvl ? { backgroundColor: LEVEL_COLORS[lvl] } : null,
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setScheduleLevel(lvl);
                    }}
                  >
                    <ThemedText
                      type="small"
                      style={[
                        { fontWeight: "600" },
                        scheduleLevel === lvl ? { color: "#FFFFFF" } : { color: LEVEL_COLORS[lvl] },
                      ]}
                    >
                      {t(`muaythai:levels.${lvl}`)}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
              
              <ScheduleCalendar 
                level={scheduleLevel} 
                completedDays={completedDays[scheduleLevel]} 
                onCompleteDay={handleCompleteDay}
              />
            </>
          ) : null}
        </Card>
        
        <ThemedText type="small" style={[styles.sectionIntro, { color: theme.textSecondary }]}>
          {t("muaythai:sectionIntro")}
        </ThemedText>

        <ThemedText type="body" style={[styles.sectionHeader, { color: TYPE_COLORS.do }]}>
          {t("muaythai:thingsToDo")}
        </ThemedText>
        {doTips.map((tip) => (
          <MuayThaiCard key={tip.id} tip={tip} />
        ))}

        <ThemedText type="body" style={[styles.sectionHeader, { color: TYPE_COLORS.dont, marginTop: Spacing.lg }]}>
          {t("muaythai:thingsToAvoid")}
        </ThemedText>
        {dontTips.map((tip) => (
          <MuayThaiCard key={tip.id} tip={tip} />
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
    paddingTop: 0,
    gap: Spacing.sm,
  },
  workoutBanner: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  workoutBannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  workoutBannerText: {
    flex: 1,
  },
  workoutBannerIcon: {
    marginLeft: Spacing.md,
  },
  scheduleCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scheduleHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  scheduleIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  levelTabs: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  levelTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    alignItems: "center",
  },
  sectionIntro: {
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  sectionHeader: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  card: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  safetyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  typeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  description: {
    marginTop: Spacing.md,
    lineHeight: 20,
  },
  expandIndicator: {
    alignItems: "center",
    marginTop: Spacing.xs,
  },
});

const scheduleStyles = StyleSheet.create({
  calendar: {
    marginTop: Spacing.sm,
  },
  weekHeader: {
    flexDirection: "row",
    marginBottom: Spacing.xs,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontWeight: "500",
  },
  week: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dayNum: {
    fontSize: 11,
    fontWeight: "600",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.lg,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#00000015",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
