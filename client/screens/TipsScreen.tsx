import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { culturalTips, thingsToAvoid, CulturalTip, ThingToAvoid } from "@/lib/tipsData";

type TabType = "culture" | "avoid";

const CATEGORY_COLORS = {
  etiquette: Colors.light.primary,
  religion: "#FF9800",
  social: "#4CAF50",
  food: "#E91E63",
  general: "#2196F3",
};

const CATEGORY_LABELS = {
  etiquette: "Etiquette",
  religion: "Religion",
  social: "Social",
  food: "Food",
  general: "General",
};

const SEVERITY_COLORS = {
  high: "#E53935",
  medium: "#FF9800",
  low: "#4CAF50",
};

const SEVERITY_LABELS = {
  high: "Important",
  medium: "Moderate",
  low: "Good to Know",
};

interface CulturalTipCardProps {
  tip: CulturalTip;
}

function CulturalTipCard({ tip }: CulturalTipCardProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    Haptics.selectionAsync();
    setExpanded(!expanded);
  };

  const categoryColor = CATEGORY_COLORS[tip.category];

  return (
    <Card elevation={2} onPress={handlePress} style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <View style={[styles.iconContainer, { backgroundColor: categoryColor + "20" }]}>
          <Feather name={tip.icon as any} size={20} color={categoryColor} />
        </View>
        <View style={styles.tipTitleContainer}>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {tip.title}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {tip.titleThai}
          </ThemedText>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor + "20" }]}>
          <ThemedText type="small" style={{ color: categoryColor, fontWeight: "500", fontSize: 10 }}>
            {CATEGORY_LABELS[tip.category]}
          </ThemedText>
        </View>
      </View>
      
      {expanded ? (
        <ThemedText type="small" style={[styles.tipDescription, { color: theme.textSecondary }]}>
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

interface AvoidCardProps {
  item: ThingToAvoid;
}

function AvoidCard({ item }: AvoidCardProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    Haptics.selectionAsync();
    setExpanded(!expanded);
  };

  const severityColor = SEVERITY_COLORS[item.severity];

  return (
    <Card elevation={2} onPress={handlePress} style={styles.avoidCard}>
      <View style={styles.avoidHeader}>
        <View style={[styles.rankBadge, { backgroundColor: severityColor + "20" }]}>
          <ThemedText type="body" style={{ color: severityColor, fontWeight: "700" }}>
            {item.rank}
          </ThemedText>
        </View>
        <View style={styles.avoidTitleContainer}>
          <ThemedText type="body" style={{ fontWeight: "600" }} numberOfLines={expanded ? undefined : 1}>
            {item.title}
          </ThemedText>
          <View style={[styles.severityBadge, { backgroundColor: severityColor + "15" }]}>
            <Feather name={item.icon as any} size={12} color={severityColor} />
            <ThemedText type="small" style={{ color: severityColor, fontWeight: "500", fontSize: 10, marginLeft: 4 }}>
              {SEVERITY_LABELS[item.severity]}
            </ThemedText>
          </View>
        </View>
      </View>
      
      {expanded ? (
        <ThemedText type="small" style={[styles.avoidDescription, { color: theme.textSecondary }]}>
          {item.description}
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

export default function TipsScreen() {
  const { theme } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  
  const [activeTab, setActiveTab] = useState<TabType>("culture");

  const handleTabChange = (tab: TabType) => {
    Haptics.selectionAsync();
    setActiveTab(tab);
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
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => handleTabChange("culture")}
            style={[
              styles.tab,
              activeTab === "culture" && { backgroundColor: Colors.light.primary + "20" },
            ]}
          >
            <Feather 
              name="heart" 
              size={18} 
              color={activeTab === "culture" ? Colors.light.primary : theme.textSecondary} 
            />
            <ThemedText 
              type="body" 
              style={{ 
                marginLeft: Spacing.xs,
                fontWeight: activeTab === "culture" ? "600" : "400",
                color: activeTab === "culture" ? Colors.light.primary : theme.textSecondary,
              }}
            >
              Cultural Tips
            </ThemedText>
          </Pressable>
          
          <Pressable
            onPress={() => handleTabChange("avoid")}
            style={[
              styles.tab,
              activeTab === "avoid" && { backgroundColor: "#E53935" + "20" },
            ]}
          >
            <Feather 
              name="alert-triangle" 
              size={18} 
              color={activeTab === "avoid" ? "#E53935" : theme.textSecondary} 
            />
            <ThemedText 
              type="body" 
              style={{ 
                marginLeft: Spacing.xs,
                fontWeight: activeTab === "avoid" ? "600" : "400",
                color: activeTab === "avoid" ? "#E53935" : theme.textSecondary,
              }}
            >
              Things to Avoid
            </ThemedText>
          </Pressable>
        </View>

        {activeTab === "culture" ? (
          <>
            <ThemedText type="small" style={[styles.sectionIntro, { color: theme.textSecondary }]}>
              Understanding Thai culture will enrich your experience. Tap any tip to learn more.
            </ThemedText>
            {culturalTips.map((tip) => (
              <CulturalTipCard key={tip.id} tip={tip} />
            ))}
          </>
        ) : (
          <>
            <ThemedText type="small" style={[styles.sectionIntro, { color: theme.textSecondary }]}>
              Top 20 things to avoid while visiting Thailand. Ranked by importance.
            </ThemedText>
            {thingsToAvoid.map((item) => (
              <AvoidCard key={item.id} item={item} />
            ))}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
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
  tipCard: {
    padding: Spacing.md,
  },
  tipHeader: {
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
  tipTitleContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  tipDescription: {
    marginTop: Spacing.md,
    lineHeight: 20,
  },
  expandIndicator: {
    alignItems: "center",
    marginTop: Spacing.xs,
  },
  avoidCard: {
    padding: Spacing.md,
  },
  avoidHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avoidTitleContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  avoidDescription: {
    marginTop: Spacing.md,
    lineHeight: 20,
  },
});
