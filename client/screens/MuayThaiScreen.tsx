import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { muayThaiTips, MuayThaiTip } from "@/lib/tipsData";

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
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    Haptics.selectionAsync();
    setExpanded(!expanded);
  };

  const typeColor = TYPE_COLORS[tip.type];
  const typeLabel = tip.type === "do" ? "Do" : "Don't";

  return (
    <Card elevation={2} onPress={handlePress} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: typeColor + "20" }]}>
          <Feather name={tip.icon as any} size={20} color={typeColor} />
        </View>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <ThemedText type="body" style={{ fontWeight: "600", flex: 1 }}>
              {tip.title}
            </ThemedText>
            {tip.priority === "safety" ? (
              <View style={[styles.safetyBadge, { backgroundColor: SAFETY_COLOR + "20" }]}>
                <Feather name="alert-circle" size={10} color={SAFETY_COLOR} />
                <ThemedText type="small" style={{ color: SAFETY_COLOR, fontWeight: "600", fontSize: 10, marginLeft: 4 }}>
                  Safety
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
          {tip.description}
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

export default function MuayThaiScreen() {
  const { theme } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  
  const doTips = muayThaiTips.filter(t => t.type === "do");
  const dontTips = muayThaiTips.filter(t => t.type === "dont");

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
        <ThemedText type="small" style={[styles.sectionIntro, { color: theme.textSecondary }]}>
          Essential tips for your first Muay Thai experience in Thailand. Respect the traditions and enjoy the art.
        </ThemedText>
        
        <ThemedText type="body" style={[styles.sectionHeader, { color: TYPE_COLORS.do }]}>
          Things to Do
        </ThemedText>
        {doTips.map((tip) => (
          <MuayThaiCard key={tip.id} tip={tip} />
        ))}
        
        <ThemedText type="body" style={[styles.sectionHeader, { color: TYPE_COLORS.dont, marginTop: Spacing.lg }]}>
          Things to Avoid
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
    paddingTop: Spacing.xl,
    gap: Spacing.sm,
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
